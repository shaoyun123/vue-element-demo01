import Mock from 'mockjs'
import { doPagination, putEntity, updateEntity, getById, deleteById } from './kit'
import { getDataType } from '@/utils'
import request from '@/utils/request'

const enterpriseIndex = {}
const enterpriseList = []
function mockDefaultEnterprise() {
  const defaultEnterprise = Mock.mock({
    E_INST_ID: '000000',
    E_INST_PATH: '000000',
    E_ID: '@guid',
    E_CREATER: '@cname',
    E_CREATION_TIME: '@datetime',
    E_MODIFIER: '@cname',
    E_MODIFICATION_TIME: '@datetime',
    E_DATA_PROTECT_MODE: 'DPM03'
  })
  return defaultEnterprise
}
function mockEnterprise() {
  const enterprise = Mock.mock({
    E_NAME: '企业 @increment',
    E_TAX_ID_NUMBER: '@id',
    'E_TYPE|1': ['01', '02'],
    E_ADDRESS: '@county(true)',
    E_PHONE: /^1[385][1-9]\d{8}/,
    E_REMARK: '@cparagraph(1, 3)'
  })
  return Object.assign({}, mockDefaultEnterprise(), enterprise)
}
const staffIndex = {}
const staffList = []
function mockDefaultStaff() {
  const defaultEnterprise = Mock.mock({
    S_INST_ID: '000000',
    S_INST_PATH: '000000',
    S_CREATER: '@cname',
    S_CREATION_TIME: '@datetime',
    S_MODIFIER: '@cname',
    S_MODIFICATION_TIME: '@datetime',
    S_DATA_PROTECT_MODE: 'DPM03'
  })
  return defaultEnterprise
}
function mockStaff() {
  const staff = Mock.mock({
    'S_NUMBER|10': '@integer(0, 9)',
    'S_LOGIN_ID|1': ['', '@first'],
    S_ENTERPRISE_ID: '@guid',
    S_NAME: '@cname',
    'S_GENDER|1': ['M', 'F'],
    S_BIRTHDATE: '@date',
    'S_NATIONALITY|1': ['001', '002', '003', '004', '005'],
    S_ID_TYPE: '01',
    S_ID_NUMBER: '@id',
    S_ADDRESS: '@county(true)',
    S_PHONE: /^1[385][1-9]\d{8}/,
    S_EMAIL: '@email',
    'S_EDUCATION|1': ['01', '02', '03', '04', '05'],
    'S_STATUS|1': ['1', '2'],
    'S_IS_STAFF|1': ['Y', 'N'],
    S_HIRE_DATE: '@date',
    S_TERM_DATE: '@date',
    S_DEPARTMENT: '开发部',
    'S_DUTY|1': ['1', '2'],
    S_DEPOSIT_BANK: '交通银行',
    'S_BANK_NUMBER|19': '@integer(0, 9)',
    'S_IS_MARITAL|1': ['Y', 'N'],
    S_SPOUSE_NAME: '@cname',
    S_SPOUSE_ID_TYPE: '01',
    S_SPOUSE_ID_NUMBER: '@id',
    'S_IS_DISABLED|1': ['Y', 'N'],
    'S_DC_NUMBER|19': '@integer(0, 9)',
    'S_IS_HERO_FM|1': ['Y', 'N'],
    'S_HFMC_NUMBER|15': '@integer(0, 9)',
    'S_IS_LONELY_ELDERLY|1': ['Y', 'N'],
    'S_IS_INVESTOR|1': ['Y', 'N'],
    S_CORPORATE_ASSETS: '@float(0, 100000, 0, 2)',
    S_PERSONAL_ASSETS: '@float(0, 100000, 0, 2)',
    S_ASSETS_RATIO: '@float(0, 100, 0, 2)',
    'S_IS_OVERSEA|1': ['Y', 'N'],
    S_CHEGADA_TIME: '@datetime',
    S_PARTIDA_TIME: '@datetime',
    S_PARTIDA_ADDRESS: '@county(true)',
    S_TENURE: '@integer(0, 24)',
    'S_HAVE_INLAND_DOMICILE|1': ['Y', 'N'],
    'S_INLAND_DUTY|1': ['1', '2'],
    'S_OVERSEA_DUTY|1': ['1', '2'],
    S_INLAND_YIELDLY: '@county(true)',
    S_OVERSEA_YIELDLY: '@county(true)',
    'S_VERIFY_STATUS|1': ['1', '2', '3', '4'],
    'S_RECORD_STATUS|1': ['1', '2', '3'],
    S_REMARK: '@cparagraph(1, 3)'
  })
  return Object.assign({}, mockDefaultStaff(), staff)
}
const salaryIndex = {}
const salaryList = []
function mockDefaultSalary() {
  const defaultSalary = Mock.mock({
    S_INST_ID: '000000',
    S_INST_PATH: '000000',
    S_CREATER: '@cname',
    S_CREATION_TIME: '@datetime',
    S_MODIFIER: '@cname',
    S_MODIFICATION_TIME: '@datetime',
    S_DATA_PROTECT_MODE: 'DPM03'
  })
  return defaultSalary
}
function mockSalary() {
  const salary = Mock.mock({
    'S_STAFF_NUMBER|10': '@integer(0, 9)',
    S_TYPE: '01',
    S_PAY_SITE: ['001', '001001'],
    S_PAY_TYPE: '02',
    S_PAY_ENTERPRISE_ID: '@guid',
    S_WAGE_BASIC: '@float(0, 100000, 0, 2)',
    S_WAGE_POST: '@float(0, 100000, 0, 2)',
    S_WAGE_KPI: '@float(0, 100000, 0, 2)',
    S_WAGE_OVERTIME: '@float(0, 100000, 0, 2)',
    S_WAGE_RETROACTIVE: '@float(0, 100000, 0, 2)',
    S_WAGE_PROBATION: '@float(0, 100000, 0, 2)',
    S_SUBSIDY: '@float(0, 100000, 0, 2)',
    S_BONUS: '@float(0, 100000, 0, 2)',
    S_DEDUCT: '@float(0, 100000, 0, 2)',
    S_FIDUCIAL_PENSION: '@float(0, 100000, 0, 2)',
    S_RATIO_PENSION_P: '7',
    S_RATIO_PENSION_E: '7',
    S_RATIO_PENSION_PS: '7',
    S_RATIO_PENSION_ES: '7',
    S_FIDUCIAL_MEDICAL: '@float(0, 100000, 0, 2)',
    S_RATIO_MEDICAL_P: '7',
    S_RATIO_MEDICAL_E: '7',
    S_RATIO_MEDICAL_PS: '7',
    S_RATIO_MEDICAL_ES: '7',
    S_FIDUCIAL_UNEMPLOYMENT: '@float(0, 100000, 0, 2)',
    S_RATIO_UNEMPLOYMENT_P: '7',
    S_RATIO_UNEMPLOYMENT_E: '7',
    S_RATIO_UNEMPLOYMENT_PS: '7',
    S_RATIO_UNEMPLOYMENT_ES: '7',
    S_FIDUCIAL_PROCREATION: '@float(0, 100000, 0, 2)',
    S_RATIO_PROCREATION_P: '7',
    S_RATIO_PROCREATION_E: '7',
    S_RATIO_PROCREATION_PS: '7',
    S_RATIO_PROCREATION_ES: '7',
    S_FIDUCIAL_INJURY: '@float(0, 100000, 0, 2)',
    S_RATIO_INJURY_P: '7',
    S_RATIO_INJURY_E: '7',
    S_RATIO_INJURY_PS: '7',
    S_RATIO_INJURY_ES: '7',
    S_FIDUCIAL_CR_FUND: '@float(0, 100000, 0, 2)',
    S_RATIO_CR_FUND_P: '7',
    S_RATIO_CR_FUND_E: '7',
    S_FIDUCIAL_CR_FUND_S: '@float(0, 100000, 0, 2)',
    S_RATIO_CR_FUND_PS: '7',
    S_RATIO_CR_FUND_ES: '7'
  })
  return Object.assign({}, mockDefaultSalary(), salary)
}
function getSalaryId(salary) {
  return salary.S_STAFF_NUMBER + '_' + salary.S_TYPE
}
const fiducialIndex = {}
const fiducialList = []
function mockDefaultFiducial() {
  const defaultFiducial = Mock.mock({
    PFC_INST_ID: '000000',
    PFC_INST_PATH: '000000',
    PFC_CREATER: '@cname',
    PFC_CREATION_TIME: '@datetime',
    PFC_MODIFIER: '@cname',
    PFC_MODIFICATION_TIME: '@datetime',
    PFC_DATA_PROTECT_MODE: 'DPM03'
  })
  return defaultFiducial
}
function mockFiducial() {
  const fiducial = Mock.mock({
    PFC_PAY_SITE: ['001', '001001'],
    PFC_YEAR: '2019',
    PFC_WAGE_AVERAGE: '@float(0, 100000, 0, 2)',
    PFC_PENSION_MAX: '@float(0, 100000, 0, 2)',
    PFC_PENSION_MIN: '@float(0, 100000, 0, 2)',
    PFC_MEDICAL_MAX: '@float(0, 100000, 0, 2)',
    PFC_MEDICAL_MIN: '@float(0, 100000, 0, 2)',
    PFC_UNEMPLOYMENT_MAX: '@float(0, 100000, 0, 2)',
    PFC_UNEMPLOYMENT_MIN: '@float(0, 100000, 0, 2)',
    PFC_PROCREATION_MAX: '@float(0, 100000, 0, 2)',
    PFC_PROCREATION_MIN: '@float(0, 100000, 0, 2)',
    PFC_INJURY_MAX: '@float(0, 100000, 0, 2)',
    PFC_INJURY_MIN: '@float(0, 100000, 0, 2)',
    PFC_CR_FUND_MAX: '@float(0, 100000, 0, 2)',
    PFC_CR_FUND_MIN: '@float(0, 100000, 0, 2)',
    PFC_CR_FUND_S_MAX: '@float(0, 100000, 0, 2)',
    PFC_CR_FUND_S_MIN: '@float(0, 100000, 0, 2)'
  })
  return Object.assign({}, mockDefaultFiducial(), fiducial)
}
function getFiducialId(fiducial) {
  return fiducial.PFC_PAY_SITE + '_' + fiducial.PFC_YEAR
}
const ratioIndex = {}
const ratioList = []
function mockDefaultRatio() {
  const defaultRatio = Mock.mock({
    PRC_INST_ID: '000000',
    PRC_INST_PATH: '000000',
    PRC_CREATER: '@cname',
    PRC_CREATION_TIME: '@datetime',
    PRC_MODIFIER: '@cname',
    PRC_MODIFICATION_TIME: '@datetime',
    PRC_DATA_PROTECT_MODE: 'DPM03'
  })
  return defaultRatio
}
function mockRatio() {
  const ratio = Mock.mock({
    PRC_PAY_SITE: ['001', '001001'],
    PRC_EFFECTIVE_DATE: '2019-01-01',
    PRC_EXPIRY_DATE: '2019-12-31',
    PRC_PENSION_P: '5, 7, 9',
    PRC_PENSION_E: '5, 7, 9',
    PRC_PENSION_PS: '5, 7, 9',
    PRC_PENSION_ES: '5, 7, 9',
    PRC_MEDICAL_P: '5, 7, 9',
    PRC_MEDICAL_E: '5, 7, 9',
    PRC_MEDICAL_PS: '5, 7, 9',
    PRC_MEDICAL_ES: '5, 7, 9',
    PRC_UNEMPLOYMENT_P: '5, 7, 9',
    PRC_UNEMPLOYMENT_E: '5, 7, 9',
    PRC_UNEMPLOYMENT_PS: '5, 7, 9',
    PRC_UNEMPLOYMENT_ES: '5, 7, 9',
    PRC_PROCREATION_P: '5, 7, 9',
    PRC_PROCREATION_E: '5, 7, 9',
    PRC_PROCREATION_PS: '5, 7, 9',
    PRC_PROCREATION_ES: '5, 7, 9',
    PRC_INJURY_P: '5, 7, 9',
    PRC_INJURY_E: '5, 7, 9',
    PRC_INJURY_PS: '5, 7, 9',
    PRC_INJURY_ES: '5, 7, 9',
    PRC_CR_FUND_P: '5, 7, 9',
    PRC_CR_FUND_E: '5, 7, 9',
    PRC_CR_FUND_PS: '5, 7, 9',
    PRC_CR_FUND_ES: '5, 7, 9'
  })
  return Object.assign({}, mockDefaultRatio(), ratio)
}
function getRatioId(ratio) {
  return ratio.PRC_PAY_SITE + '_' + ratio.PRC_EFFECTIVE_DATE + '_' + ratio.PRC_EXPIRY_DATE
}
const taxStairIndex = {}
const taxStairList = []
function mockDefaultTaxStair() {
  const defaultTaxStair = Mock.mock({
    TSC_INST_ID: '000000',
    TSC_INST_PATH: '000000',
    TSC_ID: '@guid',
    TSC_CREATER: '@cname',
    TSC_CREATION_TIME: '@datetime',
    TSC_MODIFIER: '@cname',
    TSC_MODIFICATION_TIME: '@datetime',
    TSC_DATA_PROTECT_MODE: 'DPM03'
  })
  return defaultTaxStair
}
function mockTaxStair() {
  const taxStair = Mock.mock({
    TSC_EFFECTIVE_DATE: '@date',
    TSC_EXPIRY_DATE: '@date',
    'TSC_IS_RESIDENT|1': ['Y', 'N'],
    'TSC_INCOME_TYPE|1': ['1', '2', '3'],
    TSC_LEVEL: '@integer(1, 9)',
    TSC_AMOUNT: '@float(0, 100000, 0, 2)',
    TSC_RATIO: '@float(0, 100, 0, 2)',
    TSC_QUICK_DEDUCTION: '@float(0, 100000, 0, 2)'
  })
  return Object.assign({}, mockDefaultTaxStair(), taxStair)
}
const childEducateIndex = {}
const childEducateList = []
function mockDefaultChildEducate() {
  const defaultChildEducate = Mock.mock({
    ADCE_INST_ID: '000000',
    ADCE_INST_PATH: '000000',
    ADCE_ID: '@guid',
    ADCE_CREATER: '@cname',
    ADCE_CREATION_TIME: '@datetime',
    ADCE_MODIFIER: '@cname',
    ADCE_MODIFICATION_TIME: '@datetime',
    ADCE_DATA_PROTECT_MODE: 'DPM03'
  })
  return defaultChildEducate
}
function mockChildEducate() {
  const childEducate = Mock.mock({
    'ADCE_STAFF_NUMBER|10': '@integer(0, 9)',
    ADCE_NAME: '@cname',
    ADCE_BIRTHDATE: '@date',
    'ADCE_NATIONALITY|1': ['001', '002', '003', '004', '005'],
    ADCE_ID_TYPE: '01',
    ADCE_ID_NUMBER: '@id',
    'ADCE_EDUCATE_STAGE|1': ['1', '2', '3', '4'],
    ADCE_STAGE_START: '@date',
    ADCE_STAGE_END: '@date',
    ADCE_EDUCATE_STOP: '@date',
    'ADCE_SCHOOL_SITE|1': ['001', '002', '003', '004', '005'],
    ADCE_SCHOOL_NAME: '学校',
    ADCE_AMOUNT: '@float(0, 100000, 0, 2)',
    'ADCE_RATIO|1': [50, 100]
  })
  return Object.assign({}, mockDefaultChildEducate(), childEducate)
}
const adultEducateIndex = {}
const adultEducateList = []
function mockDefaultAdultEducate() {
  const defaultAdultEducate = Mock.mock({
    ADAE_INST_ID: '000000',
    ADAE_INST_PATH: '000000',
    ADAE_ID: '@guid',
    ADAE_CREATER: '@cname',
    ADAE_CREATION_TIME: '@datetime',
    ADAE_MODIFIER: '@cname',
    ADAE_MODIFICATION_TIME: '@datetime',
    ADAE_DATA_PROTECT_MODE: 'DPM03'
  })
  return defaultAdultEducate
}
function mockAdultEducate() {
  const adultEducate = Mock.mock({
    'ADAE_STAFF_NUMBER|10': '@integer(0, 9)',
    ADAE_STAGE_START: '@date',
    ADAE_STAGE_END: '@date',
    'ADAE_EDUCATE_STAGE|1': ['01', '02', '03', '04', '05'],
    'ADAE_EDUCATE_TYPE|1': ['1', '2'],
    ADAE_CERTIFICATE_DATE: '@date',
    ADAE_CERTIFICATE_NAME: '证书名称',
    'ADAE_CERTIFICATE_ID|10': '@integer(0, 9)',
    ADAE_CERTIFICATE_ISSUER: '发证机关',
    ADAE_AMOUNT: '@float(0, 100000, 0, 2)'
  })
  return Object.assign({}, mockDefaultAdultEducate(), adultEducate)
}
const houseLoanIndex = {}
const houseLoanList = []
function mockDefaultHouseLoan() {
  const defaultHouseLoan = Mock.mock({
    ADHL_INST_ID: '000000',
    ADHL_INST_PATH: '000000',
    ADHL_ID: '@guid',
    ADHL_CREATER: '@cname',
    ADHL_CREATION_TIME: '@datetime',
    ADHL_MODIFIER: '@cname',
    ADHL_MODIFICATION_TIME: '@datetime',
    ADHL_DATA_PROTECT_MODE: 'DPM03'
  })
  return defaultHouseLoan
}
function mockHouseLoan() {
  const houseLoan = Mock.mock({
    'ADHL_STAFF_NUMBER|10': '@integer(0, 9)',
    ADHL_ADDRESS: '@county(true)',
    'ADHL_IS_BORROWER|1': ['Y', 'N'],
    'ADHL_CERTIFICATE_TYPE|1': ['1', '2', '3', '4'],
    'ADHL_CERTIFICATE_ID|10': '@integer(0, 9)',
    'ADHL_LOAN_TYPE|1': ['1', '2'],
    ADHL_LOAN_BANK: '交通银行',
    'ADHL_LOAN_CN|10': '@integer(0, 9)',
    ADHL_LOAN_DEADLINE: '@integer(12, 48)',
    ADHL_FIRST_REPAY_DATE: '@date',
    ADHL_AMOUNT: '@float(0, 100000, 0, 2)',
    'ADHL_RATIO|1': [50, 100]
  })
  return Object.assign({}, mockDefaultHouseLoan(), houseLoan)
}
const houseRentIndex = {}
const houseRentList = []
function mockDefaultHouseRent() {
  const defaultHouseRent = Mock.mock({
    ADHR_INST_ID: '000000',
    ADHR_INST_PATH: '000000',
    ADHR_ID: '@guid',
    ADHR_CREATER: '@cname',
    ADHR_CREATION_TIME: '@datetime',
    ADHR_MODIFIER: '@cname',
    ADHR_MODIFICATION_TIME: '@datetime',
    ADHR_DATA_PROTECT_MODE: 'DPM03'
  })
  return defaultHouseRent
}
function mockHouseRent() {
  const houseRent = Mock.mock({
    'ADHR_STAFF_NUMBER|10': '@integer(0, 9)',
    ADHR_WORK_SITE: ['001', '001001'],
    'ADHR_LESSOR_TYPE|1': ['1', '2'],
    ADHR_LESSOR_NAME: '出租方名称',
    ADHR_LESSOR_ID_TYPE: '01',
    ADHR_LESSOR_ID_NUMBER: '@id',
    ADHR_ADDRESS: '@county(true)',
    'ADHR_LEASE_CN|10': '@integer(0, 9)',
    ADHR_LEASE_DATE_START: '@date',
    ADHR_LEASE_DATE_END: '@date',
    ADHR_AMOUNT: '@float(0, 100000, 0, 2)'
  })
  return Object.assign({}, mockDefaultHouseRent(), houseRent)
}
const supportAgedIndex = {}
const supportAgedList = []
function mockDefaultSupportAged() {
  const defaultSupportAged = Mock.mock({
    ADSA_INST_ID: '000000',
    ADSA_INST_PATH: '000000',
    ADSA_ID: '@guid',
    ADSA_CREATER: '@cname',
    ADSA_CREATION_TIME: '@datetime',
    ADSA_MODIFIER: '@cname',
    ADSA_MODIFICATION_TIME: '@datetime',
    ADSA_DATA_PROTECT_MODE: 'DPM03'
  })
  return defaultSupportAged
}
function mockSupportAged() {
  const supportAged = Mock.mock({
    'ADSA_STAFF_NUMBER|10': '@integer(0, 9)',
    'ADSA_TAXPAYER_TYPE|1': ['1', '2'],
    'ADSA_APPORTION_TYPE|1': ['1', '2', '3'],
    'ADSA_RELATION|1': ['1', '2', '3'],
    ADSA_NAME: '@cname',
    ADSA_BIRTHDATE: '@date',
    ADSA_ID_TYPE: '01',
    ADSA_ID_NUMBER: '@id',
    'ADSA_NATIONALITY|1': ['001', '002', '003', '004', '005'],
    ADSA_PARTNER_NAME: '@cname',
    ADSA_PARTNER_ID_TYPE: '01',
    ADSA_PARTNER_ID_NUMBER: '@id',
    'ADSA_PARTNER_NATIONALITY|1': ['001', '002', '003', '004', '005'],
    ADSA_AMOUNT: '@float(0, 100000, 0, 2)'
  })
  return Object.assign({}, mockDefaultSupportAged(), supportAged)
}
const medicalIndex = {}
const medicalList = []
function mockDefaultMedical() {
  const defaultMedical = Mock.mock({
    ADM_INST_ID: '000000',
    ADM_INST_PATH: '000000',
    ADM_ID: '@guid',
    ADM_CREATER: '@cname',
    ADM_CREATION_TIME: '@datetime',
    ADM_MODIFIER: '@cname',
    ADM_MODIFICATION_TIME: '@datetime',
    ADM_DATA_PROTECT_MODE: 'DPM03'
  })
  return defaultMedical
}
function mockMedical() {
  const medical = Mock.mock({
    'ADM_STAFF_NUMBER|10': '@integer(0, 9)',
    'ADM_RELATION|1': ['1', '2', '3'],
    ADM_NAME: '@cname',
    ADM_ID_TYPE: '01',
    ADM_ID_NUMBER: '@id',
    ADM_MEDICAL_EXPENSE: '@float(0, 100000, 0, 2)',
    ADM_AMOUNT: '@float(0, 100000, 0, 2)'
  })
  return Object.assign({}, mockDefaultMedical(), medical)
}
const salarySnapshootIndex = {}
const salarySnapshootList = []
function mockDefaultSalarySnapshoot() {
  const defaultSalarySnapshoot = Mock.mock({
    SS_INST_ID: '000000',
    SS_INST_PATH: '000000',
    SS_CREATER: '@cname',
    SS_CREATION_TIME: '@datetime',
    SS_MODIFIER: '@cname',
    SS_MODIFICATION_TIME: '@datetime',
    SS_DATA_PROTECT_MODE: 'DPM03'
  })
  return defaultSalarySnapshoot
}
function mockSalarySnapshoot() {
  const salarySnapshoot = Mock.mock({
    SS_FREQ: 'M',
    SS_ISSUE: '2019-02',
    'SS_STAFF_NUMBER|10': '@integer(0, 9)',
    SS_TYPE: '01',
    SS_PREDICT_PAY_DATE: '2019-03-08',
    SS_PAY_SITE: ['001', '001001'],
    SS_PAY_TYPE: '02',
    SS_PAY_ENTERPRISE_ID: '@guid',
    SS_WAGE_BASIC: '@float(0, 100000, 0, 2)',
    SS_WAGE_POST: '@float(0, 100000, 0, 2)',
    SS_WAGE_KPI: '@float(0, 100000, 0, 2)',
    SS_WAGE_OVERTIME: '@float(0, 100000, 0, 2)',
    SS_WAGE_RETROACTIVE: '@float(0, 100000, 0, 2)',
    SS_WAGE_PROBATION: '@float(0, 100000, 0, 2)',
    SS_SUBSIDY: '@float(0, 100000, 0, 2)',
    SS_BONUS: '@float(0, 100000, 0, 2)',
    SS_DEDUCT: '@float(0, 100000, 0, 2)',
    SS_WAGE_TOTAL: '@float(0, 100000, 0, 2)',
    SS_FIDUCIAL_PENSION: '@float(0, 100000, 0, 2)',
    SS_RATIO_PENSION_P: '7',
    SS_PAY_PENSION_P: '@float(0, 100000, 0, 2)',
    SS_RATIO_PENSION_E: '7',
    SS_PAY_PENSION_E: '@float(0, 100000, 0, 2)',
    SS_RATIO_PENSION_PS: '7',
    SS_PAY_PENSION_PS: '@float(0, 100000, 0, 2)',
    SS_RATIO_PENSION_ES: '7',
    SS_PAY_PENSION_ES: '@float(0, 100000, 0, 2)',
    SS_FIDUCIAL_MEDICAL: '@float(0, 100000, 0, 2)',
    SS_RATIO_MEDICAL_P: '7',
    SS_PAY_MEDICAL_P: '@float(0, 100000, 0, 2)',
    SS_RATIO_MEDICAL_E: '7',
    SS_PAY_MEDICAL_E: '@float(0, 100000, 0, 2)',
    SS_RATIO_MEDICAL_PS: '7',
    SS_PAY_MEDICAL_PS: '@float(0, 100000, 0, 2)',
    SS_RATIO_MEDICAL_ES: '7',
    SS_PAY_MEDICAL_ES: '@float(0, 100000, 0, 2)',
    SS_FIDUCIAL_UNEMPLOYMENT: '@float(0, 100000, 0, 2)',
    SS_RATIO_UNEMPLOYMENT_P: '7',
    SS_PAY_UNEMPLOYMENT_P: '@float(0, 100000, 0, 2)',
    SS_RATIO_UNEMPLOYMENT_E: '7',
    SS_PAY_UNEMPLOYMENT_E: '@float(0, 100000, 0, 2)',
    SS_RATIO_UNEMPLOYMENT_PS: '7',
    SS_PAY_UNEMPLOYMENT_PS: '@float(0, 100000, 0, 2)',
    SS_RATIO_UNEMPLOYMENT_ES: '7',
    SS_PAY_UNEMPLOYMENT_ES: '@float(0, 100000, 0, 2)',
    SS_FIDUCIAL_PROCREATION: '@float(0, 100000, 0, 2)',
    SS_RATIO_PROCREATION_P: '7',
    SS_PAY_PROCREATION_P: '@float(0, 100000, 0, 2)',
    SS_RATIO_PROCREATION_E: '7',
    SS_PAY_PROCREATION_E: '@float(0, 100000, 0, 2)',
    SS_RATIO_PROCREATION_PS: '7',
    SS_PAY_PROCREATION_PS: '@float(0, 100000, 0, 2)',
    SS_RATIO_PROCREATION_ES: '7',
    SS_PAY_PROCREATION_ES: '@float(0, 100000, 0, 2)',
    SS_FIDUCIAL_INJURY: '@float(0, 100000, 0, 2)',
    SS_RATIO_INJURY_P: '7',
    SS_PAY_INJURY_P: '@float(0, 100000, 0, 2)',
    SS_RATIO_INJURY_E: '7',
    SS_PAY_INJURY_E: '@float(0, 100000, 0, 2)',
    SS_RATIO_INJURY_PS: '7',
    SS_PAY_INJURY_PS: '@float(0, 100000, 0, 2)',
    SS_RATIO_INJURY_ES: '7',
    SS_PAY_INJURY_ES: '@float(0, 100000, 0, 2)',
    SS_FIDUCIAL_CR_FUND: '@float(0, 100000, 0, 2)',
    SS_RATIO_CR_FUND_P: '7',
    SS_PAY_CR_FUND_P: '@float(0, 100000, 0, 2)',
    SS_RATIO_CR_FUND_E: '7',
    SS_PAY_CR_FUND_E: '@float(0, 100000, 0, 2)',
    SS_FIDUCIAL_CR_FUND_S: '@float(0, 100000, 0, 2)',
    SS_RATIO_CR_FUND_PS: '7',
    SS_PAY_CR_FUND_PS: '@float(0, 100000, 0, 2)',
    SS_RATIO_CR_FUND_ES: '7',
    SS_PAY_CR_FUND_ES: '@float(0, 100000, 0, 2)',
    'SS_STATUS|1': ['01', '02', '03', '04', '05', '06'],
    'SS_VERIFY_STATUS|1': ['01', '02', '03', '04']
  })
  return Object.assign({}, mockDefaultSalarySnapshoot(), salarySnapshoot)
}
function getSalarySnapshootId(salarySnapshoot) {
  return salarySnapshoot.SS_FREQ + '_' + salarySnapshoot.SS_ISSUE + '_' + salarySnapshoot.SS_STAFF_NUMBER + '_' + salarySnapshoot.SS_TYPE
}
function getSalarySnapshootResults(salarySnapshoot) {
  const SS_ISSUE = salarySnapshoot.SS_ISSUE
  const SS_STAFF_NUMBER = salarySnapshoot.SS_STAFF_NUMBER
  const SS_STAFF_NAME = salarySnapshoot.SS_STAFF_NAME
  const SS_TYPE = salarySnapshoot.SS_TYPE
  const SS_PAY_TYPE = salarySnapshoot.SS_PAY_TYPE
  const SS_PAY_ENTERPRISE_ID = salarySnapshoot.SS_PAY_ENTERPRISE_ID
  let SS_STATUS = salarySnapshoot.SS_STATUS
  if (getDataType(SS_STATUS) === 'string') {
    SS_STATUS = [SS_STATUS]
  }
  const SS_VERIFY_STATUS = salarySnapshoot.SS_VERIFY_STATUS
  const mockList = salarySnapshootList.filter(item => {
    if (!item) return false
    if (SS_ISSUE && SS_ISSUE.length && item.SS_ISSUE !== SS_ISSUE) return false
    if (SS_STAFF_NUMBER && SS_STAFF_NUMBER.length && item.SS_STAFF_NUMBER !== SS_STAFF_NUMBER) return false
    if (SS_STAFF_NAME && SS_STAFF_NAME.length && item.SS_STAFF_NAME.indexOf(SS_STAFF_NAME) < 0) return false
    if (SS_TYPE && SS_TYPE.length && item.SS_TYPE !== SS_TYPE) return false
    if (SS_PAY_TYPE && SS_PAY_TYPE.length && item.SS_PAY_TYPE !== SS_PAY_TYPE) return false
    if (SS_PAY_ENTERPRISE_ID && SS_PAY_ENTERPRISE_ID.length && item.SS_PAY_ENTERPRISE_ID !== SS_PAY_ENTERPRISE_ID) return false
    if (SS_STATUS && SS_STATUS.length && !SS_STATUS.includes(item.SS_STATUS)) return false
    if (SS_VERIFY_STATUS && SS_VERIFY_STATUS.length && item.SS_VERIFY_STATUS !== SS_VERIFY_STATUS) return false
    return true
  })
  return mockList
}
const adSnapshootIndex = {}
const adSnapshootList = []
const adSnapshootDict = {
  '001': '子女教育',
  '002': '继续教育',
  '003': '住房贷款利息',
  '004': '住房租金',
  '005': '赡养老人',
  '006': '大病医疗'
}
function mockDefaultADSnapshoot() {
  const defaultADSnapshoot = Mock.mock({
    ADS_INST_ID: '000000',
    ADS_INST_PATH: '000000',
    ADS_CREATER: '@cname',
    ADS_CREATION_TIME: '@datetime',
    ADS_MODIFIER: '@cname',
    ADS_MODIFICATION_TIME: '@datetime',
    ADS_DATA_PROTECT_MODE: 'DPM03'
  })
  return defaultADSnapshoot
}
function mockADSnapshoot() {
  const adSnapshoot = Mock.mock({
    ADS_FREQ: 'M',
    ADS_ISSUE: '2019-02',
    'ADS_STAFF_NUMBER|10': '@integer(0, 9)',
    'ADS_TYPE|1': ['001', '002', '003', '004', '005', '006'],
    ADS_DESCR: '@cparagraph(1, 3)',
    ADS_AMOUNT: '@float(0, 100000, 0, 2)',
    ADS_AT_ALREADY: '@float(0, 100000, 0, 2)',
    ADS_AT_SHOULD: '@float(0, 100000, 0, 2)',
    'ADS_VERIFY_STATUS|1': ['01', '02', '03', '04']
  })
  adSnapshoot.ADS_TITLE = adSnapshootDict[adSnapshoot.ADS_TYPE]
  return Object.assign({}, mockDefaultADSnapshoot(), adSnapshoot)
}
function getADSnapshootId(adSnapshoot) {
  return adSnapshoot.ADS_FREQ + '_' + adSnapshoot.ADS_ISSUE + '_' + adSnapshoot.ADS_STAFF_NUMBER
}
const verifyResultIndex = {}
const verifyResultList = []
function mockDefaultVerifyResult() {
  const defaultVerifyResult = Mock.mock({
    VR_INST_ID: '000000',
    VR_INST_PATH: '000000',
    VR_ID: '@guid',
    VR_CREATER: '@cname',
    VR_CREATION_TIME: '@datetime'
  })
  return defaultVerifyResult
}
function mockVerifyResult() {
  const verifyResult = Mock.mock({
    'VR_BODY_TYPE|1': ['01', '02'],
    VR_BODY_ID: '',
    VR_RULE_TITLE: '测试规则',
    VR_RULE_DESCR: '@cparagraph(1, 3)',
    VR_RESULT: '@cparagraph(1, 3)',
    'VR_STATUS|1': ['01', '02', '03'],
    VR_DISPOSE_DESCR: '@cparagraph(1, 3)'
  })
  return Object.assign({}, mockDefaultVerifyResult(), verifyResult)
}
function getVerifyResultId(verifyResult) {
  return verifyResult.VR_BODY_TYPE + '_' + verifyResult.VR_BODY_ID
}
const payrollIndex = {}
const payrollList = []
function mockDefaultPayroll() {
  const defaultPayroll = Mock.mock({
    P_INST_ID: '000000',
    P_INST_PATH: '000000',
    P_CREATER: '@cname',
    P_CREATION_TIME: '@datetime'
  })
  return defaultPayroll
}
function mockPayroll() {
  const payroll = Mock.mock({
    P_FREQ: 'M',
    P_ISSUE: '2019-02',
    'P_STAFF_NUMBER|10': '@integer(0, 9)',
    P_TYPE: '01',
    P_PREDICT_PAY_DATE: '@date',
    P_ACTUAL_PAY_DATE: '@date',
    P_WAGE_TOTAL: '@float(0, 100000, 0, 2)',
    P_A8L_D4T_TOTAL: '@float(0, 100000, 0, 2)',
    P_WAGE_TAX: '@float(0, 100000, 0, 2)',
    P_PIT_TOTAL: '@float(0, 100000, 0, 2)',
    P_5I1F_P_TOTAL: '@float(0, 100000, 0, 2)',
    P_5I1F_E_TOTAL: '@float(0, 100000, 0, 2)',
    P_WAGE_ACTUAL: '@float(0, 100000, 0, 2)',
    'P_STATUS|1': ['01', '02', '03', '04', '05', '06', '07', '08', '09']
  })
  return Object.assign({}, mockDefaultPayroll(), payroll)
}
function getPayrollId(payroll) {
  return payroll.P_FREQ + '_' + payroll.P_ISSUE + '_' + payroll.P_STAFF_NUMBER + '_' + payroll.P_TYPE
}
function getPayrollResults(payroll) {
  const P_ISSUE = payroll.P_ISSUE
  const P_STAFF_NUMBER = payroll.P_STAFF_NUMBER
  const P_STAFF_NAME = payroll.P_STAFF_NAME
  let P_STATUS = payroll.P_STATUS
  if (getDataType(P_STATUS) === 'string') {
    P_STATUS = [P_STATUS]
  }
  const mockList = payrollList.filter(item => {
    if (!item) return false
    if (P_ISSUE && P_ISSUE.length && item.P_ISSUE !== P_ISSUE) return false
    if (P_STAFF_NUMBER && P_STAFF_NUMBER.length && item.P_STAFF_NUMBER !== P_STAFF_NUMBER) return false
    if (P_STAFF_NAME && P_STAFF_NAME.length && item.P_STAFF_NAME.indexOf(P_STAFF_NAME) < 0) return false
    if (P_STATUS && P_STATUS.length && !P_STATUS.includes(item.P_STATUS)) return false
    return true
  })
  return mockList
}
const flowRecordIndex = {}
const flowRecordList = []
function mockDefaultFlowRecord() {
  const defaultFlowRecord = Mock.mock({
    FR_INST_ID: '000000',
    FR_INST_PATH: '000000',
    FR_ID: '@guid',
    FR_OPERATOR: '@first',
    FR_OPERATOR_NAME: '@cname',
    FR_OPERATE_TIME: '@datetime'
  })
  return defaultFlowRecord
}
function putFlowRecord(FR_BODY_TYPE, FR_BODY_ID, FLOW_RECORD) {
  const flowRecord = { FR_BODY_TYPE, FR_BODY_ID }
  Object.assign(flowRecord, FLOW_RECORD, mockDefaultFlowRecord())
  putEntity(flowRecord.FR_ID, flowRecord, flowRecordIndex, flowRecordList)
}

