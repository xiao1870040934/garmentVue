import request from '@/utils/request'

export const reqOutStoreList=(data)=>request({url:'/stock/getOutstore',method:'get',params:data})

export const reqDetailList=(id)=>request({url:`/stock/getOutDetail/${id}`,method:'get'})

export const removeOutStoreById=(id)=>request({url:`/stock/deleteOut/${id}`,method:'post'})

export const getOutstoreById=(id)=>request({url:`/stock/getOut/${id}`,method:'get'})

export const editOutStoreInfoById=(data)=>request({url:'/stock/editOut',method:'post',data})

export const OutStock=(data)=>request({url:'/stock/addOutstore',method:'post',data})