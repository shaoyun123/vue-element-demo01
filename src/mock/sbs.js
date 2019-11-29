import Mock from 'mockjs'
import { doPagination, putEntity, updateEntity, getById, deleteById } from './kit'

const serverThemeIndex = {}
const serverThemeList = []
function mockDefaultServerTheme() {
  return {}
}
function mockServerTheme() {
  const serverTheme = Mock.mock({
    id: '@guid',
    title: '@cname',
    descr: ''
  })
  return Object.assign({}, mockDefaultServerTheme(), serverTheme)
}

const serverIndex = {}
const serverList = []
function mockDefaultServer() {
  const defaultServer = Mock.mock({
    creationTime: '@datetime',
    modificationTime: '@datetime'
  })
  return defaultServer
}
function mockServer() {
  const server = Mock.mock({
    themeId: '',
    id: /^[a-zA-Z]{8}/,
    title: '@cname',
    descr: '',
    channel: 'jes.shinosi.server.channel.diting.invoice.CheckChannel',
    params: [],
    docChannel: '',
    serviceProviders: [],
    status: 'ONLINE',
    statusDescr: ''
  })
  for (let i = 0; i < 3; i++) {
    server.params.push(Mock.mock({
      serverId: server.id,
      id: '@guid',
      order: i + 1,
      key: /^[a-zA-Z]{4}/,
      nullable: 'Y'
    }))
    server.serviceProviders.push(Mock.mock({
      targetId: server.id,
      id: '@guid',
      order: i + 1,
      code: /^[a-zA-Z]{8}/,
      name: '@cname'
    }))
  }
  return Object.assign({}, mockDefaultServer(), server)
}

const servicePackageIndex = {}
const servicePackageList = []
function mockDefaultServicePackage() {
  const defaultServicePackage = Mock.mock({
    id: '@guid',
    creationTime: '@datetime',
    modificationTime: '@datetime'
  })
  return defaultServicePackage
}
function mockServicePackage() {
  const servicePackage = Mock.mock({
    customerId: '',
    serverId: '',
    startDate: '@date',
    endDate: '@date',
    status: 'ENABLED',
    statusDescr: '',
    serviceProviders: [],
    payRules: []
  })
  for (let i = 0; i < 3; i++) {
    servicePackage.serviceProviders.push(Mock.mock({
      targetId: servicePackage.id,
      id: '@guid',
      order: i + 1,
      code: /^[a-zA-Z]{8}/,
      name: '@cname'
    }))
    servicePackage.payRules.push(Mock.mock({
      packageId: servicePackage.id,
      id: '@guid',
      order: i + 1,
      quantity: '@integer(10000, 99999999)',
      valuationMode: 'PACKAGE',
      price: '@float(0, 100000, 0, 2)'
    }))
  }
  return Object.assign({}, mockDefaultServicePackage(), servicePackage)
}

const customerIndex = {}
const customerList = []
function mockDefaultCustomer() {
  const defaultCustomer = Mock.mock({
    creationTime: '@datetime',
    modificationTime: '@datetime'
  })
  return defaultCustomer
}
function mockCustomer() {
  const customer = Mock.mock({
    id: /^[a-zA-Z]{8}/,
    license: /^[a-zA-Z0-9]{16}/,
    name: '@cname',
    descr: '',
    parentId: '',
    idPath: '',
    status: 'ENABLED',
    statusDescr: ''
  })
  customer['idPath'] = '/' + customer.id
  return Object.assign({}, mockDefaultCustomer(), customer)
}

const callLogIndex = {}
const callLogList = []
function mockDefaultCallLog() {
  const defaultCallLog = Mock.mock({
    id: '@guid',
    creationTime: '@datetime'
  })
  return defaultCallLog
}
function mockCallLog() {
  const callLog = Mock.mock({
    customerId: '',
    customerIdPath: '',
    serverId: '',
    packageId: '',
    date: '@date',
    'dimension|1': ['VALID', 'INVALID']
  })
  callLog['idPath'] = '/' + callLog.id
  return Object.assign({}, mockDefaultCallLog(), callLog)
}

