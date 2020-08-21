const logger = require('../log')

const logGitEvent = (req, res, next) => {
  const event = req.headers['x-event']
  const data = req.body
  logger.info('[GIT_EVENT]', event, data)
  next()
}

module.exports = {
  logGitEvent,
}
