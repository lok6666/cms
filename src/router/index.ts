import { createRouter, createWebHistory, RouteRecordRaw, createWebHashHistory, Router } from 'vue-router'
import Layout from "@/layout/index.vue";

// 引入组件
import chartsRouter from './modules/charts'
import chatRouter from './modules/chat'
import componentsRouter from './modules/components'
import othersRouter from './modules/other'
import externalLink from './modules/externalLink'
import permissionRouter from './modules/permission'
import tableRouter from './modules/table'
import errorRouter from './modules/error'
import excelRouter from './modules/excel'
import nestedRouter from './modules/nested'

interface extendRoute {
  hidden?: boolean
}
/**
 * alwaysShow 如果设置为true，将始终显示根菜单，无论其子路由长度如何
 * hidden 如果“hidden:true”不会显示在侧边栏中（默认值为false）
 * keepAlive 设为true 缓存
 */


export const constantRoutes: Array<RouteRecordRaw & extendRoute> = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    hidden: true,
    meta: { title: '登录', }
  },
  {
    path: '/policy-pulish-detail',
    name: 'policy-pulish-detail',
    component: () => import('@/views/serverManage/policy-pulish-detail.vue'),
    hidden: true,
    meta: { title: '政策详情', }
  },
  {
    path: '/',
    name: 'layout',
    component: Layout,
    redirect: '/home',
    children: [
      {
        path: '/home',
        component: () => import('@/views/home/index.vue'),
        name: 'home',
        meta: { title: '首页', affix: true, role: ['other'] }
      }
    ]
  },
  {
    path: '/business',
    component: Layout,
    redirect: 'noRedirect',
    name: 'Charts',
    meta: {
      title: '招商服务',
      roles: ['other']
    },
    children: [
      {
        path: 'migration',
        component: () => import('@/views/business/apply.vue'),
        name: 'migration',
        meta: { title: '入驻申请', roles: ['other']}
      },
      {
        path: 'simple',
        component: () => import('@/views/business/estimate.vue'),
        // component: () => import('@/views/business/essay.vue'),
        name: 'charts-simple',
        meta: { title: '企业评估', roles: ['other'] }
      },
      {
        path: 'income',
        component: () => import('@/views/busneissMessage/income.vue'),
        name: 'busneiss-income',
        meta: { title: '财税数据', roles: ['other'] }
      },
      {
        path: 'test',
        component: () => import('@/views/busneissMessage/test.vue'),
        name: 'busneiss-test',
        meta: { title: '政策申报管理', roles: ['other'] }
      },
      // {
      //   path: 'complex',
      //   component: () => import('@/views/charts/complex.vue'),
      //   name: 'charts-complex',
      //   meta: { title: '招商效果', roles: ['other'] }
      // },
      // {
      //   path: 'animation',
      //   component: () => import('@/views/business/enterMessage.vue'),
      //   name: 'charts-animation',
      //   meta: { title: '信息录入', roles: ['other'] }
      // },
    ]
  },
  {
    path: '/busneiss-message',
    component: Layout,
    redirect: 'noRedirect',
    name: 'busneiss-message',
    meta: {
      title: '企业信息',
      roles: ['other']
    },
    children: [
      {
        path: 'busneiss-basic',
        component: () => import('@/views/busneissMessage/basic.vue'),
        name: 'busneiss-basic',
        meta: { title: '基本信息', roles: ['other']}
      },
      {
        path: 'busneiss-propagate',
        component: () => import('@/views/busneissMessage/propagate.vue'),
        // component: () => import('@/views/business/essay.vue'),
        name: 'busneiss-propagate',
        meta: { title: '宣传资料', roles: ['other'] }
      },
      {
        path: 'busneiss-filling',
        component: () => import('@/views/busneissMessage/filling.vue'),
        name: 'busneiss-filling',
        meta: { title: '备案信息', roles: ['other'] }
      },
      {
        path: 'envelope',
        component: () => import('@/views/serverManage/envelope.vue'),
        name: 'envelope',
        meta: { title: '站内信管理', roles: ['other'] }
      },
    ]
  },
  {
    path: '/action',
    component: Layout,
    redirect: 'noRedirect',
    name: 'action',
    meta: {
      title: '活动管理',
      roles: ['other']
    },
    children: [
      {
        path: 'publish',
        component: () => {
          let src = 'publish';
          return import(`@/views/action/${src}.vue`)
        },
        name: 'publish',
        meta: { title: '活动发布', roles: ['other'], requiresAuth: false }
      },
      {
        path: 'enroll',
        component: () => import('@/views/action/enroll.vue'),
        name: 'enroll',
        meta: { title: '活动报名', roles: ['other'] }
      }
    ]
  },
  {
    path: '/message',
    component: Layout,
    redirect: 'noRedirect',
    name: 'message',
    meta: {
      title: '信息发布',
      roles: ['other']
    },
    children: [
      {
        path: 'essay',
        component: () => import('@/views/contentmanage/essay.vue'),
        name: 'essay',
        meta: { title: '文章发布', roles: ['other'], requiresAuth: false }
      },
      {
        path: 'essay2',
        component: () => import('@/views/contentmanage/essay.vue'),
        name: 'essay1',
        meta: { title: '文章发布', roles: ['other'], requiresAuth: false }
      }
    ]
  }
  // permissionRouter
]

const clipboardTable = {
  path: '/clipboard',
  component: Layout,
  redirect: 'noRedirect',
  name: 'clipboard',
  meta: {
    title: 'clipboard',
    icon: 'document-copy'
  },
  children: [
    {
      path: 'index',
      component: () => import('@/views/clipboard/index.vue'),
      name: 'map',
      meta: { title: '剪贴板', roles: ['other'], icon: 'document-copy', }
    },

  ]
}

const zipRoutes = {
  path: '/zip',
  component: Layout,
  isShow: true,
  redirect: 'noRedirect',
  name: 'zip',
  alwaysShow: true,
  meta: {
    title: 'Zip',
    icon: 'document-copy',
    roles: ['other']
  },
  children: [
    {
      path: 'download',
      component: () => import('@/views/zip/download.vue'),
      name: 'download',
      meta: { title: 'Zip', roles: ['other'], icon: 'document-copy', }
    },

  ]
}


// 异步组件
export const asyncRoutes = [
  tableRouter,
  chartsRouter,
  chatRouter,
  componentsRouter,
  othersRouter,
  nestedRouter,
  excelRouter,
  zipRoutes,
  errorRouter,
  externalLink,
  clipboardTable,
  // permissionRouter,

  {
    path: '/:pathMatch(.*)',
    redirect: '/error/404'
  }
]


const router = createRouter({
  // history: createWebHistory(process.env.BASE_URL), // history
  history: createWebHashHistory(), // hash
  routes: constantRoutes
})

export default router
