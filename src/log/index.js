const log4js = require('log4js')
console.log(process.env.LOG_FILE)
/**
 * log4js config
 */
log4js.configure({
  appenders: {
    debug: {
      type: 'file',
      filename: process.env.LOG_FILE,
    },
    out: {
      type: 'stdout',
    },
  },

  categories: {
    default: {
      appenders: ['out', 'debug'],
      level: 'debug',
    },
  },
})

/**
 * create log4js instance
 */
const logger = log4js.getLogger()
logger.level = process.env.LOG_LEVEL || 'debug'

/**
 * logger content stringify
 */
;['trace', 'debug', 'info', 'warn', 'error', 'fatal'].forEach(fnName => {
  const originalFn = logger[fnName]
  logger[fnName] = (...args) => {
    const stringifyArgs = args.map(x => {
      if (typeof x === 'object') return JSON.stringify(x)
      else return x
    })
    originalFn.call(logger, ...stringifyArgs)
  }
})

logger.info(`LOG FILE: ${process.env.LOG_FILE}`)

module.exports = logger