for (let i = 0; i < 5; i++) {
  const enterprise = mockEnterprise()
  putEntity(enterprise.E_ID, enterprise, enterpriseIndex, enterpriseList)
}
const fiducial = mockFiducial()
putEntity(getFiducialId(fiducial), fiducial, fiducialIndex, fiducialList)
const ratio = mockRatio()
putEntity(getRatioId(ratio), ratio, ratioIndex, ratioList)
for (let i = 0; i < 50; i++) {
  const enterprise = enterpriseList[i % 5]
  const E_ID = enterprise.E_ID
  const E_NAME = enterprise.E_NAME

  const staff = mockStaff()
  staff.S_ENTERPRISE_ID = E_ID
  const S_NUMBER = staff.S_NUMBER
  const S_NAME = staff.S_NAME
  putEntity(S_NUMBER, staff, staffIndex, staffList)

  if (i % 2 === 0) {
    const salary = mockSalary()
    salary.S_STAFF_NUMBER = S_NUMBER
    salary.S_PAY_ENTERPRISE_ID = E_ID
    putEntity(getSalaryId(salary), salary, salaryIndex, salaryList)
  }

  const taxStair = mockTaxStair()
  putEntity(taxStair.TSC_ID, taxStair, taxStairIndex, taxStairList)

  const childEducate = mockChildEducate()
  childEducate.ADCE_STAFF_NUMBER = S_NUMBER
  putEntity(childEducate.ADCE_ID, childEducate, childEducateIndex, childEducateList)

  const adultEducate = mockAdultEducate()
  adultEducate.ADAE_STAFF_NUMBER = S_NUMBER
  putEntity(adultEducate.ADAE_ID, adultEducate, adultEducateIndex, adultEducateList)

  const houseLoan = mockHouseLoan()
  houseLoan.ADHL_STAFF_NUMBER = S_NUMBER
  putEntity(houseLoan.ADHL_ID, houseLoan, houseLoanIndex, houseLoanList)

  const houseRent = mockHouseRent()
  houseRent.ADHR_STAFF_NUMBER = S_NUMBER
  putEntity(houseRent.ADHR_ID, houseRent, houseRentIndex, houseRentList)

  const supportAged = mockSupportAged()
  supportAged.ADSA_STAFF_NUMBER = S_NUMBER
  putEntity(supportAged.ADSA_ID, supportAged, supportAgedIndex, supportAgedList)

  const medical = mockMedical()
  medical.ADM_STAFF_NUMBER = S_NUMBER
  putEntity(medical.ADM_ID, medical, medicalIndex, medicalList)

  const salarySnapshoot = mockSalarySnapshoot()
  salarySnapshoot.SS_STAFF_NUMBER = S_NUMBER
  salarySnapshoot.SS_STAFF_NAME = S_NAME
  salarySnapshoot.SS_PAY_ENTERPRISE_ID = E_ID
  salarySnapshoot.SS_PAY_ENTERPRISE_NAME = E_NAME
  const SS_FREQ = salarySnapshoot.SS_FREQ
  const SS_ISSUE = salarySnapshoot.SS_ISSUE
  const SS_STATUS = salarySnapshoot.SS_STATUS
  const SS_VERIFY_STATUS = salarySnapshoot.SS_VERIFY_STATUS
  putEntity(getSalarySnapshootId(salarySnapshoot), salarySnapshoot, salarySnapshootIndex, salarySnapshootList)
  if (SS_VERIFY_STATUS === '03' || SS_VERIFY_STATUS === '04') {
    const verifyResult = mockVerifyResult()
    verifyResult.VR_BODY_TYPE = '01'
    verifyResult.VR_BODY_ID = JSON.stringify({
      SS_FREQ: salarySnapshoot.SS_FREQ,
      SS_ISSUE: salarySnapshoot.SS_ISSUE,
      SS_STAFF_NUMBER: salarySnapshoot.SS_STAFF_NUMBER,
      SS_TYPE: salarySnapshoot.SS_TYPE
    })
    verifyResult.VR_STATUS = (SS_VERIFY_STATUS === '03') ? '03' : '02'
    putEntity(verifyResult.VR_ID, verifyResult, verifyResultIndex, verifyResultList)
    verifyResultIndex[getVerifyResultId(verifyResult)] = verifyResultList.length - 1
  }

  const adSnapshoot = mockADSnapshoot()
  const ADS_VERIFY_STATUS = SS_VERIFY_STATUS
  adSnapshoot.ADS_FREQ = SS_FREQ
  adSnapshoot.ADS_ISSUE = SS_ISSUE
  adSnapshoot.ADS_STAFF_NUMBER = S_NUMBER
  adSnapshoot.ADS_VERIFY_STATUS = ADS_VERIFY_STATUS
  putEntity(getADSnapshootId(adSnapshoot), adSnapshoot, adSnapshootIndex, adSnapshootList)
  if (ADS_VERIFY_STATUS === '03' || ADS_VERIFY_STATUS === '04') {
    const verifyResult = mockVerifyResult()
    verifyResult.VR_BODY_TYPE = '02'
    verifyResult.VR_BODY_ID = JSON.stringify({
      ADS_FREQ: adSnapshoot.ADS_FREQ,
      ADS_ISSUE: adSnapshoot.ADS_ISSUE,
      ADS_STAFF_NUMBER: adSnapshoot.ADS_STAFF_NUMBER
    })
    verifyResult.VR_STATUS = (ADS_VERIFY_STATUS === '03') ? '03' : '02'
    putEntity(verifyResult.VR_ID, verifyResult, verifyResultIndex, verifyResultList)
    verifyResultIndex[getVerifyResultId(verifyResult)] = verifyResultList.length - 1
  }

  if (SS_STATUS === '06') {
    const payroll = mockPayroll()
    payroll.P_STAFF_NUMBER = S_NUMBER
    payroll.P_STAFF_NAME = S_NAME
    putEntity(getPayrollId(payroll), payroll, payrollIndex, payrollList)
  }
}

