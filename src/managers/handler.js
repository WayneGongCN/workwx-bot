const { NodeVM } = require('vm2')
const path = require('path')
const logger = require('../log')
const { Handler, Group, Chat, Controller } = require('../models')
const { MdMessage } = require('./message')

function run(controllers, payload, chatId = null) {
  return controllers.map(async (controller, i) => {
    chatId = chatId ? chatId : [].concat(...controller.groups.map(x => x.chats.map(x => x.chatId)))
    let result = ''

    for (let j = 0; j < controller.handlers.length; j++) {
      const handler = controller.handlers[j]
      const vm = new NodeVM({ require: { external: true, builtin: ['path'] } })
      const userScript = vm.run(handler.script, path.join(__dirname, 'receive.js'))
      result = await userScript(payload, result).catch(e => `ERROR:\n${e.message}`)
      console.log(`Controller: ${i + 1}, Handler: ${j + 1}, result: ${result}`)
    }

    return await new MdMessage(result)
      .chatId(chatId)
      .send()
      .then(res => ({ ...res, result, chatId }))
  })
}

module.exports = async function (controllerName, payload, chatId = null) {
  const controllerType = chatId ? 0 : 1
  const includeChat = { model: Chat, as: 'chats', required: true, where: { ...(chatId && { chatId }) } }
  const includeGroup = { model: Group, as: 'groups', require: true, include: includeChat }
  const includeHanlder = { model: Handler, as: 'handlers' }
  const controllers = await Controller.findAll({
    where: { name: controllerName, controllerType, status: 1 },
    include: [includeGroup, includeHanlder],
  })
  if (chatId === null && !controllers.length) throw new Error(`Not find Controller ${controllerName}`)
  logger.debug('[CONTROLLERS]', controllers)

  let globalControllers = []
  let privateControllers = []
  controllers.forEach(x => (x.global ? globalControllers : privateControllers).push(x))

  const promises = []
  globalControllers && promises.push(...run(globalControllers, payload, null))
  privateControllers && promises.push(...run(privateControllers, payload, chatId))
  return await Promise.all(promises)
}
