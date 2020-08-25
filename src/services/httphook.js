const handler = require('../managers/handler')

function handleHttphook(controllerName, req) {
  return handler(controllerName, req, null)
}

module.exports = { handleHttphook }
