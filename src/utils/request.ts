import axios, {AxiosRequestConfig} from "axios";

// 之阿多诺
axios.interceptors.response.use(res => {
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
export async function post(url: string, params?: any) {
    return new Promise((resolve, reject) => {
		axios.post(url, params).then(res => {
			console.log('url-----', url);
			console.log('res', res);
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
			console.log('url-----', url);
			console.log('res', res);
			resolve(res.data);
		}).
		catch(err => {
			reject(err.data)
		})
	})
}