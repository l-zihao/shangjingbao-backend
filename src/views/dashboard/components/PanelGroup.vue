<template>
  <el-row
    :gutter="40"
    class="panel-group"
  >
    <el-col
      v-for="(item, index) in list"
      :key="index"
      :xs="12"
      :sm="12"
      :lg="6"
      class="card-panel-col"
    >
      <div
        class="card-panel"
        @click="handleSetLineChartData('newVisitis')"
      >
        <div :class="'card-panel-icon-wrapper icon-' + item.type">
          <svg-icon :icon-class="item.icon" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            {{ item.title }}
          </div>
          <count-to
            :start-val="0"
            :end-val="item.total"
            :duration="2600"
            class="card-panel-num"
          />
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import homeApi from '@/api/home'
import CountTo from 'vue-count-to'
export default {
  components: {
    CountTo
  },
  data () {
    return {
      list: [
        { title: '用户总数', type: 'people', total: 0, icon: 'peoples' },
        { title: '用户反馈', type: 'message', total: 0, icon: 'message' },
        { title: '订单总量', type: 'order', total: 0, icon: 'form' },
        { title: '总金额', type: 'money', total: 0, icon: 'money' }
      ]
    }
  },
  mounted () {
    this.getHomeData()
  },
  methods: {
    handleSetLineChartData (type) {
      this.$emit('handleSetLineChartData', type)
    },
    getHomeData(){
      homeApi.queryHomeData().then(res => {
        if (res.data.succ) {
           const homeData = res.data.homeData
            this.list[0].total = homeData.userCount
            this.list[1].total = homeData.feedbackCount
            this.list[2].total = homeData.orderCount
            this.list[3].total = homeData.moneyTotal
          }
      })
    },
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.panel-group {
  margin-top: 18px;
  .card-panel-col{
    margin-bottom: 32px;
  }
  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);
    .el-icon{
      font-size: 48px;
    }
    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }
      .icon-people {
          background: #40c9c6;
        }

        .icon-message {
          background: #36a3f7;
        }

        .icon-order {
          background: #f4516c;
        }

        .icon-money {
          background: #FFD700
        }
      }

      .icon-people {
        color: #40c9c6;
      }

      .icon-message {
        color: #36a3f7;
      }

      .icon-order {
        color: #f4516c;
      }

      .icon-money {
        color: #FFD700
      }
    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }
    .card-panel-icon {
      float: left;
      font-size: 48px;
    }
    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;
      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }
      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}
</style>
