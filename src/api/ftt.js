import request from '@/utils/request'

export function taxTypeList(query) {
  return request({
    url: '/ftt/basic-data/tax-type/list',
    method: 'post',
    data: query
  })
}

export function taxTypeSingle(query) {
  return request({
    url: '/ftt/basic-data/tax-type/single',
    method: 'post',
    data: query
  })
}

export function taxTypeDelete(query) {
  return request({
    url: '/ftt/basic-data/tax-type/delete',
    method: 'post',
    data: query
  })
}

export function taxTypeSave(taxType) {
  return request({
    url: '/ftt/basic-data/tax-type/save',
    method: 'post',
    data: taxType
  })
}

export function taxTypeCaliberList(query) {
  return request({
    url: '/ftt/basic-data/tax-type-caliber/list',
    method: 'post',
    data: query
  })
}

export function taxTypeCaliberSingle(query) {
  return request({
    url: '/ftt/basic-data/tax-type-caliber/single',
    method: 'post',
    data: query
  })
}

export function taxTypeCaliberDelete(query) {
  return request({
    url: '/ftt/basic-data/tax-type-caliber/delete',
    method: 'post',
    data: query
  })
}

export function taxTypeCaliberSave(taxTypeCaliber) {
  return request({
    url: '/ftt/basic-data/tax-type-caliber/save',
    method: 'post',
    data: taxTypeCaliber
  })
}