const callStatisticsIndex = {}
const callStatisticsList = []
function mockDefaultCallStatistics() {
  const defaultCallStatistics = Mock.mock({
    id: '@guid',
    creationTime: '@datetime'
  })
  return defaultCallStatistics
}
function mockCallStatistics() {
  const callStatistics = Mock.mock({
    customerId: '',
    customerIdPath: '',
    serverId: '',
    packageId: '',
    freq: 'Y',
    freqDate: '2019',
    'dimension|1': ['VALID', 'INVALID'],
    count: '@integer(10000, 9999999)'
  })
  callStatistics['idPath'] = '/' + callStatistics.id
  return Object.assign({}, mockDefaultCallStatistics(), callStatistics)
}

const callStatisticsLogIndex = {}
const callStatisticsLogList = []
function mockDefaultCallStatisticsLog() {
  const defaultCallStatisticsLog = Mock.mock({
    id: '@guid',
    creationTime: '@datetime'
  })
  return defaultCallStatisticsLog
}
function mockCallStatisticsLog() {
  const callStatisticsLog = Mock.mock({
    'freq|1': ['Y', 'M', 'D'],
    freqDate: '@date',
    'status|1': ['SUCCESS', 'PART', 'FAIL'],
    statusDescr: 'status_descr_value',
    'warnStatus|1': ['SUCCESS', 'FAIL'],
    hasChildren: true
  })
  callStatisticsLog['idPath'] = '/' + callStatisticsLog.id
  return Object.assign({}, mockDefaultCallStatisticsLog(), callStatisticsLog)
}

const serverTheme01 = mockServerTheme()
putEntity(serverTheme01.id, serverTheme01, serverThemeIndex, serverThemeList)
const serverTheme02 = mockServerTheme()
putEntity(serverTheme02.id, serverTheme02, serverThemeIndex, serverThemeList)
for (let i = 0; i < 3; i++) {
  const server = mockServer()
  const serverId = server.id
  if (i === 0) {
    server.themeId = serverTheme01.id
  } else {
    server.themeId = serverTheme02.id
  }
  putEntity(serverId, server, serverIndex, serverList)
  const servicePackage = mockServicePackage()
  servicePackage.customerId = 'TEMPLATE'
  servicePackage.serverId = serverId
  putEntity(servicePackage.id, servicePackage, servicePackageIndex, servicePackageList)
}
for (let i = 0; i < 5; i++) {
  const customer = mockCustomer()
  const customerId = customer.id
  const customerIdPath = customer.idPath
  putEntity(customer.id, customer, customerIndex, customerList)
  for (let j = 0; j < 3; j++) {
    const serverId = serverList[j].id
    const servicePackage = mockServicePackage()
    const packageId = servicePackage.id
    servicePackage.customerId = customerId
    servicePackage.serverId = serverId
    putEntity(packageId, servicePackage, servicePackageIndex, servicePackageList)
    for (let k = 0; k < 3; k++) {
      const callLog = mockCallLog()
      callLog.customerId = customerId
      callLog.customerIdPath = customerIdPath
      callLog.serverId = serverId
      callLog.packageId = packageId
      putEntity(callLog.id, callLog, callLogIndex, callLogList)
      const callStatistics = mockCallStatistics()
      callStatistics.customerId = customerId
      callStatistics.customerIdPath = customerIdPath
      callStatistics.serverId = serverId
      callStatistics.packageId = packageId
      putEntity(callStatistics.id, callStatistics, callStatisticsIndex, callStatisticsList)
    }
  }
}
const callStatisticsLog01 = mockCallStatisticsLog()
callStatisticsLog01.freq = 'Y'
callStatisticsLog01.freqDate = '2019'
putEntity(callStatisticsLog01.id, callStatisticsLog01, callStatisticsLogIndex, callStatisticsLogList)
const callStatisticsLog02 = mockCallStatisticsLog()
callStatisticsLog02.freq = 'M'
callStatisticsLog02.freqDate = '2019-01'
putEntity(callStatisticsLog02.id, callStatisticsLog02, callStatisticsLogIndex, callStatisticsLogList)
const callStatisticsLog03 = mockCallStatisticsLog()
callStatisticsLog03.freq = 'M'
callStatisticsLog03.freqDate = '2019-02'
putEntity(callStatisticsLog03.id, callStatisticsLog03, callStatisticsLogIndex, callStatisticsLogList)
const callStatisticsLog04 = mockCallStatisticsLog()
callStatisticsLog04.freq = 'D'
callStatisticsLog04.freqDate = '2019-01-01'
putEntity(callStatisticsLog04.id, callStatisticsLog04, callStatisticsLogIndex, callStatisticsLogList)
const callStatisticsLog05 = mockCallStatisticsLog()
callStatisticsLog05.freq = 'D'
callStatisticsLog05.freqDate = '2019-01-02'
putEntity(callStatisticsLog05.id, callStatisticsLog05, callStatisticsLogIndex, callStatisticsLogList)
// -
// -
// -
const getServerThemeList = config => {
  const { id, title, page = 1, limit = 20 } = JSON.parse(config.body)
  const mockList = serverThemeList.filter(item => {
    if (!item) return false
    if (id && id.length && item.id !== id) return false
    if (title && title.length && item.title.indexOf(title) < 0) return false
    return true
  })
  return doPagination(mockList, page, limit)
}

