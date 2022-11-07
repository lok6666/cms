import { Module } from "vuex";
import { getToken, setToken, removeToken, getUserId, setUserId } from '@/utils/auth'
import { get, post, deleteItem } from "@/utils/request";
import {
    login,
} from "@/config/api";
const state = {
    token: getToken(),
    userId: getUserId(),
    userInfo: {
        username: ''
    },
    roles: localStorage.roles ? JSON.parse(localStorage.roles) : [],
}

const mutations = {
    SET_TOKEN: (state, token) => {
        state.token = token
    },
    SET_USERID: (state, userId) => {
        localStorage.userInfo = userId
        state.userId = userId
    },
    SET_ROLES: (state, roles) => {
        localStorage.roles = JSON.stringify(roles)
        state.roles = roles
    },
    SET_USERNAME: (state, username) => {
        localStorage.username = username
        state.userInfo.username = username
    }
}


const actions = {
    // 登录
    login({ commit, dispatch }, userInfo) {
        const { username, password } = userInfo
        return new Promise(async (resolve, reject) => {
            post(`${login}`, {
                headers: {
                    "Access-Control-Allow-Origin": "*",
                },
                username,
                password,
            }).then(async function ({ token, userId }) {
                commit('SET_USERNAME', username)
                commit('SET_TOKEN', token)
                commit('SET_USERID', userId)
                await dispatch('getInfo', ['admin']) // 获取权限列表 默认就是超级管理员，因为没有进行接口请求 写死
                setToken(token)
                setUserId(userId)
                resolve(token)
            });
        })
    },
    // 获取用户信息 ，如实际应用中 可以通过token通过请求接口在这里获取用户信息
    getInfo({ commit, state }, roles) {
        return new Promise((resolve, reject) => {
            commit('SET_ROLES', roles)
            resolve(roles)
        })
    },
    // 退出
    logout({ commit, state, dispatch }) {
        return new Promise((resolve, reject) => {
            removeToken()
            commit('SET_TOKEN', '')
            commit('SET_USERID', '')
            commit('SET_ROLES', '')
            resolve(null)
        })
    },
}


const user: Module<any, any> = {
    namespaced: true,
    state,
    actions,
    mutations,
}

export default user
