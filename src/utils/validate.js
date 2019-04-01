import { getDataType } from './index'

// 是否为空
export function isEmpty(value, loose) {
  const dataType = getDataType(value)
  if (loose === true) {
    if (['undefined', 'null'].includes(dataType)) {
      return true
    }
  } else {
    if (['undefined', 'null'].includes(dataType)) {
      return true
    } else if (
      ['string', 'array'].includes(dataType) &&
      value.length === 0
    ) {
      return true
    } else if (
      ['object'].includes(dataType) &&
      Object.keys(value).length === 0
    ) {
      return true
    }
  }
  return false
}

// 是否不为空
export function isNotEmpty(value, loose) {
  return !isEmpty(value, loose)
}

/* 合法uri*/
export function validateURL(textval) {
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return urlregex.test(textval)
}

/* 小写字母*/
export function validateLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/* 大写字母*/
export function validateUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/* 大小写字母*/
export function validateAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

// 座机
export function validateTelephone(telephone) {
  const re = /^\d{3}-\d{7,8}|\d{4}-\d{7,8}$/
  return re.test(telephone)
}

/**
 * validate email
 * @param email
 * @returns {boolean}
 */
export function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(email)
}

// QQ
export function validateQQ(qq) {
  const re = /^[1-9]\d{4,11}$/
  return re.test(qq)
}

// 合法 id
export function validateLegalID(id) {
  const re = /^[a-z0-9A-Z_]{0,}$/
  return re.test(id)
}

// 中文
export function validateChineseText(text) {
  const re = /^[\u4E00-\u9FA5]$/
  return re.test(text)
}

// 银行卡号
export function validateBankCard(bankCard) {
  const re = /^[1-9]\d{9,19}$/
  return re.test(bankCard)
}

// 居民身份证号
export function validateIDNumber(email) {
  const re = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{7}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}$)/
  return re.test(email)
}

// 统一社会信用编码
export function checkSocialCreditCodeOrg(code) {
  var patrn = /^[0-9A-Z]+$/
  // 18 位校验及大写校验
  if ((code.length !== 18) || (patrn.test(code) === false)) {
    return false
  } else {
    var ancode // 信用代码 / 税号的每一个值
    var ancodevalue // 信用代码 / 税号每一个值的权重
    var total = 0
    var weightedfactors = [1, 3, 9, 27, 19, 26, 16, 17, 20, 29, 25, 13, 8, 24, 10, 30, 28] // 加权因子
    var str = '0123456789ABCDEFGHJKLMNPQRTUWXY'
    // 不用 I、O、S、V、Z
    for (var i = 0; i < code.length - 1; i++) {
      ancode = code.substring(i, i + 1)
      ancodevalue = str.indexOf(ancode)
      total = total + ancodevalue * weightedfactors[i]
      // 权重与加权因子相乘之和
    }
    var logiccheckcode = 31 - total % 31
    if (logiccheckcode === 31) {
      logiccheckcode = 0
    }
    var Str = '0,1,2,3,4,5,6,7,8,9,A,B,C,D,E,F,G,H,J,K,L,M,N,P,Q,R,T,U,W,X,Y'
    var Array_Str = Str.split(',')
    logiccheckcode = Array_Str[logiccheckcode]
    var checkcode = code.substring(17, 18)
    if (logiccheckcode !== checkcode) {
      return false
    } else {
      return true
    }
  }
}

// 个体工商户验证码
export function checkValidBusCode(code) {
  var bool = false
  if (code.length === 15) {
    var s = []
    var p = []
    var a = []
    var m = 10
    p[0] = m
    for (var i = 0; i < code.length; i++) {
      a[i] = parseInt(code.substring(i, i + 1), m)
      s[i] = (p[i] % (m + 1)) + a[i]
      if (s[i] % m === 0) {
        p[i + 1] = 10 * 2
      } else {
        p[i + 1] = (s[i] % m) * 2
      }
    }
    if (s[14] % m === 1) { // 营业执照编号正确!
      bool = true
    } else { // 营业执照编号错误!
      bool = false
    }
  } else { // 营业执照格式不对，必须是 15 位数
    bool = false
  }
  return bool
}

// 纳税人识别号验证
export function checkTaxpayerId(taxpayerId) {
  if (taxpayerId !== '' && taxpayerId.length === 15) {
    var addressCode = taxpayerId.substring(0, 6)
    // 校验地址码
    var bool = checkAddressCode(addressCode)
    if (!bool) {
      return false
    }
    // 校验组织机构代码
    var orgCode = taxpayerId.substring(6, 9)
    bool = checkValidOrgCode(orgCode)
    if (!bool) {
      return false
    }
    return true
  } else {
    return false
  }
}

// 标准地区码
export function checkAddressCode(code) {
  var provinceAndCitys = {
    11: '北京', 12: '天津', 13: '河北', 14: '山西', 15: '内蒙古', 21: '辽宁', 22: '吉林', 23: '黑龙江',
    31: '上海', 32: '江苏', 33: '浙江', 34: '安徽', 35: '福建', 36: '江西', 37: '山东', 41: '河南', 42: '湖北', 43: '湖南', 44: '广东',
    45: '广西', 46: '海南', 50: '重庆', 51: '四川', 52: '贵州', 53: '云南', 54: '西藏', 61: '陕西', 62: '甘肃', 63: '青海', 64: '宁夏',
    65: '新疆', 71: '台湾', 81: '香港', 82: '澳门', 91: '境外'
  }
  var bool = /^[1-9]\d{5}$/.test(code)
  if (!bool) {
    return false
  }
  if (provinceAndCitys[parseInt(code.substring(0, 2))]) {
    return true
  } else {
    return false
  }
}

export function checkValidOrgCode(code) {
  if (code !== '') {
    var part1 = code.substring(0, 8)
    var part2 = code.substring(code.length - 1, 1)
    var ws = [3, 7, 9, 10, 5, 8, 4, 2]
    var str = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    var reg = /^([0-9A-Z]){8}$/
    if (!reg.test(part1)) {
      return true
    }
    var sum = 0
    for (var i = 0; i < 8; i++) {
      sum += str.indexOf(part1.charAt(i)) * ws[i]
    }
    var C9 = 11 - (sum % 11)
    var YC9 = part2 + ''
    if (C9 === 11) {
      C9 = '0'
    } else if (C9 === 10) {
      C9 = 'X'
    } else {
      C9 = C9 + ''
    }
    return YC9 !== C9
  }
}
