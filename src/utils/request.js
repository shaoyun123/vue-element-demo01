import axios from 'axios'
import store from '@/store'
import { getTokenKey } from '@/utils/auth'
import { isNotEmpty } from '@/utils/validate'
import { showMessage, showAlert } from '@/utils/element'

const errorFlag = '_error_'
const tokenMessage = {
  '10001': '令牌非法',
  '10002': '令牌过期',
  '10003': '令牌失效'
}
const service = axios.create({
  baseURL: process.env.BASE_API, // api 的 base_url
  headers: { 'Content-Type': 'application/json;charset=UTF-8' },
  timeout: 5000 // request timeout
})
// request interceptor
service.interceptors.request.use(
  config => {
    const token = store.getters.token
    if (isNotEmpty(token)) {
      // 让每个请求绑定 token
      config.headers[getTokenKey()] = token
    }
    return config
  },
  error => {
    console.log(error)
    showMessage({ content: error, type: 'error' })
    return errorFlag
  }
)
// response interceptor
service.interceptors.response.use(
  response => {
    const data = response.data
    if (isNotEmpty(data)) {
      const code = data.code
      if (code === 10001 || code === 10002 || code === 10003) {
        showAlert({ content: tokenMessage[code], title: '登出', type: 'warning' }).then(() => {
          store.dispatch('silentLogout').then(() => {
            location.reload() // 重新实例化 vue-router 对象，避免 bug
          })
        })
        return errorFlag
      } else if (code === 200) {
        response.data = data.responseBody
        return response
      } else if (code === 251) {
        showMessage({ content: data.messages, type: 'warning' })
        response.data = data.responseBody
        return response
      } else if (code === 500) {
        showMessage({ content: data.messages, type: 'error' })
        return errorFlag
      } else {
        return response
      }
    } else {
      return response
    }
  },
  error => {
    console.log(error)
    showMessage({ content: error, type: 'error' })
    return errorFlag
  }
)

export default service
/**
 * 是否是有效的响应
 */
export function passable(response) {
  return errorFlag !== response && isNotEmpty(response)
}
/**
 * 串行
 */
export function serial(requests) {
  const datas = []
  let promise = Promise.resolve()
  requests.forEach(request => {
    promise = promise.then(request).then(data => {
      datas.push(data)
      return datas
    })
  })
  return promise
}
/**
 * 并行
 */
export function parallel(requests) {
  return Promise.all(requests)
}