const getServerThemeById = config => {
  const id = config.body
  return getById(id, serverThemeIndex, serverThemeList)
}

const deleteServerThemeByIds = config => {
  const ids = JSON.parse(config.body)
  deleteById(ids, serverThemeIndex, serverThemeList)
}

const saveServerTheme = config => {
  let serverTheme = JSON.parse(config.body)
  let id = serverTheme.id
  if (serverThemeIndex[id] !== undefined) {
    updateEntity(id, serverTheme, serverThemeIndex, serverThemeList)
  } else {
    serverTheme = Object.assign({}, mockDefaultServerTheme(), serverTheme)
    id = serverTheme.id
    putEntity(id, serverTheme, serverThemeIndex, serverThemeList)
  }
  return getById(id, serverThemeIndex, serverThemeList)
}

Mock.mock(/\/sbs\/server-theme\/list.api/, 'post', getServerThemeList)
Mock.mock(/\/sbs\/server-theme\/single.api/, 'post', getServerThemeById)
Mock.mock(/\/sbs\/server-theme\/delete.api/, 'post', deleteServerThemeByIds)
Mock.mock(/\/sbs\/server-theme\/save.api/, 'post', saveServerTheme)
// -
// -
// -
const getServerList = config => {
  const { themeId, id, title, status, idOrTitle, page = 1, limit = 20 } = JSON.parse(config.body)
  const mockList = serverList.filter(item => {
    if (!item) return false
    if (themeId && themeId.length && item.themeId !== themeId) return false
    if (id && id.length && item.id !== id) return false
    if (title && title.length && item.title.indexOf(title) < 0) return false
    if (status && status.length && item.status !== status) return false
    if (idOrTitle && idOrTitle.length && item.id.indexOf(idOrTitle) < 0 && item.title.indexOf(idOrTitle) < 0) return false
    return true
  })
  return doPagination(mockList, page, limit)
}

const getServerById = config => {
  const id = config.body
  return getById(id, serverIndex, serverList)
}

const deleteServerByIds = config => {
  const ids = JSON.parse(config.body)
  deleteById(ids, serverIndex, serverList)
}

const saveServer = config => {
  let server = JSON.parse(config.body)
  const id = server.id
  if (serverIndex[id] !== undefined) {
    updateEntity(id, server, serverIndex, serverList)
  } else {
    server = Object.assign({}, mockDefaultServer(), server)
    putEntity(id, server, serverIndex, serverList)
  }
  return getById(id, serverIndex, serverList)
}

Mock.mock(/\/sbs\/server\/list.api/, 'post', getServerList)
Mock.mock(/\/sbs\/server\/single.api/, 'post', getServerById)
Mock.mock(/\/sbs\/server\/delete.api/, 'post', deleteServerByIds)
Mock.mock(/\/sbs\/server\/save.api/, 'post', saveServer)
// -
// -
// -
const getServicePackageList = config => {
  const { customerId, serverId, id, status, page = 1, limit = 20 } = JSON.parse(config.body)
  const mockList = servicePackageList.filter(item => {
    if (!item) return false
    if (customerId && customerId.length && item.customerId !== customerId) return false
    if (serverId && serverId.length && item.serverId !== serverId) return false
    if (id && id.length && item.id !== id) return false
    if (status && status.length && item.status !== status) return false
    return true
  })
  return doPagination(mockList, page, limit)
}

const getServicePackageById = config => {
  const id = config.body
  return getById(id, servicePackageIndex, servicePackageList)
}

