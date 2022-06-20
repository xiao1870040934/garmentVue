import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
// 常量路由
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },



]

// 异步路由
export const asyncRouters = [
  {
    path: '/person',
    component: Layout,
    name: 'Person',
    redirect: '/person/clientMark',
    meta: { title: '系统管理', icon: 'el-icon-goods' },
    children: [
      {
        path: 'clientMark',
        name: 'ClinetMark',
        component: () => import('@/views/person/client'),
        meta: { title: '用户管理' }
      },
      {
        path: 'goodsManage',
        name: 'GoodsManage',
        component: () => import('@/views/person/goods'),
        meta: { title: '货号管理' }
      },
      {
        path: 'providerMark',
        name: 'ProviderMark',
        component: () => import('@/views/person/provider'),
        meta: { title: '供应商管理' }
      }     
    ]
  },
  {
    path: '/inventory',
    component: Layout,
    name: 'Inventory',
    meta: { title: '库存管理', icon: 'el-icon-s-order' },
    children: [
      {
        path: 'inwarehouseManage',
        name: 'InwarehouseManage',
        component: () => import('@/views/inventory/instore'),
        meta: { title: '入库管理' }
      },
      {
        path: 'outwarehouseManage',
        name: 'OutwarehouseManage',
        component: () => import('@/views/inventory/outstore'),
        meta: { title: '出库管理' }
      },
      {
        path: 'inboundQuery',
        name: 'InboundQuery',
        component: () => import('@/views/inventory/warehousequery'),
        meta: { title: '入库查询' }
      },
      {
        path: 'inboundQuery2',
        name: 'InboundQuery2',
        component: () => import('@/views/inventory/warehousequery2'),
        meta: { title: '入库查询2' }
      },
      {
        path: 'outboundQuery',
        name: 'OutboundQuery',
        component: () => import('@/views/inventory/outboundquery'),
        meta: { title: '出库查询' }
      }
    ]
  },
  {
    path: '/permission',
    component: Layout,
    name: 'Permission',
    meta: { title: '权限管理', icon: 'el-icon-user-solid' },
    children: [
      {
        path: 'roleManage',
        name: 'RoleManage',
        component: () => import('@/views/permission/role'),
        meta: { title: '角色管理' }
      },
      {
        name: 'RoleAuth',
        path: 'auth/:id',
        component: () => import('@/views/permission/role/roleAuth'),
        meta: {
          activeMenu: '/permission/roleManage',
          title: '角色授权',
        },
        hidden: true,
      },
      {
        path: 'authorityManage',
        name: 'AuthorityManage',
        component: () => import('@/views/permission/authority'),
        meta: { title: '菜单管理' }
      }  
    ]
  }
]

// 任意路由 :当路径出现错误的时候重定向至404
export const anyRouter = { path: '*', redirect: '/404', hidden: true };



const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