const getEnterpriseList = config => {
  const { E_NAME, E_TAX_ID_NUMBER, E_TYPE, page = 1, limit = 20 } = JSON.parse(config.body)
  const mockList = enterpriseList.filter(item => {
    if (!item) return false
    if (E_NAME && E_NAME.length && item.E_NAME.indexOf(E_NAME) < 0) return false
    if (E_TAX_ID_NUMBER && E_TAX_ID_NUMBER.length && item.E_TAX_ID_NUMBER !== E_TAX_ID_NUMBER) return false
    if (E_TYPE && E_TYPE.length && item.E_TYPE !== E_TYPE) return false
    return true
  })
  return doPagination(mockList, page, limit)
}

const getEnterprise = config => {
  const { E_ID } = JSON.parse(config.body)
  return getById(E_ID, enterpriseIndex, enterpriseList)
}

const deleteEnterpriseById = config => {
  const E_IDS = JSON.parse(config.body)
  deleteById(E_IDS, enterpriseIndex, enterpriseList)
}

const saveEnterprise = config => {
  let enterprise = JSON.parse(config.body)
  let E_ID = enterprise.E_ID
  if (enterpriseIndex[E_ID] !== undefined) {
    updateEntity(E_ID, enterprise, enterpriseIndex, enterpriseList)
  } else {
    enterprise = Object.assign({}, mockDefaultEnterprise(), enterprise)
    E_ID = enterprise.E_ID
    putEntity(E_ID, enterprise, enterpriseIndex, enterpriseList)
  }
  return getById(E_ID, enterpriseIndex, enterpriseList)
}