const deleteServicePackageByIds = config => {
  const ids = JSON.parse(config.body)
  deleteById(ids, servicePackageIndex, servicePackageList)
}

const saveServicePackage = config => {
  let servicePackage = JSON.parse(config.body)
  let id = servicePackage.id
  if (servicePackageIndex[id] !== undefined) {
    updateEntity(id, servicePackage, servicePackageIndex, servicePackageList)
  } else {
    servicePackage = Object.assign({}, mockDefaultServicePackage(), servicePackage)
    id = servicePackage.id
    putEntity(id, servicePackage, servicePackageIndex, servicePackageList)
  }
  return getById(id, servicePackageIndex, servicePackageList)
}

Mock.mock(/\/sbs\/service-package\/list.api/, 'post', getServicePackageList)
Mock.mock(/\/sbs\/service-package\/single.api/, 'post', getServicePackageById)
Mock.mock(/\/sbs\/service-package\/delete.api/, 'post', deleteServicePackageByIds)
Mock.mock(/\/sbs\/service-package\/save.api/, 'post', saveServicePackage)
// -
// -
// -
const getCustomerList = config => {
  const { id, name, status, idOrName, page = 1, limit = 20 } = JSON.parse(config.body)
  const mockList = customerList.filter(item => {
    if (!item) return false
    if (id && id.length && item.id !== id) return false
    if (name && name.length && item.name.indexOf(name) < 0) return false
    if (status && status.length && item.status !== status) return false
    if (idOrName && idOrName.length && item.id.indexOf(idOrName) < 0 && item.name.indexOf(idOrName) < 0) return false
    return true
  })
  return doPagination(mockList, page, limit)
}

const getCustomerById = config => {
  const id = config.body
  return getById(id, customerIndex, customerList)
}

const deleteCustomerByIds = config => {
  const ids = JSON.parse(config.body)
  deleteById(ids, customerIndex, customerList)
}

const saveCustomer = config => {
  let customer = JSON.parse(config.body)
  const id = customer.id
  if (customerIndex[id] !== undefined) {
    updateEntity(id, customer, customerIndex, customerList)
  } else {
    customer = Object.assign({}, mockDefaultCustomer(), customer)
    const parentId = customer.parentId
    const parentCustomer = getById(parentId, customerIndex, customerList)
    const parentIdPath = parentCustomer.idPath
    customer.idPath = parentIdPath + '/' + id
    putEntity(id, customer, customerIndex, customerList)
  }
  return getById(id, customerIndex, customerList)
}

Mock.mock(/\/sbs\/customer\/list.api/, 'post', getCustomerList)
Mock.mock(/\/sbs\/customer\/single.api/, 'post', getCustomerById)
Mock.mock(/\/sbs\/customer\/delete.api/, 'post', deleteCustomerByIds)
Mock.mock(/\/sbs\/customer\/save.api/, 'post', saveCustomer)
// -
// -
// -
const getCallLogList = config => {
  const { id, customerId, customerIdPath, serverId, packageId, date, dimension, page = 1, limit = 20 } = JSON.parse(config.body)
  const mockList = callLogList.filter(item => {
    if (!item) return false
    if (id && id.length && item.id !== id) return false
    if (customerId && customerId.length && item.customerId !== customerId) return false
    if (customerIdPath && customerIdPath.length && item.customerIdPath.indexOf(customerIdPath) < 0) return false
    if (serverId && serverId.length && item.serverId !== serverId) return false
    if (packageId && packageId.length && item.packageId !== packageId) return false
    if (date && date.length && item.date !== date) return false
    if (dimension && dimension.length && item.dimension !== dimension) return false
    return true
  })
  return doPagination(mockList, page, limit)
}

const getCallLogById = config => {
  const id = config.body
  return getById(id, callLogIndex, callLogList)
}

