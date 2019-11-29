import request from '@/utils/request'

export function serverThemeList(query) {
  return request({
    url: '/sbs/server-theme/list.api',
    method: 'post',
    data: query
  })
}

export function serverThemeSingleById({ id }) {
  return request({
    url: '/sbs/server-theme/single.api',
    method: 'post',
    data: id
  })
}

export function serverThemeDeleteByIds(ids) {
  return request({
    url: '/sbs/server-theme/delete.api',
    method: 'post',
    data: ids
  })
}

export function serverThemeSave(serverTheme) {
  return request({
    url: '/sbs/server-theme/save.api',
    method: 'post',
    data: serverTheme
  })
}

export function serverList(query) {
  return request({
    url: '/sbs/server/list.api',
    method: 'post',
    data: query
  })
}

export function serverSingleById({ id }) {
  return request({
    url: '/sbs/server/single.api',
    method: 'post',
    data: id
  })
}

export function serverDeleteByIds(ids) {
  return request({
    url: '/sbs/server/delete.api',
    method: 'post',
    data: ids
  })
}

export function serverSave(server) {
  return request({
    url: '/sbs/server/save.api',
    method: 'post',
    data: server
  })
}

export function servicePackageList(query) {
  return request({
    url: '/sbs/service-package/list.api',
    method: 'post',
    data: query
  })
}

export function servicePackageSingleById({ id }) {
  return request({
    url: '/sbs/service-package/single.api',
    method: 'post',
    data: id
  })
}

export function servicePackageDeleteByIds(ids) {
  return request({
    url: '/sbs/service-package/delete.api',
    method: 'post',
    data: ids
  })
}

export function servicePackageSave(servicePackage) {
  return request({
    url: '/sbs/service-package/save.api',
    method: 'post',
    data: servicePackage
  })
}

export function customerList(query) {
  return request({
    url: '/sbs/customer/list.api',
    method: 'post',
    data: query
  })
}

export function customerSingleById({ id }) {
  return request({
    url: '/sbs/customer/single.api',
    method: 'post',
    data: id
  })
}

export function customerDeleteByIds(ids) {
  return request({
    url: '/sbs/customer/delete.api',
    method: 'post',
    data: ids
  })
}

export function customerSave(customer) {
  return request({
    url: '/sbs/customer/save.api',
    method: 'post',
    data: customer
  })
}

export function callLogList(query) {
  return request({
    url: '/sbs/call-log/list.api',
    method: 'post',
    data: query
  })
}

export function callStatisticsList(query) {
  return request({
    url: '/sbs/call-statistics/list.api',
    method: 'post',
    data: query
  })
}

export function callStatisticsByServer(query) {
  return request({
    url: '/sbs/call-statistics/by-server.api',
    method: 'post',
    data: query
  })
}

export function callStatisticsByCustomer(query) {
  return request({
    url: '/sbs/call-statistics/by-customer.api',
    method: 'post',
    data: query
  })
}

export function callStatisticsLogList(query) {
  return request({
    url: '/sbs/call-statistics-log/list.api',
    method: 'post',
    data: query
  })
}