const getStaffList = config => {
  const { S_NUMBER, S_LOGIN_ID, S_NAME, S_ID_NUMBER, S_STATUS, S_IS_STAFF, page = 1, limit = 20 } = JSON.parse(config.body)
  const mockList = staffList.filter(item => {
    if (!item) return false
    if (S_NUMBER && S_NUMBER.length && item.S_NUMBER !== S_NUMBER) return false
    if (S_LOGIN_ID && S_LOGIN_ID.length && item.S_LOGIN_ID !== S_LOGIN_ID) return false
    if (S_NAME && S_NAME.length && item.S_NUMBER.indexOf(S_NAME) < 0 && item.S_NAME.indexOf(S_NAME) < 0) return false
    if (S_ID_NUMBER && S_ID_NUMBER.length && item.S_ID_NUMBER !== S_ID_NUMBER) return false
    if (S_STATUS && S_STATUS.length && item.S_STATUS !== S_STATUS) return false
    if (S_IS_STAFF && S_IS_STAFF.length && item.S_IS_STAFF !== S_IS_STAFF) return false
    return true
  })
  return doPagination(mockList, page, limit)
}

const getStaff = config => {
  const { S_NUMBER } = JSON.parse(config.body)
  return getById(S_NUMBER, staffIndex, staffList)
}

