const router = require('express').Router()
const bodyParser = require('body-parser')
const handleSentryEvent = require('../services/sentry')
const { MdMessage } = require('../managers/message')

router.use(bodyParser.json())
router.post('/', (req, res, next) => {
  const chatId = req.query.chatId
  const event = req.body
  const msgContent = handleSentryEvent(event)
  new MdMessage(msgContent).chatId(chatId).send(res.send).catch(next)
})

module.exports = router
