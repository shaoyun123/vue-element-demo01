import createUniqueString from './createUniqueString'
import { isEmpty, isNotEmpty } from './validate'

const loadHistory = {}
function asyncLoad({ type, url, reload = false }) {
  return new Promise((resolve, reject) => {
    let loadId = loadHistory[url]
    if (isNotEmpty(loadId) && reload) {
      // 先执行删除，后续统一执行加载
      const element = document.getElementById(loadId)
      if (isNotEmpty(element)) {
        element.parentNode && element.parentNode.removeChild(element)
      }
    } else if (isEmpty(loadId)) {
      // 只执行加载
    } else {
      // 已加载，直接执行 then
      resolve()
      return
    }
    loadId = createUniqueString()
    let element = null
    if (type === 'script') {
      element = document.createElement('script')
      element.type = 'text/javascript'
      element.src = url
    } else if (type === 'link') {
      element = document.createElement('link')
      element.rel = 'stylesheet'
      element.type = 'text/css'
      element.href = url
    }
    element.id = loadId
    document.body.appendChild(element)
    element.onload = () => {
      loadHistory[url] = loadId
      resolve()
    }
    element.onerror = () => {
      reject()
    }
  })
}

export const asyncScript = ({ url, reload }) => {
  return asyncLoad({ type: 'script', url, reload })
}

export const asyncLink = ({ url, reload }) => {
  return asyncLoad({ type: 'link', url, reload })
}