const deleteStaffById = config => {
  const S_NUMBERS = JSON.parse(config.body)
  deleteById(S_NUMBERS, staffIndex, staffList)
  deleteById(S_NUMBERS.map(S_NUMBER => {
    return getSalaryId({ S_STAFF_NUMBER: S_NUMBER, S_TYPE: '01' })
  }), salaryIndex, salaryList)
  deleteById(S_NUMBERS.map(S_NUMBER => {
    return getSalaryId({ S_STAFF_NUMBER: S_NUMBER, S_TYPE: '02' })
  }), salaryIndex, salaryList)
}

const saveStaff = config => {
  const staff = JSON.parse(config.body)
  const S_NUMBER = staff.S_NUMBER
  if (staffIndex[S_NUMBER] !== undefined) {
    updateEntity(S_NUMBER, staff, staffIndex, staffList)
  } else {
    putEntity(S_NUMBER, Object.assign({}, mockDefaultStaff(), staff), staffIndex, staffList)
  }
  return getById(S_NUMBER, staffIndex, staffList)
}

const saveStaffLoginId = config => {
  let staff = JSON.parse(config.body)
  const S_NUMBER = staff.S_NUMBER
  staff = Object.assign({}, getById(S_NUMBER, staffIndex, staffList), staff)
  updateEntity(S_NUMBER, staff, staffIndex, staffList)
}

const getSalary = config => {
  const salary = JSON.parse(config.body)
  return getById(getSalaryId(salary), salaryIndex, salaryList)
}

const saveSalary = config => {
  const salary = JSON.parse(config.body)
  const S_ID = getSalaryId(salary)
  if (salaryIndex[S_ID] !== undefined) {
    updateEntity(S_ID, salary, salaryIndex, salaryList)
  } else {
    putEntity(S_ID, Object.assign({}, mockDefaultSalary(), salary), salaryIndex, salaryList)
  }
  return getById(S_ID, salaryIndex, salaryList)
}

const getFiducialList = config => {
  const { PFC_PAY_SITE, PFC_YEAR, page = 1, limit = 20 } = JSON.parse(config.body)
  const mockList = fiducialList.filter(item => {
    if (!item) return false
    if (PFC_PAY_SITE && PFC_PAY_SITE.length && JSON.stringify(item.PFC_PAY_SITE) !== JSON.stringify(PFC_PAY_SITE)) return false
    if (PFC_YEAR && PFC_YEAR.length && item.PFC_YEAR !== PFC_YEAR) return false
    return true
  })
  return doPagination(mockList, page, limit)
}

const getFiducial = config => {
  const fiducial = JSON.parse(config.body)
  return getById(getFiducialId(fiducial), fiducialIndex, fiducialList)
}

const deleteFiducialById = config => {
  const fiducials = JSON.parse(config.body)
  deleteById(fiducials.map(fiducial => {
    return getFiducialId(fiducial)
  }), fiducialIndex, fiducialList)
}

