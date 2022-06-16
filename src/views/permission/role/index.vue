<template>
  <div>
        <!--添加按钮  -->
        <el-button type="primary" icon="el-icon-plus" style="margin:10px 0px" @click="showDialog">添加</el-button>
        <el-table :data="list" border stripe>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="角色名" prop="name" width="width"></el-table-column>
            <el-table-column label="操作" width="250px">
                <template slot-scope="scope">
                    <HintButton size="mini" type="info" icon="el-icon-info" title="分配权限"
                    @click="$router.push(`/permission/auth/${scope.row.id}?roleName=${scope.row.key}`)"/>
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeRole(scope.row.id)">删除</el-button>
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

        <el-dialog title="添加角色" :visible.sync="dialogFormVisible" width="45%">
            <el-form :model="addForm" label-width="80px" ref="addForm" :rules="addFormRules">
                <el-form-item label="角色名称" prop="name">
                <el-input v-model="addForm.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="角色标识" prop="key">
                <el-input v-model="addForm.key" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addRoleInfo">确 定</el-button>
            </div>
        </el-dialog>
  </div>
</template>

<script>
export default {
    name: 'roleManage',
    data() {
        return {
            list: [],
            total: 0,
            pageNum: 1,
            pageSize: 5,
            dialogFormVisible: false,
            addForm: {
                name: '',
                key: ''
            },
            addFormRules:{
                name: [
                    { required: true, message: '请输入角色名', trigger: 'blur'}
                ],
                key: [
                    { required: true, message: '请输入角色标识', trigger: 'blur'}
                ]
            }
        }
    },
    mounted() {
        this.getPageList()
    },
    methods: {
        async getPageList() {
            let result= await this.$API.roleManage.reqRoleList(this.pageNum,this.pageSize)
            if(result.code === 200){
                this.total = parseInt(result.data.total)-1
                this.list = result.data.list.filter(item=>item.key!='root');
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
        addRoleInfo() {
            this.$refs.addForm.validate(async valid => {
            if (valid) {
                let result= await this.$API.roleManage.addRole(this.addForm)
                if(result.code === 200){
                    this.$message.success('新增用户成功')
                    this.getPageList();
                }
                this.dialogFormVisible=false
                }
            })
        },
        async removeRole(id){
            // 弹框询问用户是否删除数据
            const confirmResult = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err => err)
            // 如果用户确认删除，则返回值为字符串 confirm
            // 如果用户取消删除，则返回值为字符串 cancel
            if (confirmResult !== 'confirm') {
                return this.$message.info('已取消删除');
            }
            let result= await this.$API.roleManage.removeRole(id)
            if (result.code === 200) {
                this.$message.success('删除角色成功！');
                this.getPageList();
            }
        }
    }
}
</script>

<style>

</style>
