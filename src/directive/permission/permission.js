import { getDataType } from '@/utils'
import checkPermission from '@/utils/permission'

export default{
  inserted(el, binding, vnode) {
    const data = binding.value
    const mode = binding.mode || 'resource'
    let value = data.value
    if (mode === 'resource' && getDataType(value) === 'string') {
      // 默认基于资源检查菜单权限
      value = ['MENU', value]
    }
    if (!checkPermission(mode, value)) {
      el.parentNode && el.parentNode.removeChild(el)
    }
  }
}
