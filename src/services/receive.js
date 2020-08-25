const { sequelize, Message, Chat, User } = require('../models')
const axios = require('axios')
const handler = require('../managers/handler')

/**
 * 保存收到的 message，并更新关联表
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
    const chatInstance = await Chat.upsert(chat, { transaction }).then(res => res[0])
    const userInstances = await User.bulkCreate(users, { transaction, updateOnDuplicate: ['name', 'alias', 'updatedAt'] })
    await chatInstance.setUsers(userInstances, { transaction })
    return await Message.create({ msgId, msgType, chatId, userId: from.userId, text }, { transaction })
  })
}

/**
 * 解析消息内容为 command
 * @param {string} text
 */
const cmdParser = text => {
  const reg = new RegExp(`^(@${process.env.BOT_NAME} )?\\s?(\\w+)`, 'i')
  const regRes = reg.exec(text)
  if (regRes) return regRes[2]
  return regRes ? regRes[2] : ''
}

/**
 * 处理接收到的信息
 * @param {*} msg
 */
function handleMessage(msg) {
  receiveMessage(msg)

  const { text, chatId, msgType } = msg
  if (msgType !== 'text') return

  const command = cmdParser(text)
  if (!command) return

  return handler(command, msg, chatId)
}

module.exports = {
  handleMessage,
}
