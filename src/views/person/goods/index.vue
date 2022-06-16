<template>
  <div>
      <!--添加按钮  -->
    <el-button type="primary" icon="el-icon-plus" style="margin:10px 0px" @click="showDialog">添加</el-button>
    <el-row :gutter="20">
      <el-col :span="8">
          <el-input placeholder="请输入货号" v-model="queryInfo.number" clearable @clear="getPageList"></el-input>
      </el-col>
      <el-col :span="8">
          <el-input placeholder="请输入服装名称" v-model="queryInfo.name" clearable @clear="getPageList">
              <el-button slot="append" icon="el-icon-search" @click="getPageList"></el-button>
          </el-input>
      </el-col>
    </el-row>
    <el-table :data="list" border stripe style="margin:10px 0px">
      <el-table-column type="index"></el-table-column>
      <el-table-column label="货号" prop="number" width="width"></el-table-column>
      <el-table-column label="服装名称" prop="name" width="width"></el-table-column>
      <el-table-column label="尺寸" prop="size" width="width"></el-table-column>
      <el-table-column label="颜色" prop="colour" width="width"></el-table-column>
      <el-table-column label="数量" prop="count" width="width"></el-table-column>
      <el-table-column label="操作" width="250px">
          <template slot-scope="scope">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeGoods(scope.row)">删除</el-button>
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

    <el-dialog title="添加服装" :visible.sync="dialogFormVisible" width="45%">
      <el-form :model="addForm" label-width="80px" ref="addForm" :rules="addFormRules">
          <el-form-item label="服装名称" prop="name">
            <el-input v-model="addForm.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="服装编号" prop="number">
            <el-input v-model="addForm.number" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="服装尺寸" prop="size">
            <el-input v-model="addForm.size" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="服装颜色" prop="colour">
            <el-input v-model="addForm.colour" autocomplete="off"></el-input>
          </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="addGoodsInfo">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
    name:'goodsManage',
    data() {
      return {
        queryInfo:{
          number: '',
          name: '',
          pageNum: 1,
          pageSize: 5
        },    
        list: [],
        total: 0,
        dialogFormVisible: false,
        addForm:{
          name:'',
          number: '',
          size: '',
          colour: ''
        },
        addFormRules:{
          name: [
            { required: true, message: '请输入货品名', trigger: 'blur'}
          ],
          number: [
            { required: true, message: '请输入货号', trigger: 'blur'}
          ],
          size: [
            { required: true, message: '请输入尺寸', trigger: 'blur'}
          ],
          colour: [
            { required: true, message: '请输入颜色', trigger: 'blur'}
          ]
        }
      }
    },
    mounted() {
      this.getPageList()
    },
    methods: {
      async getPageList() {
        let result= await this.$API.goodsManage.reqGoodsList(this.queryInfo)
        if(result.code === 200){
          this.total = parseInt(result.data.total)
          this.list = result.data.list;
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
      addGoodsInfo() {
        this.$refs.addForm.validate(async valid => {
        if (valid) {
            let result= await this.$API.goodsManage.addGoods(this.addForm)
            if(result.code === 200){
                this.$message.success('新增货号成功')
                this.getPageList();
            }
            this.dialogFormVisible=false
            }
        })
      },
      async removeGoods(row){
        // 弹框询问用户是否删除数据
        if(row.count!==0){
          return this.$message.info('数量不为0不能删除');
        }
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
        let result= await this.$API.goodsManage.removeGoods(row.id)
        if (result.code === 200) {
            this.$message.success('删除货号成功！');
            this.getPageList();
        }
      }
    }
    
}
</script>

<style>
</style>
