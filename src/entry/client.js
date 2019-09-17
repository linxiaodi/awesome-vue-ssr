import createApp from '../main'
const { app, store, router } = createApp()


/**
 * 客户端渲染
 * 1. 提取将要进入路由的所有组件
 * 2. 过滤掉from与to重复的组件（先不做这里）
 * 3. 取出过滤组件的所有asyncData
 * */
router.onReady(() => {
	router.beforeResolve((to, from, next) => {
		// from components
		const preMatchComponents = router.getMatchedComponents(from)
		// to components
		const matchComponents = router.getMatchedComponents(to).filter((c) => c && c.asyncData)
		if (matchComponents.length < 1) {
			return next()
		}

		Promise.all(matchComponents.map((components) => {
			return components.asyncData.call(components, { store, router })
		})).then(() => {
			next()
		}).catch(() => next())
	})
})

if (window.__INITIAL_STATE__) {
	store.replaceState(window.__INITIAL_STATE__)
}

app.$mount('#app')
