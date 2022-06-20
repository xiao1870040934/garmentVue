import request from '@/utils/request'

export const reqGoodsList=(data)=>request({url:'/goods/getAll',method:'get',params:data})

export const reqGoodListPage=(pageNum,pageSize)=>request({url:'/goods/query',method:'get',params:{pageNum,pageSize}})

export const addGoods=(data)=>request({url:'/goods/add',method:'post',data})

export const removeGoods=(id)=>request({url:`/goods/delete/${id}`,method:'delete'})

export const getGoodsList=()=>request({url:'/goods/list',method:'get'})