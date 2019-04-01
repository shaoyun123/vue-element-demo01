
export const doPagination = (mockList, page, limit) => {
  if (page && page > 0 && limit && limit > 0) {
    const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))
    return {
      total: mockList.length,
      items: pageList
    }
  } else {
    return {
      total: mockList.length,
      items: mockList
    }
  }
}

export const putEntity = (id, entity, entityIndex, entityList) => {
  entityList.push(entity)
  entityIndex[id] = entityList.length - 1
}

export const updateEntity = (id, entity, entityIndex, entityList) => {
  const index = entityIndex[id]
  if (index !== undefined) {
    if (entity) {
      entity = Object.assign({}, getById(id, entityIndex, entityList), entity)
    }
    entityList.splice(index, 1, entity)
  }
}

export const getById = (id, entityIndex, entityList) => {
  const index = entityIndex[id]
  if (index !== undefined) {
    return entityList[index]
  } else {
    return null
  }
}

export const deleteById = (ids, entityIndex, entityList) => {
  if (ids && ids.length) {
    if (!Array.isArray(ids)) {
      ids = [ids]
    }
    ids.forEach(id => {
      updateEntity(id, null, entityIndex, entityList)
    })
  }
}
