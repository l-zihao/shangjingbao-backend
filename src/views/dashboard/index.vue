<template>
  <div class="dashboard-editor-container">
    <panel-group />
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
  import PanelGroup from './components/PanelGroup'
  import {
    mapGetters
  } from 'vuex'
  import PanThumb from '@/components/PanThumb'
  import CountTo from 'vue-count-to'
  export default {
    name: 'dashboard',
    components: {
      PanelGroup,
      PanThumb,
      'chart-line': Line,
      'chart-bar': Bar
    },
    data() {
      return {
        loading: false,
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
      this.getCharts()
    },
    methods: {
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
    max-height: 100vh;
    padding: 10px 20px 0px;
    display: flex;
    flex-direction: column;
  }

  .container {
    display: flex;
    flex-direction: column;
    height: 350px;

    .charts {
      flex: 1;
      margin-bottom: 20px;
      padding: 10px;
      box-shadow: 4px 4px 40px rgba(0, 0, 0, .1);
      border-color: rgba(0, 0, 0, .05);
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
