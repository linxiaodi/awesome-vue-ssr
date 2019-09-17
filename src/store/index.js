import Vuex from 'vuex';
import * as api from '../api/index'

export default function createStore() {
	return new Vuex.Store({
		state: {
			head: {
				title: '',
				meta: {}
			},
			home: [],
			article: {
				title: '',
				desc: '',
				author: ''
			}
		},
		actions: {
			FETCH_HOME({ commit }) {
				return api.getIndex().then((res) => {
					commit('FETCH_HOME', res.data)
				})
			},
			FETCH_ARTICLE({ commit }) {
				return api.getDetail().then((res) => {
					commit('FETCH_ARTICLE', res.data)
				})
			}
		},
		mutations: {
			FETCH_HOME(state, data) {
				state.home = data.list
			},
			FETCH_ARTICLE(state, data) {
				Object.assign(state.article, data)
				state.head.title = data.title
			}
		}
	})
}

