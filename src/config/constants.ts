
import Layout from "@/layout/index.vue";
export const constantRouterComponents = {
    // 你需要动态引入的页面组件
    'message': () => Layout, // 信息发布
    'essay': () => import('@/views/contentManage/essay.vue'), // 信息发布-内容管理-文章发布
    'sensitivemanage': () => import('@/views/contentManage/sensitive-manage.vue'), // 信息发布-内容管理-敏感词管理
    // 'sensitiveManage': () => import('@/views/joinProcess/business.vue'), // 推荐管理-临时替代
    'selectconfig': () => import('@/views/recommendManage/select-config.vue'), // 推荐管理-下拉框配置
    'datasafeguard': () => import('@/views/recommendManage/data-safeguard.vue'), // 推荐管理-行业数据维护
    'swiper': () => import('@/views/recommendManage/data-safeguard.vue'), // 推荐管理-轮播图管理
    'videospecialcolumn': () => import('@/views/recommendManage/video-special-column.vue'), // 视频专栏
    'servermanage': () => import('@/views/serverManage/project.vue'), // 服务管理-项目库
    'fund': () => import('@/views/serverManage/fund.vue'), // 服务管理-资金产品库
    'other': () => import('@/views/serverManage/other.vue'), // 服务管理-其他服务库
    'invert': () => import('@/views/joinProcess/invert.vue'), // 对接进度服务-投融资对接管理
    'joinservice': () => import('@/views/joinProcess/join-service.vue'), // 对接进度服务-服务对接管理
    'business': () => import('@/views/joinProcess/business.vue'), // 对接进度服务-招商管理
    'service': () => Layout, // 服务管理
    'systemManage': () => Layout, // 系统管理
    'businessUse': () => import('@/views/systemManage/inline-edit-table.vue'), // 系统管理-企业用户
    'accountManage': () => import('@/views/systemManage/account-manage.vue'), // 系统管理-账户管理
    'roleManage': () => import('@/views/systemManage/role-manage.vue'), // 系统管理-角色管理
    'dailyManage': () => import('@/views/systemManage/daily-manage.vue'), // 系统管理-日志管理
    'sourceyManage': () => import('@/views/systemManage/source-manage.vue'), // 系统管理-资源管理
    // 'publish': () => import('@/views/action/publish.vue'), // 活动管理-活动发布
    // 'enroll': () => import('@/views/action/enroll.vue'), // 系统管理-活动报名
    'businessCheck': () => Layout, // 企业监测
    'choose': () => Layout, // 优化筛选
  };