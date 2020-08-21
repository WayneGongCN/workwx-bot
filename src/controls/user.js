const router = require('express').Router()
const bodyParser = require('body-parser')
const cors = require('cors')
const { getUser, getUserLikeNameAlias } = require('../services/user')

router.use(bodyParser.json())
router.use(cors())

router.get('/', (req, res, next) => {
  const query = req.query
  getUser(query)
    .then(data => res.json(data))
    .catch(next)
})

router.get('/like', (req, res, next) => {
  const query = req.query
  getUserLikeNameAlias(query)
    .then(data => res.json(data))
    .catch(next)
})

module.exports = router
