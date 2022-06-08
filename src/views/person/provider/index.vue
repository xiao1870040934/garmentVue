<template>
  <div>
      <!--按钮-->
      <el-button type="primary" icon="el-icon-plus" style="margin:10px 0px" @click="showDialog">添加</el-button>
      <!-- 表格组件 -->
      <el-table :data="list" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="供应商名称" prop="name" width="width"></el-table-column>
        <el-table-column label="供应商电话" prop="phone" width="width"></el-table-column>
        <el-table-column label="供应商地址" prop="address" width="width"></el-table-column>
        <el-table-column label="操作时间" prop="updateTime" width="width"></el-table-column>
        <el-table-column label="操作" width="250px">
            <template slot-scope="scope">
                <el-button type="warning" icon="el-icon-edit" size="mini">修改</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
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

      <!--对话框 -->
      <el-dialog title="添加供应商" :visible.sync="dialogFormVisible" width="80%">
        <el-form :model="form">
          <el-form-item label="供应商名称" label-width="60px">
            <el-input v-model="form.name" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
        </div>
      </el-dialog>
  </div>
</template>

<script>
export default {
    name:'providerMark',
    data() {
      return {
        pageNum: 1,
        pageSize: 5,
        list: [],
        total: 0,
        dialogFormVisible: false,
        form: {
          name: ''
        }
      }
    },
    mounted() {
      this.getPageList()
    },
    methods: {
      async getPageList() {
        const {pageNum,pageSize}=this;
        let result= await this.$API.providerMark.reqProviderList(pageNum,pageSize)
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
      // 点击添加品牌的按钮
      showDialog() {
        // 显示对话框
        this.dialogFormVisible = true
      }
    },
}
</script>

<style>

</style>