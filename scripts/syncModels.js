const {
  Chat,
  User,
  Message,
  ChatUser,

  Controller,
  Handler,
  Group,
  ControllerHandler,
  ChatGroup,
} = require('../src/models/index')
const logger = require('../src/log')

const Models = [Chat, User, Message, Controller, Handler, Group, ChatUser, ControllerHandler, ChatGroup]

/**
 * eachModels
 */
async function eachModels(cb) {
  const promises = Models.map(cb)
  const taskRes = await Promise.allSettled(promises)
  return taskRes.every(x => x.value)
}

/**
 * main function
 */
async function main() {
  const drop = await eachModels(model =>
    model
      .drop()
      .then(() => {
        logger.debug('[DROP]', model)
        return true
      })
      .catch(e => {
        logger.error('[DROP_ERROR]', model, e)
        return false
      })
  )
  if (!drop) return

  const sync = await eachModels(model =>
    model
      .sync()
      .then(() => {
        logger.debug('[SYNC]', model)
        return true
      })
      .catch(e => {
        logger.error('[SYNC_ERROR]', model, e)
        return false
      })
  )
  if (!sync) return

  // await eachModels(model => {
  //   if (!model.defaultData) return Promise.resolve(true)
  //   return model.bulkCreate(model.defaultData)
  // })
}

main()
