const router = require('express').Router()
const bodyParser = require('body-parser')
const { findChat } = require('../services/chat')
const { parseOrder, parsePagination } = require('../utils')

const cors = require('cors')
router.use(bodyParser.json())
router.use(cors())

/**
 * 查 chat
 */
router.get('/', (req, res, next) => {
  const { chatType, keyword, page, itemsPerPage, sortBy, sortDesc } = req.query
  const pagination = parsePagination(page, itemsPerPage)
  const order = parseOrder(sortBy, sortDesc)

  findChat({ chatType, keyword }, pagination, order)
    .then(data => res.json(data))
    .catch(next)
})

module.exports = router
