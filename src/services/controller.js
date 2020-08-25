const { Controller, Group, Handler, sequelize } = require('../models')
const { Op } = require('sequelize')
const { filterObjUndefined } = require('../utils')

const include = [
  { model: Group, as: 'groups' },
  { model: Handler, as: 'handlers' },
]

/**
 * find controller
 */
function findController({ controllerType, status, global, name, keyword }, pagination = null, order = []) {
  const where = filterObjUndefined({ controllerType, status, global, name })
  if (keyword) where.name = { [Op.like]: `%${keyword}%` }
  const options = { where, ...pagination, order, include }
  return Controller.findAndCountAll(options)
}

/**
 * upsert controller
 */
function upsertController({ name, controllerType, descript, status, global, groups, handlers }, id = null) {
  const controller = filterObjUndefined({ id, name, controllerType, descript, status, global })
  return sequelize.transaction(async transaction => {
    let controllerInstance = await Controller.upsert(controller, { transaction }).then(res => res[0])
    await controllerInstance.setGroups(groups, { transaction })
    await controllerInstance.setHandlers(handlers, { transaction })
    return controllerInstance.reload()
  })
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
