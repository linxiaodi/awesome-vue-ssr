const baseConfig = require('./webpack.base.js')
const merge = require('webpack-merge')
const { resolve, isPro } = require('./utils')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
const webpack = require('webpack')

module.exports = merge(baseConfig, {
  entry: {
    client: resolve('src/entry/client.js')
  },
  devtool: '#source-map',
  plugins: [
    new VueSSRClientPlugin(),
    new webpack.DefinePlugin({
      'process.env.VUE_ENV': JSON.stringify('client'),
    }),
  ],
  resolve: {
    alias: {
      'http-api': resolve('src/api/create-api-client'),
    }
  },
  optimization: isPro ? {
    splitChunks: {
      cacheGroups: {
        vendor: {
          chunks: "initial",
          test: /vue|vue-router|vuex/,
          name: "vendor", // 使用 vendor 入口作为公共部分
          enforce: true,
        },
        manifest: {
          chunks: 'all',
          name: 'manifest'
        }
      }
    }
  } : {},
})
