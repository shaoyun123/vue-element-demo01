import {
  Message,
  MessageBox
} from 'element-ui'
import { isNotEmpty } from './validate'

export function showMessage({ data, type = 'info' }) {
  if (isNotEmpty(data)) {
    let message = ''
    if (Array.isArray(data)) {
      message = data.join('<br />')
    } else {
      message = data
    }
    Message({
      showClose: true,
      message,
      dangerouslyUseHTMLString: true,
      type,
      duration: 5 * 1000
    })
  }
}

export function showAlert({ data, title = '提示', type = 'info' }) {
  let message = ''
  if (isNotEmpty(data)) {
    if (Array.isArray(data)) {
      message = data.join('<br />')
    } else {
      message = data
    }
  }
  return MessageBox.alert(message, title, {
    dangerouslyUseHTMLString: true,
    type,
    confirmButtonClass: 'el-icon-antd-check',
    confirmButtonText: '是'
  })
}
