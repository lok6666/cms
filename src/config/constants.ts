
import Layout from "@/layout/index.vue";
import essay from "@/views/contentmanage/essay.vue";
export const constantRouterComponents = {
    // 你需要动态引入的页面组件
    'message': () => Layout, // 信息发布
    'essay': essay, // 信息发布-内容管理-文章发布
    'sensitivemanage': '@/views/contentmanage/sensitive-manage.vue', // 信息发布-内容管理-敏感词管理
    // 'sensitiveManage': '@/views/joinProcess/business.vue', // 推荐管理-临时替代
    'selectconfig': '@/views/recommendManage/select-config.vue', // 推荐管理-下拉框配置
    'datasafeguard': '@/views/recommendManage/data-safeguard.vue', // 推荐管理-行业数据维护
    'swiper': '@/views/recommendManage/data-safeguard.vue', // 推荐管理-轮播图管理
    'videospecialcolumn': '@/views/recommendManage/video-special-column.vue', // 视频专栏
    'servermanage': '@/views/serverManage/project.vue', // 服务管理-行业课程
    'fund': '@/views/serverManage/fund.vue', // 服务管理-金融服务
    'policypublish': '@/views/serverManage/policypublish.vue', // 服务管理-金融服务
    'other': '@/views/serverManage/other.vue', // 服务管理-企业服务
    'flexible': '@/views/serverManage/flexible.vue', // 服务管理-灵活用工服务
    'envelope': '@/views/serverManage/envelope.vue', // 服务管理-站内信
    'supplier': '@/views/serverManage/other1.vue', // 服务管理-供应商服务
    'invert': '@/views/joinProcess/invert.vue', // 对接进度服务-投融资对接管理
    'joinservice': '@/views/joinProcess/join-service.vue', // 对接进度服务-服务对接管理
    'business': '@/views/joinProcess/business.vue', // 对接进度服务-招商管理
    'service': () => Layout, // 服务管理
    'systemManage': () => Layout, // 系统管理
    'businessUse': '@/views/systemManage/inline-edit-table.vue', // 系统管理-企业用户
    'accountManage': '@/views/systemManage/account-manage.vue', // 系统管理-账户管理
    'roleManage': '@/views/systemManage/role-manage.vue', // 系统管理-角色管理
    'dailyManage': '@/views/systemManage/daily-manage.vue', // 系统管理-日志管理
    'sourceyManage': '@/views/systemManage/source-manage.vue', // 系统管理-资源管理
    // 'publish': '@/views/action/publish.vue', // 活动管理-活动发布
    // 'enroll': '@/views/action/enroll.vue', // 系统管理-活动报名
    'businessCheck': () => Layout, // 企业监测
    'choose': () => Layout, // 优化筛选
    // todo 研究 企业信息使用-后不用在这里引入组件
  };

export const businessConfig = {
  entime: '企业名称',
  creditNo: "统一社会信用代码",
  regNo: "工商注册号",
  esDate: "成立日期",
  apprDate: "核准日期",
  entStatus: "登记状态",
  nameKeyNo: "法人key",
  name: "法人代表人",
  nameIcon: "法人头像",
  regCap: "注册资本",
  recCap: "实缴资本",
  entType: "企业类型",
  regOrg: "登记机关",
  opFrom: "营业期限自",
  opTo: "营业期限至",
  dom: "注册地址",
  canDate: "注销日期",
  revDate: "注销日期",
  tax_vert: "纳税人资质",
  nic_name: "所属行业",
  region_name: "所属地区",
  history_name: "曾用名",
  phone: "电话",
  email: "邮箱",
  website: "官网",
  opScope: "经营范围",
};

export const priseConfig = [
  'competitiveness',
  'creativity',
  'development',
  'identity',
  'risk',
  'vigor'
];