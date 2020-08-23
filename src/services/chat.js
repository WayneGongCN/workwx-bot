const { Chat } = require('../models')
const { Op } = require('sequelize')
const { filterObjUndefined } = require('../utils')

/**
 * find chat
 */
function findChat({ chatId, chatName, chatType, keyword }, pagination = null, order = []) {
  const where = filterObjUndefined({ chatId, chatName, chatType })
  if (keyword) where[Op.or] = [{ chatName: { [Op.like]: `%${keyword}%` } }, { chatId: { [Op.like]: `%${keyword}%` } }]
  const options = { where, ...pagination, order }
  return Chat.findAndCountAll(options)
}

module.exports = {
  findChat,
}
