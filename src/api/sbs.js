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
  const operate = serverTheme.operate
  return request({
    url: `/sbs/server-theme/save.api?operate=${operate}`,
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
  const operate = server.operate
  return request({
    url: `/sbs/server/save.api?operate=${operate}`,
    method: 'post',
    data: server
  })
}

export function servicePackageList(query) {
  const { page, limit } = query
  return request({
    url: `/sbs/service-package/list.api?pageIndex=${page}&pageLimit=${limit}`,
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
  const operate = servicePackage.operate
  return request({
    url: `/sbs/service-package/save.api?operate=${operate}`,
    method: 'post',
    data: servicePackage
  })
}

export function servicePackageMeasure({ id, count }) {
  return request({
    url: '/sbs/service-package/measure.api',
    method: 'post',
    data: { id, count }
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
  const operate = customer.operate
  return request({
    url: `/sbs/customer/save.api?operate=${operate}`,
    method: 'post',
    data: customer
  })
}

export function callLogList(query) {
  const { page, limit } = query
  return request({
    url: `/sbs/call-log/list.api?pageIndex=${page}&pageLimit=${limit}`,
    method: 'post',
    data: query
  })
}

export function callLogStatistics(freq, freqDate) {
  return request({
    url: '/sbs/call-log/statistics.api',
    method: 'post',
    data: { freq, freqDate }
  })
}

export function callLogStatisticsAll(freq, freqDate) {
  return request({
    url: '/sbs/call-log/statistics-all.api',
    method: 'post',
    data: { freq, freqDate }
  })
}

export function callStatisticsList(query) {
  const { page, limit } = query
  return request({
    url: `/sbs/call-statistics/list.api?pageIndex=${page}&pageLimit=${limit}`,
    method: 'post',
    data: query
  })
}

export function callStatisticsByGlobal(query) {
  const { page, limit } = query
  return request({
    url: `/sbs/call-statistics/by-global.api?pageIndex=${page}&pageLimit=${limit}`,
    method: 'post',
    data: query
  })
}

export function callStatisticsByServer(query) {
  const { page, limit } = query
  return request({
    url: `/sbs/call-statistics/by-server.api?pageIndex=${page}&pageLimit=${limit}`,
    method: 'post',
    data: query
  })
}

export function callStatisticsByCustomer(query) {
  const { page, limit } = query
  return request({
    url: `/sbs/call-statistics/by-customer.api?pageIndex=${page}&pageLimit=${limit}`,
    method: 'post',
    data: query
  })
}

export function callStatisticsLogList(query) {
  return request({
    url: '/sbs/call-statistics-log/list.api',
    method: 'post',
    data: query,
    transformResponse: [
      function(data) {
        const _data = JSON.parse(data)
        _data.responseBody.items.forEach(item => {
          const { freq } = item
          if (freq !== 'D') {
            // 为响应数据添加 hasChildren
            item['hasChildren'] = true
          }
        })
        return _data
      }
    ]
  })
}
