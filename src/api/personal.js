/**
 * “个人中心”相关接口
 */
import request from '@/utils/request'

export default {

  queryInfo() {
    return request({
      url: '/personal/info',
      method: 'get'
    })
  },

  updateInfo(data) {
    return request({
      url: '/personal/info',
      method: 'patch',
      data
    })
  },

  recallAvator(data) {
    return request({
      url: '/personal/recallAvator',
      method: 'patch',
      data:{
        ...data
      }
    })
  }
}
