import request from '@/utils/request'

export const addStock=(data)=>request({url:'/stock/addInstore',method:'post',data})

export const reqPutStoreList=(data)=>request({url:'/stock/getInstore',method:'get',params:data})

export const reqDetailList=(id)=>request({url:`/stock/getInDetail/${id}`,method:'get'})

export const removeInstoreById=(id)=>request({url:`/stock/deleteIn/${id}`,method:'delete'})

export const getInstoreById=(id)=>request({url:`/stock/getIn/${id}`,method:'get'})

export const editPutStoreInfoById=(data)=>request({url:'/stock/editIn',method:'post',data})