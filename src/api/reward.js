/**
 * “悬赏单管理”相关接口
 */
import request from '@/utils/request'

export default {

  queryReward(queryParam) {
    return request({
      url: '/reward/list',
      method: 'post',
      data: {
        ...queryParam,
      }
    })
  },
  updateReward(data) {
    return request({
      url: '/reward/info',
      method: 'patch',
      data
    })
  },

  deleteUser(data){
    return request({
      url: '/reward',
      method: 'delete',
      data
    })
  }
}
