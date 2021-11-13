/**
 * 获取搜索联想建议
 */
import request from '@/utils/request'

export const getSearchSuggestions = q => {
  return request({
    url: '/app/v1_0/suggestion',
    method: 'GET',
    params: {
      q
    }
  })
}
/**
 * 获取搜索结果
 */
export function getSearchResult (params) {
  return request({
    method: 'GET',
    url: '/app/v1_0/search',
    params
  })
}
