<template>
  <div>
    <!--添加按钮  -->
    <el-button type="primary" icon="el-icon-plus" style="margin:10px 0px" @click="showDialog">添加</el-button>
    <el-table :data="list" border stripe>
      <el-table-column type="index"></el-table-column>
      <el-table-column label="用户名" prop="username" width="width"></el-table-column>
      <el-table-column label="用户电话" prop="phone" width="width"></el-table-column>
      <el-table-column label="用名昵称" prop="nickname" width="width"></el-table-column>
      <el-table-column label="操作时间" prop="updateTime" width="width"></el-table-column>
      <el-table-column label="操作" width="250px">
          <template slot-scope="scope">
              <HintButton type="info" size="mini" icon="el-icon-user-solid" title="分配角色"
              @click="showAssignRole(scope.row)"/>
              <el-button type="warning" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)">修改</el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)">删除</el-button>
          </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="margin-top: 20px; textAlign: center"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageNum"
      :page-sizes="[1, 2, 5, 10]"
      :page-size="pageSize"
      :total="total"
      layout=" prev, pager, next, jumper, ->, total, sizes">
    </el-pagination>
    <!-- 添加对话框 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisible" width="45%">
      <el-form :model="addForm" label-width="80px" ref="addForm" :rules="addFormRules">
        <el-form-item label="用户名称" prop="username">
          <el-input v-model="addForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户昵称" prop="nickname">
          <el-input v-model="addForm.nickname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话号码" prop="phone">
          <el-input v-model="addForm.phone" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUserInfo">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改用户对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="80px">
          <el-form-item label="用户名">
              <el-input v-model="editForm.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="用户昵称" prop="nickname">
              <el-input v-model="editForm.nickname"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="phone">
              <el-input v-model="editForm.phone"></el-input>
          </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 设置角色对话框 -->
    <el-dialog title="设置角色" :visible.sync="dialogRoleVisible" :before-close="resetRoleData">
      <el-form label-width="80px">
        <el-form-item label="用户名">
          <el-input disabled :value="user.username"></el-input>
        </el-form-item>

        <el-form-item label="角色列表">
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
          <div style="margin: 15px 0;"></div>
          <el-checkbox-group v-model="userRoleIds" @change="handleCheckedChange">
            <el-checkbox v-for="role in allRoles" :key="role.id" :label="role.id">{{role.name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>

      <div slot="footer">
        <el-button  type="primary" @click="assignRole">保存</el-button>
        <el-button @click="resetRoleData">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    var validateUsername = (rule, value, callback) => {
      var reg = /^[A-Za-z0-9]+$/;
      if (!reg.test(value)) {
        callback(new Error('请输入正确用户名'));
      } else {
        callback();
      }
    }
    var validateNickname = (rule, value, callback) => {
      var reg = /^[\u4e00-\u9fa5]+$/;
      if (!reg.test(value)) {
        callback(new Error('请输入正确昵称'));
      } else {
        callback();
      }
    }
    var validatePhone = (rule, value, callback) => {
            const regPhone = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
            if (!regPhone.test(value)) {
                // 合法的邮箱
                callback(new Error('请输入合法电话'))
            }else {
                callback();
            }
            
        }
    return {
      name:'clientMark',
      pageNum: 1,
      pageSize: 5,
      list: [],
      total: 0,
      addForm: {
        username: '',
        phone: '',
        nickname: ''
      },
      dialogFormVisible: false,
      editDialogVisible: false,
      dialogRoleVisible: false,
      editForm: {},
      user: {},
      allRoles: [], // 所有角色列表
      userRoleIds: [], // 用户的角色ID的列表
      isIndeterminate: false, // 是否是不确定的
      checkAll: false, // 是否全选
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur'},
          { validator: validateUsername, trigger: 'blur' }
        ],
        nickname: [
          { required: true, message: '请输入用户昵称', trigger: 'blur'},
          { validator: validateNickname, trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入电话', trigger: 'blur'},
          { validator: validatePhone, trigger: 'blur' }
        ]
      },
      editFormRules: {
        phone: [
          { required: true, message: '请输入电话', trigger: 'blur'},
          { validator: validatePhone, trigger: 'blur' }
        ],
        nickname: [
          { required: true, message: '请输入用户昵称', trigger: 'blur'},
          { validator: validateNickname, trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.getPageList()
  },
  methods: {
    async getPageList() {
      const {pageNum,pageSize}=this;
      let result= await this.$API.clientMark.reqUserList(pageNum,pageSize)
      if(result.code === 200){
        this.total = parseInt(result.data.total)-1
        this.list = result.data.list.filter(item=>item.username!='admin');
      }
    },
    handleSizeChange(newSize) {
      this.pageSize = newSize;
      this.getPageList();
    },
    handleCurrentChange(newPage) {
      this.pageNum = newPage
      this.getPageList();
    },
    showDialog() {
      this.dialogFormVisible=true
      if(this.$refs.addForm!==undefined){
        this.$refs.addForm.resetFields()
      }
    },
    addUserInfo() {
      this.$refs.addForm.validate(async valid => {
        if (valid) {
          let result= await this.$API.clientMark.addUser(this.addForm)
          if(result.code === 200){
            this.$message.success('新增用户成功')
            this.getPageList();
          }
          this.dialogFormVisible=false
        }
      })
    },
    async showEditDialog(id) {
      let result= await this.$API.clientMark.getUser(id)
      if(result.code===200){
        this.editForm=result.data
      }
      this.editDialogVisible=true
    },
    editUserInfo() {
      this.$refs.editFormRef.validate(async valid => {
        if (valid) {
          
          let result= await this.$API.clientMark.editUser(this.editForm)
          if(result.code === 200){
            this.$message.success('修改用户成功')
            this.getPageList();
          }
          this.editDialogVisible=false
        }
      })
    },
    async removeUserById(id) {
      // 弹框询问用户是否删除数据
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).catch(err => err)
      // 如果用户确认删除，则返回值为字符串 confirm
      // 如果用户取消删除，则返回值为字符串 cancel
      if (confirmResult !== 'confirm') {
          return this.$message.info('已取消删除');
      }
      let result= await this.$API.clientMark.removeUser(id)
      if (result.code === 200) {
          this.$message.success('删除用户成功！');
          this.getPageList();
      }
    },
    showAssignRole(user){
      this.user = user
      this.dialogRoleVisible = true
      this.getRoles()
    },
    async getRoles() {
      const result = await this.$API.clientMark.getRoles(this.user.id)
      const {allRolesList, assignRoles} = result.data
      this.allRoles = allRolesList
      this.userRoleIds = assignRoles.map(item => item.id)
      this.checkAll = allRolesList.length===assignRoles.length
      this.isIndeterminate = assignRoles.length>0 && assignRoles.length<allRolesList.length
    },
    /* 
    全选勾选状态发生改变的监听
    */
    handleCheckAllChange(value) {
      // value 当前勾选状态true/false
      // 如果当前全选, userRoleIds就是所有角色id的数组, 否则是空数组
      this.userRoleIds = value ? this.allRoles.map(item => item.id) : []
      // 如果当前不是全选也不全不选时, 指定为false
      this.isIndeterminate = false
    },
    /* 
    角色列表选中项发生改变的监听
    */
    handleCheckedChange (value) {
      const {userRoleIds, allRoles} = this
      this.checkAll = userRoleIds.length === allRoles.length && allRoles.length>0
      this.isIndeterminate = userRoleIds.length>0 && userRoleIds.length<allRoles.length
    },
    /* 
    请求给用户进行角色授权
    */
    async assignRole () {
      const userId = this.user.id
      const roleIds = this.userRoleIds.join(',')
      const result = await this.$API.clientMark.assignRoles(userId, roleIds)
      if (result.code ===200){
        this.$message.success( '分配角色成功')
        this.resetRoleData()
      }
    },
    /* 
    重置用户角色的数据
    */
    resetRoleData () {
      this.dialogRoleVisible = false
      this.allRoles = []
      this.userRoleIds = []
      this.isIndeterminate = false
      this.checkAll = false
    }
  }
}
</script>

<style>
</style>
