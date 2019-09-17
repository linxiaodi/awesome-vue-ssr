
import axios from 'axios'

let requestParams = {};

const interceptor = {
	onRequest(req) {
		if (requestParams.headers && requestParams.headers.cookie) {
			// 设置cookie
			req.headers.cookie = requestParams.headers.cookie;
		}
		// added http_x
		req.headers['user-agent'] = requestParams.headers['user-agent'];
		req.headers['accept-language'] = requestParams.headers['accept-language'];
		// req.headers.host = requestParams.headers.host;
		
		return req;
	},
	onRequestError() {
		return Promise.reject();
	},
	onResponse() {
		return Promise.resolve(res);
	},
	onResponseError() {
	}
};

// 保持cookie的动态化
export const setRequestParams = request => {
	requestParams = request;
};

const createApi = function() {
	const instance = axios.create({
		baseURL: 'http://rap2api.taobao.org/app/mock/161769/'
	})
	instance.interceptors.request.use(interceptor.onRequest, interceptor.onRequestError)
	return instance
}

export default createApi()
