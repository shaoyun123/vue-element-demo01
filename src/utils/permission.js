import { getRouterInfo } from '@/router'
import store from '@/store'
import { getDataType } from '@/utils'
import { getToken } from '@/utils/auth' // getToken from cookie
import { isNotEmpty } from '@/utils/validate'

export const buildSubsystemKey = id => id
export const buildRoleKey = id => id
export const buildResourceKey = (type, id) => `${type}_${id}`

/**
 * 基于角色或资源检查权限
 * @param {String} mode [subsystem | role | resource]
 * @param {String | Array} value [mode = role 数组元素为角色列表 | mode = resource 数组第 1 个元素为 type [MENU]，第 2 个元素为 id]
 * @returns {Boolean} true 为检查通过
 * @example see @/views/permission/directive.vue
 */
export default function checkPermission(mode, value) {
  let bool = false
  if (isNotEmpty(value)) {
    const dataType = getDataType(value)
    if (mode === 'subsystem') {
      if (dataType !== 'string') {
        console.error(`value 类型要求为字符串，返回默认值 false`)
      } else {
        const subsystemChecker = store.getters && store.getters.subsystemChecker
        if (subsystemChecker[buildSubsystemKey(value)]) {
          bool = true
        }
      }
    } else {
      if (getDataType(value) !== 'array') {
        console.error(`value 类型要求为数组，返回默认值 false`)
      } else if (mode === 'resource' && value.length !== 2) {
        console.error(`资源检查模式下要求 value 数组长度等于 2 [type, id]，返回默认值 false`)
      } else if (mode === 'role') {
        const roleChecker = store.getters && store.getters.roleChecker
        value.forEach(val => {
          if (roleChecker[buildRoleKey(val)]) {
            bool = true
          }
        })
      } else if (mode === 'resource') {
        const type = value[0]
        const id = value[1]
        const resourceChecker = store.getters && store.getters.resourceChecker
        if (resourceChecker[buildResourceKey(type, id)]) {
          bool = true
        }
      }
    }
  } else {
    console.error(`value 为空，返回默认值 false`)
  }
  return bool
}

// 以 [/redirect] 前缀的路径为转发路径，需要特殊处理
const redirectPath = '/redirect'
const guestWhiteList = [
  '/login',
  '/auth-redirect'
]
const userWhiteList = [
  '/login',
  '/auth-redirect',
  '/401',
  '/404',
  '/dashboard'
]
export const checkWhiteList = function(fullPath) {
  if (isNotEmpty(fullPath)) {
    if (fullPath.indexOf(redirectPath) === 0) {
      return true
    } else {
      const routerInfo = getRouterInfo(fullPath)
      const whiter = routerInfo && routerInfo.meta && routerInfo.meta.whiter
      if (whiter === true) {
        return true
      } else {
        let whiteList = guestWhiteList
        if (isNotEmpty(getToken())) {
          whiteList = userWhiteList
        }
        return whiteList.includes(fullPath)
      }
    }
  } else {
    return false
  }
}
