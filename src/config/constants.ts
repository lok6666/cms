
import Layout from "@/layout/index.vue";
export const constantRouterComponents = {
    // 你需要动态引入的页面组件
    'message': () => Layout, // 信息发布
    'essay': () => import('@/views/contentManage/inline-edit-table.vue'), // 信息发布-内容管理-文章发布
    'sensitiveManage': () => import('@/views/other/editor.vue'), // 信息发布-推荐管理-敏感词管理
    'service': () => Layout, // 服务管理
    'systemManage': () => Layout, // 系统管理
    'businessUse': () => import('@/views/systemManage/inline-edit-table.vue'), // 系统管理-企业用户
    'accountManage': () => import('@/views/systemManage/account-manage.vue'), // 系统管理-账户管理
    'roleManage': () => import('@/views/systemManage/role-manage.vue'), // 系统管理-角色管理
    'dailyManage': () => import('@/views/systemManage/daily-manage.vue'), // 系统管理-日志管理
    'sourceyManage': () => import('@/views/systemManage/source-manage.vue'), // 系统管理-资源管理
    'businessCheck': () => Layout, // 企业监测
    'choose': () => Layout, // 优化筛选
  };