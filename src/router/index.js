import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login')
  },
  {
    path: '/',
    // name: 'layout', // 如果父路由有默认子路由，父路由的name没有意义，可以不要
    component: () => import('@/views/layout'),
    children: [
      {
        path: '', // 设置为空默认来这
        name: 'home',
        component: () => import('@/views/home')
      },
      {
        path: '/qa',
        name: 'qa',
        component: () => import('@/views/qa')
      },
      {
        path: '/video',
        name: 'video',
        component: () => import('@/views/video')
      },
      {
        path: '/my',
        name: 'my',
        component: () => import('@/views/my')
      }
    ]
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('@/views/search')
  },
  {
    path: '/article/:articleId',
    name: 'article',
    component: () => import('@/views/article'),
    // // 将路由动态参数映射到组件的 props 中，更推荐这种做法
    props: true
  },
  {
    path: '/user-profile',
    name: 'user-profile',
    component: () => import('@/views/user-profile'),
    // // 将路由动态参数映射到组件的 props 中，更推荐这种做法
    props: true
  }
]

const router = new VueRouter({
  routes
})

export default router
