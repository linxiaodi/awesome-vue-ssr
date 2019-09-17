const path = require('path')
const express = require('express')
const compression = require('compression')
const microcache = require('route-cache')
const { resolve, isPro } = require('../build/utils')
const { createBundleRenderer } = require('vue-server-renderer')
const proxy = require('express-http-proxy');

const useMicroCache = process.env.MICRO_CACHE !== 'false'
const serverInfo =
	`express/${require('express/package.json').version} ` +
	`vue-server-renderer/${require('vue-server-renderer/package.json').version}`

const { PROXY = 'http://localhost:9090', PORT = 8080 } = process.env;

const app = express()

function createRenderer (bundle, options) {
	// https://github.com/vuejs/vue/blob/dev/packages/vue-server-renderer/README.md#why-use-bundlerenderer
	return createBundleRenderer(bundle, Object.assign(options, {
		// for component caching
		// cache: LRU({
		//   max: 1000,
		//   maxAge: 1000 * 60 * 15
		// }),
		// this is only needed when vue-server-renderer is npm-linked
		basedir: resolve('./dist'),
		// recommended for performance
		runInNewContext: false
	}))
}

let renderer

const templatePath = resolve('./index.html')
// In development: setup the dev server with watch and hot-reload,
// and create a new renderer on bundle / index template update.
const readyPromise = require('../build/setup-dev-server')(
	app,
	templatePath,
	/**
	 * @params { string } bundle vue-ssr-server-bundle.json
	 * @params { object } options 编译成renderer
	 */
	(bundle, options) => {
		renderer = createRenderer(bundle, options)
	}
)
const serve = (path, cache) => express.static(resolve(path), {
	maxAge: cache && isPro ? 1000 * 60 * 60 * 24 * 30 : 0
})

// app.use(favicon('./public/logo-48.png'))

app.use(compression({ threshold: 0 }))
app.use('/api/', proxy(PROXY, {
	proxyReqPathResolver: (req) => {
		console.log(req.originalUrl);
		return req.originalUrl;
	},
	timeout: 5000,
}))
app.use('/dist', serve('./dist', true))
app.use('/public', serve('./public', true))
app.use('/manifest.json', serve('./manifest.json', true))
// app.use('/service-worker.js', serve('./dist/service-worker.js'))

// since this app has no user-specific content, every page is micro-cacheable.
// if your app involves user-specific content, you need to implement custom
// logic to determine whether a request is cacheable based on its url and
// headers.
// 1-second microcache.
// https://www.nginx.com/blog/benefits-of-microcaching-nginx/
app.use(microcache.cacheSeconds(1, req => useMicroCache && req.originalUrl))

/* 生产环境 */
function render (req, res) {
	const s = Date.now()

	res.setHeader("Content-Type", "text/html")
	res.setHeader("Server", serverInfo)

	const handleError = err => {
		if (err.url) {
			res.redirect(err.url)
		} else if (err.code === 404) {
			res.status(404).send('404 | Page Not Found')
		} else {
			// Render Error Page or Redirect
			res.status(500).send('500 | Internal Server Error')
			console.error(`error during render : ${req.url}`)
			console.error(err.stack)
		}
	}

	const context = {
		title: 'linweikun,前端工程师,JavaScript,', // default title
		url: req.url,
		request: {
			headers: req.headers,
			protocol: req.protocol,
			ip: req.ip,
			hostname: req.hostname,
		}
	}

	// 输出html
	renderer.renderToString(context, (err, html) => {
		if (err) {
			return handleError(err)
		}
		res.send(html)
		if (!isPro) {
			console.log(`whole request: ${Date.now() - s}ms`)
		}
	})
}

app.get('*', (req, res) => {
	// dev
	readyPromise.then(() => render(req, res))
})

const port = PORT || 8080
app.listen(port, () => {
	console.log(`server started at localhost:${port}`)
})
