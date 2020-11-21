<template>
  <div class="dashboard-editor-container">
    <div class="clearfix">
      <div style="display: flex;flex-direction: row;width: 610px;height: 180px;border: 1px solid #EBEEF5;background-color: #FFF;box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);border-radius: 4px;transition: .3s;padding: 10px 0 10px 10px;">
        <div class="pan-item">
          <div class="pan-info"></div>
          <img class="pan-thumb" :src="avatar">
        </div>
        <div class="info-container">
          <!--<span class="display_name">{{nick}}</span>-->
          <div style="font-size: 38px;line-height: 38px;color: #212121;padding-top: 15px;">
            {{nick}}
          </div>
          <div>
            <span style="font-size:20px;padding-top:20px;display:inline-block;">角色：</span>
            <el-tag style="margin-right: 5px;" type="danger" v-if="roles.length==0">游客（未配置任何角色）</el-tag>
            <el-tag style="margin-right: 5px;" type="success" v-else v-for="r in roles" :key="r.val">{{r.name}}</el-tag>
          </div>
          <div>
            <span style="font-size:20px;padding-top:20px;display:inline-block;">权限：</span>
            <el-tag style="margin-right: 5px;" type="danger" v-if="perms.length==0">未配置任何权限</el-tag>
            <el-tag style="margin-right: 5px;" type="info" v-else v-for="r in perms" :key="r.val">{{r.name}}</el-tag>
          </div>
        </div>
      </div>
      <div class="card">
        <el-row :gutter="40" class="panel-group">
          <el-col :xs="12" :sm="12" :lg="7" class="card-panel-col">
            <div class="card-panel" @click="handleSetLineChartData('newVisitis')">
              <div class="card-panel-icon-wrapper icon-people">
                <svg-icon icon-class="peoples" class-name="card-panel-icon" />
              </div>
              <div class="card-panel-description">
                <div class="card-panel-text">
                  New Visits
                </div>
                <count-to :start-val="0" :end-val="102400" :duration="2600" class="card-panel-num" />
              </div>
            </div>
          </el-col>
          <el-col :xs="12" :sm="12" :lg="7" class="card-panel-col">
            <div class="card-panel" @click="handleSetLineChartData('messages')">
              <div class="card-panel-icon-wrapper icon-message">
                <svg-icon icon-class="message" class-name="card-panel-icon" />
              </div>
              <div class="card-panel-description">
                <div class="card-panel-text">
                  Messages
                </div>
                <count-to :start-val="0" :end-val="81212" :duration="3000" class="card-panel-num" />
              </div>
            </div>
          </el-col>
          <el-col :xs="12" :sm="12" :lg="7" class="card-panel-col">
            <div class="card-panel" @click="handleSetLineChartData('purchases')">
              <div class="card-panel-icon-wrapper icon-money">
                <svg-icon icon-class="money" class-name="card-panel-icon" />
              </div>
              <div class="card-panel-description">
                <div class="card-panel-text">
                  Purchases
                </div>
                <count-to :start-val="0" :end-val="9280" :duration="3200" class="card-panel-num" />
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>


<script>
  import {
    mapGetters
  } from 'vuex'
  import PanThumb from '@/components/PanThumb'
  import CountTo from 'vue-count-to'
  export default {
    name: 'dashboard',
    components: {
      PanThumb,
      CountTo
    },
    data() {
      return {

      }
    },
    methods: {
      handleSetLineChartData(type) {
        this.$emit('handleSetLineChartData', type)
      }
    },
    computed: {
      ...mapGetters([
        'name',
        'nick',
        'avatar',
        'roles',
        'perms'
      ])
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .clearfix {
    display: flex;
    flex-direction: row;
  }

  .card {
    width: 100%;
    height: 100%;
    margin-left: auto;
  }

  .pan-info {
    position: absolute;
    width: inherit;
    height: inherit;
    border-radius: 50%;
    overflow: hidden;
    box-shadow: inset 0 0 0 5px rgba(0, 0, 0, 0.05);
  }

  .pan-item {
    float: left;
    z-index: 1;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    display: inline-block;
    position: relative;
    cursor: default;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  }

  .pan-thumb {
    width: 100%;
    height: 100%;
    background-size: 100%;
    border-radius: 50%;
    overflow: hidden;
    position: absolute;
    transform-origin: 95% 40%;
    transition: all 0.3s ease-in-out;
  }

  .emptyGif {
    display: block;
    width: 45%;
    margin: 0 auto;
  }

  .dashboard-editor-container {
    background-color: #F2F6FC;
    min-height: 100vh;
    padding: 40px 30px 0px;

    .pan-info-roles {
      font-size: 12px;
      font-weight: 700;
      color: #333;
      display: block;
    }

    .info-container {
      position: relative;
      margin-left: 20px;
      height: 80px;
      width: 100%;

      /*line-height: 80px;*/
      .display_name {
        font-size: 38px;
        line-height: 38px;
        color: #212121;
        position: absolute;
        top: 25px;
      }
    }
  }

  .panel-group {
    margin-top: 18px;
    display: flex;
    flex-direction: row-reverse;

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

        .icon-money {
          background: #f4516c;
        }

        .icon-shopping {
          background: #34bfa3
        }
      }

      .icon-people {
        color: #40c9c6;
      }

      .icon-message {
        color: #36a3f7;
      }

      .icon-money {
        color: #f4516c;
      }

      .icon-shopping {
        color: #34bfa3
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
