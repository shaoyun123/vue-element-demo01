import router, { getRouterInfo } from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'// progress bar style
import { getToken } from '@/utils/auth' // getToken from cookie
import { isEmpty, isNotEmpty } from '@/utils/validate'
import { showMessage } from '@/utils/element'
import checkPermission, { checkWhiteList } from '@/utils/permission'

NProgress.configure({ showSpinner: false })// NProgress Configuration

router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  if (isNotEmpty(getToken())) { // determine if there has token
    /* has token*/
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
      if (isEmpty(store.getters.id)) { // 判断当前用户信息是否已同步
        // 刷新页面时 to 会丢失 meta 信息，因此提供 getRouterInfo 方法获取完整信息
        const toInfo = getRouterInfo(to.fullPath)
        const subsystem = toInfo && toInfo.meta && toInfo.meta.subsystem
        store.dispatch('sync', { subsystem }).then(response => { // 同步信息
          const subsystems = response.data.subsystems // note: subsystems must be a array!
          const roles = response.data.roles // note: roles must be a array!
          const resources = response.data.resources // note: resources must be a array!
          store.dispatch('initPermission', { subsystems, roles, resources }).then(() => { // 根据roles权限生成可访问的路由表
            next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
          })
        }).catch(error => {
          store.dispatch('silentLogout').then(() => {
            showMessage({ data: error, type: 'error' })
            next({ path: '/' })
          })
        })
      } else {
        // 没有动态改变权限的需求可直接next() 删除下方权限判断 ↓
        const path = to.path
        const name = to.name
        const roles = to.meta && to.meta.roles
        let bool = false
        if (checkWhiteList(path) || checkPermission('resource', ['MENU', name]) || (isNotEmpty(roles) && !checkPermission('role', roles))) {
          bool = true
        }
        if (bool) {
          next()
        } else {
          next({ path: '/401', replace: true, query: { noGoBack: true }})
        }
        // 可删 ↑
      }
    }
  } else {
    /* has no token*/
    if (checkWhiteList(to.path)) { // 在免登录白名单，直接进入
      next()
    } else {
      next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
