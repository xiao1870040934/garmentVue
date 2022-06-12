import request from '@/utils/request'

export const reqUserList = (pageNum,pageSize)=>request({url:`/user/getAll/${pageNum}/${pageSize}`,method:'get'})

export const addUser=(data)=>request({url:'/user/add',method:'post',data})

export const getUser=(id)=>request({url:`/user/get/${id}`,method:'get'})

export const editUser=(data)=>request({url:`/user/edit/${data.id}`,method:'put',data})

export const removeUser=(id)=>request({url:`/user/delete/${id}`,method:'delete'})

export const updatePassword=(data)=>request({url:'/user//change',method:'post',data})

export const getRoles=(id)=>request({url:`/user/toAssign/${id}`,method:'get'})

export const assignRoles=(userId, roleIds)=>request({
    url:'/user/doAssign',
    method:'post',
    params:{
        userId,
        roleIds
    }
})