import request from '@/utils/request'

export function login(username, password) {
  const data = { username, password }
  return request({
    url: '/jwt/authorized/login.api',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/jwt/authorized/logout.api',
    method: 'post'
  })
}

export function sync() {
  return request({
    url: '/jwt/authorized/sync.api',
    method: 'post'
  })
}

export function changePassword(opwd, npwd) {
  const data = { opwd, npwd }
  return request({
    url: '/jwt/authorized/change-password.api',
    method: 'post',
    data
  })
}

