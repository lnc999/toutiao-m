import Vue from 'vue'
import dayjs from 'dayjs'
// 加载中文语言包
import 'dayjs/locale/zh-cn'
// 全局使用
// console.log(dayjs().format('DD/MM/YYYY'))
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.locale('zh-cn')
dayjs.extend(relativeTime)
Vue.filter('relativeTime', value => {
  // console.log(value)
  return dayjs().to(dayjs(value))
})
// console.log(dayjs().to(dayjs('2015')))
