/**
 *
 */
import createApp from '../main';
import { setRequestParams } from '@/api/create-api-server';

// const idDev = process.env.NODE_ENV !== 'production';

/**
 * @param { string } context.url 匹配的路由
 * @return { Promise } 当匹配的组件完成api的获取，store的改变。
 * @see https://ssr.vuejs.org/zh/guide/data.html#%E6%9C%8D%E5%8A%A1%E5%99%A8%E7%AB%AF%E6%95%B0%E6%8D%AE%E9%A2%84%E5%8F%96-server-data-fetching
 */
export default context => {
	return new Promise(async (resolve, reject) => {
		const { url, request } = context;
		// 访问页面发出的request
		setRequestParams(request);
		const { app, router, store } = createApp();
		const { fullPath, matched } = router.resolve(url).route;
		if (fullPath !== url) {
			return reject({ url: fullPath });
		}
		// 当路由匹配到异步组件
		router.push(url);
		// resolve(app)
		router.onReady(async () => {
			const matchedComponents = router.getMatchedComponents();
			// 如果没有匹配的组件，其实可以在router里面设置404匹配的组件
			if (matchedComponents.length === 0) {
				return reject({ code: 404 });
			}
			// 在第一次SSR之后
			await Promise.all(matchedComponents.map((component) => {
				if (component.asyncData) {
					return component.asyncData.call(component, { router, store });
				}
			})).then(() => {
				context.state = store.state
				resolve(app)
			}).catch(reject)
		}, reject)
	})
}

