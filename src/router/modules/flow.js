import Layout from '@/views/layout/Layout'

const flowRouters = [
  {
    path: '/sys/flow',
    component: Layout,
    redirect: '/sys/flow/manager/list',
    name: 'SYS-Flow',
    alwaysShow: true,
    meta: {
      subsystem: 'SYS',
      title: '工作流',
      icon: 'database',
      whiter: true
    },
    children: [
      {
        path: 'manager/list',
        component: () => import('@/components/Typography/Flow/ListCategory'),
        name: 'SYS-FlowManager',
        meta: {
          subsystem: 'SYS',
          title: '流程管理',
          icon: 'fileprotect',
          whiter: true
        }
      }
    ]
  }
]
export default flowRouters
