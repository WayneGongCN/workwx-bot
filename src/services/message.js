const { Message } = require('../models')
const { Op } = require('sequelize')
/**
 * find message
 */
function findMessage({ chatId, userId, chatType, msgType, keyword }, pagination = null, order = []) {
  const where = { chatId, userId, chatType, msgType }
  if (keyword) where.text = { [Op.like]: `%${keyword}%` }
  const options = { where, ...pagination, order }
  return Message.findAndCountAll(options)
}

module.exports = {
  findMessage,
}
