import request from '@/utils/request'

export function login(username, password) {
  const data = { username, password }
  return request({
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    url: '/jwt/authorized/login.api',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    url: '/jwt/authorized/logout.api',
    method: 'post'
  })
}

export function sync() {
  return request({
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    url: '/jwt/authorized/sync.api',
    method: 'post'
  })
}

export function changePassword(opwd, npwd) {
  const data = { opwd, npwd }
  return request({
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    url: '/jwt/authorized/change-password.api',
    method: 'post',
    data
  })
}

