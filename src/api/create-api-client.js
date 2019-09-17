import axios from 'axios'

const createApi = function() {
	return axios.create({
		baseURL: 'http://rap2api.taobao.org/app/mock/161769/'
	})
}
export default createApi()
