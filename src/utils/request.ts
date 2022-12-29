import axios, { AxiosRequestConfig } from "axios";
import { getToken, setToken } from '@/utils/auth';
import { ElMessage, ElMessageBox } from "element-plus";
import router from '@/router'
const service = axios.create({ // 生产环境下
	baseURL: "/api"
});

// http request 拦截器
axios.interceptors.request.use(function (config) {
	// 配置config
	config.headers.Accept = 'application/json'
	// 判断是否是
	if (config.url.indexOf('login') <= -1 && config.url.indexOf('freeLogin') <= -1) {
		let token = getToken();
		if (token) {
			config.headers['Authorization'] = token;
		}
	}
	// 判断是否是
	if (config.url.indexOf('freeLogin') > -1) {
		// 获取传递的参数
		let id = config.data.id
		config.headers['my-id'] = id
	}
	return config
});

// 只返回data
axios.interceptors.response.use((res: any) => {
	if (res.data.code === '4003') {
		setToken('');
		// 如果后端token失效,清楚token,从新登录
		router.replace({
			path: 'login'
		})
	};
	return res.data;
});

/**
 *  GET请求
 * @param url
 * @param params
 */
export async function get(url: string, params?: any) {
	return new Promise((resolve, reject) => {
		axios.get(url, {
			params: params
		}).then(res => {
			resolve(res.data);
		}).
			catch(err => {
				reject(err.data)
			})
	})
}

/**
 * POST请求
 * @param url
 * @param params
 */
export async function post(url: string, params?: any,) {
	return new Promise((resolve, reject) => {
		axios.post(url, {timeout: 10000, ...params}).then((res: any) => {
			if(res.code === "5003") {
				ElMessage.error(res.msg);
				reject(res.msg)
			};
			resolve(res.data);
		}).
			catch(err => {
				reject(err.data)
			})
	})
}


/**
 *  delete请求
 * @param url
 * @param params
 */
export async function deleteItem(url: string, params?: any) {
	return new Promise((resolve, reject) => {
		axios.delete(url, params).then(res => {
			resolve(res.data);
		}).
			catch(err => {
				reject(err.data)
			})
	})
}