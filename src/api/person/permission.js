import request from '@/utils/request'

export const toAssign=(roleId)=>request({url:`/permission/toAssign/${roleId}`,method:'get'})

export const reqRoleMenus=(roleId)=>request({url:`/permission/menu/${roleId}`,method:'get'})

export const doAssign=(roleId,permissionIds,menuIds)=>request({
    url:`/permission/doAssign/${roleId}`,
    method: 'post',
    params:{
        permissionIds,
        menuIds
    }
})

export const getPermissionList=()=>request({url:'/permission/list',method:'get'})