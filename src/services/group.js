const { Group, sequelize, Controller, Handler, Chat } = require('../models')
const { Op } = require('sequelize')
const { filterObjUndefined } = require('../utils')

const include = [
  { model: Controller, as: 'controllers' },
  { model: Handler, as: 'handlers' },
  { model: Chat, as: 'chats' },
]

/**
 * find group
 */
function findGroup({ name, keyword }, pagination = null, order = []) {
  const where = filterObjUndefined({ name })
  if (keyword) where.name = { [Op.like]: `%${keyword}%` }
  const options = { where, ...pagination, order, include }
  return Group.findAndCountAll(options)
}

/**
 * upsert group
 */
function upsertGroup({ name, chats }, id = null) {
  const group = filterObjUndefined({ name, id })
  return sequelize.transaction(async transaction => {
    const groupInstance = await Group.upsert(group, { transaction }).then(res => res[0])
    await groupInstance.setChats(chats, { transaction })
    return await groupInstance.reload()
  })
}

/**
 * delete group
 * 1. findByPk group
 * 2. 清空关联的 chat
 * 3. 删除 group
 * @param {*} ids
 */
function deleteGroup(id) {
  return sequelize.transaction(async transaction => {
    const group = await Group.findByPk(id, { transaction })
    await group.setChats([], { transaction })
    return await group.destroy({ transaction })
  })
}

module.exports = {
  findGroup,
  upsertGroup,
  deleteGroup,
}
