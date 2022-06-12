import request from '@/utils/request'

export const reqRoleList=(pageNum,pageSize)=>request({url:`/role/getList/${pageNum}/${pageSize}`,method:'get'})