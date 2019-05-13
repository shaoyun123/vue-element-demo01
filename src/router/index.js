import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/views/layout/Layout'
import { getDataType } from '@/utils'
import { isEmpty, isNotEmpty } from '@/utils/validate'

Vue.use(Router)

/* Router Modules */
import flowRouters from './modules/flow'
import pitRouters from './modules/pit'
import fttRouters from './modules/ftt'
import demoRouters from './modules/demo'

/**
 * id
 * name
 * icon
 * whiter
 * children
 */
export const dynamicSubsystems = [
  { id: 'PIT', name: '薪资核算', icon: 'el-icon-antd-propertysafety' },
  {
    id: 'FTT',
    name: '全税种',
    icon: 'el-icon-antd-accountbook',
    children: [
      { id: 'FTT_BASIC', name: '基础数据', icon: 'el-icon-antd-database' },
      { id: 'FTT_VAT', name: '增值税', icon: 'el-icon-antd-container' },
      { id: 'FTT_CIT', name: '企业所得税', icon: 'el-icon-antd-bank' }
    ]
  },
  { id: 'SYS', name: '系统管理', icon: 'el-icon-antd-sliders', whiter: true },
  { id: 'DEMO', name: 'Demo', icon: 'el-icon-antd-desktop', whiter: true }
]

/** note: Submenu only appear when children.length>=1
 *  detail see  https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 **/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!) 并在权限控制中匹配资源
* meta : {
    subsystem: ''                增加子系统属性，指定了子系统的路由只在相应子系统中显示
    whiter: false                白名单，白名单可以在 src\utils\permission.js 中统一设置或者在路由中单独设置
    roles: ['admin','editor']    will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if true, the page will no be cached(default is false)
  }
**/
export const constantRouters = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/authredirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/errorPage/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/errorPage/401'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'dashboard', icon: 'dashboard', noCache: true }
      }
    ]
  }
]

const routerInstance = new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouters
})
export default routerInstance

export const dynamicRouters = (function() {
  const routers = []
  routers.push(...flowRouters)
  routers.push(...pitRouters)
  routers.push(...fttRouters)
  routers.push(...demoRouters)
  return routers
})()

const subsystemInfoMap = {}
function buildSubsystemInfo(subsystems) {
  if (isNotEmpty(subsystems)) {
    subsystems.forEach(subsystem => {
      const id = subsystem.id
      const children = subsystem.children
      subsystemInfoMap[id] = subsystem
      buildSubsystemInfo(children)
    })
  }
}
export const getSubsystemInfo = (id) => {
  if (isEmpty(subsystemInfoMap)) {
    buildSubsystemInfo(dynamicSubsystems)
  }
  return subsystemInfoMap[id]
}

const routerInfoMap = {}
function buildRouterInfo(parentPath, routers) {
  if (isNotEmpty(routers)) {
    routers.forEach(router => {
      const name = router.name
      const path = router.path
      const children = router.children
      let fullpath = ''
      if (path.indexOf('/') === 0) {
        fullpath = `${parentPath}${path}`
      } else {
        fullpath = `${parentPath}/${path}`
      }
      router.fullpath = fullpath
      if (isNotEmpty(name)) {
        routerInfoMap[name] = router
      }
      routerInfoMap[fullpath] = router
      buildRouterInfo(fullpath, children)
    })
  }
}
// to fullpath | routerName
export const getRouterInfo = (to) => {
  if (isEmpty(routerInfoMap)) {
    buildRouterInfo('', constantRouters)
    buildRouterInfo('', dynamicRouters)
  }
  return routerInfoMap[to]
}

// to fullpath | routerName | RouterInfo
export const skipTo = (to) => {
  let routerInfo = null
  if (getDataType(to) === 'string') {
    routerInfo = getRouterInfo(to)
  } else {
    routerInfo = to
  }
  if (isNotEmpty(routerInfo)) {
    const fullpath = routerInfo.fullpath
    if (isNotEmpty(fullpath)) {
      routerInstance.push({ path: fullpath })
    }
  }
}
