import request from '@/utils/request'

export function enterpriseList(query) {
  return request({
    url: '/pit/basic-data/enterprise/list',
    method: 'post',
    data: query
  })
}

export function enterpriseSingle(query) {
  return request({
    url: '/pit/basic-data/enterprise/single',
    method: 'post',
    data: query
  })
}

export function enterpriseDelete(query) {
  return request({
    url: '/pit/basic-data/enterprise/delete',
    method: 'post',
    data: query
  })
}

export function enterpriseSave(enterprise) {
  return request({
    url: '/pit/basic-data/enterprise/save',
    method: 'post',
    data: enterprise
  })
}

export function staffList(query) {
  return request({
    url: '/pit/basic-data/staff/list',
    method: 'post',
    data: query
  })
}

export function staffSingle(query) {
  return request({
    url: '/pit/basic-data/staff/single',
    method: 'post',
    data: query
  })
}

export function staffDelete(query) {
  return request({
    url: '/pit/basic-data/staff/delete',
    method: 'post',
    data: query
  })
}

export function staffSave(staff) {
  return request({
    url: '/pit/basic-data/staff/save',
    method: 'post',
    data: staff
  })
}

export function loginIdSave(staff) {
  return request({
    url: '/pit/basic-data/staff/login-id/save',
    method: 'post',
    data: staff
  })
}

export function salarySingle(query) {
  return request({
    url: '/pit/basic-data/salary/single',
    method: 'post',
    data: query
  })
}

export function salarySave(salary) {
  return request({
    url: '/pit/basic-data/salary/save',
    method: 'post',
    data: salary
  })
}

export function payFiducialList(query) {
  return request({
    url: '/pit/basic-data/pay-fiducial/list',
    method: 'post',
    data: query
  })
}

export function payFiducialSingle(query) {
  return request({
    url: '/pit/basic-data/pay-fiducial/single',
    method: 'post',
    data: query
  })
}

export function payFiducialDelete(query) {
  return request({
    url: '/pit/basic-data/pay-fiducial/delete',
    method: 'post',
    data: query
  })
}

export function payFiducialSave(payFiducial) {
  return request({
    url: '/pit/basic-data/pay-fiducial/save',
    method: 'post',
    data: payFiducial
  })
}

export function payRatioList(query) {
  return request({
    url: '/pit/basic-data/pay-ratio/list',
    method: 'post',
    data: query
  })
}

export function payRatioSingle(query) {
  return request({
    url: '/pit/basic-data/pay-ratio/single',
    method: 'post',
    data: query
  })
}

export function payRatioDelete(query) {
  return request({
    url: '/pit/basic-data/pay-ratio/delete',
    method: 'post',
    data: query
  })
}

export function payRatioSave(payRatio) {
  return request({
    url: '/pit/basic-data/pay-ratio/save',
    method: 'post',
    data: payRatio
  })
}

export function taxStairList(query) {
  return request({
    url: '/pit/basic-data/tax-stair/list',
    method: 'post',
    data: query
  })
}

export function taxStairSingle(query) {
  return request({
    url: '/pit/basic-data/tax-stair/single',
    method: 'post',
    data: query
  })
}

export function taxStairDelete(query) {
  return request({
    url: '/pit/basic-data/tax-stair/delete',
    method: 'post',
    data: query
  })
}

export function taxStairSave(taxStair) {
  return request({
    url: '/pit/basic-data/tax-stair/save',
    method: 'post',
    data: taxStair
  })
}

export function childEducateList(query) {
  return request({
    url: '/pit/additional-deduct/child-educate/list',
    method: 'post',
    data: query
  })
}

export function childEducateSingle(query) {
  return request({
    url: '/pit/additional-deduct/child-educate/single',
    method: 'post',
    data: query
  })
}

export function childEducateDelete(query) {
  return request({
    url: '/pit/additional-deduct/child-educate/delete',
    method: 'post',
    data: query
  })
}

export function childEducateSave(childEducate) {
  return request({
    url: '/pit/additional-deduct/child-educate/save',
    method: 'post',
    data: childEducate
  })
}

export function adultEducateList(query) {
  return request({
    url: '/pit/additional-deduct/adult-educate/list',
    method: 'post',
    data: query
  })
}

export function adultEducateSingle(query) {
  return request({
    url: '/pit/additional-deduct/adult-educate/single',
    method: 'post',
    data: query
  })
}

export function adultEducateDelete(query) {
  return request({
    url: '/pit/additional-deduct/adult-educate/delete',
    method: 'post',
    data: query
  })
}

export function adultEducateSave(adultEducate) {
  return request({
    url: '/pit/additional-deduct/adult-educate/save',
    method: 'post',
    data: adultEducate
  })
}

export function houseLoanList(query) {
  return request({
    url: '/pit/additional-deduct/house-loan/list',
    method: 'post',
    data: query
  })
}

export function houseLoanSingle(query) {
  return request({
    url: '/pit/additional-deduct/house-loan/single',
    method: 'post',
    data: query
  })
}

