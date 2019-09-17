/**
 * 打包 src/entry-server.js
 */

const base = require('./webpack.base')
const merge = require('webpack-merge')
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')
const { resolve } = require('./utils')
const nodeExternals = require('webpack-node-externals')
const webpack = require('webpack')


module.exports = merge(base, {
  target: 'node',
  // devtool: '#source-map',
  entry: {
    server: resolve('src/entry/server.js')
  },
  output: {
    libraryTarget: 'commonjs2',
  },
  resolve: {
    alias: {
      'http-api': resolve('src/api/create-api-server'),
    }
  },
  externals: nodeExternals({
    // do not externalize CSS files in case we need to import it from a dep
    whitelist: /\.css$/
  }),
  plugins: [
    new VueSSRServerPlugin(),
    new webpack.DefinePlugin({
      'process.env.VUE_ENV': JSON.stringify('server'),
    }),
  ]
})
