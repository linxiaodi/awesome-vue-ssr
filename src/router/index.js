import VueRouter from 'vue-router'
import Home from '@/views/home/index.vue'
import Article from '@/views/article/index.vue'

export default function createRouter() {
	return new VueRouter({
		mode: 'history',
		routes: [
			{
				path: '/',
				component: Home
			},
			{
				path: '/article',
				name: 'article',
				component: Article
			}
		]
	})
}
