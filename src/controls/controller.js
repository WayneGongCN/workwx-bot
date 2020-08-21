const router = require('express').Router()
const bodyParser = require('body-parser')
const cors = require('cors')
const { getController, insertController, updatetController, deleteController } = require('../services/controller')

router.use(bodyParser.json())
router.use(cors())

router.get('/', (req, res, next) => {
  const query = req.query
  getController(query)
    .then(data => res.json(data))
    .catch(next)
})

router.post('/', (req, res, next) => {
  const controller = req.body
  insertController(controller)
    .then(data => res.status(201).json(data))
    .catch(next)
})

router.patch('/:controllerId', (req, res, next) => {
  const { controllerId } = req.params
  const controller = req.body
  updatetController(controllerId, controller)
    .then(data => res.status(201).json(data))
    .catch(next)
})

router.put('/:controllerId', (req, res, next) => {
  const { controllerId } = req.params
  const controller = req.body
  updatetController(controllerId, controller)
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
