const router = require('express').Router()
const aes = require('wx-ding-aes')
const bodyParser = require('body-parser')
require('body-parser-xml')(bodyParser)
const { signature, decodemsg, formatmsg, logReceviedMsg } = require('../middlewares/work_wechat')
const { handleMessage } = require('../services/work_wechat')

// 企业微信验证回调接口
router.get(
  '/',
  signature(process.env.TOKEN),

  (req, res, next) => {
    const echostr = req.query.echostr
    const msg = aes.decode(echostr, process.env.ENCODE_AES_KEY)
    res.send(msg)
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
    handleMessage(req.msg)
    res.send('')
  }
)

module.exports = router
