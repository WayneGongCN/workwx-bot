const { User, Chat } = require('../models')
const { Op } = require('sequelize')

async function upsertUser(users, transaction) {
  return User.bulkCreate(users, {
    transaction,
    updateOnDuplicate: ['name', 'alias', 'updatedAt'],
  })
}

/**
 * 查 user
 * @param {*} param0
 */
function getUser({ userId, name, alias, offset, limit }) {
  const where = {}
  userId !== undefined && (where.userId = userId)
  name !== undefined && (where.name = name)
  alias !== undefined && (where.alias = alias)

  const options = { where }
  offset !== undefined && (options.offset = Number(offset))
  limit !== undefined && (options.limit = Number(limit))

  return User.findAndCountAll(options)
}

/**
 * 通过 name、alias 模糊搜索
 * @param {*} param0
 */
function getUserLikeNameAlias({ search, offset, limit }) {
  const where = {
    [Op.or]: [{ name: { [Op.like]: `%${search}%` } }, { alias: { [Op.like]: `%${search}%` } }],
  }

  const options = { where }
  offset !== undefined && (options.offset = Number(offset))
  limit !== undefined && (options.limit = Number(limit))
  options.include = [Chat]

  return User.findAll(options)
}

module.exports = {
  upsertUser,
  getUser,
  getUserLikeNameAlias,
}