Mock.mock(/\/sbs\/call-log\/list.api/, 'post', getCallLogList)
Mock.mock(/\/sbs\/call-log\/single.api/, 'post', getCallLogById)
// -
// -
// -
const getCallStatisticsList = config => {
  const { id, customerId, customerIdPath, serverId, packageId, freq, freqDate, dimension, page = 1, limit = 20 } = JSON.parse(config.body)
  const mockList = callStatisticsList.filter(item => {
    if (!item) return false
    if (id && id.length && item.id !== id) return false
    if (customerId && customerId.length && item.customerId !== customerId) return false
    if (customerIdPath && customerIdPath.length && item.customerIdPath.indexOf(customerIdPath) < 0) return false
    if (serverId && serverId.length && item.serverId !== serverId) return false
    if (packageId && packageId.length && item.packageId !== packageId) return false
    if (freq && freq.length && item.freq !== freq) return false
    if (freqDate && freqDate.length && item.freqDate !== freqDate) return false
    if (dimension && dimension.length && item.dimension !== dimension) return false
    return true
  })
  return doPagination(mockList, page, limit)
}

const getCallStatisticsGroupByServer = config => {
  const { serverId, freq, freqDate, dimension, page = 1, limit = 20 } = JSON.parse(config.body)
  const mockList = callStatisticsList.filter(item => {
    if (!item) return false
    if (serverId && serverId.length && item.serverId !== serverId) return false
    if (freq && freq.length && item.freq !== freq) return false
    if (freqDate && freqDate.length && item.freqDate !== freqDate) return false
    if (dimension && dimension.length && item.dimension !== dimension) return false
    return true
  })
  const groups = {}
  mockList.forEach(mock => {
    const { customerId, dimension, count } = mock
    const groupKey = `${customerId}_${dimension}`
    let group = groups[groupKey]
    if (group) {
      group.count = (group.count + count)
    } else {
      group = { customerId, dimension, count }
    }
    groups[groupKey] = group
  })
  return doPagination(Object.values(groups), page, limit)
}

const getCallStatisticsGroupByCustomer = config => {
  const { customerId, freq, freqDate, dimension, page = 1, limit = 20 } = JSON.parse(config.body)
  const packageIds = servicePackageList.filter(item => {
    if (!item) return false
    if (customerId && customerId.length && item.customerId !== customerId) return false
    return true
  }).map(item => item.id)
  const mockList = callStatisticsList.filter(item => {
    if (!item) return false
    if (packageIds && packageIds.length && !packageIds.includes(item.packageId)) return false
    if (freq && freq.length && item.freq !== freq) return false
    if (freqDate && freqDate.length && item.freqDate !== freqDate) return false
    if (dimension && dimension.length && item.dimension !== dimension) return false
    return true
  })
  const groups = {}
  mockList.forEach(mock => {
    const { packageId, dimension, count } = mock
    const groupKey = `${packageId}_${dimension}`
    let group = groups[groupKey]
    if (group) {
      group.count = (group.count + count)
    } else {
      const serverId = getServicePackageById({ body: packageId }).serverId
      group = { serverId, packageId, dimension, count }
    }
    groups[groupKey] = group
  })
  return doPagination(Object.values(groups), page, limit)
}

const getCallStatisticsById = config => {
  const id = config.body
  return getById(id, callStatisticsIndex, callStatisticsList)
}

Mock.mock(/\/sbs\/call-statistics\/list.api/, 'post', getCallStatisticsList)
Mock.mock(/\/sbs\/call-statistics\/by-server.api/, 'post', getCallStatisticsGroupByServer)
Mock.mock(/\/sbs\/call-statistics\/by-customer.api/, 'post', getCallStatisticsGroupByCustomer)
Mock.mock(/\/sbs\/call-statistics\/single.api/, 'post', getCallStatisticsById)
// -
// -
// -
const getCallStatisticsLogList = config => {
  const { id, freq, freqDate, status, page = 1, limit = 20 } = JSON.parse(config.body)
  const mockList = callStatisticsLogList.filter(item => {
    if (!item) return false
    if (id && id.length && item.id !== id) return false
    if (freq && freq.length && item.freq !== freq) return false
    if (freqDate && freqDate.length && item.freqDate.indexOf(freqDate) < 0) return false
    if (status && status.length && item.status !== status) return false
    return true
  })
  return doPagination(mockList, page, limit)
}

const getCallStatisticsLogById = config => {
  const id = config.body
  return getById(id, callStatisticsLogIndex, callStatisticsLogList)
}

Mock.mock(/\/sbs\/call-statistics-log\/list.api/, 'post', getCallStatisticsLogList)
Mock.mock(/\/sbs\/call-statistics-log\/single.api/, 'post', getCallStatisticsLogById)