const saveFiducial = config => {
  const fiducial = JSON.parse(config.body)
  const PRC_ID = getFiducialId(fiducial)
  if (fiducialIndex[PRC_ID] !== undefined) {
    updateEntity(PRC_ID, fiducial, fiducialIndex, fiducialList)
  } else {
    putEntity(PRC_ID, Object.assign({}, mockDefaultFiducial(), fiducial), fiducialIndex, fiducialList)
  }
  return getById(PRC_ID, fiducialIndex, fiducialList)
}

const getRatioList = config => {
  const { PRC_PAY_SITE, page = 1, limit = 20 } = JSON.parse(config.body)
  const mockList = ratioList.filter(item => {
    if (!item) return false
    if (PRC_PAY_SITE && PRC_PAY_SITE.length && JSON.stringify(item.PRC_PAY_SITE) !== JSON.stringify(PRC_PAY_SITE)) return false
    return true
  })
  return doPagination(mockList, page, limit)
}

const getRatio = config => {
  const ratio = JSON.parse(config.body)
  return getById(getRatioId(ratio), ratioIndex, ratioList)
}

const deleteRatioById = config => {
  const ratios = JSON.parse(config.body)
  deleteById(ratios.map(ratio => {
    return getRatioId(ratio)
  }), ratioIndex, ratioList)
}

const saveRatio = config => {
  const ratio = JSON.parse(config.body)
  const PRC_ID = getRatioId(ratio)
  if (ratioIndex[PRC_ID] !== undefined) {
    updateEntity(PRC_ID, ratio, ratioIndex, ratioList)
  } else {
    putEntity(PRC_ID, Object.assign({}, mockDefaultRatio(), ratio), ratioIndex, ratioList)
  }
  return getById(PRC_ID, ratioIndex, ratioList)
}

const getTaxStairList = config => {
  const { TSC_IS_RESIDENT, TSC_INCOME_TYPE, page = 1, limit = 20 } = JSON.parse(config.body)
  const mockList = taxStairList.filter(item => {
    if (!item) return false
    if (TSC_IS_RESIDENT && TSC_IS_RESIDENT.length && item.TSC_IS_RESIDENT !== TSC_IS_RESIDENT) return false
    if (TSC_INCOME_TYPE && TSC_INCOME_TYPE.length && item.TSC_INCOME_TYPE !== TSC_INCOME_TYPE) return false
    return true
  })
  return doPagination(mockList, page, limit)
}

const getTaxStair = config => {
  const { TSC_ID } = JSON.parse(config.body)
  return getById(TSC_ID, taxStairIndex, taxStairList)
}

const deleteTaxStairById = config => {
  const TSC_IDS = JSON.parse(config.body)
  deleteById(TSC_IDS, taxStairIndex, taxStairList)
}

const saveTaxStair = config => {
  let taxStair = JSON.parse(config.body)
  let TSC_ID = taxStair.TSC_ID
  if (taxStairIndex[TSC_ID] !== undefined) {
    updateEntity(TSC_ID, taxStair, taxStairIndex, taxStairList)
  } else {
    taxStair = Object.assign({}, mockDefaultTaxStair(), taxStair)
    TSC_ID = taxStair.TSC_ID
    putEntity(TSC_ID, taxStair, taxStairIndex, taxStairList)
  }
  return getById(TSC_ID, taxStairIndex, taxStairList)
}

const getChildEducateList = config => {
  const { ADCE_STAFF_NUMBER, page = 1, limit = 20 } = JSON.parse(config.body)
  const mockList = childEducateList.filter(item => {
    if (!item) return false
    if (ADCE_STAFF_NUMBER && ADCE_STAFF_NUMBER.length && item.ADCE_STAFF_NUMBER !== ADCE_STAFF_NUMBER) return false
    return true
  })
  return doPagination(mockList, page, limit)
}

const getChildEducate = config => {
  const { ADCE_ID } = JSON.parse(config.body)
  return getById(ADCE_ID, childEducateIndex, childEducateList)
}

const deleteChildEducateById = config => {
  const ADCE_IDS = JSON.parse(config.body)
  deleteById(ADCE_IDS, childEducateIndex, childEducateList)
}

const saveChildEducate = config => {
  let childEducate = JSON.parse(config.body)
  let ADCE_ID = childEducate.ADCE_ID
  if (childEducateIndex[ADCE_ID] !== undefined) {
    updateEntity(ADCE_ID, childEducate, childEducateIndex, childEducateList)
  } else {
    childEducate = Object.assign({ ADCE_STAFF_NUMBER: '0000000001' }, mockDefaultChildEducate(), childEducate)
    ADCE_ID = childEducate.ADCE_ID
    putEntity(ADCE_ID, childEducate, childEducateIndex, childEducateList)
  }
  return getById(ADCE_ID, childEducateIndex, childEducateList)
}

const getAdultEducateList = config => {
  const { ADAE_STAFF_NUMBER, page = 1, limit = 20 } = JSON.parse(config.body)
  const mockList = adultEducateList.filter(item => {
    if (!item) return false
    if (ADAE_STAFF_NUMBER && ADAE_STAFF_NUMBER.length && item.ADAE_STAFF_NUMBER !== ADAE_STAFF_NUMBER) return false
    return true
  })
  return doPagination(mockList, page, limit)
}

const getAdultEducate = config => {
  const { ADAE_ID } = JSON.parse(config.body)
  return getById(ADAE_ID, adultEducateIndex, adultEducateList)
}

const deleteAdultEducateById = config => {
  const ADAE_IDS = JSON.parse(config.body)
  deleteById(ADAE_IDS, adultEducateIndex, adultEducateList)
}

const saveAdultEducate = config => {
  let adultEducate = JSON.parse(config.body)
  let ADAE_ID = adultEducate.ADAE_ID
  if (adultEducateIndex[ADAE_ID] !== undefined) {
    updateEntity(ADAE_ID, adultEducate, adultEducateIndex, adultEducateList)
  } else {
    adultEducate = Object.assign({ ADAE_STAFF_NUMBER: '0000000001' }, mockDefaultAdultEducate(), adultEducate)
    ADAE_ID = adultEducate.ADAE_ID
    putEntity(ADAE_ID, adultEducate, adultEducateIndex, adultEducateList)
  }
  return getById(ADAE_ID, adultEducateIndex, adultEducateList)
}

const getHouseLoanList = config => {
  const { ADHL_STAFF_NUMBER, page = 1, limit = 20 } = JSON.parse(config.body)
  const mockList = houseLoanList.filter(item => {
    if (!item) return false
    if (ADHL_STAFF_NUMBER && ADHL_STAFF_NUMBER.length && item.ADHL_STAFF_NUMBER !== ADHL_STAFF_NUMBER) return false
    return true
  })
  return doPagination(mockList, page, limit)
}

const getHouseLoan = config => {
  const { ADHL_ID } = JSON.parse(config.body)
  return getById(ADHL_ID, houseLoanIndex, houseLoanList)
}

const deleteHouseLoanById = config => {
  const ADHL_IDS = JSON.parse(config.body)
  deleteById(ADHL_IDS, houseLoanIndex, houseLoanList)
}

const saveHouseLoan = config => {
  let houseLoan = JSON.parse(config.body)
  let ADHL_ID = houseLoan.ADHL_ID
  if (houseLoanIndex[ADHL_ID] !== undefined) {
    updateEntity(ADHL_ID, houseLoan, houseLoanIndex, houseLoanList)
  } else {
    houseLoan = Object.assign({ ADHL_STAFF_NUMBER: '0000000001' }, mockDefaultHouseLoan(), houseLoan)
    ADHL_ID = houseLoan.ADHL_ID
    putEntity(ADHL_ID, houseLoan, houseLoanIndex, houseLoanList)
  }
  return getById(ADHL_ID, houseLoanIndex, houseLoanList)
}

const getHouseRentList = config => {
  const { ADHR_STAFF_NUMBER, page = 1, limit = 20 } = JSON.parse(config.body)
  const mockList = houseRentList.filter(item => {
    if (!item) return false
    if (ADHR_STAFF_NUMBER && ADHR_STAFF_NUMBER.length && item.ADHR_STAFF_NUMBER !== ADHR_STAFF_NUMBER) return false
    return true
  })
  return doPagination(mockList, page, limit)
}

const getHouseRent = config => {
  const { ADHR_ID } = JSON.parse(config.body)
  return getById(ADHR_ID, houseRentIndex, houseRentList)
}

const deleteHouseRentById = config => {
  const ADHR_IDS = JSON.parse(config.body)
  deleteById(ADHR_IDS, houseRentIndex, houseRentList)
}

const saveHouseRent = config => {
  let houseRent = JSON.parse(config.body)
  let ADHR_ID = houseRent.ADHR_ID
  if (houseRentIndex[ADHR_ID] !== undefined) {
    updateEntity(ADHR_ID, houseRent, houseRentIndex, houseRentList)
  } else {
    houseRent = Object.assign({ ADHR_STAFF_NUMBER: '0000000001' }, mockDefaultHouseRent(), houseRent)
    ADHR_ID = houseRent.ADHR_ID
    putEntity(ADHR_ID, houseRent, houseRentIndex, houseRentList)
  }
  return getById(ADHR_ID, houseRentIndex, houseRentList)
}

const getSupportAgedList = config => {
  const { ADSA_STAFF_NUMBER, page = 1, limit = 20 } = JSON.parse(config.body)
  const mockList = supportAgedList.filter(item => {
    if (!item) return false
    if (ADSA_STAFF_NUMBER && ADSA_STAFF_NUMBER.length && item.ADSA_STAFF_NUMBER !== ADSA_STAFF_NUMBER) return false
    return true
  })
  return doPagination(mockList, page, limit)
}

