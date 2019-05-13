import Layout from '@/views/layout/Layout'

const pitRouters = [
  {
    path: '/pit/basic-data',
    component: Layout,
    redirect: '/pit/basic-data/enterprise/list', // 设置模块默认跳转页面
    name: 'PIT-BasicData',
    alwaysShow: true,
    meta: {
      subsystem: 'PIT',
      title: '基础数据',
      icon: 'database'
    },
    children: [
      {
        path: 'enterprise/list',
        component: () => import('@/views/pit/basic-data/enterpriseList'),
        name: 'PIT-Enterprise',
        meta: {
          subsystem: 'PIT',
          title: '企业信息',
          icon: 'bank'
        }
      },
      {
        path: 'staff/list',
        component: () => import('@/views/pit/basic-data/staffList'),
        name: 'PIT-Staff',
        meta: {
          subsystem: 'PIT',
          title: '员工信息',
          icon: 'team'
        }
      },
      {
        path: 'pay-fiducial/list',
        component: () => import('@/views/pit/basic-data/payFiducialList'),
        name: 'PIT-PayFiducial',
        meta: {
          subsystem: 'PIT',
          title: '缴纳基数',
          icon: 'border'
        }
      },
      {
        path: 'pay-ratio/list',
        component: () => import('@/views/pit/basic-data/payRatioList'),
        name: 'PIT-PayRatio',
        meta: {
          subsystem: 'PIT',
          title: '缴纳比例',
          icon: 'percentage'
        }
      },
      {
        path: 'tax-stair/list',
        component: () => import('@/views/pit/basic-data/taxStairList'),
        name: 'PIT-TaxStair',
        meta: {
          subsystem: 'PIT',
          title: '所得税预扣率',
          icon: 'export'
        }
      }
    ]
  },
  {
    path: '/pit/additional-deduct',
    component: Layout,
    redirect: '/pit/additional-deduct/child-educate/list',
    name: 'PIT-AdditionalDeduct',
    alwaysShow: true,
    meta: {
      subsystem: 'PIT',
      title: '附加扣除申报',
      icon: 'piechart'
    },
    children: [
      {
        path: 'child-educate/list',
        component: () => import('@/views/pit/additional-deduct/childEducateList'),
        name: 'PIT-ChildEducate',
        meta: {
          subsystem: 'PIT',
          title: '子女教育',
          icon: 'smile'
        }
      },
      {
        path: 'adult-educate/list',
        component: () => import('@/views/pit/additional-deduct/adultEducateList'),
        name: 'PIT-AdultEducate',
        meta: {
          subsystem: 'PIT',
          title: '继续教育',
          icon: 'read'
        }
      },
      {
        path: 'house-loan/list',
        component: () => import('@/views/pit/additional-deduct/houseLoanList'),
        name: 'PIT-HouseLoan',
        meta: {
          subsystem: 'PIT',
          title: '住房贷款利息',
          icon: 'home'
        }
      },
      {
        path: 'house-rent/list',
        component: () => import('@/views/pit/additional-deduct/houseRentList'),
        name: 'PIT-HouseRent',
        meta: {
          subsystem: 'PIT',
          title: '住房租金',
          icon: 'shop'
        }
      },
      {
        path: 'support-aged/list',
        component: () => import('@/views/pit/additional-deduct/supportAgedList'),
        name: 'PIT-SupportAged',
        meta: {
          subsystem: 'PIT',
          title: '赡养老人',
          icon: 'heart'
        }
      },
      {
        path: 'medical/list',
        component: () => import('@/views/pit/additional-deduct/medicalList'),
        name: 'PIT-Medical',
        meta: {
          subsystem: 'PIT',
          title: '大病医疗',
          icon: 'medicinebox'
        }
      }
    ]
  },
  {
    path: '/pit/calc',
    component: Layout,
    redirect: '/pit/calc/salary-gather/list',
    name: 'PIT-Calc',
    alwaysShow: true,
    meta: {
      subsystem: 'PIT',
      title: '薪资核算',
      icon: 'Dollar'
    },
    children: [
      {
        path: 'salary-gather/list',
        component: () => import('@/components/Typography/Flow/ListBasic'),
        // component: () => import('@/views/pit/calc/salaryGatherList'),
        name: 'PIT-SalaryGather',
        meta: {
          subsystem: 'PIT',
          title: '薪酬信息采集',
          icon: 'moneycollect'
        }
      },
      {
        path: 'salary-confirm/list',
        component: () => import('@/components/Typography/Flow/ListBasic'),
        // component: () => import('@/views/pit/calc/salaryConfirmList'),
        name: 'PIT-SalaryConfirm',
        meta: {
          subsystem: 'PIT',
          title: '薪酬信息确认',
          icon: 'propertysafety'
        }
      },
      {
        path: 'payroll-confirm/list',
        component: () => import('@/components/Typography/Flow/ListBasic'),
        // component: () => import('@/views/pit/calc/payrollConfirmList'),
        name: 'PIT-PayrollConfirm',
        meta: {
          subsystem: 'PIT',
          title: '确认工资单',
          icon: 'accountbook'
        }
      },
      {
        path: 'payroll-doubt/list',
        component: () => import('@/components/Typography/Flow/ListBasic'),
        // component: () => import('@/views/pit/calc/payrollDoubtList'),
        name: 'PIT-PayrollDoubt',
        meta: {
          subsystem: 'PIT',
          title: '工资单质疑处理',
          icon: 'alert'
        }
      },
      {
        path: 'payroll-submit/list',
        component: () => import('@/components/Typography/Flow/ListBasic'),
        // component: () => import('@/views/pit/calc/payrollSubmitList'),
        name: 'PIT-PayrollSubmit',
        meta: {
          subsystem: 'PIT',
          title: '提交工资单',
          icon: 'carryout'
        }
      },
      {
        path: 'payroll-feedback/list',
        component: () => import('@/components/Typography/Flow/ListBasic'),
        // component: () => import('@/views/pit/calc/payrollFeedbackList'),
        name: 'PIT-PayrollFeedback',
        meta: {
          subsystem: 'PIT',
          title: '工资单发放反馈',
          icon: 'cloud-sync'
        }
      }
    ]
  }
]
export default pitRouters
