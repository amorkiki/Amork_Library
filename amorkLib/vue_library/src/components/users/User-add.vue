<template>
  <el-dialog
      title="Add new user"
      :visible.sync="dialogvisible"
      width="50%"
      @close="addDialogClosed"
    >
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef">
        <el-form-item label="Your name" prop="name" required>
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
        <el-form-item label="Your password" prop="password" required>
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="Your email" prop="email" required>
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="Set a role" prop="role" >
          <el-input v-model="addForm.role" placeholder="defalut: common"></el-input>
        </el-form-item>
        <el-form-item label="Your identity" prop="identity">
          <el-input v-model="addForm.identity"></el-input>
        </el-form-item>
      </el-form>
      <!-- 添加框の底部按钮区域 -->
      <div slot="footer" class="dialog-footer">
        <el-button type="info" @click="dialogvisible = false">
          no
        </el-button>
        <el-button type="warning" @click="$emit('add')"> yes </el-button>
      </div>
    </el-dialog>
</template>

<script>
export default {
  props: ['form', 'visible'],
  data() {
    // 验证邮箱的规则
    var checkEmail = (rule, value, callback) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        return callback()
      } else {
        callback(new Error('not a email'))
      }
    }
    return {
      addForm: this.form,
      dialogvisible: this.visible,
      // 添加用户的表单验证规则对象
      addFormRules: {
        name: [
          { required: true, message: 'please enter your name ^_^' },
          {
            min: 3,
            max: 10,
            message: 'your name must be 3~10 length ',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: 'please enter your password @_@' },
          {
            min: 6,
            max: 15,
            message: 'your name must be 6~15 length ',
            trigger: 'blur'
          }
        ],
        email: [
          { required: true, message: 'please enter your email *_*' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        identity: [
          {
            required: false,
            message: 'please enter your identity =_=',
            trigger: 'blur'
          }
        ]
      }
      
    }
  },
  methods: {
    
  }
}
</script>

<style>

</style>