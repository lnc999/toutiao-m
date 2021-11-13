// 引入请求基础默认头
import request from '@/utils/request'
// import store from '../store'
// 用户认证
export const login = data => {
  return request({
    url: '/app/v1_0/authorizations',
    method: 'POST',
    data
  })
}
// 发送验证码
export const sendCode = mobile => {
  return request({
    url: `/app/v1_0/sms/codes/${mobile}`,
    method: 'GET'
  })
}
// 获取用户自己的信息
export const getUserInfo = () => {
  return request({
    url: '/app/v1_0/user',
    method: 'GET'
    // Headers: {
    //   Authorization: `Bearer ${store.state.user.token}`
    // }
  })
}
// 获取用户的频道信息
export const getUserChannels = () => {
  return request({
    url: '/app/v1_0/user/channels',
    method: 'GET'
    // Headers: {
    //   Authorization: `Bearer ${store.state.user.token}`
    // }
  })
}
// 关注用户
export const addFollow = target => {
  return request({
    url: '/app/v1_0/user/followings',
    method: 'POST',
    // Headers: {
    //   Authorization: `Bearer ${store.state.user.token}`
    // }
    data: {
      target
    }
  })
}

// 取消关注用户
export const deleteFollow = target => {
  return request({
    url: `/app/v1_0/user/followings/${target}`,
    method: 'DELETE'
  })
}
// 获取用户个人资料
export const getUserProfile = () => {
  return request({
    url: '/app/v1_0/user/profile',
    method: 'GET'
  })
}
// 编辑用户个人资料
export const updateUserProfile = data => {
  return request({
    url: '/app/v1_0/user/profile',
    method: 'PATCH',
    data
  })
}
// 编辑用户照片资料
export const updateUserPhoto = data => {
  return request({
    url: '/app/v1_0/user/photo',
    method: 'PATCH',
    data
  })
}
