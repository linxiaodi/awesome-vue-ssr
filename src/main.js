import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import App from './App'
import createStore from './store'
import createRouter from './router'

Vue.use(VueRouter)
Vue.use(Vuex)

const createApp = () => {
	const router = createRouter()
	const store = createStore()
	const app = new Vue({
		router,
		store,
		render: h => h(App)
	})
	return {
		app,
		router,
		store
	}
}

export default createApp
