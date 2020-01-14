import request from '@/utils/request'

export function dictList(query) {
  return request({
    url: '/global-data/dict/list',
    method: 'post',
    data: query
  })
}

export function districtList(query) {
  return request({
    url: '/global-data/district/list',
    method: 'post',
    data: query
  })
}

export function validatorList(query) {
  return request({
    url: '/global-data/validator/list',
    method: 'post',
    data: query
  })
}
