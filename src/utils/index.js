function parseOrder(sortBy, sortDesc) {
  if (!sortBy || !sortDesc) return []
  if (sortBy.length !== sortDesc.length) throw new Error('Error query sortBy or sortDesc')
  if (sortBy.length === 0) return []

  return sortBy.map((key, idx) => {
    const val = sortDesc[idx]
    const direction = val === 'true' ? 'DESC' : 'ASC'
    return [key, direction]
  })
}

function parsePagination(page = 1, itemsPerPage = 10) {
  itemsPerPage = itemsPerPage > 1000 ? 1000 : itemsPerPage
  const offset = (page - 1) * itemsPerPage
  const limit = Number(itemsPerPage)
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
