const router = require('express').Router()
const bodyParser = require('body-parser')
const cors = require('cors')
const { getMsg } = require('../services/message')

router.use(bodyParser.json())
router.use(cors())

router.get('/', (req, res, next) => {
  const query = req.query
  getMsg(query)
    .then(data => res.json(data))
    .catch(next)
})

module.exports = router
