<template>
  <div class="app-container">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-message"></i> 用户反馈信息</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <el-tabs v-model="message" @tab-click="changeData">
        <el-tab-pane :label="`未读消息(${tableCount.unreadCount})`" name="first" @click="fetchData(0)">
          <el-table :data="tableData" :show-header="false" style="width: 100%" v-loading.body="tableLoading">
            <el-table-column>
              <template slot-scope="scope">
                <el-popover trigger="hover" placement="top">
                  <p><i class="el-icon-user" style="color: #409EFF;margin-right: 2px;"/>姓名: {{ scope.row.username }}</p>
                  <p><i class="el-icon-phone-outline" style="color: #409EFF;margin-right: 2px;"/>电话: {{ scope.row.contactInfo }}</p>
                  <div slot="reference" class="name-wrapper">
                    <span class="message-title">{{scope.row.detail}}</span>
                  </div>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column prop="createdTime" width="180"></el-table-column>
            <el-table-column width="120">
              <template slot-scope="scope">
                <el-button size="small" @click="handleStatus(scope.row.id,1)">标为已读</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div style="display: flex;flex-direction: row;position: relative;">
            <div class="handle-row">
              <el-button type="primary" @click="handleAllStatus(0,1)">全部标为已读</el-button>
            </div>
            <el-pagination background layout="prev, pager, next" :page-size="tablePage.size" :total="tablePage.total"
              @current-change="handleUnreadCurrentChange" style="position: absolute;top: 50%;left: 50%;transform: translate(-50%,0);">
            </el-pagination>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="`已读消息(${tableCount.readCount})`" name="second" @click="fetchData(0)">
          <template v-if="message === 'second'">
            <el-table :data="tableData" :show-header="false" style="width: 100%" v-loading.body="tableLoading">
              <el-table-column>
                <template slot-scope="scope">
                  <el-popover trigger="hover" placement="top">
                    <p><i class="el-icon-user" style="color: #409EFF;margin-right: 2px;"/>姓名: {{ scope.row.username }}</p>
                    <p><i class="el-icon-phone-outline" style="color: #409EFF;margin-right: 2px;"/>电话: {{ scope.row.contactInfo }}</p>
                    <div slot="reference" class="name-wrapper">
                      <span class="message-title">{{scope.row.detail}}</span>
                    </div>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column prop="createdTime" width="180"></el-table-column>
              <el-table-column width="120">
                <template slot-scope="scope">
                  <el-button size="small" type="danger" @click="handleStatus(scope.row.id,2)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div style="display: flex;flex-direction: row;position: relative;">
              <div class="handle-row">
                <el-button type="danger" @click="handleAllStatus(1,2)">删除全部</el-button>
              </div>
              <el-pagination background layout="prev, pager, next" :page-size="tablePage.size" :total="tablePage.total"
                @current-change="handleReadCurrentChange" style="position: absolute;top: 50%;left: 50%;transform: translate(-50%,0);">
              </el-pagination>
            </div>
          </template>
        </el-tab-pane>
        <el-tab-pane :label="`回收站(${tableCount.recycleCount})`" name="third">
          <template v-if="message === 'third'">
            <el-table :data="tableData" :show-header="false" style="width: 100%" v-loading.body="tableLoading">
              <el-table-column>
                <template slot-scope="scope">
                  <span class="message-title">{{scope.row.detail}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="createdTime" width="180"></el-table-column>
              <el-table-column width="120">
                <template slot-scope="scope">
                  <el-button size="small" @click="handleStatus(scope.row.id,1)">还原</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div style="display: flex;flex-direction: row;position: relative;">
              <div class="handle-row">
                <el-button type="danger" @click="handleAllStatus(2,1)">清空回收站</el-button>
              </div>
              <el-pagination background layout="prev, pager, next" :page-size="tablePage.size" :total="tablePage.total"
                @current-change="handleRecycleCurrentChange" style="position: absolute;top: 50%;left: 50%;transform: translate(-50%,0);">
              </el-pagination>
            </div>
          </template>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
  import feedbackApi from '@/api/feedback'
  import {
    pageParamNames
  } from '@/utils/constants'
  export default {
    name: 'feadback',
    data() {
      return {
        tableQuery: {
          status: null,
          current: null,
          size: null,
          type: null
        },
        tablePage: {
          current: null,
          pages: null,
          size: null,
          total: null
        },
        tableLoading: false,
        tableData: [],
        tableCount: [],
        message: 'first',
        showHeader: false,
      }
    },
    created() {
      this.fetchData()
      this.fetchCount()
    },
    methods: {
      changeData(tab, event) {
        const type = event.target.getAttribute('id')
        if (this.tableQuery.type != type) {
          this.tableQuery.type = type
          if (type === "tab-first") {
            this.tableQuery.status = 0
            this.tableQuery.current = 1
          } else if (type === "tab-second") {
            this.tableQuery.status = 1
            this.tableQuery.current = 1
          } else {
            this.tableQuery.status = 2
            this.tableQuery.current = 1
          }
          this.fetchData()
        }
      },
      handleStatus(id, status) {
        this.$confirm('是否确定执行此操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          feedbackApi.updateFeedback(id, status).then(res => {
            this.fetchData()
            this.fetchCount()
          })
          this.$message({
            type: 'success',
            message: '成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      },
      handleAllStatus(oldStatus, newStatus) {
        this.$confirm('是否确定执行此操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          feedbackApi.updateAllFeedbackStatus(oldStatus, newStatus).then(res => {
            this.fetchData()
            this.fetchCount()
          })
          this.$message({
            type: 'success',
            message: '成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      },
      //查询
      fetchCount() {
        feedbackApi.queryCount().then(res => {
          this.tableCount = res.data.count
        })
      },
      fetchData() {
        this.tableLoading = true
        feedbackApi.queryFeedback(this.tableQuery).then(res => {
          this.tableData = res.data.page.records
          this.tableLoading = false
          pageParamNames.forEach(name => this.$set(this.tablePage, name, res.data.page[name]))
        })
      },
      handleUnreadCurrentChange(val) {
        this.tableQuery.current = val
        this.tableQuery.status = 0
        this.fetchData();
      },
      handleReadCurrentChange(val) {
        this.tableQuery.current = val
        this.tableQuery.status = 1
        this.fetchData();
      },
      handleRecycleCurrentChange(val) {
        this.tableQuery.current = val
        this.tableQuery.status = 2
        this.fetchData();
      },
    },

    computed: {}
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .container {
    padding: 30px;
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 5px;
    margin-top: 20px;

    .message-title {
      cursor: pointer;
    }

    .handle-row {
      margin-top: 30px;
    }
  }
</style>
