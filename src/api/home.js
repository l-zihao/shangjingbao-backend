/**
 * “首页数据统计”相关接口
 */
import request from '@/utils/request'

export default {

  orderAnalyze(Param) {
    return request({
      url: '/home/orderAnalyze',
      method: 'post',
      data: {
        ...Param
      }
    })
  },
  
  queryHomeData(){
    return request({
      url: '/home/count',
      method: 'get',
    })
  }
}
