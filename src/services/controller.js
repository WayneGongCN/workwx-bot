const { Controller } = require('../models')
const { Op } = require('sequelize')
const { filterObjUndefined } = require('../utils')

/**
 * find controller
 */
function findController({ status, name, controllerType, keyword }, pagination = null, order = []) {
  const where = filterObjUndefined({ status, name, controllerType })
  if (keyword) where.name = { [Op.like]: `%${keyword}%` }
  const options = { where, ...pagination, order }
  return Controller.findAndCountAll(options)
}

/**
 * upsert controller
 */
function upsertController(id, { name, descript, controllerType, ControllerHandlerId, controllerChatId, global, status }) {
  const controller = filterObjUndefined({ name, descript, controllerType, ControllerHandlerId, controllerChatId, global, status })
  if (id && typeof id !== 'object') return Controller.create(controller)
  else return Controller.update(controller, { where: { id } })
}

/**
 * delete controller
 */
function deleteController(id) {
  const options = { where: { id } }
  return Controller.destroy(options)
}

module.exports = {
  findController,
  upsertController,
  deleteController,
}
