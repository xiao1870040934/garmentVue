<template>
  <div>
      <el-table :data="list" border stripe style="margin:10px 0px">
        <el-table-column type="index"></el-table-column>
        <!--<el-table-column label="入库单号" prop="number" width="width"></el-table-column>-->
        <el-table-column label="所入仓库" prop="storage" width="width"></el-table-column>
        <el-table-column label="经办人" prop="agent" width="width"></el-table-column>
        <el-table-column label="供应商" prop="from" width="width"></el-table-column>
        <el-table-column label="入库时间" prop="addTime" width="width"></el-table-column>
        <el-table-column label="入库详情" prop="" width="750px">
            <template slot-scope="scope">
                <el-table border :data="scope.row.detail">
                    <el-table-column prop="name" label="服装名称" width="180"></el-table-column>
                    <el-table-column prop="size" label="尺寸" width="180"></el-table-column>
                    <el-table-column prop="colour" label="颜色" width="180"></el-table-column>
                    <el-table-column prop="count" label="入库数量" width="180"></el-table-column>
                </el-table>
            </template>
        </el-table-column>
      </el-table>
  </div>
</template>

<script>
export default {
    data() {
        return {
            list: []
        }
    },
    mounted() {
        this.getList()
    },
    methods: {
        async getList() {
            let result= await this.$API.inwharehouse.reqPutStoreList2()
            if(result.code===200){
                this.list=result.data
            }
        }
    }
}
</script>

<style  scoped>
.el-table .el-table__header-wrapper th {
    background-color: #f0f1ff;
  }
.el-table .el-table__body-wrapper::-webkit-scrollbar {
    /* width: 0;宽度为0隐藏 */
    width: 0px;
    height: 0;
  }
.el-table .el-table__body-wrapper::-webkit-scrollbar-thumb {
    border-radius: 0;
    background: #fff;
  }
.el-table .el-table__body-wrapper::-webkit-scrollbar-track {
    box-shadow: none;
    border-radius: 0;
    background: #fff;
  }

</style>