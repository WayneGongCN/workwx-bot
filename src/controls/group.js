const router = require('express').Router()
const bodyParser = require('body-parser')
const cors = require('cors')
const { getGroup, insertGroup, updatetGroup, deleteGroup, getGroupLikeName } = require('../services/group')

router.use(bodyParser.json())
router.use(cors())

router.get('/', (req, res, next) => {
  const query = req.query
  getGroup(query)
    .then(data => res.json(data))
    .catch(next)
})

router.post('/', (req, res, next) => {
  const group = req.body
  insertGroup(group)
    .then(data => res.status(201).json(data))
    .catch(next)
})

router.patch('/:groupId', (req, res, next) => {
  const { groupId } = req.params
  const group = req.body
  updatetGroup(groupId, group)
    .then(data => res.status(201).json(data))
    .catch(next)
})

router.put('/:groupId', (req, res, next) => {
  const { groupId } = req.params
  const group = req.body
  updatetGroup(groupId, group)
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

router.get('/like', (req, res, next) => {
  const query = req.query
  getGroupLikeName(query)
    .then(data => res.json(data))
    .catch(next)
})

module.exports = router
