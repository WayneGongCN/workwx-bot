const { Controller } = require('../models')

/**
 * 查 command
 * @param {*} param0
 */
function getController({ status, name, keyword, type, offset, limit }) {
  const where = { status, name, keyword, type, offset, limit }
  const options = {}
  offset !== undefined && (options.offset = Number(offset))
  limit !== undefined && (options.limit = Number(limit))

  return Controller.findAndCountAll(options)
}

/**
 * 插入 command
 * @param {*} param0
 */
function insertController({ name, descript, keyword, type, ControllerHandlerId, controllerChatId, global, status }) {
  return Controller.create({ name, descript, keyword, type, ControllerHandlerId, controllerChatId, global, status })
}

/**
 * 更新 command
 * @param {*} id
 * @param {*} param1
 */
function updatetController(id, { name, descript, keyword, type, ControllerHandlerId, controllerChatId, global, status }) {
  return Controller.update(
    { name, descript, keyword, type, ControllerHandlerId, controllerChatId, global, status },
    { where: { id } }
  )
}

/**
 * 删除 command
 * @param {*} ids
 */
function deleteController(ids) {
  const options = { where: { id: ids } }
  return Controller.destroy(options)
}

module.exports = {
  getController,
  insertController,
  updatetController,
  deleteController,
}
