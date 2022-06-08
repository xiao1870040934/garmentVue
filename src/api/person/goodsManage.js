import request from '@/utils/request'

export const reqGoodsList=(data)=>request({url:'/goods/getAll',method:'get',params:data})

export const reqGoodListPage=(pageNum,pageSize)=>request({url:'/goods/query',method:'get',params:{pageNum,pageSize}})