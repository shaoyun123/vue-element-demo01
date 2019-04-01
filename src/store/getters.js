import { dictKit, districtKit } from './modules/globalData'

const getters = {
  device: state => state.app.device,
  deviceSize: state => state.app.diviceSize,
  sidebar: state => state.app.sidebar,
  language: state => state.app.language,
  size: state => state.app.size,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  errorLogs: state => state.errorLog.logs,
  getDictTitle: state => (type, value) => dictKit.getDictTitle(state, type, value),
  getDicts: state => (type) => dictKit.getDicts(state, type),
  getDistricts: state => state.globalData.districtStorer,
  getDistrictTitle: state => (value) => districtKit.getDistrictTitle(state, value),
  token: state => state.user.token,
  id: state => state.user.id,
  name: state => state.user.name,
  introduction: state => state.user.introduction,
  avatar: state => state.user.avatar,
  subsystem: state => state.user.subsystem,
  subsystems: state => state.user.subsystems,
  roles: state => state.user.roles,
  resources: state => state.user.resources,
  setting: state => state.user.setting,
  subsystemChecker: state => state.permission.subsystemChecker,
  roleChecker: state => state.permission.roleChecker,
  resourceChecker: state => state.permission.resourceChecker,
  accessedSubsystems: state => state.permission.accessedSubsystems,
  accessedRouters: state => state.permission.accessedRouters
}
export default getters
