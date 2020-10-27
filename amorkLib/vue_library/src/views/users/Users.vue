<template>
  <div>
    <!-- 面包屑导航 -->
    {{curUser}}-------
    {{creator}}
    <am-crumbs pre="users" cur="userlist"></am-crumbs>
    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <!-- 搜索&添加区域 -->
      <el-row :gutter="25" v-if="curUser.role == 'manager'">
        <el-col :span="12">
          <el-input
            placeholder="请先勾选查找方式..."
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
          >
            <el-select v-model="selected" slot="prepend" placeholder="查找方式">
              <el-option label="姓名" value="1"></el-option>
              <el-option label="邮箱" value="2"></el-option>
              <el-option label="身份" value="3"></el-option>
            </el-select>
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="findUserList(selected)"
              v-loading="loading"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="info" @click="addDialogVisible=true"
            >ADD</el-button
          >
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <am-table :loading="loading" :tableData="userlist" :total="total" @switch="changeSwitch" @edit="showEditDialog" @remove="removeUserById" @skip='skipToList'></am-table>
    </el-card>
    <!-- 添加区域弹出的对话框 -->
    <el-dialog
      title="Add new user"
      :visible.sync="addDialogVisible"
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
        <el-button type="info" @click="addDialogVisible = false">
          no
        </el-button>
        <el-button type="warning" @click="addUser"> yes </el-button>
      </div>
    </el-dialog>
    <!-- 修改用户信息弹出的对话框 -->
    <el-dialog
      title="Edit info"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef">
        <el-form-item label="Email">
          <el-input v-model="editForm.email" disabled></el-input>
        </el-form-item>
        <el-form-item label="Name" prop="name">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="Role" prop="role">
          <el-input v-model="editForm.role"  :disabled="editForm.name=='amork'? false:true"></el-input>
        </el-form-item>
        <el-form-item label="Identity" prop="identity" required>
          <el-input v-model="editForm.identity"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer"></span>
      <el-button type="info" @click="editDialogVisible = false"> no </el-button>
      <el-button type="warning" @click="editUserInfo()"> yes </el-button>
    </el-dialog>

  </div>
