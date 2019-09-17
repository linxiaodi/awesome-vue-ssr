const express = require('express')
const fs = require('fs')
const { createBundleRenderer } = require('vue-server-renderer')
const { resolve } = require('../build/utils');
const path = require('path')

// 部署入口

// app.use('api')

/**
 * 创建一个renderer
 * @see https://ssr.vuejs.org/zh/guide/bundle-renderer.html#%E4%BC%A0%E5%85%A5-bundlerenderer
 */
const createRenderer = function(bundle, options = {}) {
	return createBundleRenderer(bundle, Object.assign(options, {
		template: fs.readFileSync('./index.html', 'utf-8'),
		// cache: LRU({
		//   max: 1000,
		//   maxAge: 1000 * 60 * 15
		// }),

		// 这个地方有坑，如果你不配置baseDir一直就不会走客户端渲染，一直走服务端
		basedir: path.resolve(__dirname, './dist'),
		// runInNewContext: 'once'
	}))
}

// 服务端
const serverManifest = require('../dist/vue-ssr-server-bundle.json')
const clientManifest = require('../dist/vue-ssr-client-manifest.json')

const renderer = createRenderer(serverManifest, {
	clientManifest
})

const serve = (path, cache) => express.static(resolve(path), {
	maxAge: cache && 1000 * 60 * 60 * 24 * 30
})

const app = express();

app.use('/dist', serve('./dist'))

// 第一次客户端渲染进来
app.get('*', (req, res) => {
	res.setHeader('Content-Type', 'text/html')
	// 转发
	const context = {
		title: 'linweikun,前端工程师', // default title
		url: req.url,
		request: {
			headers: req.headers,
			protocol: req.protocol,
			ip: req.ip,
			hostname: req.hostname,
		}
	}

	renderer.renderToString(context, (err, html) => {
		if (err) {
			if (err.url) {
				res.redirect(err.url);
			} else if (err.code === 404) {
				res.status(404).send('404 | Page Not Found');
			} else {
				// Render Error Page or Redirect
				res.status(500).send('500 | Internal Server Error');
				console.error(`error during render : ${req.url}`);
				console.error(err.stack);
			}
		} else {
			if (context.httpStatus) res.status(context.httpStatus);
			res.send(html);
		}
	})
})

const port = process.env.PORT || 8080

app.listen(port, () => {
	console.log(`> server started at localhost:${port}\n`)
})
