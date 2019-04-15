import { Message, MessageBox } from 'element-ui'
import { isEmpty, isNotEmpty } from './validate'

function buildMessage(content) {
  let message = ''
  if (isNotEmpty(content)) {
    if (Array.isArray(content)) {
      message = content.join('<br />')
    } else {
      message = content
    }
  }
  return message
}

export function showMessage({ content, title = '消息', type = 'info', force = false }) {
  const message = buildMessage(content)
  if (isNotEmpty(message)) {
    if (force) {
      MessageBox.alert(message, title, {
        type,
        showConfirmButton: false,
        closeOnClickModal: true,
        closeOnPressEscape: true,
        callback: function() {}
      })
    } else {
      Message({
        showClose: true,
        message,
        dangerouslyUseHTMLString: true,
        type,
        duration: 5 * 1000
      })
    }
  }
}

export function showAlert({ content, title = '提示', type = 'info' }) {
  const message = buildMessage(content)
  return MessageBox.alert(message, title, {
    dangerouslyUseHTMLString: true,
    type,
    confirmButtonClass: 'el-icon-antd-check',
    confirmButtonText: '是'
  })
}

export function showConfirm({ content, title = '请确认 ...', type = 'info' }) {
  const message = buildMessage(content)
  return MessageBox.confirm(message, title, {
    dangerouslyUseHTMLString: true,
    type,
    confirmButtonClass: 'el-icon-antd-check',
    confirmButtonText: '是',
    showCancelButton: false
  })
}

export function showPrompt({ content, title = '请输入 ...' }) {
  const message = buildMessage(content)
  return MessageBox.prompt(message, title, {
    dangerouslyUseHTMLString: true,
    confirmButtonClass: 'el-icon-antd-check',
    confirmButtonText: '提交',
    showCancelButton: false,
    inputValidator: (value) => {
      if (isEmpty(value)) {
        return '请输入提交信息'
      }
      return true
    }
  })
}
