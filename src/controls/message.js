const router = require('express').Router()
const bodyParser = require('body-parser')
const { parsePagination, parseOrder } = require('../utils')
const { findMessage } = require('../services/message')

const cors = require('cors')
router.use(bodyParser.json())
router.use(cors())

router.get('/', (req, res, next) => {
  const { chatId, userId, chatType, msgType, keyword, page, itemsPerPage, sortBy, sortDesc } = req.query
  const pagination = parsePagination(page, itemsPerPage)
  const order = parseOrder(sortBy, sortDesc)
  findMessage({ chatId, userId, chatType, msgType, keyword }, pagination, order)
    .then(data => res.json(data))
    .catch(next)
})

module.exports = router
