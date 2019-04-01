import router, { dynamicSubsystems, constantRouters, dynamicRouters } from '@/router'
import store from '@/store'
import { isEmpty, isNotEmpty } from '@/utils/validate'
import checkPermission, { buildSubsystemKey, buildRoleKey, buildResourceKey } from '@/utils/permission'

function filterDynamicSubsystem(subsystems) {
  const t_subsystems = []
  subsystems.forEach(subsystem => {
    const t_subsystem = { ...subsystem }
    const id = t_subsystem.id
    let bool = false
    if (checkPermission('subsystem', id)) {
      bool = true
    }
    if (bool) {
      const children = t_subsystem.children
      if (isNotEmpty(children)) {
        t_subsystem.children = filterDynamicSubsystem(children)
      }
      t_subsystems.push(t_subsystem)
    }
  })
  return t_subsystems
}

function filterDynamicRouter(routes) {
  const subsystemChecker = store.getters.subsystem
  const t_routes = []
  routes.forEach(route => {
    const t_route = { ...route }
    const name = t_route.name
    const subsystem = t_route.meta && t_route.meta.subsystem
    const whiter = t_route && t_route.meta && t_route.meta.whiter
    const roles = t_route.meta && t_route.meta.roles
    let bool = false
    if (
      (isEmpty(subsystem) || subsystem === subsystemChecker) &&
      (whiter || checkPermission('resource', ['MENU', name]) || (isNotEmpty(roles) && checkPermission('role', roles)))
    ) {
      bool = true
    }
    if (bool) {
      const children = t_route.children
      if (isNotEmpty(children)) {
        t_route.children = filterDynamicRouter(children)
      }
      t_routes.push(t_route)
    }
  })
  return t_routes
}

const permission = {
  state: {
    subsystemChecker: {},
    roleChecker: {},
    resourceChecker: {},
    accessedSubsystems: [],
    accessedRouters: constantRouters
  },
  mutations: {
    SET_SUBSYSTEM_CHECKER: (state, subsystemChecker) => {
      state.subsystemChecker = subsystemChecker
    },
    SET_ROLE_CHECKER: (state, roleChecker) => {
      state.roleChecker = roleChecker
    },
    SET_RESOURCE_CHECKER: (state, resourceChecker) => {
      state.resourceChecker = resourceChecker
    },
    SET_ACCESSED_SUBSYSTEMS: (state) => {
      state.accessedSubsystems = filterDynamicSubsystem(dynamicSubsystems)
    },
    SET_ACCESSED_ROUTERS: (state) => {
      const routers = filterDynamicRouter(dynamicRouters)
      state.accessedRouters = constantRouters.concat(routers)
      router.addRoutes(routers)
    }
  },
  actions: {
    initPermission({ commit }, data) {
      return new Promise(resolve => {
        const { subsystems, roles, resources } = data
        if (isNotEmpty(subsystems)) {
          const subsystemChecker = {}
          subsystems.forEach(subsystem => {
            subsystemChecker[buildSubsystemKey(subsystem.ID)] = true
          })
          commit('SET_SUBSYSTEM_CHECKER', subsystemChecker)
        }
        if (isNotEmpty(roles)) {
          const roleChecker = {}
          roles.forEach(role => {
            roleChecker[buildRoleKey(role.ID)] = true
          })
          commit('SET_ROLE_CHECKER', roleChecker)
        }
        if (isNotEmpty(resources)) {
          const resourceChecker = {}
          resources.forEach(resource => {
            resourceChecker[buildResourceKey(resource.TYPE, resource.ID)] = true
          })
          commit('SET_RESOURCE_CHECKER', resourceChecker)
        }
        commit('SET_ACCESSED_SUBSYSTEMS')
        commit('SET_ACCESSED_ROUTERS')
        resolve()
      })
    }
  }
}

export default permission
