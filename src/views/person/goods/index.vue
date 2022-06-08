<template>
  <div>
      <!--添加按钮  -->
    <el-button type="primary" icon="el-icon-plus" style="margin:10px 0px">添加</el-button>
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
              <el-button type="warning" icon="el-icon-edit" size="mini">修改</el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
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
      }
    }
    
}
</script>

<style>
</style>
