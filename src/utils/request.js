import axios from 'axios'
import store from '@/store'
import { getDataType } from '@/utils'
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
    showMessage({ data: error, type: 'error' })
    return errorFlag
  }
)
// response interceptor
service.interceptors.response.use(
  response => {
    const code = response.data
    if (
      getDataType(code) === 'number' &&
      (code === 10001 || code === 10002 || code === 10003)
    ) {
      showAlert({ data: tokenMessage[code], title: '登出', type: 'warning' }).then(() => {
        store.dispatch('silentLogout').then(() => {
          location.reload() // 重新实例化 vue-router 对象，避免 bug
        })
      })
      return errorFlag
    } else {
      return response
    }
  },
  error => {
    console.log(error)
    showMessage({ data: error, type: 'error' })
    return errorFlag
  }
)

export default service
export function passable(response) {
  return errorFlag !== response && isNotEmpty(response)
}
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
export function parallel(requests) {
  return Promise.all(requests)
}
