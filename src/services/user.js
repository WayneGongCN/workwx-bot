const { User } = require('../models')
const { Op } = require('sequelize')
const { filterObjUndefined } = require('../utils')

/**
 * 查 user
 * @param {*} param0
 */
function getUser({ userId, name, alias, keyword }, pagination = null, order = []) {
  const where = filterObjUndefined({ userId, name, alias })
  if (keyword) where[Op.or] = [{ name: { [Op.like]: `%${keyword}%` } }, { alias: { [Op.like]: `%${keyword}%` } }]
  const options = { where, ...pagination, order }
  return User.findAndCountAll(options)
}

module.exports = {
  getUser,
}
