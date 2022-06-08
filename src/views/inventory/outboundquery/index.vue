<template>
  <div>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请选择出库日期" v-model="queryInfo.outTime" clearable @clear="getPageList"></el-input>
        </el-col>
        <el-col :span="8">
            <el-input placeholder="请输出库单号" v-model="queryInfo.number" clearable @clear="getPageList">
                <el-button slot="append" icon="el-icon-search" @click="getPageList"></el-button>
            </el-input>
        </el-col>
      </el-row>
      <el-table :data="list" border stripe style="margin:10px 0px">
        <el-table-column type="index"></el-table-column>
        <!--<el-table-column label="入库单号" prop="number" width="width"></el-table-column>-->
        <el-table-column label="所出仓库" prop="storage" width="width"></el-table-column>
        <el-table-column label="经办人" prop="agent" width="width"></el-table-column>
        <el-table-column label="客户" prop="towhere" width="width"></el-table-column>
        <el-table-column label="出库时间" prop="outTime" width="width"></el-table-column>
        <el-table-column label="备注" prop="remark" width="width"></el-table-column>
        <el-table-column label="操作" width="width">
            <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="showDetail(scope.row.id)">查看详情</el-button>
                <el-button type="warning" icon="el-icon-edit" size="mini" @click="editOutstore(scope.row.id)">修改</el-button>               
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeOutstore(scope.row.id)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
    <el-pagination
      style="margin-top: 20px; textAlign: center"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pageNum"
      :page-sizes="[1, 2, 5, 10]"
      :page-size="queryInfo.pageSize"
      :total="total"
      layout=" prev, pager, next, jumper, ->, total, sizes">
    </el-pagination>
    <!-- 详情对话框 -->
    <el-dialog title="出库明细" :visible.sync="detailFormVisible" width="45%">
      <el-table :data="detailList" style="width: 100%">
        <el-table-column prop="name" label="服装名称" width="180"></el-table-column>
        <el-table-column prop="size" label="尺寸" width="180"></el-table-column>
        <el-table-column prop="colour" label="颜色" width="180"></el-table-column>
        <el-table-column prop="count" label="出库数量" width="180"></el-table-column>
      </el-table>
    </el-dialog>
    <!-- 修改对话框 -->
    <el-dialog
      title="修改出库单"
      :visible.sync="editDialogVisible"
      width="50%">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="80px">
          <el-form-item label="出库单号">
              <el-input v-model="editForm.number" disabled></el-input>
          </el-form-item>
          <el-form-item label="经办人" prop="agent">
              <el-input v-model="editForm.agent"></el-input>
          </el-form-item>
          <el-form-item label="所出仓库" prop="storage">
              <el-input v-model="editForm.storage"></el-input>
          </el-form-item>
          <el-form-item label="客户" prop="towhere">
              <el-input v-model="editForm.towhere"></el-input>
          </el-form-item>          
          <el-form-item label="出库时间" prop="outTime">
              <el-input v-model="editForm.outTime" disabled></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
              <el-input v-model="editForm.remark"></el-input>
          </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editOutStoreInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
    name:'outboundQuery',
    data() {
      return {
        queryInfo:{
          storage:'',
          number:'',
          pageNum: 1,
          pageSize: 5
        },
        list: [],
        total: 0,
        detailList: [],
        detailFormVisible: false,
        editDialogVisible: false,
        editForm: {},
        editFormRules: {
          agent:[
            { required: true, message: '请输入经办人', trigger: 'blur'}
          ],
          storage:[
            { required: true, message: '请输入所出仓库', trigger: 'blur'}
          ],
          towhere:[
            { required: true, message: '请输入客户', trigger: 'blur'}
          ]
        }
      }
    },
    mounted() {
      this.getPageList()
    },
    methods: {
      async getPageList() {
        let result= await this.$API.outwharehouse.reqOutStoreList(this.queryInfo)
        if(result.code === 200){
          this.total = parseInt(result.data.total)
          this.list = result.data.list;
        }
      },
      async showDetail(id){
        let result=await this.$API.outwharehouse.reqDetailList(id)
        if(result.code===200){
          this.detailList=result.data
          this.detailFormVisible=true
        }
      },
      async editOutstore(id) {
        let result= await this.$API.outwharehouse.getOutstoreById(id)
        if(result.code===200){
          this.editForm=result.data
        }
        this.editDialogVisible=true
      },
      async removeOutstore(id) {
        const confirmResult = await this.$confirm('此操作将永久删除该出库单, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        // 如果用户确认删除，则返回值为字符串 confirm
        // 如果用户取消删除，则返回值为字符串 cancel
        if (confirmResult !== 'confirm') {
            return this.$message.info('已取消删除');
        }
        let result= await this.$API.outwharehouse.removeOutStoreById(id)
        if(result.code ===200){
          this.$message.info('删除成功')
        }
      },
      editOutStoreInfo() {
        this.$refs.editFormRef.validate(async valid => {
          if (valid) {
            let result= await this.$API.inwharehouse.editOutStoreInfoById(this.editForm)
            if(result.code===200){
              this.$message.success('修改出库单成功')
              this.getPageList();
              this.editDialogVisible=false
            }
          }
        })
      }
    }
}
</script>

<style>
</style>
