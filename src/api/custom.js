/**
 * “客户管理”相关接口
 */
import request from '@/utils/request'

export default {

  queryUser(queryParam) {
    return request({
      url: '/user/list',
      method: 'post',
      data: {
        ...queryParam,
      }
    })
  },


  queryCount(){
    return request({
      url: '/user/count',
      method: 'get'
    })
  },



  updateUser(tempData) {
    return request({
      url: '/user/info',
      method: 'patch',
      data: {
        user: tempData
      }
    })
  },

  deleteUser(data){
    return request({
      url: '/user',
      method: 'delete',
      data
    })
  }
}
