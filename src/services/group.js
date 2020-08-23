const { Group, sequelize } = require('../models')
const { Op } = require('sequelize')
const { filterObjUndefined } = require('../utils')

/**
 * find group
 */
function findGroup({ name, keyword }, pagination = null, order = []) {
  const where = filterObjUndefined({ name })
  if (keyword) where.name = { [Op.like]: `%${keyword}%` }
  const options = { where, ...pagination, order }
  return Group.findAndCountAll(options)
}

/**
 * upsert group
 */
function upsertGroup(id, { name, chats }) {
  return sequelize.transaction(async transaction => {
    if (id && typeof id !== 'object') {
      // update
      const group = await Group.findByPk(id, { transaction })
      await group.setChats(chats, { transaction })
      group.set('name', name, { transaction })
      return await group.save({ transaction })
    } else {
      // insert
      const group = await Group.create({ name }, { transaction })
      return await group.addChat(chats, { transaction })
    }
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