const getSupportAged = config => {
  const { ADSA_ID } = JSON.parse(config.body)
  return getById(ADSA_ID, supportAgedIndex, supportAgedList)
}

const deleteSupportAgedById = config => {
  const ADSA_IDS = JSON.parse(config.body)
  deleteById(ADSA_IDS, supportAgedIndex, supportAgedList)
}

const saveSupportAged = config => {
  let supportAged = JSON.parse(config.body)
  let ADSA_ID = supportAged.ADSA_ID
  if (supportAgedIndex[ADSA_ID] !== undefined) {
    updateEntity(ADSA_ID, supportAged, supportAgedIndex, supportAgedList)
  } else {
    supportAged = Object.assign({ ADSA_STAFF_NUMBER: '0000000001' }, mockDefaultSupportAged(), supportAged)
    ADSA_ID = supportAged.ADSA_ID
    putEntity(ADSA_ID, supportAged, supportAgedIndex, supportAgedList)
  }
  return getById(ADSA_ID, supportAgedIndex, supportAgedList)
}

const getMedicalList = config => {
  const { ADM_STAFF_NUMBER, page = 1, limit = 20 } = JSON.parse(config.body)
  const mockList = medicalList.filter(item => {
    if (!item) return false
    if (ADM_STAFF_NUMBER && ADM_STAFF_NUMBER.length && item.ADM_STAFF_NUMBER !== ADM_STAFF_NUMBER) return false
    return true
  })
  return doPagination(mockList, page, limit)
}

const getMedical = config => {
  const { ADM_ID } = JSON.parse(config.body)
  return getById(ADM_ID, medicalIndex, medicalList)
}

const deleteMedicalById = config => {
  const ADM_IDS = JSON.parse(config.body)
  deleteById(ADM_IDS, medicalIndex, medicalList)
}

const saveMedical = config => {
  let medical = JSON.parse(config.body)
  let ADM_ID = medical.ADM_ID
  if (medicalIndex[ADM_ID] !== undefined) {
    updateEntity(ADM_ID, medical, medicalIndex, medicalList)
  } else {
    medical = Object.assign({ ADM_STAFF_NUMBER: '0000000001' }, mockDefaultMedical(), medical)
    ADM_ID = medical.ADM_ID
    putEntity(ADM_ID, medical, medicalIndex, medicalList)
  }
  return getById(ADM_ID, medicalIndex, medicalList)
}

const getSalarySnapshootList = config => {
  const salarySnapshoot = JSON.parse(config.body)
  const page = salarySnapshoot.page || 1
  const limit = salarySnapshoot.limit || 20
  return doPagination(getSalarySnapshootResults(salarySnapshoot), page, limit)
}

const getSalarySnapshoot = config => {
  const salarySnapshoot = JSON.parse(config.body)
  return getById(getSalarySnapshootId(salarySnapshoot), salarySnapshootIndex, salarySnapshootList)
}

const deleteSalarySnapshootById = config => {
  const salarySnapshoots = JSON.parse(config.body)
  deleteById(salarySnapshoots.map(salarySnapshoot => {
    return getSalarySnapshootId(salarySnapshoot)
  }), salarySnapshootIndex, salarySnapshootList)
}

const saveSalarySnapshoot = config => {
  const salarySnapshoot = JSON.parse(config.body)
  const SS_ID = getSalarySnapshootId(salarySnapshoot)
  if (salarySnapshootIndex[SS_ID] !== undefined) {
    updateEntity(SS_ID, salarySnapshoot, salarySnapshootIndex, salarySnapshootList)
  } else {
    putEntity(SS_ID, Object.assign({}, mockDefaultSalarySnapshoot(), salarySnapshoot), salarySnapshootIndex, salarySnapshootList)
  }
  return getById(SS_ID, salarySnapshootIndex, salarySnapshootList)
}

const updateSalarySnapshootById = config => {
  const salarySnapshoots = JSON.parse(config.body)
  salarySnapshoots.forEach(salarySnapshoot => {
    const SS_FREQ = salarySnapshoot.SS_FREQ
    const SS_ISSUE = salarySnapshoot.SS_ISSUE
    const SS_STAFF_NUMBER = salarySnapshoot.SS_STAFF_NUMBER
    const SS_TYPE = salarySnapshoot.SS_TYPE
    updateEntity(getSalarySnapshootId(salarySnapshoot), salarySnapshoot, salarySnapshootIndex, salarySnapshootList)
    putFlowRecord('01', JSON.stringify({ SS_FREQ, SS_ISSUE, SS_STAFF_NUMBER, SS_TYPE }), salarySnapshoot.FLOW_RECORD)
  })
}

const updateSalarySnapshootByQuery = config => {
  const body = JSON.parse(config.body)
  const query = body.query
  const target = body.target
  let count = 0
  getSalarySnapshootResults(query).forEach(salarySnapshoot => {
    const SS_VERIFY_STATUS = salarySnapshoot.SS_VERIFY_STATUS
    if (SS_VERIFY_STATUS === '02' || SS_VERIFY_STATUS === '03') {
      const SS_FREQ = salarySnapshoot.SS_FREQ
      const SS_ISSUE = salarySnapshoot.SS_ISSUE
      const SS_STAFF_NUMBER = salarySnapshoot.SS_STAFF_NUMBER
      const SS_TYPE = salarySnapshoot.SS_TYPE
      updateEntity(getSalarySnapshootId(salarySnapshoot), target, salarySnapshootIndex, salarySnapshootList)
      putFlowRecord('01', JSON.stringify({ SS_FREQ, SS_ISSUE, SS_STAFF_NUMBER, SS_TYPE }), target.FLOW_RECORD)
    } else {
      count++
    }
  })
  return count
}

const importSalarySnapshoot = config => {
  request({
    baseURL: '',
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    url: '/kit/file/base64/upload.ajax',
    method: 'post',
    data: config.body
  })
}

const getADSnapshootList = config => {
  const { ADS_TYPE, ADS_FREQ, ADS_ISSUE, ADS_STAFF_NUMBER, ADS_VERIFY_STATUS, page = 1, limit = 20 } = JSON.parse(config.body)
  const mockList = adSnapshootList.filter(item => {
    if (!item) return false
    if (ADS_TYPE && ADS_TYPE.length && item.ADS_TYPE !== ADS_TYPE) return false
    if (ADS_FREQ && ADS_FREQ.length && item.ADS_FREQ !== ADS_FREQ) return false
    if (ADS_ISSUE && ADS_ISSUE.length && item.ADS_ISSUE !== ADS_ISSUE) return false
    if (ADS_STAFF_NUMBER && ADS_STAFF_NUMBER.length && item.ADS_STAFF_NUMBER !== ADS_STAFF_NUMBER) return false
    if (ADS_VERIFY_STATUS && ADS_VERIFY_STATUS.length && item.ADS_VERIFY_STATUS !== ADS_VERIFY_STATUS) return false
    if (item.ADS_VERIFY_STATUS === '03' || item.ADS_VERIFY_STATUS === '04') {
      let verifyResult = {}
      verifyResult.VR_BODY_TYPE = '02'
      verifyResult.VR_BODY_ID = JSON.stringify({ ADS_FREQ, ADS_ISSUE, ADS_STAFF_NUMBER })
      verifyResult = getById(getVerifyResultId(verifyResult), verifyResultIndex, verifyResultList)
      if (verifyResult) {
        item.ADS_RESULT = verifyResult.VR_RESULT
        item.ADS_DISPOSE_DESCR = verifyResult.VR_DISPOSE_DESCR
      }
    }
    return true
  })
  return doPagination(mockList, page, limit)
}

const updateADSnapshootById = config => {
  const adSnapshoots = JSON.parse(config.body)
  adSnapshoots.forEach(adSnapshoot => {
    updateEntity(getADSnapshootId(adSnapshoot), adSnapshoot, adSnapshootIndex, adSnapshootList)
    const { ADS_FREQ, ADS_ISSUE, ADS_STAFF_NUMBER, ADS_DISPOSE_DESCR } = adSnapshoot
    const verifyResult = {
      VR_BODY_TYPE: '02',
      VR_BODY_ID: JSON.stringify({ ADS_FREQ, ADS_ISSUE, ADS_STAFF_NUMBER }),
      VR_STATUS: '03',
      VR_DISPOSE_DESCR: ADS_DISPOSE_DESCR
    }
    updateEntity(getVerifyResultId(verifyResult), verifyResult, verifyResultIndex, verifyResultList)
  })
}

const getVerifyResultList = config => {
  const { VR_BODY_TYPE, VR_BODY_ID, VR_STATUS, page = 1, limit = 20 } = JSON.parse(config.body)
  const mockList = verifyResultList.filter(item => {
    if (!item) return false
    if (VR_BODY_TYPE && VR_BODY_TYPE.length && item.VR_BODY_TYPE !== VR_BODY_TYPE) return false
    if (VR_BODY_ID && VR_BODY_ID.length && item.VR_BODY_ID !== VR_BODY_ID) return false
    if (VR_STATUS && VR_STATUS.length && item.VR_STATUS !== VR_STATUS) return false
    return true
  })
  return doPagination(mockList, page, limit)
}

const updateVerifyResultById = config => {
  const verifyResults = JSON.parse(config.body)
  verifyResults.forEach(verifyResult => {
    updateEntity(verifyResult.VR_ID, verifyResult, verifyResultIndex, verifyResultList)
  })
}

const verifyById = config => {
  const salarySnapshoots = JSON.parse(config.body)
  salarySnapshoots.forEach((salarySnapshoot, i) => {
    if (i % 2 === 0) {
      salarySnapshoot.SS_VERIFY_STATUS = '02'
    } else {
      salarySnapshoot.SS_VERIFY_STATUS = '04'
    }
    updateEntity(getSalarySnapshootId(salarySnapshoot), salarySnapshoot, salarySnapshootIndex, salarySnapshootList)
  })
}

