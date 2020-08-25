const router = require('express').Router()
const bodyParser = require('body-parser')
const { findGroup, upsertGroup, deleteGroup } = require('../services/group')
const { parsePagination, parseOrder } = require('../utils')

const cors = require('cors')
router.use(bodyParser.json())
router.use(cors())

router.get('/', (req, res, next) => {
  const { name, keyword, page, itemsPerPage, sortBy, sortDesc } = req.query
  const pagination = parsePagination(page, itemsPerPage)
  const order = parseOrder(sortBy, sortDesc)
  findGroup({ name, keyword }, pagination, order)
    .then(data => res.json(data))
    .catch(next)
})

router.post('/', (req, res, next) => {
  const group = req.body
  upsertGroup(group)
    .then(data => res.status(201).json(data))
    .catch(next)
})

router.put('/:groupId', (req, res, next) => {
  const { groupId } = req.params
  const group = req.body
  upsertGroup(group, groupId)
    .then(data => res.status(201).json(data))
    .catch(next)
})

router.delete('/:groupId', (req, res, next) => {
  let { groupId } = req.params
  groupId = Number(groupId)
  deleteGroup(groupId)
    .then(() => {
      res.sendStatus(204)
    })
    .catch(next)
})

module.exports = router
