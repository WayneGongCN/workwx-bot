const { Message, User, Chat } = require('../models')
const { Op } = require('sequelize')
const { filterObjUndefined } = require('../utils')

const include = [
  { model: User, as: 'user' },
  { model: Chat, as: 'chat' },
]

/**
 * find message
 */
function findMessage({ chatId, userId, chatType, msgType, keyword }, pagination = null, order = []) {
  const where = filterObjUndefined({ chatId, userId, chatType, msgType })
  if (keyword) where.text = { [Op.like]: `%${keyword}%` }
  const options = { where, ...pagination, order, include }
  return Message.findAndCountAll(options)
}

module.exports = {
  findMessage,
}
