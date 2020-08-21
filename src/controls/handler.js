const router = require('express').Router()
const bodyParser = require('body-parser')
const cors = require('cors')
const { getHandler, insertHandler, updatetHandler, deleteHandler } = require('../services/handler')

router.use(bodyParser.json())
router.use(cors())

router.get('/', (req, res, next) => {
  const query = req.query
  getHandler(query)
    .then(data => res.json(data))
    .catch(next)
})

router.post('/', (req, res, next) => {
  const handler = req.body
  insertHandler(handler)
    .then(data => res.status(201).json(data))
    .catch(next)
})

router.patch('/:handlerId', (req, res, next) => {
  const { handlerId } = req.params
  const handler = req.body
  updatetHandler(handlerId, handler)
    .then(data => res.status(201).json(data))
    .catch(next)
})

router.put('/:handlerId', (req, res, next) => {
  const { handlerId } = req.params
  const handler = req.body
  updatetHandler(handlerId, handler)
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
