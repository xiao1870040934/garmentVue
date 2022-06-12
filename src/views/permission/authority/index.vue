<template>
  <div>
      <el-table
      border
      style="margin-bottom: 20px;"
      :data="menuPermissionList"
      >
      <el-table-column
        prop="name"
        label="名称"
      />
      <el-table-column
        prop="parms"
        label="权限值"
      />
    </el-table>
  </div>
</template>

<script>
export default {
    name: 'authorityManage',
    data() {
      return {
        menuPermissionList: [],
      }
    },
    mounted() {
      this.fetchPermissionList()
    },
    methods: {
      async fetchPermissionList() {
        const result = await this.$API.permission.getPermissionList()
        this.menuPermissionList = result.data
      }
    }
}
</script>

<style>

</style>