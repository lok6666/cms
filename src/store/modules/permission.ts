import { Module } from "vuex";
import Layout from "@/layout/index.vue";
import { post } from "@/utils/request";
import { asyncRoutes, constantRoutes } from '@/router/index';
// import { constantRouterComponents } from '@/config/constants';
import { getMenuByUserId } from '@/config/api';
import { el } from "element-plus/es/locale";
import router from '../../router'
import { setToken } from '@/utils/auth'
const constantRouterComponents = {
    // 你需要动态引入的页面组件
    'message': '@/layout/index.vue', // 信息发布
    'essay': '@/views/contentmanage/essay.vue', // 信息发布-内容管理-文章发布
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
    'service': '@/layout/index.vue', // 服务管理
    'systemManage': '@/layout/index.vue', // 系统管理
    'businessUse': '@/views/systemManage/inline-edit-table.vue', // 系统管理-企业用户
    'accountManage': '@/views/systemManage/account-manage.vue', // 系统管理-账户管理
    'roleManage': '@/views/systemManage/role-manage.vue', // 系统管理-角色管理
    'dailyManage': '@/views/systemManage/daily-manage.vue', // 系统管理-日志管理
    'sourceyManage': '@/views/systemManage/source-manage.vue', // 系统管理-资源管理
    // 'publish': '@/views/action/publish.vue', // 活动管理-活动发布
    // 'enroll': '@/views/action/enroll.vue', // 系统管理-活动报名
    'businessCheck': '@/layout/index.vue', // 企业监测
    'choose': '@/layout/index.vue', // 优化筛选
    // todo 研究 企业信息使用-后不用在这里引入组件
  };
function exists(rows, parentId) {
    for (let i = 0; i < rows.length; i++) {
      if (rows[i].id === parentId) return true
    }
    return false
  };
function arrayToMenu(array) {
    const nodes = []
    // 获取顶级节点
    for (let i = 0; i < array.length; i++) {
      const row = array[i]
      // 这个exists方法就是判断下有没有子级
      if (!exists(array, row.parentId)) {
        nodes.push({
          path:  '/' + row.path, // 路由地址
          component: Layout, // 一般就是匹配你文件的component
          name: row.name, // 路由名称
          meta: { title: row.title, icon: row.name }, // title就是显示的名字
          resourceId: row.resourceId, // 路由的id
          redirect: 'noredirect'
        })
      }
    }
    const toDo = Array.from(nodes)
    while (toDo.length) {
      const node = toDo.shift()
      // 获取子节点
      for (let i = 0; i < array.length; i++) {
        const row = array[i]
        // parentId等于哪个父级的id，就push到哪个
        if (row.parentId === node.resourceId) {
            debugger;
            console.log('-----------', );
          const child = {
            path: row.path,
            name: row.name,
            hidden: row.hidden,
            // 核心代码，因为二级路由的component是需要匹配页面的
            component: () => import('' + constantRouterComponents[row.name]),
            meta: { title: row.title, icon: row.name },
            resourceId: row.resourceId
          }
          if (node.children) {
            node.children.push(child)
          } else {
            node.children = [child]
          }
          toDo.push(child)
        }
      }
    }
    return nodes
  };
/**
 * 使用 meta.role 来确定当前用户是否具有权限
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
    if (route.meta && route.meta.roles) {
        return roles.some(role => route.meta.roles.includes(role))
    } else {
        // return true
        return false
    }
}

interface currentRouter {
    name: string,
    path: string,
    component: Function | Object,
    meta: Object,
    children?: currentRouter[] // todo需修改any类型
};
/**
 * 格式化树形结构数据 生成 vue-router 层级路由表
 * @param routes routerMap
 * @param parent
 */
export function generator(routes) {
    const res = [];
    debugger;
    let node = arrayToMenu(routes);
    console.log('node', node);
    routes.forEach(el => {
        const { name, path, meta } = el || {};
        const currentRouter: currentRouter = {
            path: path || name,
            name: name,
            component: constantRouterComponents[name],
            meta
        };
        console.log('name-------', name, path, constantRouterComponents[name]);
        if (el.children && el.children.length !== 0) {
            currentRouter.children = generator(el.children)
        } else {
            delete currentRouter.children;
        }
        res.push(currentRouter);
    });
    console.log('res-------', res);
    return res;
};
/**
 * 通过递归过滤异步路由表
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
    const res = []

    routes.forEach(route => {
        const tmp = { ...route }
        if (hasPermission(roles, tmp)) {
            if (tmp.children) {
                tmp.children = filterAsyncRoutes(tmp.children, roles)
            }
            res.push(tmp)
        }
    })


    return res
}


const state = {
    routes: [],
    addRoutes: []
}

const mutations = {
    SET_ROUTES: (state, routes) => {
        state.addRoutes = routes
        state.routes = constantRoutes.concat(routes)
        console.log('SET_ROUTES----', state.routes);
    },
    CLEAR_ROUTERS: (state, routes) => {
        state.addRoutes = []
        state.routes = []
    },
}

const actions = {
    getRoutes({ commit }, roles) {
        return new Promise(resolve => {
            post(`${getMenuByUserId}`, {})
            .then(function (data) {
                const routers = generator(data);
                commit('SET_ROUTES', routers);
                resolve(routers);
            });
        })
    },
    generateRoutes({ commit }, roles) {
        return new Promise(resolve => {
            // 在这判断是否有权限，哪些角色拥有哪些权限
            let accessedRoutes
            if (roles && roles.length && !roles.includes('admin')) {
                accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
            } else {
                accessedRoutes = asyncRoutes || []
            }
            console.log('accessedRoutes', accessedRoutes);
            commit('SET_ROUTES', accessedRoutes)
            resolve(accessedRoutes)
        })
    },
    clearRoutes({ commit }) {
        commit('CLEAR_ROUTERS')
    }
}

const permission: Module<any, any> = {
    namespaced: true,
    state,
    mutations,
    actions
}

export default permission
