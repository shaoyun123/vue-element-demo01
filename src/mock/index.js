import Mock from 'mockjs'
/**
 * mock 与 service 混合
 * 注释掉相应的模块便可关闭其 mock 拦截
 */
import './global-data' // 全局数据
import './login' // 用户认证
import './pit' // 薪资核算
import './ftt' // 全税种
import './sbs' // 市舶司
import './article'
import './remoteSearch'
import './transaction'

// 修复在使用 MockJS 情况下，设置 withCredentials = true，且未被拦截的跨域请求丢失 Cookies 的问题
// https://github.com/nuysoft/Mock/issues/300
Mock.XHR.prototype.proxy_send = Mock.XHR.prototype.send
Mock.XHR.prototype.send = function() {
  if (this.custom.xhr) {
    this.custom.xhr.withCredentials = this.withCredentials || false
  }
  this.proxy_send(...arguments)
}
// Mock.setup({ timeout: '350-600' })

export default Mock
