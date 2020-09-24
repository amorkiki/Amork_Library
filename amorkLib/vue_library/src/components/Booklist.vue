<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb
      separator-class="el-icon-arrow-right"
      active-text-color="#a38eaa"
    >
      <el-breadcrumb-item :to="{ path: '/home' }" active-text-color="#a38eaa"
        >home</el-breadcrumb-item
      >
      <el-breadcrumb-item>books</el-breadcrumb-item>
      <el-breadcrumb-item>booklist</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card class="box-card">
      <!-- 搜索&添加区域 -->
      <el-row :gutter="25">
        <el-col :span="12">
          <el-input
            placeholder="请先勾选查找方式..."
            v-model="queryInfo.query"
            clearable
            @clear="getBookList()"
          >
            <el-select v-model="selected" slot="prepend" placeholder="查找方式">
              <el-option label="书名" value="1"></el-option>
              <el-option label="作者" value="2"></el-option>
              <el-option label="类型" value="3"></el-option>
            </el-select>
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="findBookList(selected)"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="info" @click="addDialogVisible = true"
            >ADD</el-button
          >
        </el-col>
      </el-row>
      <!-- 图书列表区域 -->
      <el-table :data="bookList" border style="width: 100%">
        <el-table-column type="index" width="30px"> </el-table-column>
        <el-table-column prop="type" label="Type" width="60px">
        </el-table-column>
        <el-table-column prop="b_name" label="Name"> </el-table-column>
        <el-table-column prop="author" label="Author"> </el-table-column>
        <el-table-column prop="publish" label="Publish"> </el-table-column>
        <el-table-column prop="isbn_num" label="ISBN" width="180px">
        </el-table-column>
        <el-table-column prop="pages" label="PAGES" width="80px">
        </el-table-column>
        <!-- 备注栏 -->
        <el-table-column label="Remark" width="85px"></el-table-column>
        <!-- 操作栏 -->
        <el-table-column label="Control">
          <template slot-scope="scope">
            <el-tooltip
              effect="dark"
              content="edit"
              placement="top"
              :enterable="false"
            >
              <el-button type="text" @click="showEditDialog(scope.row._id)">
                <i
                  class="iconfont icon-customization"
                  style="color: #91ca8d"
                ></i>
              </el-button>
            </el-tooltip>
            <el-tooltip
              effect="dark"
              content="delete"
              placement="top"
              :enterable="false"
              ><el-button type="text" @click="removeBookById(scope.row._id)">
                <i
                  class="iconfont icon-ashbin"
                  style="color: #ea7e53"
                ></i> </el-button
            ></el-tooltip>
            <el-tooltip
              effect="dark"
              content="skip to readingnotes"
              placement="top"
              :enterable="false"
              ><el-button type="text">
                <i
                  class="iconfont icon-attachment"
                  style="color: #7288ac"
                ></i> </el-button
            ></el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加区域弹出的对话框 -->
    <el-dialog
      title="Add new book"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <el-form
        :model="addBookForm"
        :rules="addFormBookRules"
        ref="addBookFormRef"
      >
        <el-form-item label="Book Name" prop="b_name" required>
          <el-input v-model="addBookForm.b_name"></el-input>
        </el-form-item>
        <el-form-item label="Author" prop="author" required>
          <el-input v-model="addBookForm.author"></el-input>
        </el-form-item>
        <el-form-item label="ISBN Code" prop="isbn_num">
          <el-input v-model="addBookForm.isbn_num"></el-input>
        </el-form-item>
        <el-form-item label="Publish Company" prop="publish">
          <el-input v-model="addBookForm.publish"></el-input>
        </el-form-item>
        <el-form-item label="Book Pages" prop="pages">
          <el-input v-model="addBookForm.pages"></el-input>
        </el-form-item>
        <el-form-item label="Book Type" prop="type">
          <!-- 类型区域的级联选择框 -->
          <el-cascader
            v-model="addBookForm.type"
            :options="bookCateList"
            :clearable="true"
            :props="{ expandTrigger: 'hover' }"
            :show-all-levels="false"
          ></el-cascader>
        </el-form-item>
        <!-- <el-form-item label="Reading Status" prop=""></el-form-item> -->
      </el-form>
      <!-- 添加框の底部按钮区域 -->
      <div slot="footer" class="dialog-footer">
        <el-button type="info" @click="addDialogVisible = false">
          no
        </el-button>
        <el-button type="warning" @click="addBook"> yes </el-button>
      </div>
    </el-dialog>
    <!-- 修改弹出的对话框 -->
    <el-dialog
      title="Edit Books"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        :model="editBookForm"
        :rules="editBookFormRules"
        ref="editBookFormRef"
      >
        <el-form-item label="Book Name" prop="b_name">
          <el-input v-model="editBookForm.b_name"></el-input>
        </el-form-item>
        <el-form-item label="Author" prop="author">
          <el-input v-model="editBookForm.author"></el-input>
        </el-form-item>
        <el-form-item label="ISBN Code" prop="isbn_num">
          <el-input v-model="editBookForm.isbn_num"></el-input>
        </el-form-item>
        <el-form-item label="Publish Company" prop="publish">
          <el-input v-model="editBookForm.publish"></el-input>
        </el-form-item>
        <el-form-item label="Pages" prop="pages">
          <el-input v-model="editBookForm.pages"></el-input>
        </el-form-item>
        <el-form-item label="Remark" prop="remark">
          <el-input v-model="editBookForm.remark"></el-input>
        </el-form-item>
        <el-form-item label="Book Type" prop="type">
          <el-cascader
            v-model="editBookForm.type"
            :options="bookCateList"
            :clearable="true"
            :props="{ expandTrigger: 'hover' }"
            :show-all-levels="false"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer"></span>
      <el-button type="info" @click="editDialogVisible = false"> no </el-button>
      <el-button type="warning" @click="editBookInfo()"> yes </el-button>
    </el-dialog>
    <!-- 查询图书信息弹出的对话框 -->
    <el-dialog
      title="Find Books @_@!"
      :visible.sync="findDialogVisible"
      width="90%"
    >
      <el-table :data="findBook" border style="width: 100%">
        <el-table-column type="index" width="30px"> </el-table-column>
        <el-table-column prop="type" label="Type" width="70px">
        </el-table-column>
        <el-table-column prop="b_name" label="Name"> </el-table-column>
        <el-table-column prop="author" label="Author" width="80px">
        </el-table-column>
        <el-table-column prop="publish" label="Publish"> </el-table-column>
        <el-table-column
          prop="isbn_num"
          label="ISBN"
          width="150px"
        ></el-table-column>
        <el-table-column prop="pages" label="PAGES" width="70px">
        </el-table-column>
        <!-- 备注栏 -->
        <el-table-column label="Remark"></el-table-column>
        <!-- 操作栏 -->
        <el-table-column label="Control" width="215px">
          <template slot-scope="scope">
            <el-tooltip
              effect="light"
              content="edit"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="info"
                icon="iconfont icon-customization"
                size="mini"
                @click="showEditDialog(scope.row._id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              effect="dark"
              content="delete"
              placement="top"
              :enterable="false"
              ><el-button
                type="danger"
                icon="iconfont icon-close1"
                size="mini"
                @click="removeBookById(scope.row._id)"
              ></el-button
            ></el-tooltip>
            <el-tooltip
              effect="light"
              content="skip to readingnotes"
              placement="top"
              :enterable="false"
              ><el-button
                type="warning"
                icon="iconfont icon-attachment"
                size="mini"
              ></el-button
            ></el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      // 获取用户列表的参数对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 保存服务器返回的图书列表
      bookList: [],
      total: 0,
      // 进度条
      // percentage: 0,
      // 添加ADD对话框的显示和隐藏
      addDialogVisible: false,
      // 添加book的表单数据对象
      addBookForm: {
        b_name: '',
        author: '',
        isbn_num: '',
        type: '',
        status: '',
        remark: '',
        publish: '',
        pages: 0
      },
      // 添加book的表单数据验证规则
      addFormBookRules: {
        b_name: [
          {
            required: true,
            message: 'please enter book name !^_^',
            trigger: 'blur'
          }
        ],
        author: [
          {
            required: true,
            message: 'who is the author? ?^_^',
            trigger: 'blur'
          }
        ],
        pages: [
          {
            required: true,
            message: 'enter total pages of this book',
            trigger: 'blur'
          }
        ]
      },
      editDialogVisible: false,
      editBookForm: {},
      editBookFormRules: {},
      // 已选中的查询方式
      selected: '',
      // 查询到的图书信息
      findBook: [],
      // 查询对话框的显示和隐藏
      findDialogVisible: false
    }
  },
  created() {
    this.getBookList()
    // this.$store.dispatch('getCategories')
  },
  computed: {
    ...mapState(['bookCateList'])
  },
  methods: {
    // 获取图书列表
    async getBookList() {
      const { data: res } = await this.$http.get('profiles', {
        params: this.queryInfo
      })
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('这里没啥内容@_@')
      }
      this.bookList = res.data
      this.total = res.data.length
      // console.log(this.bookList)
      // console.log(this.total)
    },
    // 查询图书列表
    async findBookList(selected) {
      // console.log(selected)
      if (!this.queryInfo.query) {
        return this.$message.error('请输入要查找的内容')
      }
      const { data: res } = await this.$http.get(
        `profiles/find/${selected}/${this.queryInfo.query}`
      )
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('没找到任何内容>_<')
      }
      this.findBook = res.data
      console.log(this.findBook)
      this.findDialogVisible = true
    },
    // 表单关闭重置
    addDialogClosed() {
      this.$refs.addBookFormRef.resetFields()
    },
    // ADD按钮点击添加book
    addBook() {
      // 添加前预验证
      this.$refs.addBookFormRef.validate(async valid => {
        if (!valid) return this.$message.error('请输入正确的图书信息呦#_#')
        const { data: res } = await this.$http.post(
          'profiles/add',
          this.addBookForm
        )
        // console.log(res)
        if (res.meta.status !== 200 && res.meta.status !== 400) {
          return this.$message.error('添加图书失败>_#')
        } else if (res.meta.status === 401) {
          return this.$message.error('改图书已存在0_0')
        }
        this.$message.success('添加成功!^_^')
        this.addDialogVisible = false
        // 添加成功后，要刷新用户列表，重新请求最新数据
        this.getBookList()
      })
    },
    // 点击修改按钮后弹出对话框
    async showEditDialog(id) {
      this.findDialogVisible = false
      // console.log(id)
      const { data: res } = await this.$http.get('/profiles/' + id)
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取不到任何信息!!>_<')
      }
      // 获取到的用户对象保存到editForm中
      this.editBookForm = res.data
      // console.log(this.editForm)
      this.editDialogVisible = true
    },
    // 修改对话框关闭后重置
    editDialogClosed() {
      this.$refs.editBookFormRef.resetFields()
    },
    // 编辑图书
    editBookInfo() {
      this.$refs.editBookFormRef.validate(async valid => {
        if (!valid) return this.$message.error('请输入符合标准的信息')
        const { data: res } = await this.$http.put(
          '/profiles/edit/' + this.editBookForm._id,
          {
            b_name: this.editBookForm.b_name,
            author: this.editBookForm.author,
            isbn_num: this.editBookForm.isbn_num,
            type: this.editBookForm.type,
            publish: this.editBookForm.publish,
            pages: this.editBookForm.pages
          }
        )
        console.log(res)
        this.editDialogVisible = false
        this.getBookList()
        return this.$message.success('修改成功^_^')
      })
    },
    // 删除图书
    async removeBookById(id) {
      // console.log(id)
      // 弹窗提示
      const confirmResult = await this.$confirm(
        '确定要永久删除这条图书信息嘛+_+?',
        '警告',
        {
          confirmButtonText: 'yes',
          cancelButtonText: 'no',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.error('取消删除=_=')
      } else {
        const res = await this.$http.delete('profiles/delete/' + id)
        console.log(res)
        if (res.status !== 200) {
          return this.$message.error('没能删除>_<')
        }
        this.$message.success('成功删除@_@')
        this.getBookList()
      }
    },
    // 监听 pagesize 改变 的事件
    handleSizeChange(newsize) {
      console.log(newsize)
      this.queryInfo.pagesize = newsize
      this.getBookList()
    },
    // 监听 页码值 改变 的事件
    handleCurrentChange(newpage) {
      console.log(newpage)
      this.queryInfo.pagenum = newpage
      this.getBookList()
    }
  }
}
</script>
<style lang="less" scoped></style>
