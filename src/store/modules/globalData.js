import { isEmpty, isNotEmpty } from '@/utils/validate'
import { dictList, districtList } from '@/api/globalData'

function getDictKey(type, value) {
  return type + '_' + value
}

function recursionDistrict(districtMapper, districts) {
  if (isNotEmpty(districts)) {
    districts.forEach(district => {
      const value = district.value
      const title = district.label
      const children = district.children
      districtMapper[value] = title
      recursionDistrict(districtMapper, children)
    })
  }
}

const globalData = {
  state: {
    dictMapper: {},
    dictStorer: {},
    districtMapper: {},
    districtStorer: []
  },
  mutations: {
    INIT_DICTIONARY: (state, payload) => {
      const dictList = payload.data
      const dictMapper = {}
      const dictStorer = {}
      if (isNotEmpty(dictList)) {
        dictList.forEach(dict => {
          const type = dict.type
          const value = dict.value
          const title = dict.title
          const key = getDictKey(type, value)
          dictMapper[key] = title
          let dicts = dictStorer[type]
          if (!dicts) {
            dicts = []
          }
          dicts.push({ value, title })
          dictStorer[type] = dicts
        })
      }
      state.dictMapper = dictMapper
      state.dictStorer = dictStorer
      console.log('字典初始化完成 ...')
    },
    INIT_REGION: (state, payload) => {
      const districtMapper = {}
      const districtStorer = payload.data
      recursionDistrict(districtMapper, districtStorer)
      state.districtMapper = districtMapper
      state.districtStorer = districtStorer
      console.log('地区初始化完成 ...')
    }
  },
  actions: {
    async initGlobalData({ dispatch, commit }) {
      await dispatch('initDict')
      await dispatch('initDistrict')
      return new Promise((resolve) => {
        resolve()
      })
    },
    async initDict({ commit }) {
      commit('INIT_DICTIONARY', await dictList())
    },
    async initDistrict({ commit }) {
      commit('INIT_REGION', await districtList())
    }
  }
}
export default globalData

export const dictKit = {
  getDictTitle: function(state, type, value) {
    const key = getDictKey(type, value)
    let title = state.globalData.dictMapper[key]
    if (isEmpty(title)) {
      title = value
    }
    return title
  },
  getDicts: function(state, type) {
    let dicts = state.globalData.dictStorer[type]
    if (isEmpty(dicts)) {
      dicts = []
    }
    return dicts
  }
}

export const districtKit = {
  getDistrictTitle: function(state, value) {
    let title = state.globalData.districtMapper[value]
    if (isEmpty(title)) {
      title = value
    }
    return title
  }
}
