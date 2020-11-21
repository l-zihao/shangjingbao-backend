/**
 * “用户反馈”相关接口
 */
import request from '@/utils/request'

export default {

  queryFeedback(queryParam) {
    return request({
      url: '/feedback/list',
      method: 'post',
      data: {
        ...queryParam,
      }
    })
  },
  queryCount(){
    return request({
      url: '/feedback/count',
      method: 'get'
    })
  },



  updateFeedback(id, status) {
    return request({
      url: '/feedback/info',
      method: 'patch',
      data: {
        id,
        status
      }
    })
  },
  updateAllFeedbackStatus(oldStatus, newStatus) {
    return request({
      url: '/feedback/info/all',
      method: 'patch',
      data: {
        oldStatus,
        newStatus
      }
    })
  }
}
