import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import tagsView from './modules/tagsView'
import errorLog from './modules/errorLog'
import globalData from './modules/globalData'
import flow from './modules/flow'
import user from './modules/user'
import permission from './modules/permission'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    tagsView,
    errorLog,
    globalData,
    flow,
    user,
    permission
  },
  getters
})

export default store
