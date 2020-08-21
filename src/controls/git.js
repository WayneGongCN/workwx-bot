const router = require('express').Router()
const bodyParser = require('body-parser')
const { logGitEvent } = require('../middlewares/git')
const handleGitEvent = require('../services/git')
const { MdMessage } = require('../managers/message')

router.use(bodyParser.json())
router.post(
  '/',
  logGitEvent,

  (req, res, next) => {
    const event = req.headers['x-event']
    const chatId = req.query.chatId
    const data = req.body
    const msgContent = handleGitEvent(event, data)
    new MdMessage(msgContent).chatId(chatId).send().then(res.send).catch(next)
  }
)

module.exports = router
