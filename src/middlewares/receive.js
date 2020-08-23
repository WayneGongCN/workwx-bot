const crypto = require('crypto')
const aes = require('wx-ding-aes')
const logger = require('../log')

/**
 * express 中间件
 * 解密接收到的信息
 */
const decodemsg = aesKey => (req, res, next) => {
  const encrypt = req.body.xml.Encrypt[0]
  req.body = aes.decode(encrypt, aesKey)
  next()
}

/**
 * express 中间件
 * 对微信过来的请求进行签名校验，校验不通过则为非法请求
 */
const signature = token => (req, res, next) => {
  const { timestamp, nonce, msg_signature } = req.query
  const echostr = req.query.echostr || (req.body && req.body.xml.Encrypt[0])

  const sortStr = [token, timestamp, nonce, echostr].sort().join('')
  const sha1 = crypto.createHash('sha1').update(sortStr).digest('hex')

  if (sha1 !== msg_signature) return next(new Error('signature error'))
  next()
}

/**
 * exporess 中间件
 * 格式化解密后的 xml 信息
 */
function msgFmt(xml, isMixed) {
  const msg = basicFmt(xml, isMixed)
  const fmtFn = fmtMap[`${msg.msgType}Fmt`]
  return { ...msg, ...fmtFn(xml) }
}

function basicFmt(xml, isMixed = false) {
  const msg = {
    msgType: xml.MsgType[0],
    ...(!isMixed && {
      chatType: xml.ChatType[0],
      webhookUrl: xml.WebhookUrl[0],
      chatId: xml.ChatId[0],
      msgId: xml.MsgId[0],
      from: {
        userId: xml.From[0].UserId[0],
        name: xml.From[0].Name[0],
        alias: xml.From[0].Alias[0],
      },
    }),
  }
  if (!isMixed && msg.chatType !== 'single') msg.getChatInfoUrl = xml.GetChatInfoUrl[0]
  return msg
}

const fmtMap = {
  textFmt: xml => ({ text: xml.Text[0].Content[0] }),
  imageFmt: xml => ({ image: xml.Image[0].ImageUrl[0] }),

  eventFmt: xml => {
    const eventType = xml.Event[0].EventType[0]
    const appVersion = xml.AppVersion[0]
    return { eventType, appVersion }
  },

  attachmentFmt: xml => {
    const attachment = xml
    const callbackId = xml
    const actions = xml
    return {}
  },

  mixedFmt: xml => {
    const mixedMessage = xml.MixedMessage[0].MsgItem.map(item => msgFmt(item, true))
    return { mixedMessage }
  },
}

const formatmsg = (req, res, next) => {
  const msg = msgFmt(req.body.xml)
  req.msg = msg
  next()
}

/**
 * log 格式化后的 Message
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const logReceviedMsg = (req, res, next) => {
  logger.info(`[RECEIVED_MESSAGE] `, req.msg)
  next()
}

module.exports = {
  signature,
  decodemsg,
  formatmsg,
  logReceviedMsg,
}
