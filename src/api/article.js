// 获取频道的文章列表
import request from '@/utils/request'

export const getArticles = params => {
  return request({
    url: '/app/v1_1/articles',
    method: 'GET',
    params
  })
}
/**
 * 获取文章详情
 */
export const getArticleById = articleId => {
  return request({
    method: 'GET',
    url: `/app/v1_0/articles/${articleId}`
  })
}
// 添加收藏
export const addCollect = target => {
  return request({
    url: '/app/v1_0/article/collections',
    method: 'POST',
    data: {
      target
    }
  })
}
// 取消收藏
export const deleteCollect = target => {
  return request({
    url: `/app/v1_0/article/collections/${target}`,
    method: 'DELETE'
  })
}
// 点赞
export const addLike = target => {
  return request({
    url: '/app/v1_0/article/likings',
    method: 'POST',
    data: {
      target
    }
  })
}
//  取消点赞
export const deleteLike = target => {
  return request({
    url: `/app/v1_0/article/likings/${target}`,
    method: 'DELETE'
  })
}
