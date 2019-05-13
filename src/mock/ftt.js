import Mock from 'mockjs'
import { doPagination, putEntity, updateEntity, getById, deleteById } from './kit'

const taxTypeIndex = {}
const taxTypeList = []
function mockDefaultTaxType() {
  const defaultTaxType = Mock.mock({
    TT_INST_ID: '000000',
    TT_INST_PATH: '000000',
    TT_CREATER: '@cname',
    TT_CREATION_TIME: '@datetime',
    TT_MODIFIER: '@cname',
    TT_MODIFICATION_TIME: '@datetime',
    TT_DATA_PROTECT_MODE: 'DPM03'
  })
  return defaultTaxType
}
function mockTaxType() {
  const taxType = Mock.mock({
    TT_ID: '@guid',
    TT_NAME: '@cname',
    TT_DESCR: '@cparagraph(1, 3)',
    TT_STATUS: 'E'
  })
  return Object.assign({}, mockDefaultTaxType(), taxType)
}

const taxTypeCaliberIndex = {}
const taxTypeCaliberList = []
function mockDefaultTaxTypeCaliber() {
  const defaultTaxTypeCaliber = Mock.mock({
    TTC_INST_ID: '000000',
    TTC_INST_PATH: '000000',
    TTC_ID: '@guid',
    TTC_CREATER: '@cname',
    TTC_CREATION_TIME: '@datetime',
    TTC_MODIFIER: '@cname',
    TTC_MODIFICATION_TIME: '@datetime',
    TTC_DATA_PROTECT_MODE: 'DPM03'
  })
  return defaultTaxTypeCaliber
}
function mockTaxTypeCaliber() {
  const taxTypeCaliber = Mock.mock({
    TTC_TAX_TYPE_ID: '',
    TTC_DISTRICT: ['001', '001001'],
    TTC_DATE_START: '2019-01-01',
    TTC_DATE_END: '2019-12-31',
    'TTC_BASISES|5': [{
      KEY: 'KEY', // 引用 key
      TITLE: 'TITLE',
      TABLE: 'TABLE',
      FIELD: 'FIELD'
    }],
    'TTC_RATIO_CALCS|5': [{
      VALUE: 'VALUE', // 0 - 100
      TITLE: 'TITLE',
      SCRIPT: 'SCRIPT'
    }]
  })
  return Object.assign({}, mockDefaultTaxTypeCaliber(), taxTypeCaliber)
}

const bool = true
if (bool) {
  const TT_ID = 'VAT'
  const taxType = mockTaxType()
  taxType.TT_ID = TT_ID
  taxType.TT_NAME = '增值税'
  putEntity(TT_ID, taxType, taxTypeIndex, taxTypeList)
  const taxTypeCaliber = mockTaxTypeCaliber()
  taxTypeCaliber.TTC_TAX_TYPE_ID = TT_ID
  taxTypeCaliber.TTC_BASISES = [{ KEY: 'TC', TITLE: '交易类型', TABLE: 'FTT_TRANSACTION', FIELD: 'T_TYPE' }]
  taxTypeCaliber.TTC_RATIO_CALCS = [
    { VALUE: '0', TITLE: '免征', SCRIPT: 'eq("#[TC]", "01")' },
    { VALUE: '0', TITLE: '0%', SCRIPT: 'eq("#[TC]", "02")' },
    { VALUE: '6', TITLE: '6%', SCRIPT: 'eq("#[TC]", "03")' },
    { VALUE: '10', TITLE: '10%', SCRIPT: 'eq("#[TC]", "04")' },
    { VALUE: '16', TITLE: '16%', SCRIPT: 'eq("#[TC]", "05")' }
  ]
  putEntity(taxTypeCaliber.TTC_ID, taxTypeCaliber, taxTypeCaliberIndex, taxTypeCaliberList)
}
if (bool) {
  const TT_ID = 'CIT'
  const taxType = mockTaxType()
  taxType.TT_ID = TT_ID
  taxType.TT_NAME = '企业所得税'
  putEntity(TT_ID, taxType, taxTypeIndex, taxTypeList)
  const taxTypeCaliber = mockTaxTypeCaliber()
  taxTypeCaliber.TTC_TAX_TYPE_ID = TT_ID
  taxTypeCaliber.TTC_BASISES = [
    { KEY: 'CI', TITLE: '行业', TABLE: 'FTT_COMPANY', FIELD: 'C_INDUSTRY' },
    { KEY: 'CC', TITLE: '地区', TABLE: 'FTT_COMPANY', FIELD: 'C_SITE' },
    { KEY: 'CS', TITLE: '企业规模', TABLE: 'FTT_COMPANY', FIELD: 'C_SCALE' }
  ]
  taxTypeCaliber.TTC_RATIO_CALCS = [
    { VALUE: '15', TITLE: '15%', SCRIPT: 'eq("#[CI]", "01") AND eq("#[CC]", "0000001") AND eq("#[CS]", "03")' },
    { VALUE: '25', TITLE: '25%', SCRIPT: 'eq("#[CI]", "02") AND eq("#[CC]", "0000001") AND eq("#[CS]", "03")' }
  ]
  putEntity(taxTypeCaliber.TTC_ID, taxTypeCaliber, taxTypeCaliberIndex, taxTypeCaliberList)
}

