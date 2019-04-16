import request from '@/utils/request'

export function enterpriseList(query) {
  return request({
    url: '/pit/basic-data/enterprise/list.api',
    method: 'post',
    data: query
  })
}

export function enterpriseSingle(query) {
  return request({
    url: '/pit/basic-data/enterprise/single.api',
    method: 'post',
    data: query
  })
}

export function enterpriseDelete(query) {
  return request({
    url: '/pit/basic-data/enterprise/delete.api',
    method: 'post',
    data: query
  })
}

export function enterpriseSave(enterprise) {
  return request({
    url: '/pit/basic-data/enterprise/save.api',
    method: 'post',
    data: enterprise
  })
}

export function staffList(query) {
  return request({
    url: '/pit/basic-data/staff/list.api',
    method: 'post',
    data: query
  })
}

export function staffSingle(query) {
  return request({
    url: '/pit/basic-data/staff/single.api',
    method: 'post',
    data: query
  })
}

export function staffDelete(query) {
  return request({
    url: '/pit/basic-data/staff/delete.api',
    method: 'post',
    data: query
  })
}

export function staffSave(staff) {
  return request({
    url: '/pit/basic-data/staff/save.api',
    method: 'post',
    data: staff
  })
}

export function loginIdSave(staff) {
  return request({
    url: '/pit/basic-data/staff/login-id/save.api',
    method: 'post',
    data: staff
  })
}

export function salarySingle(query) {
  return request({
    url: '/pit/basic-data/salary/single.api',
    method: 'post',
    data: query
  })
}

export function salarySave(salary) {
  return request({
    url: '/pit/basic-data/salary/save.api',
    method: 'post',
    data: salary
  })
}

export function payFiducialList(query) {
  return request({
    url: '/pit/basic-data/pay-fiducial/list.api',
    method: 'post',
    data: query
  })
}

export function payFiducialSingle(query) {
  return request({
    url: '/pit/basic-data/pay-fiducial/single.api',
    method: 'post',
    data: query
  })
}

export function payFiducialDelete(query) {
  return request({
    url: '/pit/basic-data/pay-fiducial/delete.api',
    method: 'post',
    data: query
  })
}

export function payFiducialSave(payFiducial) {
  return request({
    url: '/pit/basic-data/pay-fiducial/save.api',
    method: 'post',
    data: payFiducial
  })
}

export function payRatioList(query) {
  return request({
    url: '/pit/basic-data/pay-ratio/list.api',
    method: 'post',
    data: query
  })
}

export function payRatioSingle(query) {
  return request({
    url: '/pit/basic-data/pay-ratio/single.api',
    method: 'post',
    data: query
  })
}

export function payRatioDelete(query) {
  return request({
    url: '/pit/basic-data/pay-ratio/delete.api',
    method: 'post',
    data: query
  })
}

export function payRatioSave(payRatio) {
  return request({
    url: '/pit/basic-data/pay-ratio/save.api',
    method: 'post',
    data: payRatio
  })
}

export function taxStairList(query) {
  return request({
    url: '/pit/basic-data/tax-stair/list.api',
    method: 'post',
    data: query
  })
}

export function taxStairSingle(query) {
  return request({
    url: '/pit/basic-data/tax-stair/single.api',
    method: 'post',
    data: query
  })
}

export function taxStairDelete(query) {
  return request({
    url: '/pit/basic-data/tax-stair/delete.api',
    method: 'post',
    data: query
  })
}

export function taxStairSave(taxStair) {
  return request({
    url: '/pit/basic-data/tax-stair/save.api',
    method: 'post',
    data: taxStair
  })
}

export function childEducateList(query) {
  return request({
    url: '/pit/additional-deduct/child-educate/list.api',
    method: 'post',
    data: query
  })
}

export function childEducateSingle(query) {
  return request({
    url: '/pit/additional-deduct/child-educate/single.api',
    method: 'post',
    data: query
  })
}

export function childEducateDelete(query) {
  return request({
    url: '/pit/additional-deduct/child-educate/delete.api',
    method: 'post',
    data: query
  })
}

export function childEducateSave(childEducate) {
  return request({
    url: '/pit/additional-deduct/child-educate/save.api',
    method: 'post',
    data: childEducate
  })
}

export function adultEducateList(query) {
  return request({
    url: '/pit/additional-deduct/adult-educate/list.api',
    method: 'post',
    data: query
  })
}

export function adultEducateSingle(query) {
  return request({
    url: '/pit/additional-deduct/adult-educate/single.api',
    method: 'post',
    data: query
  })
}

export function adultEducateDelete(query) {
  return request({
    url: '/pit/additional-deduct/adult-educate/delete.api',
    method: 'post',
    data: query
  })
}

export function adultEducateSave(adultEducate) {
  return request({
    url: '/pit/additional-deduct/adult-educate/save.api',
    method: 'post',
    data: adultEducate
  })
}

export function houseLoanList(query) {
  return request({
    url: '/pit/additional-deduct/house-loan/list.api',
    method: 'post',
    data: query
  })
}

export function houseLoanSingle(query) {
  return request({
    url: '/pit/additional-deduct/house-loan/single.api',
    method: 'post',
    data: query
  })
}

