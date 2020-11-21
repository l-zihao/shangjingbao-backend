<template>
  <div class="app-container">
    <!--查询  -->
    <el-row>
      <el-input style="width:200px;" v-model="tableQuery.status" placeholder="昵称"></el-input>
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
      <el-table-column align="center" sortable prop="id" label="id" width="60px"></el-table-column>
      <el-table-column align="center" label="认证图片" width="140px">
        <template slot-scope="scope">
          <div class="demo-image__preview">
            <el-image v-if="scope.row.studentPassPhotoPath!=null" style="width: 100px; height: 100%;"
            :src="getUrl(scope.row.studentPassPhotoPath)"
            :preview-src-list="[getUrl(scope.row.studentPassPhotoPath)]">
            </el-image>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户姓名" width="100px">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.realName!=null" style="margin: 2px;">{{scope.row.realName}}</el-tag>
          <el-tag v-else style="margin: 2px;" type="danger">未知</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="性别" width="80px">
        <template slot-scope="scope">
          <i v-if="scope.row.gender!=0" :class="chooseSex(scope.row.gender)" :style="scope.row.gender == 1 ? 'color: #409EFF;font-size: 30px;' : 'color: #FF88C2;font-size: 30px;'" />
          <el-tag v-else style="margin: 2px;" type="danger">未知</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="联系方式" width="140px">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.phoneNumber != null" style="margin: 2px;" type="success">
            <i class="el-icon-phone-outline"></i>
            {{scope.row.phoneNumber}}
          </el-tag>
          <el-tag v-else style="margin: 2px;" type="danger">未知</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" sortable prop="registerTime" label="注册时间"></el-table-column>
      <el-table-column align="center" label="审核人" width="100px">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.studentConfirmStatus==0" style="margin: 2px;" type="info" effect="plain">未认证</el-tag>
          <el-tag v-else-if="scope.row.studentConfirmStatus==1" style="margin: 2px;" type="" effect="plain">待审核</el-tag>
          <el-tag v-else style="margin: 2px;border-color: #6A6AFF;color: #6A6AFF;" type="success" effect="plain">
            <i class="el-icon-s-custom"></i>
            {{scope.row.reviewer}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" sortable prop="reviewTime" label="审核时间">
        <template slot-scope="scope">
          <span v-if="scope.row.reviewTime==null">无</span>
          <span v-else>{{scope.row.reviewTime}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="审核状态" width="100px">
        <template slot-scope="scope">
          <el-tag style="margin: 2px;" :type="chooseStatusCode(scope.row.studentConfirmStatus)">{{chooseStatus(scope.row.studentConfirmStatus)}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="200" class-name="small-padding">
        <template slot-scope="scope">
          <el-button v-if="scope.row.studentConfirmStatus==2" type="primary" size="mini" @click="handleUpdate(scope.$index,scope.row)">编辑</el-button>
          <el-button v-if="scope.row.studentConfirmStatus==1" size="mini" type="success" @click="handleUpdate(scope.$index,scope.row)">审核
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index,scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-bottom: 30px;"></div>
    <!--分页-->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tablePage.current"
      :page-sizes="[10, 20, 30, 40, 50]" :page-size="tablePage.size" layout="total, sizes, prev, pager, next, jumper"
      :total="tablePage.total">
    </el-pagination>
    <!--弹出窗口：学生认证审核-->
    <el-dialog title="学生认证审核" :visible.sync="dialogFormVisible" width="35%">
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="80px">
        <div class="demo-image__preview" align="center" style="margin-bottom: 30px;">
          <el-image style="width: 400px; height: 100%;" v-model="temp.studentPassPhotoPath" :src="getUrl(temp.studentPassPhotoPath)"
            :preview-src-list="[getUrl(temp.studentPassPhotoPath)]">
          </el-image>
        </div>
        <el-form-item label="学号" prop="studentNumber">
          <el-input v-model="temp.studentNumber"></el-input>
        </el-form-item>

        <el-form-item label="姓名" prop="realName">
          <el-input v-model="temp.realName"></el-input>
        </el-form-item>

        <el-form-item label="专业" prop="major">
          <el-input v-model="temp.major"></el-input>
        </el-form-item>

        <el-form-item label="性别">
          <el-radio v-model="temp.gender" :label="1">男</el-radio>
          <el-radio v-model="temp.gender" :label="2">女</el-radio>
        </el-form-item>

        <el-form-item label="审核结果" v-if="temp.reviewer==null">
          <el-radio v-model="temp.studentConfirmStatus" :label="2">认证通过</el-radio>
          <el-radio v-model="temp.studentConfirmStatus" :label="3">认证失败</el-radio>
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
  import customApi from '@/api/custom'
  import optionApi from '@/api/option'
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

      let validateStudentNumber = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('学号不能为空'));
        } else {
          callback();
        }
      };

      let validateRealName = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('姓名不能为空'));
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
          status: null,
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
          gender: null,
          major: null,
          realName: null,
          studentNumber: null,
          studentConfirmStatus: null,
          reviewer: null,
          reviewTime: null
        },
        rules: {
          studentNumber: [{
            validator: validateStudentNumber,
            trigger: 'blur'
          }],
          realName: [{
            validator: validateRealName,
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
      getUrl(imgUrl){
        if(imgUrl != null){
          if (imgUrl.trim().startsWith("http")) {
            return imgUrl
          } else {
            return process.env.STU_PASS_PHOTO_URL + imgUrl.substring(imgUrl.lastIndexOf("/") + 1)
          }
        }
      },
      chooseSex(gender) {
        if (gender == 1) {
          return 'el-icon-male'
        } else if (gender == 2) {
          return 'el-icon-female'
        }
      },
      chooseStatus(status) {
        switch (status) {
          case 0:
            return '未认证'
            break;
          case 1:
            return '审核中'
            break;
          case 2:
            return '认证通过'
            break;
          case 3:
            return '认证失败'
            break;
          default:
            return '其他'
            break;
        }
      },
      chooseStatusCode(status) {
        switch (status) {
          case 0:
            return 'info'
            break;
          case 1:
            return ''
            break;
          case 2:
            return 'success'
            break;
          case 3:
            return 'danger'
            break;
          default:
            return ''
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
        customApi.queryUser(this.tableQuery).then(res => {
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
        this.dialogFormVisible = true
        this.$nextTick(() => this.$refs['dataForm'].clearValidate())
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (!valid) return
          this.temp.reviewer = this.$store.getters.name
          this.temp.reviewTime = this.CurentTime()
          const tempData = Object.assign({}, this.temp) //copy obj
          console.log(tempData)
          customApi.updateUser(tempData).then(res => {
            this.tableData.splice(tempData.idx, 1, tempData)
            this.dialogFormVisible = false
            this.$message.success("更新成功")
          })
        })
      },

      //删除
      handleDelete(idx, row) {
        this.$confirm('您确定要永久删除该用户？', '提示', confirm).then(() => {
          customApi.deleteUser({
            id: row.id
          }).then(res => {
            this.tableData.splice(idx, 1)
              --this.tablePage.total
            this.dialogFormVisible = false
            this.$message.success("删除成功")
            this.fetchData()
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
      CurentTime() {
        var now = new Date();

        var year = now.getFullYear(); //年
        var month = now.getMonth() + 1; //月
        var day = now.getDate(); //日

        var hh = now.getHours(); //时
        var mm = now.getMinutes(); //分
        var ss = now.getSeconds(); //秒

        var clock = year + "-";

        if (month < 10)
          clock += "0";

        clock += month + "-";

        if (day < 10)
          clock += "0";

        clock += day + " ";

        if (hh < 10)
          clock += "0";

        clock += hh + ":";
        if (mm < 10) clock += '0';
        clock += mm + ":";

        if (ss < 10) clock += '0';
        clock += ss;
        return (clock);
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .role-checkbox {
    margin-left: 0px;
    margin-right: 15px;
  }
</style>
