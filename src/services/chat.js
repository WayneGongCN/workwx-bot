const { Chat, Message, User } = require('../models')
const { Op } = require('sequelize')
const { filterObjUndefined } = require('../utils')

const include = [
  { model: Message, as: 'messages' },
  { model: User, as: 'users' },
]

/**
 * find chat
 */
function findChat({ chatType, keyword }, pagination = null, order = []) {
  const where = filterObjUndefined({ chatType })
  if (keyword) where[Op.or] = [{ name: { [Op.like]: `%${keyword}%` } }, { chatId: { [Op.like]: `%${keyword}%` } }]
  const options = { where, ...pagination, order, include }
  return Chat.findAndCountAll(options)
}

module.exports = {
  findChat,
}
