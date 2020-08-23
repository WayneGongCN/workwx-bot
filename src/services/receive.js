// const { NodeVM } = require('vm2')
// const logger = require('../log')
// const { MdMessage } = require('../managers/message')
// const { getHandler } = require('./handler')
const { sequelize, Message, Chat, User } = require('../models')
const axios = require('axios')

/**
 * 更新 user、chat 及关联表
 * 1. 如果是 Group 则获取 GroupInfo
 * 2. upsert user、chat
 * 3. 更新关联关系
 * @param {*} param0
 */
async function receiveMessage(msg) {
  const { msgId, msgType, chatType, chatId, text, getChatInfoUrl, from } = msg
  let users = [from]
  let chat = { chatId, chatType }

  if (chatType === 'group') {
    const chatInfo = await axios.get(getChatInfoUrl).then(res => {
      if (res.data.errcode !== 0) throw new Error(res.data)
      return res.data
    })
    users = chatInfo.members.map(x => ({ userId: x.userid, name: x.name, alias: x.alias }))
    chat.name = chatInfo.name
  }

  return sequelize.transaction(async transaction => {
    const chatInstance = await Chat.upsert(chat, { transaction })
    const userInstances = await User.bulkCreate(users, { transaction, updateOnDuplicate: ['name', 'alias', 'updatedAt'] })

    await chatInstance.setUsers(userInstances, { transaction })
    return await Message.create({ msgId, msgType, chatId, userId: from.userId, text }, { transaction })
  })
}

/**
 * 解析消息内容为 command + option
 * @param {string} text
 */
// const cmdParser = text => {
//   const reg = new RegExp(`^(@${process.env.BOT_NAME} )?\\s?(\\w+)(\\s?(\\w+)?)?$`, 'i')
//   const regRes = reg.exec(text)

//   let command = ''
//   let option = ''
//   if (regRes) {
//     command = regRes[2]
//     option = regRes[4] || ''
//   }

//   return { command, option, text }
// }

/**
 * 处理接收到的信息
 * @param {*} msg
 */
async function handleMessage(msg) {
  receiveMessage(msg)

  // const { msgType } = msg
  // let msgContent = ''
  // const { command, option } = cmdParser(msg.text)
  // const userConf = await getHandler({ keyword: command, status: 1 }).then(data => data.rows[0])
  // if (!userConf) return
  // const vm = new NodeVM({
  //   require: {
  //     external: true,
  //     builtin: ['path'],
  //   },
  // })
  // const userScript = vm.run(userConf.script, path.join(__dirname, 'receive.js'))
  // const userScriptResult = await userScript(msg).catch(e => `ERROR:\n${e.message}`)
  // if (typeof userScriptResult !== 'string') return
  // msgContent = userScriptResult
  // new MdMessage(msgContent).chatId(msg.chatId).send()
}

module.exports = {
  handleMessage,
}
