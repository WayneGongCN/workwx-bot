const router = require('express').Router()
const bodyParser = require('body-parser')
const { findHandler, upsertHandler, deleteHandler } = require('../services/handler')
const { parsePagination, parseOrder } = require('../utils')

const cors = require('cors')
router.use(bodyParser.json())
router.use(cors())

router.get('/', (req, res, next) => {
  const { name, status, keyword, page, itemsPerPage, sortBy, sortDesc } = req.query
  const pagination = parsePagination(page, itemsPerPage)
  const order = parseOrder(sortBy, sortDesc)

  findHandler({ name, status, keyword }, pagination, order)
    .then(data => res.json(data))
    .catch(next)
})

router.post('/', (req, res, next) => {
  const handler = req.body
  upsertHandler(handler)
    .then(data => res.status(201).json(data))
    .catch(next)
})

router.put('/:handlerId', (req, res, next) => {
  const { handlerId } = req.params
  const handler = req.body
  upsertHandler(handler, handlerId)
    .then(data => res.status(201).json(data))
    .catch(next)
})

router.delete('/:handlerId', (req, res, next) => {
  let { handlerId } = req.params
  handlerId = Number(handlerId)
  deleteHandler(handlerId)
    .then(() => {
      res.sendStatus(204)
    })
    .catch(next)
})

module.exports = router
