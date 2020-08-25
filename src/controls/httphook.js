const { handleHttphook } = require('../services/httphook')

const router = require('express').Router()

router.use('/:controllerName', (req, res, next) => {
  const { controllerName } = req.params
  handleHttphook(controllerName, req)
    .then(data => res.json(data))
    .catch(next)
})

module.exports = router
