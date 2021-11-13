import axios from 'axios'
import store from '@/store'
// 遇到问题：后端返回的超大数字无法在JS中精确表示
// 解决方案：借助 json-bigint 将超大数字转成字符串即可
import JSONBig from 'json-bigint'
const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/', // 接口基础路径

  // transformResponse 允许自定义原始的响应数据（字符串）
  transformResponse: [function (data) {
    try {
      // 如果转换成功则返回转换的数据结果
      return JSONBig.parse(data)
    } catch (err) {
      // 其他数据的话，直接原样返回
      return data
    }
  }]
})
// axios.defaults.baseURL = 'http://api-toutiao-web.itheima.net'
request.defaults.baseURL = 'http://toutiao-app.itheima.net'
// 请求拦截器
request.interceptors.request.use(function (config) {
  // 请求发起会经过这里
  // config 本次请求的配置对象
  const { user } = store.state
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`
    // console.log(config)
  }
  if (config.url.startsWith('/app')) {
    config.url = config.url.slice(4)
  }
  // console.log(config)
  return config
}, function (error) {
  // 请求出错会经过（还没有发出去）
  return Promise.reject(error)
})
export default request

// request,
