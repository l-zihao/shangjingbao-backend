<template>
  <div class="container">
    <div class="header">
      <div style="font-size: 30px;">单号:{{pageName}}</div>
      <div style="margin-right: 50px;">
        <el-button>1</el-button>
        <el-button>2</el-button>
      </div>
    </div>
    <div style="display: flex;flex-direction: row;">
      <div style="display: flex;flex-direction: column;margin: 10px 100px 10px 0;">
        <span style="margin: 5px 0;">创建人曲丽丽</span>
        <span style="margin: 5px 0;">创建时间2017-07-07</span>
        <span style="margin: 5px 0;">生效日期2017-07-07 ~ 2017-08-08</span>
      </div>
      <div style="display: flex;flex-direction: column;margin: 10px auto 10px 0;">
        <span style="margin: 5px 0;">订购产品XX 服务</span>
        <span style="margin: 5px 0;">关联单据12421</span>
        <span style="margin: 5px 0;">备注请于两个工作日内确认</span>
      </div>
      <div style="display: flex;flex-direction: row;margin: 10px 100px 10px 0;">
        <div style="display: flex;flex-direction: column;margin: 0 50px;">
          <span style="margin: 5px 0;">状态</span>
          <span style="margin: 5px 0;font-size: 30px;">待审批</span>
        </div>
        <div style="display: flex;flex-direction: column;">
          <span style="margin: 5px 0;">订单金额</span>
          <span style="margin: 5px 0;font-size: 30px;">¥568.08</span>
        </div>
      </div>
    </div>
    <div style="">
      <el-steps align-center="true" :space="200" :active="1" finish-status="success" style="width: 500px;padding: 20px 0;">
        <el-step title="已完成"></el-step>
        <el-step title="进行中"></el-step>
        <el-step title="步骤 3"></el-step>
      </el-steps>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Menu3_2',
    data() {
      return {
        pageName: '菜单3-2'
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .container {
    padding: 20px 30px 0px;
  }

  .header {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
  }
</style>
 