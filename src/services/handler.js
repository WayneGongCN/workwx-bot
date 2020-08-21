const { Handler } = require('../models')

let activeCommands = []

applyCommands()
function applyCommands() {
  return getHandler({ status: 1 }).then(res => {
    activeCommands = res.rows
  })
}

/**
 * 查 command
 * @param {*} param0
 */
function getHandler({ status, name, keyword, offset, limit }) {
  const where = {}
  status !== undefined && (where.status = status)
  name !== undefined && (where.name = name)
  keyword !== undefined && (where.keyword = keyword)

  const options = { where }
  offset !== undefined && (options.offset = Number(offset))
  limit !== undefined && (options.limit = Number(limit))

  return Handler.findAndCountAll(options)
}

/**
 * 插入 command
 * @param {*} param0
 */
function insertHandler({ name, keyword, descript, script, timeout, status }) {
  return Handler.create({ name, keyword, descript, script, timeout, status })
}

/**
 * 更新 command
 * @param {*} id
 * @param {*} param1
 */
function updatetHandler(id, { name, keyword, descript, script, timeout, status }) {
  const updateValues = {}
  name !== undefined && (updateValues.name = name)
  keyword !== undefined && (updateValues.keyword = keyword)
  descript !== undefined && (updateValues.descript = descript)
  script !== undefined && (updateValues.script = script)
  timeout !== undefined && (updateValues.timeout = timeout)
  status !== undefined && (updateValues.status = status)
  return Handler.update({ name, keyword, descript, script, timeout, status }, { where: { id } })
}

/**
 * 删除 command
 * @param {*} ids
 */
function deleteHandler(ids) {
  const options = { where: { id: ids } }
  return Handler.destroy(options)
}

module.exports = {
  activeCommands,
  getHandler,
  insertHandler,
  updatetHandler,
  deleteHandler,
}
