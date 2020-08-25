const { User, Chat, Message } = require('../models')
const { Op } = require('sequelize')
const { filterObjUndefined } = require('../utils')

const include = [
  { model: Chat, as: 'chats' },
  { model: Message, as: 'messages' },
]

/**
 * 查 user
 * @param {*} param0
 */
function findUser({ userId, name, alias, keyword }, pagination = null, order = []) {
  const where = filterObjUndefined({ userId, name, alias })
  if (keyword) where[Op.or] = [{ name: { [Op.like]: `%${keyword}%` } }, { alias: { [Op.like]: `%${keyword}%` } }]
  const options = { where, ...pagination, order, include }
  return User.findAndCountAll(options)
}

module.exports = {
  findUser,
}
