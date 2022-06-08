import request from '@/utils/request'

export const addStock=(data)=>request({url:'/stock/add',method:'post',data})

export const reqPutStoreList=(data)=>request({url:'/stock/getInstore',method:'get',params:data})

export const reqDetailList=(id)=>request({url:`/stock/getDetail/${id}`,method:'get'})

export const removeInstoreById=(id)=>request({url:`/stock/delete/${id}`,method:'delete'})

export const getInstoreById=(id)=>request({url:`/stock/get/${id}`,method:'get'})

export const editPutStoreInfoById=(data)=>request({url:`/stock/edit`,method:'post',data})