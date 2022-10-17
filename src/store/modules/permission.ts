import { Module } from "vuex";
import Layout from "@/layout/index.vue";
import { post } from "@/utils/request";
import { asyncRoutes, constantRoutes } from '@/router/index';
import { constantRouterComponents } from '@/config/constants';
import { getMenuByUserId } from '@/config/api';
import { el } from "element-plus/es/locale";
import router from '../../router'
import { setToken } from '@/utils/auth'
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
    routes.forEach(el => {
        const { name, path, meta, parentId} = el || {};
        const currentRouter: currentRouter = {
            path:  path || name,
            name: name,
            component: constantRouterComponents[name],
            meta: meta
        };
        if (el.children && el.children.length !== 0) {
            currentRouter.children = generator(el.children)
        } else {
            delete currentRouter.children;
        };
        res.push(currentRouter);
    });
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
