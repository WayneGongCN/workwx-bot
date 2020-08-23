const router = require('express').Router()
const aes = require('wx-ding-aes')
const bodyParser = require('body-parser')
require('body-parser-xml')(bodyParser)
const { signature, decodemsg, formatmsg, logReceviedMsg } = require('../middlewares/receive')
const { handleMessage } = require('../services/receive')

// 企业微信验证回调接口
router.get(
  '/',
  signature(process.env.TOKEN),

  (req, res, next) => {
    try {
      const echostr = req.query.echostr
      const msg = aes.decode(echostr, process.env.ENCODE_AES_KEY)
      res.send(msg)
    } catch (e) {
      next(e)
    }
  }
)

// 企业微信接收消息回调接口
router.post(
  '/',
  bodyParser.xml(),
  signature(process.env.TOKEN),
  decodemsg(process.env.ENCODE_AES_KEY),
  bodyParser.xml(),
  formatmsg,
  logReceviedMsg,

  (req, res, next) => {
    try {
      handleMessage(req.msg)
      res.send('')
    } catch (e) {
      next(e)
    }
  }
)

module.exports = router
