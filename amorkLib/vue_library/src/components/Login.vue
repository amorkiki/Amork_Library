<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/avatar.jpeg" alt="" />
      </div>
      <!-- 表单区域 -->
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginFormRules"
        label-width="0px"
        class="login_form"
      >
        <!-- 登录名 -->
        <el-form-item prop="email">
          <el-input
            prefix-icon="iconfont icon-bussiness-man"
            v-model="loginForm.email"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            prefix-icon="iconfont icon-password"
            type="password"
            v-model="loginForm.password"
          ></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="login_btns">
          <el-button type="primary" @click="login">login</el-button>
          <el-button type="info" @click="loginFormRef">reset</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 登录表单的数据绑定对象
      loginForm: {
        email: 'admin@123.com',
        password: '123456'
      },
      // 表单验证
      loginFormRules: {
        // 验证用户名
        email: [
          { required: true, message: '请输入登录邮箱', trigger: 'blur' }
          // { min: 3, max: 10, message: '长度范围在3~10个字符', trigger: 'blur' }
        ],
        // 验证密码
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度范围在6~15个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    loginFormRef() {
      console.log(this)
      this.$refs.loginFormRef.resetFields()
    },
    login() {
      this.$refs.loginFormRef.validate(async valid => {
        // console.log(valid)
        if (!valid) return
        const { data: res } = await this.$http.post(
          'users/login',
          this.loginForm
        )
        console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error('哎呀>_<没有登录成功')
        } else {
          this.$message.success('成功登录喽~^_^~')
          // console.log(res)
          window.sessionStorage.setItem('token', res.meta.token)
          // 页面跳转
          this.$router.push('/home')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  height: 100%;
  background: url(../assets/Avril1.jpeg) no-repeat;
  background-size: cover;
}
.login_box {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 450px;
  height: 300px;
  background: #a38eaa;
  border-radius: 15px;
  opacity: 0.95;
}
.avatar_box {
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 130px;
  width: 130px;
  border-radius: 50%;
  border: 1px solid #a38eaa;
  box-shadow: 0 0 3px #eee;
  background: #cbc8df;
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eee;
  }
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 35px;
  box-sizing: border-box;
  margin-top: 10px;
}
.login_btns {
  display: flex;
  justify-content: flex-end;
}
</style>
