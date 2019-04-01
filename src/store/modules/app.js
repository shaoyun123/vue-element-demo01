import Cookies from 'js-cookie'

const app = {
  state: {
    device: 'desktop',
    diviceSize: {
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight
    },
    sidebar: {
      opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
      withoutAnimation: false
    },
    language: Cookies.get('language') || 'en',
    size: Cookies.get('size') || 'mini' // small
  },
  mutations: {
    TOGGLE_DEVICE: (state, device) => {
      state.device = device
    },
    SET_DIVICE_SIZE: (state, { diviceWidth, diviceHeight }) => {
      state.diviceSize.width = diviceWidth
      state.diviceSize.height = diviceHeight
    },
    TOGGLE_SIDEBAR: state => {
      state.sidebar.opened = !state.sidebar.opened
      state.sidebar.withoutAnimation = false
      if (state.sidebar.opened) {
        Cookies.set('sidebarStatus', 1)
      } else {
        Cookies.set('sidebarStatus', 0)
      }
    },
    CLOSE_SIDEBAR: (state, withoutAnimation) => {
      Cookies.set('sidebarStatus', 0)
      state.sidebar.opened = false
      state.sidebar.withoutAnimation = withoutAnimation
    },
    SET_LANGUAGE: (state, language) => {
      state.language = language
      Cookies.set('language', language)
    },
    SET_SIZE: (state, size) => {
      state.size = size
      Cookies.set('size', size)
    }
  },
  actions: {
    toggleDevice({ commit }, device) {
      commit('TOGGLE_DEVICE', device)
    },
    setDiviceSize({ commit }, { diviceWidth, diviceHeight }) {
      commit('SET_DIVICE_SIZE', { diviceWidth, diviceHeight })
    },
    toggleSubsystem({ commit }, subsystem) {
      commit('SET_SUBSYSTEM', subsystem)
      commit('SET_ACCESSED_ROUTERS')
    },
    toggleSideBar({ commit }) {
      commit('TOGGLE_SIDEBAR')
    },
    closeSideBar({ commit }, { withoutAnimation }) {
      commit('CLOSE_SIDEBAR', withoutAnimation)
    },
    setLanguage({ commit }, language) {
      commit('SET_LANGUAGE', language)
    },
    setSize({ commit }, size) {
      commit('SET_SIZE', size)
    }
  }
}

export default app