</template>
<script>
import amCrumbs from '../../components/cmps/breadCrumb'
import amTable from '../../components/users/User-table'
// import amAddForm from '../../components/users/User-add'
export default {
  components: { amCrumbs, amTable },
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
      loading: false,
      // 当前用户信息、 创建者信息
      curUser: this.$store.getters.curUser,
      creator: this.$store.getters.creator,
      // 获取用户列表的参数对象
      queryInfo: {
        query: ''
      },
      // 保存请求回来的用户列表数据
      userlist: [],
      total: 0,
      // 控制添加按钮的对话框的显示和隐藏
      addDialogVisible: false,
      // 添加用户的表单验证规则对象
      addFormRules: {
        name: [
          { required: true, message: 'please enter your name ^_^' },
          {
            min: 1,
            max: 10,
            message: 'your name must be 1~10 length ',
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
      },
      
      // 添加用户的表单数据对象
      addForm: {
        name: '',
        password: '',
        email: '',
        identity: '',
        situation: ''
      },
      // 控制编辑按钮的对话框的显示和隐藏
      editDialogVisible: false,
      // 编辑用户的表单数据对象
      editForm: {},
      // 编辑用户的表单验证规则对象
      editFormRules: {
        name: [
          { required: true, message: 'please enter your name ^_^' },
          {
            min: 1,
            max: 10,
            message: 'your name must be 1~10 length ',
            trigger: 'blur'
          }
        ],
        identity: [
          {
            required: false,
            message: 'please enter your identity =_=',
            trigger: 'blur'
          }
        ]
      },
      // 已选中的查询方式
      selected: ''
    }
  },
  created() {
    this.getUserList()
    if (this.creator) {
      this.creator = {}
    }
  },
  methods: {
    // 获取用户列表
    async getUserList() {
      this.loading = true
      const { data: res } = await this.$http.get(
        `users/list/${this.curUser.role}/${this.curUser.id}`
      )
      console.log(res)
      if (res.meta.status !== 200) {
        this.loading = false
        return this.$message.error('没拿到任何信息呀 >_<')
      }
      this.loading = false
      this.userlist = res.data
      this.total = res.data.length
    },
    // 查询用户列表
    async findUserList(selected) {
      if (!this.queryInfo.query) {
        return this.$message.error('请输入要查找的内容')
      }
      this.loading = true
      const { data: res } = await this.$http.get(
        `users/find/${selected}/${this.queryInfo.query}`
      )
      // console.log(res)
      this.loading = false
      if (res.meta.status !== 200) {
        return this.$message.error('没找到任何内容>_<')
      }
      this.userlist = res.data
    },
    // 切换situation状态栏
    async changeSwitch(switchInfo) {
      console.log(switchInfo)
      const { data: res } = await this.$http.put(
        `users/${switchInfo._id}/situation/${switchInfo.situation}`
      )
      // console.log(res)
      if (!res) {
        switchInfo.situation = !switchInfo.situation
        return this.$message.error('状态更新失败 =_=')
      }
      this.$message.success('状态更新成功 *_*')
    },
    // 监听添加对话框的关闭, 关闭后重置表单
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 点击按钮，添加新用户
    addUser(ev) {
      alert(ev)
      // 添加用户之前预验证
      this.$refs.addFormRef.validate(async valid => {
        console.log(valid)
        if (!valid) {
          return this.$message.error('please finish this add user form')
        }
        // 请求接口
        const { data: res } = await this.$http.post('users/add', this.addForm)
        // console.log(res)
        if (res.meta.status !== 200 && res.meta.status !== 401) {
          return this.$message.error('没能查到用户信息>_<!')
        } else if (res.meta.status === 401) {
          return this.$message.error('已注册过的邮箱=_=')
        }
        this.$message.success('成功添加新用户 ^_^!')
        // 添加成功后隐藏对话框
        this.addDialogVisible = false
        // 添加成功后，要刷新用户列表，重新请求最新数据
        this.getUserList()
      })
    },
    // 点击按钮，修改用户
    async showEditDialog(id) {
      this.findDialogVisible = false
      // console.log(id)
      const { data: res } = await this.$http.get('/users/' + id)
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取不到任何信息!!>_<')
      }
      // 获取到的用户对象保存到editForm中
      this.editForm = res.data
      // console.log(this.editForm)
      this.editDialogVisible = true
    },
    // 监听 编辑用户对话框 的 关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 修改用户信息并提交
    editUserInfo() {
      this.$refs.editFormRef.validate(async valid => {
        // console.log(valid)
        if (!valid) return this.$message.error('用户信息编辑失败!!>_<')
        // 发起修改请求
        const { data: res } = await this.$http.put(
          '/users/edit/' + this.editForm._id,
          { name: this.editForm.name, identity: this.editForm.identity, role: this.editForm.role }
        )
        console.log(res)
        // if (res.meta.status !== 200) {
        //   return this.$message.error('没能更新>_<')
        // } else {
        this.editDialogVisible = false
        this.getUserList()
        return this.$message.success('更新成功^_^')
        // }
      })
    },
    // 删除用户
    async removeUserById(_id) {
      // console.log(_id)
      // 弹框提示
      const confirmResult = await this.$confirm(
        '确定要永久删除改用户信息嘛+_+?',
        '警告',
        {
          confirmButtonText: 'Yes',
          cancelButtonText: 'No',
          type: 'warning'
        }
      ).catch(err => err)
      // console.log(confirmResult)
      if (confirmResult !== 'confirm') {
        return this.$message.error('取消删除=_=')
      } else {
        const result = await this.$http.delete('users/delete/' + _id)
        // console.log(result)
        if (result.status !== 200) {
          return this.$message.error('没能删除>_<')
        }
        this.$message.success('成功删除该用户@_@')
        this.getUserList()
      }
    },
    // 点击跳转到图书列表
    async skipToList(row) {
      console.log(row)
      if (row.role === 'manager') { 
        this.$store.dispatch('getCreator', row)
        this.$router.push('/booklist')
      } else {
        const { data: res } = await this.$http.get(`profiles/${row.role}/${row._id}`)
        console.log(res)
        if (res.data.length <= 0) { 
          this.$message.error('该用户还没添加任何图书信息')
          return
        } 
        this.$store.dispatch('getCreator', row)
        this.$router.push('/booklist')
      }
    }

  }
}
</script>
<style lang="less" scoped>
.el-select {
  width: 110px;
}
</style>
