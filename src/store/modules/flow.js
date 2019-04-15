const flow = {
  state: {
    initializing: true
  },
  mutations: {
    CHANGE_INITIALIZING: (state) => {
      state.initializing = false
    }
  },
  actions: {
    changeInitializing({ commit }) {
      commit('CHANGE_INITIALIZING')
    }
  }
}
export default flow
