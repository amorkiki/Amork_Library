<template>
  <div>
    <!-- 面包屑导航 -->
    <am-crumbs pre="tracks" cur="reading notes"></am-crumbs>
    <!-- 卡片视图区 -->
    <el-card class="box-card">
      <!-- 搜索&添加区域 -->
      <el-row :gutter="25">
        <el-col :span="12">
          <el-input
            placeholder="searching box..."
            v-model="queryInfo.query"
            clearable
            @clear="getNotesList()"
          >
            <el-select v-model="selected" slot="prepend" placeholder="请选择">
              <el-option label="书名" value="1"></el-option>
              <el-option label="用户" value="2"></el-option>
              <el-option label="创建日期" value="3"></el-option>
            </el-select>
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="findNotesList(selected)"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 日记列表区域 -->
    <am-table :tableData="notesInfo" :total="total" :loading="loading" :curUser="curUser" @delete="delNotes" @edit="editNotes"></am-table>
    </el-card>
    <!-- 修改日记弹出框 -->
    <el-dialog  
      title="Edit Notes"
      :visible.sync="editDialogVisible"
      width="80%"
      @close="editDialogClosed">
      <el-form :model="editInfo" ref="editRef"  :rules="editNotesRules">
      <el-form-item label="Book Name" prop="b_name">
        <el-input v-model="editInfo.b_name" disabled></el-input>
      </el-form-item>
      <el-form-item label="Chaptor" prop="b_chapters">
        <el-input v-model="editInfo.b_chapters" ></el-input>
      </el-form-item>
      <el-form-item label="Short Introduction" prop="intro">
        <el-input v-model="editInfo.intro" ></el-input>
      </el-form-item>
      <el-form-item label="Last updated Date" prop="dateAndTime">
        <el-input v-model="editInfo.dateAndTime" disabled></el-input>
      </el-form-item>
      <el-form-item >
        <quill-editor v-model="editInfo.content" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer"></span>
      <el-button type="info" @click="editDialogVisible = false"> no </el-button>
      <el-button type="warning" @click="editComfirm"> yes </el-button>
    </el-dialog>
  </div>
</template>
<script>
import amCrumbs from '../../components/cmps/breadCrumb'
import amTable from '../../components/tracks/Notes-table'
export default {
  components: { amCrumbs, amTable },
  data() {
    return {
      loading: false,
      curUser: this.$store.getters.curUser,
      curBook: this.$store.getters.curBook,
      // 读书笔记信息
      notesInfo: [],
      total: 0,
      // 获取列表的参数对象
      queryInfo: {
        query: ''
      },
      // 已选中的查询方式
      selected: '',
      editDialogVisible: false,
      editInfo: [],
      editNotesRules: {
        b_chapters: [{ required: true, message: 'write down chaptor ^_^', trigger: 'blur' }],
        intro: [
          { required: true, message: 'write down chaptor ^_^', trigger: 'blur' }, 
          { min: 1, max: 20, message: 'less than 20 words as a short view ' }
        ]
      }
    }
  },
  created() {
    this.getNotesList()
  },
  methods: {
    // 获取笔记列表
    async getNotesList() {
      this.loading = true
      if (!this.curBook.b_name) {
        const res = await this.$http.get(
        `/diaries/${this.curUser.role}/${this.curUser.id} `,
        { params: this.queryInfo }
        )
        console.log(res.data)
        if (res.status !== 200) return this.$message.error('获取列表失败>_<')
        this.loading = false
        this.notesInfo = res.data
        this.total = res.data.length
      } else if (this.curBook.b_name !== 'undefined') {
        const { data: res } = await this.$http(
        `/diaries/find/1/${this.curBook.b_name}`
        )
        // console.log(res)
        this.loading = false
        this.notesInfo = res.data
        this.total = res.data.length
      }
    },
    
    // 查询笔记
    async findNotesList(selected) {
      const { data: res } = await this.$http.get(
        `/diaries/find/${selected}/${this.queryInfo.query}`
      )
      // console.log(res)
      if (res.data.length === 0 || res.meta.status !== 200) {
        this.$message.error('没找到任何内容哦>_<')
        this.notesInfo = res.data
      }
      this.notesInfo = res.data
    },

    // 删除笔记
    async delNotes(id) {
      // console.log(id)
      // 弹窗提示
      const confirmRes = await this.$confirm(
        '确定要永久删除这条信息嘛+_+?',
        '警告',
        {
          confirmButtonText: 'yes',
          cancelButtonText: 'no',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmRes !== 'confirm') {
        return this.$message.error('取消删除=_=')
      } else {
        this.loading = true
        await this.$http.delete('/diaries/delete/' + this.id)
        // console.log(res)
        this.loading = false
        this.$message.success('删除成功>_<')
        this.getNotesList()
      }
    },
    
    // 修改笔记
    editNotes(row) {
      // console.log(row)
      this.editInfo = row
      this.editDialogVisible = true
    },
    async editComfirm() {
      // console.log(this.editInfo)
      const { data: res } = await this.$http.put(`/diaries/edit/${this.editInfo._id}`, {
        b_chapters: this.editInfo.b_chapters,
        intro: this.editInfo.intro,
        content: this.editInfo.content
      })
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error('修改失败啦>_<')
      this.editDialogVisible = false
      this.getNotesList()
      return this.$message.success('更新成功^_^')
    },
    // 修改对话框关闭后重置
    editDialogClosed() {
      this.$refs.editRef.resetFields()
    }
  }
}
</script>
<style lang="less" scoped></style>