export function houseLoanDelete(query) {
  return request({
    url: '/pit/additional-deduct/house-loan/delete.api',
    method: 'post',
    data: query
  })
}

export function houseLoanSave(houseLoan) {
  return request({
    url: '/pit/additional-deduct/house-loan/save.api',
    method: 'post',
    data: houseLoan
  })
}

export function houseRentList(query) {
  return request({
    url: '/pit/additional-deduct/house-rent/list.api',
    method: 'post',
    data: query
  })
}

export function houseRentSingle(query) {
  return request({
    url: '/pit/additional-deduct/house-rent/single.api',
    method: 'post',
    data: query
  })
}

export function houseRentDelete(query) {
  return request({
    url: '/pit/additional-deduct/house-rent/delete.api',
    method: 'post',
    data: query
  })
}

export function houseRentSave(houseRent) {
  return request({
    url: '/pit/additional-deduct/house-rent/save.api',
    method: 'post',
    data: houseRent
  })
}

export function supportAgedList(query) {
  return request({
    url: '/pit/additional-deduct/support-aged/list.api',
    method: 'post',
    data: query
  })
}

export function supportAgedSingle(query) {
  return request({
    url: '/pit/additional-deduct/support-aged/single.api',
    method: 'post',
    data: query
  })
}

export function supportAgedDelete(query) {
  return request({
    url: '/pit/additional-deduct/support-aged/delete.api',
    method: 'post',
    data: query
  })
}

export function supportAgedSave(supportAged) {
  return request({
    url: '/pit/additional-deduct/support-aged/save.api',
    method: 'post',
    data: supportAged
  })
}

export function medicalList(query) {
  return request({
    url: '/pit/additional-deduct/medical/list.api',
    method: 'post',
    data: query
  })
}

export function medicalSingle(query) {
  return request({
    url: '/pit/additional-deduct/medical/single.api',
    method: 'post',
    data: query
  })
}

export function medicalDelete(query) {
  return request({
    url: '/pit/additional-deduct/medical/delete.api',
    method: 'post',
    data: query
  })
}

export function medicalSave(medical) {
  return request({
    url: '/pit/additional-deduct/medical/save.api',
    method: 'post',
    data: medical
  })
}

export function salarySnapshootList(query) {
  return request({
    url: '/pit/calc/salary-snapshoot/list.api',
    method: 'post',
    data: query
  })
}

export function salarySnapshootSingle(query) {
  return request({
    url: '/pit/calc/salary-snapshoot/single.api',
    method: 'post',
    data: query
  })
}

export function salarySnapshootDelete(query) {
  return request({
    url: '/pit/calc/salary-snapshoot/delete.api',
    method: 'post',
    data: query
  })
}

export function salarySnapshootSave(salarySnapshoot) {
  return request({
    url: '/pit/calc/salary-snapshoot/save.api',
    method: 'post',
    data: salarySnapshoot
  })
}

export function salarySnapshootUpdateById(query) {
  return request({
    url: '/pit/calc/salary-snapshoot/update-id.api',
    method: 'post',
    data: query
  })
}

export function salarySnapshootUpdateByQuery(query, target) {
  return request({
    url: '/pit/calc/salary-snapshoot/update-query.api',
    method: 'post',
    data: {
      query,
      target
    }
  })
}

export function salarySnapshootImport(query) {
  return request({
    url: '/pit/calc/salary-snapshoot/import.api',
    method: 'post',
    data: query
  })
}

export function adSnapshootList(query) {
  return request({
    url: '/pit/calc/ad-snapshoot/list.api',
    method: 'post',
    data: query
  })
}

export function adSnapshootUpdateById(query) {
  return request({
    url: '/pit/calc/ad-snapshoot/update-id.api',
    method: 'post',
    data: query
  })
}

export function verifyResultList(query) {
  return request({
    url: '/pit/calc/verify/result/list.api',
    method: 'post',
    data: query
  })
}

export function verifyResultUpdateById(query) {
  return request({
    url: '/pit/calc/verify/result/update-id.api',
    method: 'post',
    data: query
  })
}

export function verifyUpdateById(query) {
  return request({
    url: '/pit/calc/verify/verify-id.api',
    method: 'post',
    data: query
  })
}

export function verifyUpdateByQuery(query) {
  return request({
    url: '/pit/calc/verify/verify-query.api',
    method: 'post',
    data: query
  })
}

export function payrollList(query) {
  return request({
    url: '/pit/calc/payroll/list.api',
    method: 'post',
    data: query
  })
}

export function payrollSingle(query) {
  return request({
    url: '/pit/calc/payroll/single.api',
    method: 'post',
    data: query
  })
}

export function payrollUpdateById(query) {
  return request({
    url: '/pit/calc/payroll/update-id.api',
    method: 'post',
    data: query
  })
}

export function payrollUpdateByQuery(query, target) {
  return request({
    url: '/pit/calc/payroll/update-query.api',
    method: 'post',
    data: {
      query,
      target
    }
  })
}

export function flowRecordList(query) {
  return request({
    url: '/pit/calc/flow-record/list.api',
    method: 'post',
    data: query
  })
}
