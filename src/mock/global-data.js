import Mock from 'mockjs'

const getDictList = config => {
  return [
    { type: 'YN', value: 'Y', title: '是' },
    { type: 'YN', value: 'N', title: '否' },
    { type: 'ED', value: 'E', title: '启用' },
    { type: 'ED', value: 'D', title: '停用' },
    { type: 'GENDER', value: 'M', title: '男' },
    { type: 'GENDER', value: 'F', title: '女' },
    { type: 'NATIONALITY', value: '001', title: '中国' },
    { type: 'NATIONALITY', value: '002', title: '中国澳门' },
    { type: 'NATIONALITY', value: '003', title: '中国香港' },
    { type: 'NATIONALITY', value: '004', title: '中国台湾' },
    { type: 'NATIONALITY', value: '005', title: '美国' },
    { type: 'ID_TYPE', value: '01', title: '居民身份证' },
    { type: 'ID_TYPE', value: '02', title: '中国护照' },
    { type: 'ID_TYPE', value: '03', title: '港澳居民来往内地通行证' },
    { type: 'ID_TYPE', value: '04', title: '港澳居民居住证' },
    { type: 'ID_TYPE', value: '05', title: '台湾居民来往内地通行证' },
    { type: 'ID_TYPE', value: '06', title: '台湾居民居住证' },
    { type: 'ID_TYPE', value: '07', title: '外国护照' },
    { type: 'ID_TYPE', value: '08', title: '外国人永久居留身份证' },
    { type: 'ID_TYPE', value: '09', title: '外国人工作许可证（A类）' },
    { type: 'ID_TYPE', value: '10', title: '外国人工作许可证（B类）' },
    { type: 'ID_TYPE', value: '11', title: '外国人工作许可证（C类）' },
    { type: 'ID_TYPE', value: '12', title: '其他个人证件' },
    { type: 'EDUCATION', value: '01', title: '大学专科' },
    { type: 'EDUCATION', value: '02', title: '大学本科' },
    { type: 'EDUCATION', value: '03', title: '硕士研究生' },
    { type: 'EDUCATION', value: '04', title: '博士研究生' },
    { type: 'EDUCATION', value: '05', title: '其他' },
    { type: 'OPERATE_CODE', value: '01', title: '提交' },
    { type: 'OPERATE_CODE', value: '02', title: '打回' },
    { type: 'OPERATE_CODE', value: '03', title: '确认' },
    { type: 'OPERATE_CODE', value: '04', title: '质疑' },
    { type: 'OPERATE_CODE', value: '05', title: '调整' },
    { type: 'OPERATE_CODE', value: '06', title: '不调' },
    { type: 'OPERATE_CODE', value: '07', title: '发放' },
    { type: 'E8E_E_TYPE', value: '01', title: '雇主企业' },
    { type: 'E8E_E_TYPE', value: '02', title: '代理机构' },
    { type: 'S3F_S_STATUS', value: '1', title: '正常' },
    { type: 'S3F_S_STATUS', value: '2', title: '非正常' },
    { type: 'S3F_S_DUTY', value: '1', title: '高层' },
    { type: 'S3F_S_DUTY', value: '2', title: '普通' },
    { type: 'S3F_S_VERIFY_STATUS', value: '1', title: '验证中' },
    { type: 'S3F_S_VERIFY_STATUS', value: '2', title: '验证不通过' },
    { type: 'S3F_S_VERIFY_STATUS', value: '3', title: '验证成功' },
    { type: 'S3F_S_VERIFY_STATUS', value: '4', title: '暂不验证' },
    { type: 'S3F_S_RECORD_STATUS', value: '1', title: '待报送' },
    { type: 'S3F_S_RECORD_STATUS', value: '2', title: '报送成功' },
    { type: 'S3F_S_RECORD_STATUS', value: '3', title: '待反馈' },
    { type: 'S4Y_S_TYPE', value: '01', title: '月薪' },
    { type: 'S4Y_S_TYPE', value: '02', title: '年终奖' },
    { type: 'S4Y_S_PAY_TYPE', value: '01', title: '自缴' },
    { type: 'S4Y_S_PAY_TYPE', value: '02', title: '代缴' },
    { type: 'T1X_S3R_C4G_TSC_INCOME_TYPE', value: '1', title: '工资薪金所得' },
    { type: 'T1X_S3R_C4G_TSC_INCOME_TYPE', value: '2', title: '劳务报酬所得' },
    { type: 'T1X_S3R_C4G_TSC_INCOME_TYPE', value: '3', title: '非居民所得' },
    { type: 'AD_C3D_E5E_ADCE_EDUCATE_STAGE', value: '1', title: '学前教育阶段' },
    { type: 'AD_C3D_E5E_ADCE_EDUCATE_STAGE', value: '2', title: '义务教育' },
    { type: 'AD_C3D_E5E_ADCE_EDUCATE_STAGE', value: '3', title: '高中阶段教育' },
    { type: 'AD_C3D_E5E_ADCE_EDUCATE_STAGE', value: '4', title: '高等教育' },
    { type: 'AD_A3T_E5E_ADAE_EDUCATE_TYPE', value: '1', title: '技能人员职业资格' },
    { type: 'AD_A3T_E5E_ADAE_EDUCATE_TYPE', value: '2', title: '专业技术人员职业资格' },
    { type: 'AD_H3E_L2N_ADHL_CERTIFICATE_TYPE', value: '1', title: '房屋所有权证' },
    { type: 'AD_H3E_L2N_ADHL_CERTIFICATE_TYPE', value: '2', title: '不动产权证' },
    { type: 'AD_H3E_L2N_ADHL_CERTIFICATE_TYPE', value: '3', title: '房屋买卖合同' },
    { type: 'AD_H3E_L2N_ADHL_CERTIFICATE_TYPE', value: '4', title: '房屋预售合同' },
    { type: 'AD_H3E_L2N_ADHL_LOAN_TYPE', value: '1', title: '公积金贷款' },
    { type: 'AD_H3E_L2N_ADHL_LOAN_TYPE', value: '2', title: '商业贷款' },
    { type: 'AD_H3E_R2T_ADHR_LESSOR_TYPE', value: '1', title: '个人' },
    { type: 'AD_H3E_R2T_ADHR_LESSOR_TYPE', value: '2', title: '组织' },
    { type: 'AD_S5T_A2D_ADSA_TAXPAYER_TYPE', value: '1', title: '独生子女' },
    { type: 'AD_S5T_A2D_ADSA_TAXPAYER_TYPE', value: '2', title: '非独生子女' },
    { type: 'AD_S5T_A2D_ADSA_APPORTION_TYPE', value: '1', title: '平均分摊' },
    { type: 'AD_S5T_A2D_ADSA_APPORTION_TYPE', value: '2', title: '赡养人约定分摊' },
    { type: 'AD_S5T_A2D_ADSA_APPORTION_TYPE', value: '3', title: '被赡养人指定分摊' },
    { type: 'AD_S5T_A2D_ADSA_RELATION', value: '1', title: '父亲' },
    { type: 'AD_S5T_A2D_ADSA_RELATION', value: '2', title: '母亲' },
    { type: 'AD_S5T_A2D_ADSA_RELATION', value: '3', title: '其他' },
    { type: 'AD_M5L_ADM_RELATION', value: '1', title: '本人' },
    { type: 'AD_M5L_ADM_RELATION', value: '2', title: '配偶' },
    { type: 'AD_M5L_ADM_RELATION', value: '3', title: '未成年子女' },
    { type: 'S4Y_S7T_SS_FREQ', value: 'M', title: '月' },
    { type: 'S4Y_S7T_SS_FREQ', value: 'Y', title: '年' },
    { type: 'S4Y_S7T_SS_TYPE', value: '01', title: '月薪' },
    { type: 'S4Y_S7T_SS_TYPE', value: '02', title: '年终奖' },
    { type: 'S4Y_S7T_SS_PAY_TYPE', value: '01', title: '自缴' },
    { type: 'S4Y_S7T_SS_PAY_TYPE', value: '02', title: '代缴' },
    { type: 'S4Y_S7T_SS_STATUS', value: '01', title: '待处理' },
    { type: 'S4Y_S7T_SS_STATUS', value: '02', title: '打回' },
    { type: 'S4Y_S7T_SS_STATUS', value: '03', title: '待调整' },
    { type: 'S4Y_S7T_SS_STATUS', value: '04', title: '待确认' },
    { type: 'S4Y_S7T_SS_STATUS', value: '05', title: '调整待确认' },
    { type: 'S4Y_S7T_SS_STATUS', value: '06', title: '已生成' },
    { type: 'S4Y_S7T_SS_VERIFY_STATUS', value: '01', title: '待校验' },
    { type: 'S4Y_S7T_SS_VERIFY_STATUS', value: '02', title: '通过' },
    { type: 'S4Y_S7T_SS_VERIFY_STATUS', value: '03', title: '已处理' },
    { type: 'S4Y_S7T_SS_VERIFY_STATUS', value: '04', title: '预警' },
    { type: 'A8L_D4T_AD_TYPE', value: '001', title: '子女教育' },
    { type: 'A8L_D4T_AD_TYPE', value: '002', title: '继续教育' },
    { type: 'A8L_D4T_AD_TYPE', value: '003', title: '住房贷款利息' },
    { type: 'A8L_D4T_AD_TYPE', value: '004', title: '住房租金' },
    { type: 'A8L_D4T_AD_TYPE', value: '005', title: '赡养老人' },
    { type: 'A8L_D4T_AD_TYPE', value: '006', title: '大病医疗' },
    { type: 'A8L_D4T_S7T_ADS_TYPE', value: '001', title: '子女教育' },
    { type: 'A8L_D4T_S7T_ADS_TYPE', value: '002', title: '继续教育' },
    { type: 'A8L_D4T_S7T_ADS_TYPE', value: '003', title: '住房贷款利息' },
    { type: 'A8L_D4T_S7T_ADS_TYPE', value: '004', title: '住房租金' },
    { type: 'A8L_D4T_S7T_ADS_TYPE', value: '005', title: '赡养老人' },
    { type: 'A8L_D4T_S7T_ADS_TYPE', value: '006', title: '大病医疗' },
    { type: 'A8L_D4T_S7T_ADS_VERIFY_STATUS', value: '01', title: '待校验' },
    { type: 'A8L_D4T_S7T_ADS_VERIFY_STATUS', value: '02', title: '通过' },
    { type: 'A8L_D4T_S7T_ADS_VERIFY_STATUS', value: '03', title: '已处理' },
    { type: 'A8L_D4T_S7T_ADS_VERIFY_STATUS', value: '04', title: '预警' },
    { type: 'V4Y_R4T_VR_STATUS', value: '01', title: '通过' },
    { type: 'V4Y_R4T_VR_STATUS', value: '02', title: '未通过' },
    { type: 'V4Y_R4T_VR_STATUS', value: '03', title: '已处理' },
    { type: 'P5L_P_FREQ', value: 'M', title: '月' },
    { type: 'P5L_P_FREQ', value: 'Y', title: '年' },
    { type: 'P5L_P_STATUS', value: '01', title: '待处理' },
    { type: 'P5L_P_STATUS', value: '02', title: '已调整' },
    { type: 'P5L_P_STATUS', value: '03', title: '打回' },
    { type: 'P5L_P_STATUS', value: '04', title: '质疑' },
    { type: 'P5L_P_STATUS', value: '05', title: '待调整' },
    { type: 'P5L_P_STATUS', value: '06', title: '不调整' },
    { type: 'P5L_P_STATUS', value: '07', title: '已确认' },
    { type: 'P5L_P_STATUS', value: '08', title: '待发放' },
    { type: 'P5L_P_STATUS', value: '09', title: '已发放' }
  ]
}

const getDistrictList = config => {
  return [
    {
      value: '001',
      label: '北京市',
      children: [
        { value: '001001', label: '北京市' }
      ]
    },
    {
      value: '002',
      label: '上海市',
      children: [
        { value: '002001', label: '上海市' }
      ]
    },
    {
      value: '003',
      label: '天津市',
      children: [
        { value: '003001', label: '天津市' }
      ]
    },
    {
      value: '004',
      label: '重庆市',
      children: [
        { value: '004001', label: '重庆市' }
      ]
    },
    {
      value: '005',
      label: '陕西省',
      children: [
        { value: '005001', label: '西安' },
        { value: '005002', label: '宝鸡' },
        { value: '005003', label: '咸阳' },
        { value: '005004', label: '渭南' },
        { value: '005005', label: '铜川' },
        { value: '005006', label: '延安' },
        { value: '005007', label: '榆林' },
        { value: '005008', label: '汉中' },
        { value: '005009', label: '安康' },
        { value: '005010', label: '商洛' }
      ]
    }
  ]
}

Mock.mock(/\/global-data\/dict\/list/, 'post', getDictList)
Mock.mock(/\/global-data\/district\/list/, 'post', getDistrictList)
