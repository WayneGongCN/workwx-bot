const { NodeVM } = require('vm2')
const logger = require('../log')
const { MdMessage } = require('../managers/message')
const { getHandler } = require('./handler')
const { saveMessageOnReceive } = require('./message')

/**
 * 解析消息内容为 command + option
 * @param {string} text
 */
const cmdParser = text => {
  const reg = new RegExp(`^(@${process.env.BOT_NAME} )?\\s?(\\w+)(\\s?(\\w+)?)?$`, 'i')
  const regRes = reg.exec(text)

  let command = ''
  let option = ''
  if (regRes) {
    command = regRes[2]
    option = regRes[4] || ''
  }

  return { command, option, text }
}

/**
 * 处理接收到的信息
 * @param {*} msg
 */
async function handleMessage(msg) {
  const { msgType } = msg
  saveMessageOnReceive(msg)

  let msgContent = ''
  if (msgType === 'text') {
    // const { command, option } = cmdParser(msg.text)
    // const userConf = await getHandler({ keyword: command, status: 1 }).then(data => data.rows[0])
    // if (!userConf) return
    // const vm = new NodeVM({
    //   require: {
    //     external: true,
    //     builtin: ['path'],
    //   },
    // })
    // const userScript = vm.run(userConf.script, path.join(__dirname, 'work_wechat.js'))
    // const userScriptResult = await userScript(msg).catch(e => `ERROR:\n${e.message}`)
    // if (typeof userScriptResult !== 'string') return
    // msgContent = userScriptResult
  }

  if (!msgContent) return
  new MdMessage(msgContent).chatId(msg.chatId).send()
}

module.exports = {
  handleMessage,
}
