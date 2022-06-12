<template>
  <div>
        <!--添加按钮  -->
        <el-button type="primary" icon="el-icon-plus" style="margin:10px 0px">添加</el-button>
        <el-table :data="list" border stripe>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="角色名" prop="name" width="width"></el-table-column>
            <el-table-column label="操作" width="250px">
                <template slot-scope="scope">
                    <HintButton size="mini" type="info" icon="el-icon-info" title="分配权限"
                    @click="$router.push(`/permission/auth/${scope.row.id}?roleName=${scope.row.key}`)"/>
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
            pageSize: 5
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
    }
}
</script>

<style>

</style>
