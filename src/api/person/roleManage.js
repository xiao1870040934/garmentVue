import request from '@/utils/request'

export const reqRoleList=(pageNum,pageSize)=>request({url:`/role/getList/${pageNum}/${pageSize}`,method:'get'})

export const addRole=(data)=>request({url:'/role/add',method:'post',data})

export const removeRole=(id)=>request({url:`/role/delete/${id}`,method:'delete'})