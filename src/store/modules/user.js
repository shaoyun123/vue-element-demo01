import { passable } from '@/utils/request'
import {
  login as loginApi,
  logout as logoutApi,
  sync as syncApi,
  changePassword as changePasswordApi
} from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { isNotEmpty } from '@/utils/validate'

const user = {
  state: {
    token: getToken(),
    id: '',
    name: '',
    introduction: '',
    avatar: '',
    subsystem: '',
    subsystems: [],
    roles: [],
    resources: [],
    setting: {
      articlePlatform: []
    }
  },

  mutations: {
    CLEAR_USER: (state) => {
      removeToken()
      state.token = ''
      state.id = ''
      state.name = ''
      state.introduction = ''
      state.avatar = ''
      state.subsystem = ''
      state.subsystems = []
      state.roles = []
      state.resources = []
      state.setting = {
        articlePlatform: []
      }
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_ID: (state, id) => {
      state.id = id
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_SUBSYSTEM: (state, subsystem) => {
      state.subsystem = subsystem
    },
    SET_SUBSYSTEMS: (state, subsystems) => {
      state.subsystems = subsystems
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_RESOURCES: (state, resources) => {
      state.resources = resources
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting
    }
  },

  actions: {
    // 登录
    login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        loginApi(username, userInfo.password).then(response => {
          if (passable(response) && isNotEmpty(response.data)) {
            const data = response.data
            const logined = data.logined
            const message = data.message
            if (logined) {
              const token = data.token
              setToken(token)
              commit('SET_TOKEN', token)
              resolve()
            } else {
              reject(message)
            }
          }
        })
      })
    },
    // 登出
    logout({ commit, state }) {
      return new Promise((resolve) => {
        logoutApi().then(response => {
          if (passable(response)) {
            commit('CLEAR_USER')
            resolve()
          }
        })
      })
    },
    // 静默登出
    silentLogout({ commit }) {
      return new Promise(resolve => {
        commit('CLEAR_USER')
        resolve()
      })
    },
    // 同步用户信息
    sync({ commit, state }, { subsystem }) {
      return new Promise((resolve, reject) => {
        syncApi().then(response => {
          if (passable(response) && isNotEmpty(response.data)) {
            const data = response.data
            const subsystems = data.subsystems
            commit('SET_ID', data.id)
            commit('SET_NAME', data.name)
            commit('SET_INTRODUCTION', data.introduction)
            commit('SET_AVATAR', data.avatar)
            if (isNotEmpty(subsystem)) {
              commit('SET_SUBSYSTEM', subsystem)
            } else if (isNotEmpty(subsystems)) {
              commit('SET_SUBSYSTEM', subsystems[0].ID)
            }
            commit('SET_SUBSYSTEMS', subsystems)
            commit('SET_ROLES', data.roles)
            commit('SET_RESOURCES', data.resources)
            resolve(response)
          } else {
            reject('同步登录信息失败')
          }
        })
      })
    },
    // 修改密码
    changePassword({ commit, dispatch }, pwdWrap) {
      return new Promise((resolve, reject) => {
        changePasswordApi(pwdWrap.opwd, pwdWrap.npwd).then(response => {
          if (passable(response) && isNotEmpty(response.data)) {
            const data = response.data
            const success = data.success
            const messages = data.messages
            if (!success && isNotEmpty(messages)) {
              reject(messages)
            } else {
              resolve()
            }
          } else {
            resolve()
          }
        })
      })
    }
  }
}

export default user
