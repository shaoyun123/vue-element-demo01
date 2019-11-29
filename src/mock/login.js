import Mock from 'mockjs'
import { getToken } from '@/utils/auth'
import { isEmpty } from '@/utils/validate'

const subsystems = [
  { ID: 'PIT', NAME: '薪资核算' },
  { ID: 'FTT', NAME: '全税种' },
  { ID: 'FTT_BASIC', NAME: '基础数据' },
  { ID: 'FTT_VAT', NAME: '增值税' },
  { ID: 'FTT_CIT', NAME: '企业所得税' },
  { ID: 'SBS', NAME: '市舶司' }
]
const resources = [
  { ID: 'PIT-BasicData', TYPE: 'MENU', SUBSYSTEM_ID: 'PIT' },
  { ID: 'PIT-Enterprise', TYPE: 'MENU', SUBSYSTEM_ID: 'PIT' },
  { ID: 'PIT-Staff', TYPE: 'MENU', SUBSYSTEM_ID: 'PIT' },
  { ID: 'PIT-PayFiducial', TYPE: 'MENU', SUBSYSTEM_ID: 'PIT' },
  { ID: 'PIT-PayRatio', TYPE: 'MENU', SUBSYSTEM_ID: 'PIT' },
  { ID: 'PIT-TaxStair', TYPE: 'MENU', SUBSYSTEM_ID: 'PIT' },
  { ID: 'PIT-AdditionalDeduct', TYPE: 'MENU', SUBSYSTEM_ID: 'PIT' },
  { ID: 'PIT-ChildEducate', TYPE: 'MENU', SUBSYSTEM_ID: 'PIT' },
  { ID: 'PIT-AdultEducate', TYPE: 'MENU', SUBSYSTEM_ID: 'PIT' },
  { ID: 'PIT-HouseLoan', TYPE: 'MENU', SUBSYSTEM_ID: 'PIT' },
  { ID: 'PIT-HouseRent', TYPE: 'MENU', SUBSYSTEM_ID: 'PIT' },
  { ID: 'PIT-SupportAged', TYPE: 'MENU', SUBSYSTEM_ID: 'PIT' },
  { ID: 'PIT-Medical', TYPE: 'MENU', SUBSYSTEM_ID: 'PIT' },
  { ID: 'PIT-Calc', TYPE: 'MENU', SUBSYSTEM_ID: 'PIT' },
  { ID: 'PIT-SalaryGather', TYPE: 'MENU', SUBSYSTEM_ID: 'PIT' },
  { ID: 'PIT-SalaryConfirm', TYPE: 'MENU', SUBSYSTEM_ID: 'PIT' },
  { ID: 'PIT-PayrollConfirm', TYPE: 'MENU', SUBSYSTEM_ID: 'PIT' },
  { ID: 'PIT-PayrollDoubt', TYPE: 'MENU', SUBSYSTEM_ID: 'PIT' },
  { ID: 'PIT-PayrollSubmit', TYPE: 'MENU', SUBSYSTEM_ID: 'PIT' },
  { ID: 'PIT-PayrollFeedback', TYPE: 'MENU', SUBSYSTEM_ID: 'PIT' },
  { ID: 'FTT-BasicData', TYPE: 'MENU', SUBSYSTEM_ID: 'FTT_BASIC' },
  { ID: 'FTT-TaxType', TYPE: 'MENU', SUBSYSTEM_ID: 'FTT_BASIC' },
  { ID: 'SBS-Server', TYPE: 'MENU', SUBSYSTEM_ID: 'SBS' },
  { ID: 'SBS-ServicePackageTemplate', TYPE: 'MENU', SUBSYSTEM_ID: 'SBS' },
  { ID: 'SBS-Customer', TYPE: 'MENU', SUBSYSTEM_ID: 'SBS' },
  { ID: 'SBS-CallLOG', TYPE: 'MENU', SUBSYSTEM_ID: 'SBS' },
  { ID: 'SBS-CallStatistics', TYPE: 'MENU', SUBSYSTEM_ID: 'SBS' },
  { ID: 'SBS-LogDetail', TYPE: 'MENU', SUBSYSTEM_ID: 'SBS' },
  { ID: 'SBS-Analyze', TYPE: 'MENU', SUBSYSTEM_ID: 'SBS' }
]

const users = {
  admin: {
    subsystems,
    roles: [{ ID: 'PIT_ADMIN', NAME: '薪资核算管理员', SUBSYSTEM_ID: 'PIT' }],
    resources,
    id: 'admin',
    name: 'Super Admin',
    introduction: '我是超级管理员',
    avatar: './static/img/smile-fill.png'
  },
  editor: {
    subsystems,
    roles: [{ ID: 'PIT_EDITOR', NAME: '薪资核算编辑员', SUBSYSTEM_ID: 'PIT' }],
    resources: resources.slice(0, 10),
    id: 'editor',
    name: 'Normal Editor',
    introduction: '我是编辑',
    avatar: './static/img/smile-fill.png'
  }
}

const login = config => {
  const { username } = JSON.parse(config.body)
  let logined = true
  let message = ''
  const user = users[username]
  if (isEmpty(user)) {
    logined = false
    message = '用户不存在'
  }
  return {
    logined,
    message,
    token: username
  }
}

const logout = () => {}

const sync = () => {
  const username = getToken()
  return users[username]
}

const changePassword = () => {
  return {
    success: false,
    messages: ['模拟修改密码.开始', '密码修改失败', '模拟修改密码.结束']
  }
}

Mock.mock(/\/jwt\/authorized\/login.api/, 'post', login)
Mock.mock(/\/jwt\/authorized\/logout.api/, 'post', logout)
Mock.mock(/\/jwt\/authorized\/sync.api/, 'post', sync)
Mock.mock(/\/jwt\/authorized\/change-password.api/, 'post', changePassword)
