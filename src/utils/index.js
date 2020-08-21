function parseOrder(orderBy, orderDesc) {
  if (!orderBy || !orderDesc) return []

  orderBy = orderBy.split(',')
  orderDesc = orderDesc.split(',')
  if (orderBy.length !== orderDesc.length) throw new Error('Error query orderBy or orderDesc')
  if (orderBy.length === 0) return []

  return orderBy.map((key, idx) => {
    const val = orderDesc[idx]
    const direction = val === '' ? 'NULLS' : val ? 'DESC' : 'ASC'
    return [key, direction]
  })
}

function parsePagination(page = 1, pageSize = 10) {
  pageSize = pageSize > 1000 ? 1000 : pageSize
  const offset = (page - 1) * pageSize
  const limit = pageSize
  return { offset, limit }
}

function filterObjUndefined(obj) {
  const res = {}
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const val = obj[key]
      if (val !== undefined) {
        res[key] = val
      }
    }
  }
  return res
}

module.exports = {
  parseOrder,
  parsePagination,
  filterObjUndefined,
}
