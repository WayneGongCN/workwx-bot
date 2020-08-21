const { Message, sequelize, Chat, User } = require('../models')
const { updateChatUserOnReceive } = require('./chat_user')

async function saveMessageOnReceive(msg) {
  return sequelize.transaction(async transaction => {
    const { msgId, msgType, chatType, chatId, text, getChatInfoUrl, from } = msg
    await updateChatUserOnReceive({ chatId, chatType, getChatInfoUrl, from }, transaction)
    return await Message.create({ msgId, msgType, chatId, userId: from.userId, text }, { transaction })
  })
}

/**
 * 查 msg
 * @param {*} param0
 */
function getMsg({ chatId, userId, chatType, msgType }, pagination = null, order = []) {
  const where = { chatId, userId, chatType, msgType }
  const options = { where, ...pagination, order }
  options.include = [Chat, User]
  return Message.findAndCountAll(options)
}

module.exports = {
  saveMessageOnReceive,
  getMsg,
}
