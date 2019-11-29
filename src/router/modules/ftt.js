import Layout from '@/views/layout/Layout'

const fttRouters = [
  {
    path: '/ftt/basic-data',
    component: Layout,
    meta: { subsystem: 'FTT_BASIC', breadcrumb: false, whiter: true },
    children: [{
      path: 'tax-type/list',
      component: () => import('@/components/Typography/Flow/ListCategory'),
      name: 'FTT-TaxType',
      meta: {
        subsystem: 'FTT_BASIC',
        title: '税种管理',
        icon: 'fileprotect'
      }
    }]
  }
]
export default fttRouters
