import Mock from 'mockjs'

const List = []
const count = 20

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    order_no: '@guid()',
    timestamp: +Mock.Random.date('T'),
    username: '@name()',
    price: '@float(1000, 15000, 0, 2)',
    'status|1': ['success', 'pending']
  }))
}

const transactionAPI = {
  getList: () => {
    return {
      total: List.length,
      items: List
    }
  }
}

// 账单相关
Mock.mock(/\/transaction\/list/, 'get', transactionAPI.getList)
