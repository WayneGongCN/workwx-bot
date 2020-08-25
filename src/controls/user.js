const router = require('express').Router()
const bodyParser = require('body-parser')
const { findUser } = require('../services/user')
const { parsePagination, parseOrder } = require('../utils')

const cors = require('cors')
router.use(bodyParser.json())
router.use(cors())

router.get('/', (req, res, next) => {
  const { userId, name, alias, keyword, page, itemsPerPage, sortBy, sortDesc } = req.query
  const pagination = parsePagination(page, itemsPerPage)
  const order = parseOrder(sortBy, sortDesc)
  findUser({ userId, name, alias, keyword }, pagination, order)
    .then(data => res.json(data))
    .catch(next)
})

module.exports = router
