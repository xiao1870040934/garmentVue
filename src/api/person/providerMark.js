import request from '@/utils/request'

export const reqProviderList = (pageNum,pageSize)=>request({url:`/provider/getAll/${pageNum}/${pageSize}`,method:'get'})