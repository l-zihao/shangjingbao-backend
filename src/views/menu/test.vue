<template>
  <div class="dashboard-editor-container">
    <div>
      <el-row :gutter="40" class="panel-group">
        <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
          <div class="card-panel" @click="handleSetLineChartData('newVisitis')">
            <div class="card-panel-icon-wrapper icon-people">
              <svg-icon icon-class="peoples" class-name="card-panel-icon" />
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">
                用户总数
              </div>
              <count-to :start-val="0" :end-val="homeData.userCount" :duration="2600" class="card-panel-num" />
            </div>
          </div>
        </el-col>
        <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
          <div class="card-panel" @click="handleSetLineChartData('messages')">
            <div class="card-panel-icon-wrapper icon-message">
              <svg-icon icon-class="message" class-name="card-panel-icon" />
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">
                用户反馈
              </div>
              <count-to :start-val="0" :end-val="homeData.feedbackCount" :duration="3000" class="card-panel-num" />
            </div>
          </div>
        </el-col>
        <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
          <div class="card-panel" @click="handleSetLineChartData('purchases')">
            <div class="card-panel-icon-wrapper icon-order">
              <svg-icon icon-class="form" class-name="card-panel-icon" />
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">
                订单总量
              </div>
              <count-to :start-val="0" :end-val="homeData.orderCount" :duration="3200" class="card-panel-num" />
            </div>
          </div>
        </el-col>
        <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
          <div class="card-panel" @click="handleSetLineChartData('shoppings')">
            <div class="card-panel-icon-wrapper icon-money">
              <svg-icon icon-class="money" class-name="card-panel-icon" />
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">
                总金额
              </div>
              <count-to :start-val="0" :end-val="homeData.moneyTotal" :duration="3600" class="card-panel-num" />
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="container">
      <div v-for="(item, index) in chartList" :key="index" class="charts">
        <component :is="'chart-' + item.chartType" v-loading="loading" :chart-data="item.chartData || {nameList: [], xList: [], dataList: []}"
          :mark-point="item.markPoint" :title="item.title" :x-unit="item.xUnit" :y-unit="item.yUnit" :height="item.height"
          :toolbox-show="item.toolboxShow || false" />
      </div>
    </div>
  </div>
</template>

<script>
  import homeApi from '@/api/home'
  import Line from '@/components/Charts/Line'
  import Bar from '@/components/Charts/Bar'
  import {
    mapGetters
  } from 'vuex'
  import PanThumb from '@/components/PanThumb'
  import CountTo from 'vue-count-to'
  export default {
    name: 'dashboard',
    components: {
      PanThumb,
      CountTo,
      'chart-line': Line,
      'chart-bar': Bar
    },
    data() {
      return {
        loading: false,
        homeData: {},
        chartList: [{
          dataType: 'orderAnalyze',
          title: '近7天用户下单量分析',
          height: '100%',
          chartType: 'line',
          xUnit: '小时',
          yUnit: '单',
          chartData: {
            nameList: [],
            xList: [],
            dataList: []
          }
        }]
      }
    },
    mounted() {
      this.getHomeData()
      this.getCharts()
    },
    methods: {
      handleSetLineChartData(type) {
        this.$emit('handleSetLineChartData', type)
      },
      getHomeData(){
        homeApi.queryHomeData().then(res => {
          if (res.data.succ) {
            console.log(res.data.homeData)
              this.homeData = res.data.homeData
            }
        })
      },
      getCharts() {
        this.loading = true
        homeApi.orderAnalyze({
          days: 7
        }).then(res => {
          this.loading = false
          if (res.data.succ) {
            const data = res.data.chart
            this.chartList.forEach(item => {
              if (item.dataType === 'orderAnalyze') {
                item.chartData = {
                  nameList: data.daysList,
                  xList: data.timeList,
                  dataList: data.dataList
                }
              }
            })
          }
        }).catch(() => {
          this.loading = false
        })
      }
    },
    computed: {
      ...mapGetters([
        'name',
        'nick',
        'avatar',
        'roles',
        'perms',
      ])
    }
  }
</script>

<style scoped lang="scss">
  .dashboard-editor-container {
    min-height: 100vh;
    padding: 10px 20px 0px;
    display: flex;
    flex-direction: column;
  }

  .container {
    display: flex;
    flex-direction: column;
    height: 400px;

    .charts {
      flex: 1;
      margin-bottom: 20px;
      padding: 10px;
      box-shadow: 4px 4px 40px rgba(0, 0, 0, .1);
      border-color: rgba(0, 0, 0, .05);
    }
  }

  .panel-group {
    margin-top: 18px;

    .card-panel-col {
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

  @media (max-width:550px) {
    .card-panel-description {
      display: none;
    }

    .card-panel-icon-wrapper {
      float: none !important;
      width: 100%;
      height: 100%;
      margin: 0 !important;

      .svg-icon {
        display: block;
        margin: 14px auto !important;
        float: none !important;
      }
    }
  }
</style>