export function houseLoanDelete(query) {
  return request({
    url: '/pit/additional-deduct/house-loan/delete',
    method: 'post',
    data: query
  })
}

export function houseLoanSave(houseLoan) {
  return request({
    url: '/pit/additional-deduct/house-loan/save',
    method: 'post',
    data: houseLoan
  })
}

export function houseRentList(query) {
  return request({
    url: '/pit/additional-deduct/house-rent/list',
    method: 'post',
    data: query
  })
}

export function houseRentSingle(query) {
  return request({
    url: '/pit/additional-deduct/house-rent/single',
    method: 'post',
    data: query
  })
}

export function houseRentDelete(query) {
  return request({
    url: '/pit/additional-deduct/house-rent/delete',
    method: 'post',
    data: query
  })
}

export function houseRentSave(houseRent) {
  return request({
    url: '/pit/additional-deduct/house-rent/save',
    method: 'post',
    data: houseRent
  })
}

export function supportAgedList(query) {
  return request({
    url: '/pit/additional-deduct/support-aged/list',
    method: 'post',
    data: query
  })
}

export function supportAgedSingle(query) {
  return request({
    url: '/pit/additional-deduct/support-aged/single',
    method: 'post',
    data: query
  })
}

export function supportAgedDelete(query) {
  return request({
    url: '/pit/additional-deduct/support-aged/delete',
    method: 'post',
    data: query
  })
}

export function supportAgedSave(supportAged) {
  return request({
    url: '/pit/additional-deduct/support-aged/save',
    method: 'post',
    data: supportAged
  })
}

export function medicalList(query) {
  return request({
    url: '/pit/additional-deduct/medical/list',
    method: 'post',
    data: query
  })
}

export function medicalSingle(query) {
  return request({
    url: '/pit/additional-deduct/medical/single',
    method: 'post',
    data: query
  })
}

export function medicalDelete(query) {
  return request({
    url: '/pit/additional-deduct/medical/delete',
    method: 'post',
    data: query
  })
}

export function medicalSave(medical) {
  return request({
    url: '/pit/additional-deduct/medical/save',
    method: 'post',
    data: medical
  })
}

export function salarySnapshootList(query) {
  return request({
    url: '/pit/calc/salary-snapshoot/list',
    method: 'post',
    data: query
  })
}

export function salarySnapshootSingle(query) {
  return request({
    url: '/pit/calc/salary-snapshoot/single',
    method: 'post',
    data: query
  })
}

export function salarySnapshootDelete(query) {
  return request({
    url: '/pit/calc/salary-snapshoot/delete',
    method: 'post',
    data: query
  })
}

export function salarySnapshootSave(salarySnapshoot) {
  return request({
    url: '/pit/calc/salary-snapshoot/save',
    method: 'post',
    data: salarySnapshoot
  })
}

export function salarySnapshootUpdateById(query) {
  return request({
    url: '/pit/calc/salary-snapshoot/update-id',
    method: 'post',
    data: query
  })
}

export function salarySnapshootUpdateByQuery(query, target) {
  return request({
    url: '/pit/calc/salary-snapshoot/update-query',
    method: 'post',
    data: {
      query,
      target
    }
  })
}

export function salarySnapshootImport(query) {
  return request({
    url: '/pit/calc/salary-snapshoot/import',
    method: 'post',
    data: query
  })
}

export function adSnapshootList(query) {
  return request({
    url: '/pit/calc/ad-snapshoot/list',
    method: 'post',
    data: query
  })
}

export function adSnapshootUpdateById(query) {
  return request({
    url: '/pit/calc/ad-snapshoot/update-id',
    method: 'post',
    data: query
  })
}

export function verifyResultList(query) {
  return request({
    url: '/pit/calc/verify/result/list',
    method: 'post',
    data: query
  })
}

export function verifyResultUpdateById(query) {
  return request({
    url: '/pit/calc/verify/result/update-id',
    method: 'post',
    data: query
  })
}

export function verifyUpdateById(query) {
  return request({
    url: '/pit/calc/verify/verify-id',
    method: 'post',
    data: query
  })
}

export function verifyUpdateByQuery(query) {
  return request({
    url: '/pit/calc/verify/verify-query',
    method: 'post',
    data: query
  })
}

export function payrollList(query) {
  return request({
    url: '/pit/calc/payroll/list',
    method: 'post',
    data: query
  })
}

export function payrollSingle(query) {
  return request({
    url: '/pit/calc/payroll/single',
    method: 'post',
    data: query
  })
}

export function payrollUpdateById(query) {
  return request({
    url: '/pit/calc/payroll/update-id',
    method: 'post',
    data: query
  })
}

export function payrollUpdateByQuery(query, target) {
  return request({
    url: '/pit/calc/payroll/update-query',
    method: 'post',
    data: {
      query,
      target
    }
  })
}

export function flowRecordList(query) {
  return request({
    url: '/pit/calc/flow-record/list',
    method: 'post',
    data: query
  })
}
