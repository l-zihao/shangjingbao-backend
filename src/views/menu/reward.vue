<template>
  <div class="app-container">
    <!--查询  -->
    <el-row>
      <el-input style="width:200px;" v-model="tableQuery.nick" placeholder="昵称"></el-input>
      <span style="margin-right: 15px;"></span>
      <el-tooltip class="item" content="搜索" placement="top">
        <el-button icon="el-icon-search" circle @click="fetchData(1)" v-perm="'b:user:query'"></el-button>
      </el-tooltip>
    </el-row>
    <div style="margin-bottom: 30px;"></div>
    <div style="margin-bottom: 30px;"></div>
    <!--列表-->
    <el-table style="width: 100%" :data="tableData" v-loading.body="tableLoading" element-loading-text="加载中" border fit
      highlight-current-row>
      <el-table-column align="center" sortable prop="id" label="id" width="80"></el-table-column>
      <el-table-column align="center" label="悬赏类型" width="80">
        <template slot-scope="scope">
          <el-tag :style="scope.row.typeCode!=6 ? '' : 'background-color: #7700BB;border-color: #7700BB;color: #fff;'"
            effect="dark" :type="selectTypeCode(scope.row.typeCode)">
            {{selectType(scope.row.typeCode)}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="悬赏详情">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top" style="display: inline-block;">
            <el-alert type="success" :closable="false" title="悬赏单详情">
              <div style="max-width: 200px;">{{scope.row.detail}}</div>
            </el-alert>
            <div slot="reference">
              <el-tag type="success">悬赏单详情</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="startAddress" label="起始地址"></el-table-column>
      <el-table-column align="center" prop="endAddress" label="终止地址"></el-table-column>
      <el-table-column align="center" sortable prop="requireReceiveTime" label="送达时间" width="101"></el-table-column>
      <el-table-column align="center" label="是否加急" width="80">
        <template slot-scope="scope">
          <el-tag style="margin: 2px;" :type="scope.row.urgent == 1 ? 'danger' : 'info'">{{scope.row.urgent == 1 ? '加急' : '正常'}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="重量范围" width="80">
        <template slot-scope="scope">
          {{selectWeight(scope.row.weightCode)}}
        </template>
      </el-table-column>
      </el-table-column>
      <el-table-column align="center" label="金额" width="100">
        <template slot-scope="scope">
          <el-tag type="warning" effect="plain">
            <svg-icon icon-class="money" class-name="card-panel-icon" />
            {{scope.row.money}}元
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" sortable prop="publishTime" label="发布时间" width="101"></el-table-column>
      <el-table-column align="center" label="接单状态" width="80">
        <template slot-scope="scope">
          <el-tag style="margin: 2px;" :type="selectStatusCode(scope.row.status)">{{selectStatus(scope.row.status)}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-tooltip content="编辑" placement="top">
            <el-button @click="handleUpdate(scope.$index,scope.row)" size="medium" type="info" icon="el-icon-edit"
              circle plain></el-button>
          </el-tooltip>
          <el-tooltip style="margin: 5px 0;" content="删除" placement="top">
            <el-button @click="handleDelete(scope.$index,scope.row)" size="medium" type="danger" icon="el-icon-delete"
              circle plain></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-bottom: 30px;"></div>
    <!--分页-->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tablePage.current"
      :page-sizes="[10, 20, 30, 40, 50]" :page-size="tablePage.size" layout="total, sizes, prev, pager, next, jumper"
      :total="tablePage.total">
    </el-pagination>
    <!--弹出窗口：编辑悬赏单-->
    <el-dialog title="编辑悬赏单" :visible.sync="dialogFormVisible" width="45%">
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="120px">
        <el-form-item label="悬赏类型">
          <el-select v-model="temp.typeCode" placeholder="请选择悬赏类型">
            <el-option label="帮我取" :value="1"></el-option>
            <el-option label="帮我送" :value="2"></el-option>
            <el-option label="帮我买" :value="3"></el-option>
            <el-option label="陪学习" :value="4"></el-option>
            <el-option label="陪我玩" :value="5"></el-option>
            <el-option label="其他" :value="6"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="起始地址" prop="startAddress">
          <el-input v-model="temp.startAddress"></el-input>
        </el-form-item>

        <el-form-item label="终点地址" prop="endAddress">
          <el-input v-model="temp.endAddress"></el-input>
        </el-form-item>

        <el-form-item>
          <div class="block">
              <span class="demonstration">送达时间</span>
              <el-date-picker
                v-model="temp.requireReceiveTime"
                type="datetime"
                placeholder="选择日期时间">
              </el-date-picker>
                <!-- `checked` 为 true 或 false -->
              <el-checkbox style="margin-left: 15px;" v-model="temp.urgent">加急</el-checkbox>
          </div>
        </el-form-item>

        <el-form-item>
          <div>
            <el-select v-model="temp.weightCode" placeholder="请选择重量">
              <el-option label="0-1kg" :value="0"></el-option>
              <el-option label="1-5kg" :value="1"></el-option>
              <el-option label="5-10kg" :value="2"></el-option>
              <el-option label="10kg以上" :value="3"></el-option>
              <el-option label="无" :value="4"></el-option>
            </el-select>
            <el-select style="margin-left: 15px;" v-model="temp.status" placeholder="请选择接单状态">
              <el-option label="待接单" :value="0"></el-option>
              <el-option label="已接单" :value="1"></el-option>
              <el-option label="已送达" :value="2"></el-option>
              <el-option label="已取消" :value="3"></el-option>
            </el-select>
          </div>
        </el-form-item>

        <el-form-item style="width: 200px;" label="金额" prop="money">
          <div style="display: flex;">
            <el-input style="flex-direction: row;" v-model="temp.money"></el-input>
            <span style="margin-left: 5px;">元</span>
          </div>
        </el-form-item>

        <el-form-item label="悬赏单详情">
          <el-input type="textarea" v-model="temp.detail"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="updateData">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import rewardApi from '@/api/reward'
  import optionApi from '@/api/option'
  import userApi from '@/api/user'
  import {
    parseTime,
    resetTemp
  } from '@/utils'
  import {
    root,
    confirm,
    pageParamNames
  } from '@/utils/constants'
  import debounce from 'lodash/debounce'

  export default {

    name: 'Reward',

    data() {

      let validateStartAddress = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('起始地址不能为空'));
        } else {
          callback();
        }
      };

      let validateEndAddress = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('终点地址不能为空'));
        } else {
          callback();
        }
      };

      let validateMoney = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('金额不能为空'));
        } else {
          callback();
        }
      };

      return {
        checked: true,
        visible: false,
        parseTime: parseTime,
        tableLoading: false,
        tableData: [],
        tableQuery: {
          nick: null,
          current: null,
          size: null,
        },
        tablePage: {
          current: null,
          pages: null,
          size: null,
          total: null
        },
        dialogFormVisible: false,
        editRolesDialogVisible: false,
        temp: {
          idx: null, //tableData中的下标
          id: null,
          detail: null,
          endAddress: null,
          genderCode: null,
          money: null,
          requireReceiveTime: null,
          startAddress: null,
          status: null,
          typeCode: null,
          urgent: null,
          weightCode: null
        },
        rules: {
          startAddress: [{
            validator: validateStartAddress,
            trigger: 'blur'
          }],
          endAddress: [{
            validator: validateEndAddress,
            trigger: 'blur'
          }],
          money: [{
            validator: validateMoney,
            trigger: 'blur'
          }]
        },
        checkAll: false,
        isIndeterminate: true,
        //所有角色(管理员除外)
        roleOptions: [],
        roleMap: new Map(),
        // 更新用户的角色的数据
        updateUserRolesData: {
          idx: null,
          uid: null,
          rids: []
        },
      }

    },

    created() {
      this.initData()
      this.fetchData()
    },

    watch: {
      //延时查询
      'tableQuery.nick': debounce(function() {
        this.fetchData()
      }, 500)
    }, //watch

    methods: {
      selectType(type) {
        switch (type) {
          case 1:
            return '帮我取'
            break;
          case 2:
            return '帮我送'
            break;
          case 3:
            return '帮我买'
            break;
          case 4:
            return '陪学习'
            break;
          case 5:
            return '陪我玩'
            break;
          default:
            return '其他'
            break;
        }
      },
      selectTypeCode(type) {
        switch (type) {
          case 0:
            return ''
            break;
          case 1:
            return 'success'
            break;
          case 2:
            return 'info'
            break;
          case 3:
            return 'danger'
            break;
          case 4:
            return 'warning'
            break;
          default:
            return ''
            break;
        }
      },
      selectStatus(status) {
        switch (status) {
          case 0:
            return '待接单'
            break;
          case 1:
            return '已接单'
            break;
          case 2:
            return '已送达'
            break;
          case 3:
            return '已取消'
            break;
          default:
            return '未知'
            break;
        }
      },
      selectStatusCode(status) {
        switch (status) {
          case 0:
            return 'warning'
            break;
          case 1:
            return ''
            break;
          case 2:
            return 'success'
            break;
          case 3:
            return 'info'
            break;
          default:
            return 'danger'
            break;
        }
      },
      selectWeight(weightCode) {
        switch (weightCode) {
          case 0:
            return '0-1kg'
            break;
          case 1:
            return '1-5kg'
            break;
          case 2:
            return '5-10kg'
            break;
          case 3:
            return '10kg以上'
            break;
          default:
            return '无'
            break;
        }
      },

      initData() {
        //所有角色选项
        optionApi.listRoleOptions().then(res => {
          res.data.options.forEach(obj => {
            if (obj.val2 != root.rval) { //排除管理员
              this.roleOptions.push(obj)
              this.roleMap.set(obj.id, obj.val)
            }
          })
        })
      },

      //全选
      handleCheckAllChange(val) {
        let allRids = this.roleOptions.map(role => role.id)
        this.updateUserRolesData.rids = val ? allRids : [];
        this.isIndeterminate = false;
      },

      //分页
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
        this.tableQuery.size = val;
        //this.tablePage.size = val;
        this.fetchData();
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        this.tableQuery.current = val;
        //console.log(this.tablePage.current)
        this.fetchData();
      },

      //查询
      fetchData(current) {
        if (current) {
          this.tablePage.current = current
        }
        this.tableLoading = true
        console.log(this.tablePage)
        rewardApi.queryReward(this.tableQuery).then(res => {
          this.tableData = res.data.page.records
          this.tableLoading = false
          console.log(this.tableData)
          pageParamNames.forEach(name => this.$set(this.tablePage, name, res.data.page[name]))
        })
      },

      //更新
      handleUpdate(idx, row) {
        this.temp = Object.assign({}, row) // copy obj
        this.temp.idx = idx
        if(this.temp.urgent == 1){
          this.temp.urgent = true
        }else{
          this.temp.urgent = false
        }
        this.dialogFormVisible = true
        this.$nextTick(() => this.$refs['dataForm'].clearValidate())
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (!valid) return
          const tempData = Object.assign({}, this.temp) //copy obj
          rewardApi.updateReward(tempData).then(res => {
            this.tableData.splice(tempData.idx, 1, tempData)
            this.dialogFormVisible = false
            this.$message.success("更新成功")
          })
        })
      },

      //删除
      handleDelete(idx, row) {
        this.$confirm('您确定要永久删除该用户？', '提示', confirm).then(() => {
          rewardApi.deleteUser({
            id: row.id
          }).then(res => {
            this.tableData.splice(idx, 1)
              --this.tablePage.total
            this.dialogFormVisible = false
            this.$message.success("删除成功")
            this.fetchData();
          })
        }).catch(() => {
          this.$message.info("已取消删除")
        });

      },

      //新增
      handleCreate() {
        resetTemp(this.temp)
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (!valid) return;
          userApi.addUser(this.temp).then((res) => {
            this.temp.uid = res.data.uid; //后台传回来新增记录的id
            this.temp.created = res.data.created; //后台传回来新增记录的时间
            this.temp.roleList = []
            this.tableData.unshift(Object.assign({}, this.temp))
              ++this.tablePage.total
            this.dialogFormVisible = false
            this.$message.success("添加成功")
          })
        })
      },

    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .role-checkbox {
    margin-left: 0px;
    margin-right: 15px;
  }
</style>
