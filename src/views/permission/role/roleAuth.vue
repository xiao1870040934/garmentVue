<template>
  <div>
    <el-input disabled :value="$route.query.roleName"></el-input>
    <el-form label-width="80px">
      <el-form-item label="菜单列表">
        <el-checkbox :indeterminate="isIndeterminate1" v-model="checkAll1" @change="handleCheckAllChange1">全选</el-checkbox>
        <div style="margin: 15px 0;"></div>
        <el-checkbox-group v-model="roleMenuIds" @change="handleCheckedChange1">
          <el-checkbox v-for="menu in allMenus" :key="menu.id" :label="menu.id">{{menu.name}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="权限列表">
        <el-checkbox :indeterminate="isIndeterminate2" v-model="checkAll2" @change="handleCheckAllChange2">全选</el-checkbox>
        <div style="margin: 15px 0;"></div>
        <el-checkbox-group v-model="rolePermissionIds" @change="handleCheckedChange2">
          <el-checkbox v-for="permission in allPermissions" :key="permission.id" :label="permission.id">{{permission.name}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <el-button :loading="loading" type="primary" @click="save">保存</el-button>
    <el-button @click="$router.replace({name: 'RoleManage'})">取消</el-button>
  </div>
</template>
<script>

  export default {
    name: 'roleAuth',

    data() {
      return {
        loading: false, // 用来标识是否正在保存请求中的标识, 防止重复提交
        allPermissions: [], // 所有
        rolePermissionIds: [],//角色的权限ID列表
        allMenus: [],
        roleMenuIds: [],
        checkAll1: false,
        checkAll2: false,
        isIndeterminate1: false,
        isIndeterminate2: false
      };
    },

    created() {
      this.init()
    },

    methods: {
      /* 
      初始化
      */
      init() {
        const roleId = this.$route.params.id
        this.getPermissions(roleId)
        this.getMenus(roleId)
      },

      /* 
      获取指定角色的权限列表
      */
      getPermissions(roleId) {
          this.$API.permission.toAssign(roleId).then(result => {
          const {allPermissionsList,assignPermissions} = result.data
          this.allPermissions = allPermissionsList
          this.rolePermissionIds = assignPermissions.map(item => item.id)
          this.checkAll2 = allPermissionsList.length === assignPermissions.length
          this.isIndeterminate2 = assignPermissions.length>0 && assignPermissions.length<allPermissionsList
        })
      },
      handleCheckAllChange2(value) {
        this.rolePermissionIds = value ? this.allPermissions.map(item => item.id) : []
        this.isIndeterminate2 = false
      },
      handleCheckedChange2 (value) {
        const {rolePermissionIds, allPermissions} = this
        this.checkAll2 = rolePermissionIds.length === allPermissions.length && allPermissions.length>0
        this.isIndeterminate = rolePermissionIds.length>0 && rolePermissionIds.length<allPermissions.length
      },
      getMenus(roleId) {
        this.$API.permission.reqRoleMenus(roleId).then(result => {
        const {allMenuList,assignMenus} = result.data
        this.allMenus = allMenuList
        this.roleMenuIds = assignMenus.map(item => item.id)
        this.checkAll1 = allMenuList.length === assignMenus.length
        this.isIndeterminate1 = assignMenus.length>0 && assignMenus.length<allMenuList
        })
      },
      handleCheckAllChange1(value) {
        // value 当前勾选状态true/false
        // 如果当前全选, userRoleIds就是所有角色id的数组, 否则是空数组
        this.roleMenuIds = value ? this.allMenus.map(item => item.id) : []
        // 如果当前不是全选也不全不选时, 指定为false
        this.isIndeterminate1 = false
      },
      /* 
      角色列表选中项发生改变的监听
      */
      handleCheckedChange1 (value) {
        const {roleMenuIds, allMenus} = this
        this.checkAll1 = roleMenuIds.length === allMenus.length && allMenus.length>0
        this.isIndeterminate = roleMenuIds.length>0 && roleMenuIds.length<allMenus.length
      },
      /* 
      保存权限列表
      */
      save() {
        const permissionIds =this.rolePermissionIds.join(',')
        const menuIds=this.roleMenuIds.join(',')
        this.loading = true
        this.$API.permission.doAssign(this.$route.params.id, permissionIds,menuIds).then(result => {
          this.loading = false
          this.$message.success('分配权限成功')
          // 必须在跳转前获取(跳转后通过this获取不到正确的数据了)
          const roleName = this.$route.query.roleName
          const roles = this.$store.getters.roles
          this.$router.replace('/permission/roleManage', () => {
            console.log('replace onComplete')
            // 跳转成功后, 判断如果更新的是当前用户对应角色的权限, 重新加载页面以获得最新的数据
            if (roles.includes(roleName)) {
              window.location.reload()
            }
          })
        })
      }
    }
  };
</script>
