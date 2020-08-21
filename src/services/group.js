const { Group, ChatGroup, sequelize, Chat } = require('../models')
const { Op } = require('sequelize')

/**
 * 查 group
 * @param {*} param0
 */
function getGroup({ name, offset, limit }) {
  const where = { name, offset, limit }
  const options = {}
  offset !== undefined && (options.offset = Number(offset))
  limit !== undefined && (options.limit = Number(limit))

  options.include = [Chat]
  return Group.findAndCountAll(options)
}

/**
 * 插入 group
 * 1. 插入新 group
 * 2. 关联 chat
 * @param {*} param0
 */
function insertGroup({ name, chats }) {
  return sequelize.transaction(async transaction => {
    const group = await Group.create({ name }, { transaction })
    return await group.addChat(chats, { transaction })
  })
}

/**
 * 更新 group
 * 1. findByPk group
 * 2. 更新关联的 chat
 * 3. 更新 group
 * @param {*} id
 * @param {*} param1
 */
function updatetGroup(id, { name, chats }) {
  return sequelize.transaction(async transaction => {
    const group = await Group.findByPk(id, { transaction })
    await group.setChats(chats, { transaction })
    group.set('name', name, { transaction })
    return group.save({ transaction })
  })
}

/**
 * 删除 group
 * 1. findByPk group
 * 2. 清空关联的 chat
 * 3. 删除 group
 * @param {*} ids
 */
function deleteGroup(id) {
  return sequelize.transaction(async transaction => {
    const group = await Group.findByPk(id, { transaction })
    await group.setChats([], { transaction })
    return group.destroy({ transaction })
  })
}

/**
 * 通过 name 模糊搜索
 * @param {*} param0
 */
function getGroupLikeName({ search, offset, limit }) {
  const where = { [Op.or]: [{ name: { [Op.like]: `%${search}%` } }] }
  const options = { where }
  offset !== undefined && (options.offset = Number(offset))
  limit !== undefined && (options.limit = Number(limit))

  return Group.findAndCountAll(options)
}

module.exports = {
  getGroup,
  insertGroup,
  updatetGroup,
  deleteGroup,
  getGroupLikeName,
}
