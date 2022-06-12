import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { anyRouter,resetRouter,asyncRouters,constantRoutes } from '@/router'
import router from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    routes: [],
    roles: [],
    // 最终异步的路由
    resultAsyncRouters: [],
    // 最终展示的路由
    resultAllRouters: []
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  // SET_NAME: (state, name) => {
  //   state.name = name
  // },
  // SET_AVATAR: (state, avatar) => {
  //   state.avatar = avatar
  // }
  SET_USERINFO: (state,userInfo)=>{
    state.name=userInfo.name
    state.avatar=userInfo.avatar
    state.routes=userInfo.routes
    state.roles=userInfo.roles
  },
  SET_RESULTSYNCROUTERS: (state,asyncRouters)=>{
    // vuex保存当前用户的异步路由
    state.resultAsyncRouters=asyncRouters
    // 计算出当前用户需要展示所有路由
    state.resultAllRouters=constantRoutes.concat(state.resultAsyncRouters,anyRouter)
    // 给路由器添加新的路由
    router.addRoutes(state.resultAllRouters)
  }
}

// 定义一个函数：两个数组进行对比，对比当前用户到底展示哪些异步路由
const computedAsyncRouters=(asyncRouters,routes)=>{
  // 过滤
  return asyncRouters.filter(item=>{
    // 数组当中没有这个元素返回索引值-1，如果有这个元素返回的索引值一定不是-1
    if(routes.indexOf(item.name)!= -1){
      //递归 有2级路由
      if(item.children&&item.children.length){
        item.children=computedAsyncRouters(item.children,routes)
      }
      return true
    }
  })
}


const actions = {
  // 这里在处理登录业务
  async login({ commit }, userInfo) {
    // 解构出用户名与密码
    const { username, password } = userInfo
    const result = await login({ username: username.trim(), password: password })
    // 注意当前登录请求使用的是mock数据，mock数据是200000
    if (result.code === 200) {
      commit('SET_TOKEN', result.data.token)
      setToken(result.data.token)
      return 'ok'
    } else {
      return Promise.reject(new Error('faile'))
    }
  },

  // get user info
  getInfo({ commit }) {
    return new Promise((resolve, reject) => {
      getInfo().then(response => {
        //获取用户信息：返回数据包括，用户名name，用户图像avatar，routes[返回的标志：不同的用户应该展示哪些菜单的标记]，roles(用户角色信息)
        const { data } = response
        if (!data) {
          return reject('Verification failed, please Login again.')
        }

        //const { name, avatar } = data

        //commit('SET_NAME', name)
        //commit('SET_AVATAR', avatar)
        commit('SET_USERINFO',data)
        commit('SET_RESULTSYNCROUTERS',computedAsyncRouters(asyncRouters,data.routes))
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit }) {
    return new Promise((resolve, reject) => {
      logout().then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  state,
  mutations,
  actions
}

