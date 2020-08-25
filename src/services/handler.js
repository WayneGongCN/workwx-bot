const { sequelize, Handler, Group } = require('../models')
const { Op } = require('sequelize')
const { filterObjUndefined } = require('../utils')

const include = [{ model: Group, as: 'groups' }]

/**
 * find handler
 */
function findHandler({ name, status, keyword }, pagination = null, order = []) {
  const where = filterObjUndefined({ name, status })
  if (keyword) where.name = { [Op.like]: `%${keyword}%` }
  const options = { where, ...pagination, order, include }
  return Handler.findAndCountAll(options)
}

/**
 * upsert handler
 */
function upsertHandler({ name, descript, script, status }, id = null) {
  const handler = filterObjUndefined({ id, name, descript, script, status })
  return sequelize.transaction(async transaction => await Handler.upsert(handler, { transaction }).then(res => res[0]))
}

/**
 * delete handler
 */
function deleteHandler(id) {
  const options = { where: { id } }
  return Handler.destroy(options)
}

module.exports = {
  findHandler,
  upsertHandler,
  deleteHandler,
}
