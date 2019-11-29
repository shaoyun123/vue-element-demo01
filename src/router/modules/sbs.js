import Layout from '@/views/layout/Layout'

const sbsRouters = [
  {
    path: '/sbs/server',
    component: Layout,
    meta: { subsystem: 'SBS', breadcrumb: false, whiter: true },
    children: [{
      path: 'list',
      component: () => import('@/components/Typography/Flow/ListCategory'),
      name: 'SBS-Server',
      meta: {
        subsystem: 'SBS',
        title: '服务信息',
        icon: 'cloud-server'
      }
    }]
  },
  {
    path: '/sbs/service-package',
    component: Layout,
    meta: { subsystem: 'SBS', breadcrumb: false, whiter: true },
    children: [{
      path: 'template/list',
      component: () => import('@/components/Typography/Flow/ListBasic'),
      name: 'SBS-ServicePackageTemplate',
      meta: {
        subsystem: 'SBS',
        title: '服务套餐模板',
        icon: 'star'
      }
    }]
  },
  {
    path: '/sbs/customer',
    component: Layout,
    meta: { subsystem: 'SBS', breadcrumb: false, whiter: true },
    children: [{
      path: 'list',
      component: () => import('@/components/Typography/Flow/ListBasic'),
      name: 'SBS-Customer',
      meta: {
        subsystem: 'SBS',
        title: '客户信息',
        icon: 'contacts'
      }
    }]
  },
  {
    path: '/sbs/call-log',
    component: Layout,
    redirect: '/sbs/call-log/call-statistics',
    name: 'SBS-CallLOG',
    alwaysShow: true,
    meta: {
      subsystem: 'SBS',
      title: '访问日志',
      icon: 'database'
    },
    children: [
      {
        path: 'call-statistics',
        component: () => import('@/components/Typography/Flow/ListBasic'),
        name: 'SBS-CallStatistics',
        meta: {
          subsystem: 'SBS',
          title: '访问统计',
          icon: 'reconciliation'
        }
      },
      {
        path: 'log-detail',
        component: () => import('@/components/Typography/Flow/ListBasic'),
        name: 'SBS-LogDetail',
        meta: {
          subsystem: 'SBS',
          title: '日志明细',
          icon: 'flag'
        }
      }
    ]
  },
  {
    path: '/sbs/analyze',
    component: Layout,
    meta: { subsystem: 'SBS', breadcrumb: false, whiter: true },
    children: [{
      path: 'request',
      component: () => import('@/components/Typography/Flow/ViewPlane'),
      name: 'SBS-Analyze',
      meta: {
        subsystem: 'SBS',
        title: '分析测算',
        icon: 'monitor'
      }
    }]
  }
]
export default sbsRouters
