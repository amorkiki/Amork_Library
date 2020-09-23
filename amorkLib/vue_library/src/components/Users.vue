<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" active-text-color="#a38eaa">
      <el-breadcrumb-item :to="{ path: '/home' }" active-text-color="#a38eaa">home</el-breadcrumb-item>
      <el-breadcrumb-item>users</el-breadcrumb-item>
      <el-breadcrumb-item>userlist</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <!-- 搜索&添加区域 -->
      <el-row :gutter="25">
        <el-col :span="12">
          <el-input placeholder="请先勾选查找方式..." v-model="queryInfo.query" clearable @clear="getUserList">
            <el-select v-model="selected" slot="prepend" placeholder="查找方式">
              <el-option label="姓名" value="1"></el-option>
              <el-option label="邮箱" value="2"></el-option>
              <el-option label="身份" value="3"></el-option>
            </el-select>
            <el-button slot="append" icon="el-icon-search" @click="findUserList(selected)"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="info" @click="addDialogVisible = true">ADD</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="userlist" :row-class-name="tableRowClassName">
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="name" label="NAME"> </el-table-column>
        <el-table-column prop="email" label="EMAIL"> </el-table-column>
        <el-table-column prop="identity" label="IDENTITY"> </el-table-column>
        <!-- 状态栏 -->
        <el-table-column label="STATUS">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.situation" @change="changeSwitch(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <!-- 操作栏 -->
        <el-table-column label="CONTROL">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="edit" placement="top" :enterable="false">
              <el-button type="text" @click="showEditDialog(scope.row._id)">
                <i class="iconfont icon-editor" style="color: #91ca8d"></i>
              </el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="delete" placement="top" :enterable="false">
              <el-button type="text" @click="removeUserById(scope.row._id)"> <i class="iconfont icon-ashbin" style="color: #ea7e53"></i> </el-button
            ></el-tooltip>
            <el-tooltip effect="dark" content="skip to booklist" placement="top" :enterable="false"
              ><el-button type="text"> <i class="iconfont icon-Moneymanagement" style="color: #7288ac"></i> </el-button
            ></el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <!-- <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="1"
        :page-sizes="[1, 5, 10]"
        page-size="8"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination> -->
    </el-card>
    <!-- 添加区域弹出的对话框 -->
    <el-dialog title="Add new user" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
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
        <el-form-item label="Your identity" prop="identity">
          <el-input v-model="addForm.identity"></el-input>
        </el-form-item>
      </el-form>
      <!-- 添加框の底部按钮区域 -->
      <div slot="footer" class="dialog-footer">
        <el-button type="info" @click="addDialogVisible = false"> no </el-button>
        <el-button type="warning" @click="addUser"> yes </el-button>
      </div>
    </el-dialog>
    <!-- 修改用户信息弹出的对话框 -->
    <el-dialog title="Edit info" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef">
        <el-form-item label="Email">
          <el-input v-model="editForm.email" disabled></el-input>
        </el-form-item>
        <el-form-item label="Name" prop="name">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="Identity" prop="identity" required>
          <el-input v-model="editForm.identity"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer"></span>
      <el-button type="info" @click="editDialogVisible = false"> no </el-button>
      <el-button type="warning" @click="editUserInfo()"> yes </el-button>
    </el-dialog>
    <!-- 查询图书信息弹出的对话框 -->
    <el-dialog title="Find Users +_+!" :visible.sync="findDialogVisible" width="90%">
      <el-table :data="findUser">
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="name" label="NAME"> </el-table-column>
        <el-table-column prop="email" label="EMAIL"> </el-table-column>
        <el-table-column prop="identity" label="IDENTITY"> </el-table-column>
        <!-- 状态栏 -->
        <el-table-column label="STATUS">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.situation" @change="changeSwitch(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <!-- 操作栏 -->
        <el-table-column label="CONTROL">
          <template slot-scope="scope">
            <el-tooltip effect="light" content="edit" place ment="top" :enterable="false">
              <el-button type="info" icon="iconfont icon-editor" size="mini" @click="showEditDialog(scope.row._id)"></el-button>
            </el-tooltip>
            <el-tooltip effect="dark" content="delete" placement="top" :enterable="false"
              ><el-button type="danger" icon="iconfont icon-ashbin" size="mini" @click="removeUserById(scope.row._id)"></el-button
            ></el-tooltip>
            <el-tooltip effect="light" content="skip to booklist" placement="top" :enterable="false"
              ><el-button type="warning" icon="iconfont icon-Moneymanagement" size="mini"></el-button
            ></el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
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
      // 获取用户列表的参数对象
      queryInfo: {
        query: ''
      },
      // 保存请求回来的用户列表数据
      userlist: [],
      total: 0,
      // 控制添加按钮的对话框的显示和隐藏
      addDialogVisible: false,
      // 添加用户的表单数据对象
      addForm: {
        name: '',
        password: '',
        email: '',
        identity: '',
        situation: ''
      },
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
            min: 3,
            max: 10,
            message: 'your name must be 3~10 length ',
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
      selected: '',
      // 查询到的用户信息
      findUser: [],
      // 查询对话框的显示和隐藏
      findDialogVisible: false
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    // 获取用户列表
    async getUserList () {
      const { data: res } = await this.$http.get('users/list')
      // console.log(res)
      if (!res) return this.$message.error('没拿到任何信息呀 >_<')
      this.userlist = res
      this.total = res.length
      // console.log(this.userlist)
      // console.log(this.total)
    },
    // 查询用户列表
    async findUserList (selected) {
      if (!this.queryInfo.query) {
        return this.$message.error('请输入要查找的内容')
      }
      const { data: res } = await this.$http.get(
        `users/find/${selected}/${this.queryInfo.query}`
      )
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('没找到任何内容>_<')
      }
      this.findUser = res.data
      console.log(this.findUser)
      this.findDialogVisible = true
    },
    // 表格状态颜色
    tableRowClassName ({ row, rowIndex }) {
      if (rowIndex === 0) {
        return 'success-row'
      } else if (rowIndex === 4) {
        return 'warning-row'
      }
      return ''
    },
    // 切换situation状态栏
    async changeSwitch (switchInfo) {
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
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    // 点击按钮，添加新用户
    addUser () {
      // 添加用户之前预验证
      this.$refs.addFormRef.validate(async valid => {
        // console.log(valid)
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
    async showEditDialog (id) {
      this.findDialogVisible = false
      // console.log(id)
      const { data: res } = await this.$http.get('/users/' + id)
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取不到任何信息!!>_<')
      }
      // 获取到的用户对象保存到editForm中
      this.editForm = res.data
      // console.log(this.editForm)
      this.editDialogVisible = true
    },
    // 监听 编辑用户对话框 的 关闭事件
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    // 修改用户信息并提交
    editUserInfo () {
      this.$refs.editFormRef.validate(async valid => {
        // console.log(valid)
        if (!valid) return this.$message.error('用户信息编辑失败!!>_<')
        // 发起修改请求
        const { data: res } = await this.$http.put(
          '/users/edit/' + this.editForm._id,
          { name: this.editForm.name, identity: this.editForm.identity }
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
    async removeUserById (_id) {
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
    }
  }
}
</script>
<style lang="less" scoped>
.el-select {
  width: 110px;
}
</style>
