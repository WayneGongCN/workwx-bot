const { Handler } = require('../models')
const { Op } = require('sequelize')
const { filterObjUndefined } = require('../utils')

let activeHandler = []

applyHandler()

/**
 * find handler status = 1
 */
function applyHandler() {
  return findHandler({ status: 1 }).then(res => {
    activeHandler.length = 0
    activeHandler.push(...res.rows)
  })
}

/**
 * find handler
 */
function findHandler({ status, name, keyword }, pagination = null, order = []) {
  const where = filterObjUndefined({ status, name, keyword })
  if (keyword) where.name = { [Op.like]: `%${keyword}%` }
  const options = { where, ...pagination, order }
  return Handler.findAndCountAll(options)
}

/**
 * upsert handler
 */
function upsertHandler(id, { name, keyword, descript, script, timeout, status }) {
  const hadnler = filterObjUndefined({ name, keyword, descript, script, timeout, status })
  if (id && typeof id !== 'object') return Handler.update(hadnler, { where: { id } })
  else return Handler.create(hadnler)
}

/**
 * delete handler
 */
function deleteHandler(id) {
  const options = { where: { id } }
  return Handler.destroy(options)
}

module.exports = {
  activeHandler,
  findHandler,
  upsertHandler,
  deleteHandler,
}
