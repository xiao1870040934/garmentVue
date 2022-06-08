import request from '@/utils/request'

export const reqOutStoreList=(data)=>request({url:'/out/queryAll',method:'get',params:data})

export const reqDetailList=(id)=>request({url:`/query/detail/${id}`,method:'get'})

export const removeOutStoreById=(id)=>request({url:`/out/delete/${id}`,method:'post'})

export const getOutstoreById=(id)=>request({url:`/out/get/${id}`,method:'get'})

export const editOutStoreInfoById=(data)=>request({url:'/out/updata',method:'post',data})

export const OutStock=(data)=>request({url:'out/store',method:'post',data})