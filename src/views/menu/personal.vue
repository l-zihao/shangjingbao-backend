<template>
  <div class="container">
    <el-card>
      <div slot="header" style="display: flex;flex-direction: row;justify-content: space-between;">
        <span style="display: flex;align-items: center;">用户信息</span>
        <div>
          <el-button style="" type="success" @click="handleRecall()">撤回</el-button>
          <el-button style="" type="primary" @click="submitHandler()">保存</el-button>
        </div>
      </div>
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="账号" required>
              <el-input v-model="form.uname" disabled />
            </el-form-item>
            <el-form-item label="用户姓名" prop="realName">
              <el-input v-model="form.realName" />
            </el-form-item>
            <el-form-item label="昵称" prop="nick">
              <el-input v-model="form.nick" />
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="头像">
              <el-upload ref="upload" :headers="uploadAvatarHeaders" :with-credentials="true" :show-file-list="false"
                :on-change="fileChange" :file-list="fileList" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload"
                action="http://47.103.63.54:4710/api/personal/uploadAvator" class="avatar-uploader">
                <img v-if="form.avator" :src="getAvatar(imgUrl)" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon" />
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="性别" prop="gender">
              <el-radio v-model="form.gender" :label="1">男</el-radio>
              <el-radio v-model="form.gender" :label="0">女</el-radio>
            </el-form-item>
            <el-form-item label="生日">
              <el-date-picker v-model="form.birthday" :picker-options="(time) => { return time.getTime() > Date.now() }"
                align="right" type="date" />
            </el-form-item>
            <el-form-item label="证件号码">
              <el-input v-model="form.idNumber" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="电话">
              <el-input v-model="form.phone" />
            </el-form-item>
            <el-form-item label="住址">
              <el-input v-model="form.address" />
            </el-form-item>
            <el-form-item label="标签">
              <el-input v-model="form.tag" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="用户备注">
              <el-input v-model="form.remark" type="textarea" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
  </div>
</template>

<script>
  import personalApi from '@/api/personal'
  import {
    getToken
  } from '@/utils/auth'
  import {
    mapGetters
  } from 'vuex'
  export default {
    data() {
      return {
        uploadAvatarHeaders: {
          'biu-token': getToken()
        },
        newPath: '',
        imgUrl: '',
        recall: {},
        form: {},
        fileList: [],
        rules: {
          realName: [{
            required: true,
            message: '请输入用户姓名',
            trigger: 'blur'
          }],
          nick: [{
            required: true,
            message: '请输入昵称',
            trigger: 'blur'
          }],
          email: [{
            required: true,
            message: '请输入邮箱',
            trigger: 'blur'
          }],
          gender: [{
            required: true,
            message: '请输入性别',
            trigger: 'blur'
          }],
        },
        depts: [],
        userGroups: [],
        roleGroups: [],
        roles: [],
        password: {
          value: '',
          validator: ''
        },

      }
    },
    computed: {
      ...mapGetters([
        'token'
      ])
    },
    mounted() {
      this.getInfo()
    },
    methods: {
      getAvatar(imgUrl) {
        if (imgUrl.trim().startsWith("/static/")) {
          return imgUrl
        } else if (imgUrl.trim().startsWith("http")) {
          return imgUrl
        } else {
          return process.env.IMG_BASE_URL + imgUrl.substring(imgUrl.lastIndexOf("/") + 1)
        }
      },
      getInfo() {
        personalApi.queryInfo().then(res => {
          this.form = res.data.user
          this.imgUrl = this.form.avator
          this.recall = JSON.parse(JSON.stringify(this.form))
          console.log(this.form)
        })
      },
      fileChange(file, fileList) {
        this.fileList.pop()
        this.fileList.push(file); //上传文件变化时将文件对象push进fileList数组
        console.log(this.fileList)
      },
      handleAvatarSuccess(res, file) {
        this.imgUrl = res.url
        this.newPath = res.newPath
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isPNG = file.type === 'image/png';
        const isGIF = file.type === 'image/gif';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG && !isPNG && !isGIF) {
          this.$message.error('上传头像图片格式错误!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
      submitHandler() {
        this.form.newPath = this.newPath
        personalApi.updateInfo(this.form).then(res => {
          if (res.data.succ) {
            this.recall = JSON.parse(JSON.stringify(this.form))
            this.$message.success('保存成功！');
          } else {
            this.$message.error('保存失败！');
          }
        })
      },
      handleRecall() {
        this.form = JSON.parse(JSON.stringify(this.recall))
        if (this.newPath != this.recall.avator) {
          personalApi.recallAvator({
            newPath: this.newPath
          }).then(res => {
            console.log(res)
            this.imgUrl = res.data.url
          })
        }
      },
    }
  }
</script>

<style lang="scss" scoped>
  .container {
    min-height: 100vh;
    padding: 20px 30px 0px;
    display: flex;
    flex-direction: column;
    margin-bottom: 30px;
  }

  .el-card {
    margin-top: 10px;
  }

  .avatar-uploader {
    /deep/ .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;

      &:hover {
        border-color: #409EFF;
      }

      .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
      }
    }

    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
  }
</style>
