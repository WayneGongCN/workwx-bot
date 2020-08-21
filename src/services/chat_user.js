const { upsertUser } = require('./user')
const { upsertChat } = require('./chat')
const axios = require('axios')
const { ChatUser, Chat, User } = require('../models')
const { filterObjUndefined } = require('../utils')
const logger = require('../log')
const user = require('./user')

/**
 * 更新 user、chat 及关联表
 * 1. 如果是 Group 则获取 GroupInfo
 * 2. upsert user、chat
 * 3. 更新关联关系
 * @param {*} param0
 */
async function updateChatUserOnReceive({ chatId, chatType, getChatInfoUrl, from }, transaction) {
  let users = [from]
  let chat = { chatId, chatType }

  if (chatType === 'group') {
    const chatInfo = await axios.get(getChatInfoUrl).then(res => {
      if (res.data.errcode !== 0) throw new Error(res.data)
      return res.data
    })
    users = chatInfo.members.map(x => ({ userId: x.userid, name: x.name, alias: x.alias }))
    chat.name = chatInfo.name
  }

  const [usChatPromise, usUserPromise] = await Promise.allSettled([upsertChat(chat, transaction), upsertUser(users, transaction)])
  const chatInstance = usChatPromise.value[0]
  const userInstances = usUserPromise.value
  return await chatInstance.setUsers(userInstances, { transaction })
}

module.exports = {
  updateChatUserOnReceive,
}
