const router = require('express').Router()
const bodyParser = require('body-parser')
const cors = require('cors')
const { getChat, getChatLikeNameOrChatid } = require('../services/chat')
const { parseOrder, parsePagination, filterObjUndefined } = require('../utils')

router.use(bodyParser.json())
router.use(cors())

/**
 * 查 chat
 */
router.get('/', (req, res, next) => {
  const { chatId, name, chatType, page, pageSize, orderBy, orderDesc } = req.query
  const pagination = parsePagination(page, pageSize)
  const order = parseOrder(orderBy, orderDesc)

  getChat({ chatId, name, chatType }, pagination, order)
    .then(data => res.json(data))
    .catch(next)
})

/**
 * 通过 name、chatId 模糊搜索
 */
router.get('/like', (req, res, next) => {
  const { keyword, page, pageSize, orderBy, orderDesc } = req.query
  const pagination = parsePagination(page, pageSize)
  const order = parseOrder(orderBy, orderDesc)

  getChatLikeNameOrChatid(keyword, pagination, order)
    .then(data => res.json(data))
    .catch(next)
})

module.exports = router