const getTaxTypeList = config => {
  const { TT_ID, TT_NAME, TT_STATUS, page = 1, limit = 20 } = JSON.parse(config.body)
  const mockList = taxTypeList.filter(item => {
    if (!item) return false
    if (TT_ID && TT_ID.length && item.TT_ID !== TT_ID) return false
    if (TT_NAME && TT_NAME.length && item.TT_NAME.indexOf(TT_NAME) < 0) return false
    if (TT_STATUS && TT_STATUS.length && item.TT_STATUS !== TT_STATUS) return false
    return true
  })
  return doPagination(mockList, page, limit)
}
const getTaxType = config => {
  const { TT_ID } = JSON.parse(config.body)
  return getById(TT_ID, taxTypeIndex, taxTypeList)
}
const deleteTaxTypeById = config => {
  const TT_IDS = JSON.parse(config.body)
  deleteById(TT_IDS, taxTypeIndex, taxTypeList)
}
const saveTaxType = config => {
  let taxType = JSON.parse(config.body)
  let TT_ID = taxType.TT_ID
  if (taxTypeIndex[TT_ID] !== undefined) {
    updateEntity(TT_ID, taxType, taxTypeIndex, taxTypeList)
  } else {
    taxType = Object.assign({}, mockDefaultTaxType(), taxType)
    TT_ID = taxType.TT_ID
    putEntity(TT_ID, taxType, taxTypeIndex, taxTypeList)
  }
  return getById(TT_ID, taxTypeIndex, taxTypeList)
}
const getTaxTypeCaliberList = config => {
  const { TTC_TAX_TYPE_ID, TTC_DISTRICT, page = 1, limit = 20 } = JSON.parse(config.body)
  const mockList = taxTypeCaliberList.filter(item => {
    if (!item) return false
    if (TTC_TAX_TYPE_ID && TTC_TAX_TYPE_ID.length && item.TTC_TAX_TYPE_ID !== TTC_TAX_TYPE_ID) return false
    if (TTC_DISTRICT && TTC_DISTRICT.length && JSON.stringify(item.TTC_DISTRICT) !== JSON.stringify(TTC_DISTRICT)) return false
    return true
  })
  return doPagination(mockList, page, limit)
}
const getTaxTypeCaliber = config => {
  const { TTC_ID } = JSON.parse(config.body)
  return getById(TTC_ID, taxTypeCaliberIndex, taxTypeCaliberList)
}
const deleteTaxTypeCaliberById = config => {
  const TTC_IDS = JSON.parse(config.body)
  deleteById(TTC_IDS, taxTypeCaliberIndex, taxTypeCaliberList)
}
const saveTaxTypeCaliber = config => {
  let taxTypeCaliber = JSON.parse(config.body)
  let TTC_ID = taxTypeCaliber.TTC_ID
  if (taxTypeCaliberIndex[TTC_ID] !== undefined) {
    updateEntity(TTC_ID, taxTypeCaliber, taxTypeCaliberIndex, taxTypeCaliberList)
  } else {
    taxTypeCaliber = Object.assign({}, mockDefaultTaxTypeCaliber(), taxTypeCaliber)
    TTC_ID = taxTypeCaliber.TTC_ID
    putEntity(TTC_ID, taxTypeCaliber, taxTypeCaliberIndex, taxTypeCaliberList)
  }
  return getById(TTC_ID, taxTypeCaliberIndex, taxTypeCaliberList)
}

Mock.mock(/\/ftt\/basic-data\/tax-type\/list/, 'post', getTaxTypeList)
Mock.mock(/\/ftt\/basic-data\/tax-type\/single/, 'post', getTaxType)
Mock.mock(/\/ftt\/basic-data\/tax-type\/delete/, 'post', deleteTaxTypeById)
Mock.mock(/\/ftt\/basic-data\/tax-type\/save/, 'post', saveTaxType)
Mock.mock(/\/ftt\/basic-data\/tax-type-caliber\/list/, 'post', getTaxTypeCaliberList)
Mock.mock(/\/ftt\/basic-data\/tax-type-caliber\/single/, 'post', getTaxTypeCaliber)
Mock.mock(/\/ftt\/basic-data\/tax-type-caliber\/delete/, 'post', deleteTaxTypeCaliberById)
Mock.mock(/\/ftt\/basic-data\/tax-type-caliber\/save/, 'post', saveTaxTypeCaliber)
