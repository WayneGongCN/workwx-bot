const createError = require('http-errors')
const express = require('express')
const app = express()
const log4js = require('log4js')
const logger = require('./log')

// log
app.use(log4js.connectLogger(logger, { level: 'INFO' }))

// urlencode
app.use(express.urlencoded({ extended: false }))

// route
app.use('/api/v1/workWechat', require('./controls/work_wechat'))
app.use('/api/v1/sentry', require('./controls/sentry'))
app.use('/api/v1/git', require('./controls/git'))

// web
app.use('/api/v1/handler', require('./controls/handler'))
app.use('/api/v1/chat', require('./controls/chat'))
app.use('/api/v1/message', require('./controls/message'))
app.use('/api/v1/user', require('./controls/user'))
app.use('/api/v1/controller', require('./controls/controller'))
app.use('/api/v1/group', require('./controls/group'))

// 404 handle
app.use(function (req, res, next) {
  next(createError(404))
})

// error handle
app.use(function (err, req, res, next) {
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}
  logger.error(err.message)
  console.error(err)

  res.status(err.status || 500)
  res.send({ err: err.message })
})

module.exports = app
