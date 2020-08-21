const { Chat, User } = require('../models')
const { Op } = require('sequelize')
const { filterObjUndefined } = require('../utils')
const logger = require('../log')

async function upsertChat(chatInfo, transaction) {
  const { chatId, name, chatType } = chatInfo
  return await Chat.upsert({ chatId, name, chatType }, { transaction })
}

/**
 * 查 chat
 */
function getChat({ chatId, name, chatType }, pagination = null, order = []) {
  const where = filterObjUndefined({ chatId, name, chatType })
  const options = { where, ...pagination, order }
  return Chat.findAndCountAll(options)
}

/**
 * 通过 name、chatId 模糊搜索
 */
function getChatLikeNameOrChatid(keyword = '', pagination = null, order = []) {
  let where = null
  if (keyword) {
    where = {
      [Op.or]: [{ name: { [Op.like]: `%${keyword}%` } }, { chatId: { [Op.like]: `%${keyword}%` } }],
    }
  }

  const options = { where, ...pagination, order, include: { model: User, as: 'users', attributes: [] } }
  return Chat.findAndCountAll(options)
}

module.exports = {
  upsertChat,
  getChat,
  getChatLikeNameOrChatid,
}