const verifyByQuery = config => {
  const query = JSON.parse(config.body)
  let count = 0
  getSalarySnapshootResults(query).forEach((salarySnapshoot, i) => {
    const SS_VERIFY_STATUS = salarySnapshoot.SS_VERIFY_STATUS
    if (SS_VERIFY_STATUS === '01') {
      if (i % 2 === 0) {
        salarySnapshoot.SS_VERIFY_STATUS = '02'
      } else {
        salarySnapshoot.SS_VERIFY_STATUS = '04'
      }
      updateEntity(getSalarySnapshootId(salarySnapshoot), salarySnapshoot, salarySnapshootIndex, salarySnapshootList)
    } else {
      count++
    }
  })
  return count
}

const getPayrollList = config => {
  const payroll = JSON.parse(config.body)
  const page = payroll.page || 1
  const limit = payroll.limit || 20
  return doPagination(getPayrollResults(payroll), page, limit)
}

const getPayroll = config => {
  const payroll = JSON.parse(config.body)
  return getById(getPayrollId(payroll), payrollIndex, payrollList)
}

const updatePayrollById = config => {
  const payrolls = JSON.parse(config.body)
  payrolls.forEach(payroll => {
    const P_FREQ = payroll.P_FREQ
    const P_ISSUE = payroll.P_ISSUE
    const P_STAFF_NUMBER = payroll.P_STAFF_NUMBER
    const P_TYPE = payroll.P_TYPE
    updateEntity(getPayrollId(payroll), payroll, payrollIndex, payrollList)
    putFlowRecord('02', JSON.stringify({ P_FREQ, P_ISSUE, P_STAFF_NUMBER, P_TYPE }), payroll.FLOW_RECORD)
  })
}

const updatePayrollByQuery = config => {
  const body = JSON.parse(config.body)
  const query = body.query
  const target = body.target
  getPayrollResults(query).forEach(payroll => {
    const P_FREQ = payroll.P_FREQ
    const P_ISSUE = payroll.P_ISSUE
    const P_STAFF_NUMBER = payroll.P_STAFF_NUMBER
    const P_TYPE = payroll.P_TYPE
    updateEntity(getPayrollId(payroll), target, payrollIndex, payrollList)
    putFlowRecord('02', JSON.stringify({ P_FREQ, P_ISSUE, P_STAFF_NUMBER, P_TYPE }), target.FLOW_RECORD)
  })
  return 0
}

const getFlowRecordList = config => {
  const { FR_BODY_TYPE, FR_BODY_ID, page = 1, limit = 20 } = JSON.parse(config.body)
  const mockList = flowRecordList.filter(item => {
    if (!item) return false
    if (FR_BODY_TYPE && FR_BODY_TYPE.length && item.FR_BODY_TYPE !== FR_BODY_TYPE) return false
    if (FR_BODY_ID && FR_BODY_ID.length && item.FR_BODY_ID !== FR_BODY_ID) return false
    return true
  })
  return doPagination(mockList, page, limit)
}

Mock.mock(/\/pit\/basic-data\/enterprise\/list/, 'post', getEnterpriseList)
Mock.mock(/\/pit\/basic-data\/enterprise\/single/, 'post', getEnterprise)
Mock.mock(/\/pit\/basic-data\/enterprise\/delete/, 'post', deleteEnterpriseById)
Mock.mock(/\/pit\/basic-data\/enterprise\/save/, 'post', saveEnterprise)
Mock.mock(/\/pit\/basic-data\/staff\/list/, 'post', getStaffList)
Mock.mock(/\/pit\/basic-data\/staff\/single/, 'post', getStaff)
Mock.mock(/\/pit\/basic-data\/staff\/delete/, 'post', deleteStaffById)
Mock.mock(/\/pit\/basic-data\/staff\/save/, 'post', saveStaff)
Mock.mock(/\/pit\/basic-data\/staff\/login-id\/save/, 'post', saveStaffLoginId)
Mock.mock(/\/pit\/basic-data\/salary\/single/, 'post', getSalary)
Mock.mock(/\/pit\/basic-data\/salary\/save/, 'post', saveSalary)
Mock.mock(/\/pit\/basic-data\/pay-fiducial\/list/, 'post', getFiducialList)
Mock.mock(/\/pit\/basic-data\/pay-fiducial\/single/, 'post', getFiducial)
Mock.mock(/\/pit\/basic-data\/pay-fiducial\/delete/, 'post', deleteFiducialById)
Mock.mock(/\/pit\/basic-data\/pay-fiducial\/save/, 'post', saveFiducial)
Mock.mock(/\/pit\/basic-data\/pay-ratio\/list/, 'post', getRatioList)
Mock.mock(/\/pit\/basic-data\/pay-ratio\/single/, 'post', getRatio)
Mock.mock(/\/pit\/basic-data\/pay-ratio\/delete/, 'post', deleteRatioById)
Mock.mock(/\/pit\/basic-data\/pay-ratio\/save/, 'post', saveRatio)
Mock.mock(/\/pit\/basic-data\/tax-stair\/list/, 'post', getTaxStairList)
Mock.mock(/\/pit\/basic-data\/tax-stair\/single/, 'post', getTaxStair)
Mock.mock(/\/pit\/basic-data\/tax-stair\/delete/, 'post', deleteTaxStairById)
Mock.mock(/\/pit\/basic-data\/tax-stair\/save/, 'post', saveTaxStair)
Mock.mock(/\/pit\/additional-deduct\/child-educate\/list/, 'post', getChildEducateList)
Mock.mock(/\/pit\/additional-deduct\/child-educate\/single/, 'post', getChildEducate)
Mock.mock(/\/pit\/additional-deduct\/child-educate\/delete/, 'post', deleteChildEducateById)
Mock.mock(/\/pit\/additional-deduct\/child-educate\/save/, 'post', saveChildEducate)
Mock.mock(/\/pit\/additional-deduct\/adult-educate\/list/, 'post', getAdultEducateList)
Mock.mock(/\/pit\/additional-deduct\/adult-educate\/single/, 'post', getAdultEducate)
Mock.mock(/\/pit\/additional-deduct\/adult-educate\/delete/, 'post', deleteAdultEducateById)
Mock.mock(/\/pit\/additional-deduct\/adult-educate\/save/, 'post', saveAdultEducate)
Mock.mock(/\/pit\/additional-deduct\/house-loan\/list/, 'post', getHouseLoanList)
Mock.mock(/\/pit\/additional-deduct\/house-loan\/single/, 'post', getHouseLoan)
Mock.mock(/\/pit\/additional-deduct\/house-loan\/delete/, 'post', deleteHouseLoanById)
Mock.mock(/\/pit\/additional-deduct\/house-loan\/save/, 'post', saveHouseLoan)
Mock.mock(/\/pit\/additional-deduct\/house-rent\/list/, 'post', getHouseRentList)
Mock.mock(/\/pit\/additional-deduct\/house-rent\/single/, 'post', getHouseRent)
Mock.mock(/\/pit\/additional-deduct\/house-rent\/delete/, 'post', deleteHouseRentById)
Mock.mock(/\/pit\/additional-deduct\/house-rent\/save/, 'post', saveHouseRent)
Mock.mock(/\/pit\/additional-deduct\/support-aged\/list/, 'post', getSupportAgedList)
Mock.mock(/\/pit\/additional-deduct\/support-aged\/single/, 'post', getSupportAged)
Mock.mock(/\/pit\/additional-deduct\/support-aged\/delete/, 'post', deleteSupportAgedById)
Mock.mock(/\/pit\/additional-deduct\/support-aged\/save/, 'post', saveSupportAged)
Mock.mock(/\/pit\/additional-deduct\/medical\/list/, 'post', getMedicalList)
Mock.mock(/\/pit\/additional-deduct\/medical\/single/, 'post', getMedical)
Mock.mock(/\/pit\/additional-deduct\/medical\/delete/, 'post', deleteMedicalById)
Mock.mock(/\/pit\/additional-deduct\/medical\/save/, 'post', saveMedical)
Mock.mock(/\/pit\/calc\/salary-snapshoot\/list/, 'post', getSalarySnapshootList)
Mock.mock(/\/pit\/calc\/salary-snapshoot\/single/, 'post', getSalarySnapshoot)
Mock.mock(/\/pit\/calc\/salary-snapshoot\/delete/, 'post', deleteSalarySnapshootById)
Mock.mock(/\/pit\/calc\/salary-snapshoot\/save/, 'post', saveSalarySnapshoot)
Mock.mock(/\/pit\/calc\/salary-snapshoot\/update-id/, 'post', updateSalarySnapshootById)
Mock.mock(/\/pit\/calc\/salary-snapshoot\/update-query/, 'post', updateSalarySnapshootByQuery)
Mock.mock(/\/pit\/calc\/salary-snapshoot\/import/, 'post', importSalarySnapshoot)
Mock.mock(/\/pit\/calc\/ad-snapshoot\/list/, 'post', getADSnapshootList)
Mock.mock(/\/pit\/calc\/ad-snapshoot\/update-id/, 'post', updateADSnapshootById)
Mock.mock(/\/pit\/calc\/verify\/result\/list/, 'post', getVerifyResultList)
Mock.mock(/\/pit\/calc\/verify\/result\/update-id/, 'post', updateVerifyResultById)
Mock.mock(/\/pit\/calc\/verify\/verify-id/, 'post', verifyById)
Mock.mock(/\/pit\/calc\/verify\/verify-query/, 'post', verifyByQuery)
Mock.mock(/\/pit\/calc\/payroll\/list/, 'post', getPayrollList)
Mock.mock(/\/pit\/calc\/payroll\/single/, 'post', getPayroll)
Mock.mock(/\/pit\/calc\/payroll\/update-id/, 'post', updatePayrollById)
Mock.mock(/\/pit\/calc\/payroll\/update-query/, 'post', updatePayrollByQuery)
Mock.mock(/\/pit\/calc\/flow-record\/list/, 'post', getFlowRecordList)
