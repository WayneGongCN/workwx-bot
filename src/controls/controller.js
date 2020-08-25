const router = require('express').Router()
const bodyParser = require('body-parser')
const { findController, upsertController, deleteController } = require('../services/controller')
const { parsePagination, parseOrder } = require('../utils')

const cors = require('cors')
router.use(bodyParser.json())
router.use(cors())

router.get('/', (req, res, next) => {
  const { controllerType, status, global, name, keyword, page, itemsPerPage, sortBy, sortDesc } = req.query
  const pagination = parsePagination(page, itemsPerPage)
  const order = parseOrder(sortBy, sortDesc)

  findController({ controllerType, status, global, name, keyword }, pagination, order)
    .then(data => res.json(data))
    .catch(next)
})

router.post('/', (req, res, next) => {
  const controller = req.body
  upsertController(controller)
    .then(data => res.status(201).json(data))
    .catch(next)
})

router.put('/:controllerId', (req, res, next) => {
  const { controllerId } = req.params
  const controller = req.body
  upsertController(controller, controllerId)
    .then(data => res.status(201).json(data))
    .catch(next)
})

router.delete('/:controllerId', (req, res, next) => {
  let { controllerId } = req.params
  controllerId = Number(controllerId)
  deleteController(controllerId)
    .then(() => {
      res.sendStatus(204)
    })
    .catch(next)
})

module.exports = router
