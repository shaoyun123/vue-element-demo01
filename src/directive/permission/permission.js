import { getDataType } from '@/utils'
import checkPermission from '@/utils/permission'

export default{
  inserted(el, binding, vnode) {
    // 默认基于资源检查菜单权限
    const mode = binding.mode || 'resource'
    let value = binding.value
    if (mode === 'resource' && getDataType(value) === 'string') {
      value = ['MENU', value]
    }
    if (!checkPermission(mode, value)) {
      el.parentNode && el.parentNode.removeChild(el)
    }
  }
}
