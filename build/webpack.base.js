
const { resolve, isPro, mode } = require('./utils')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  output: {
    path: resolve('dist'),
    filename: '[name].[hash].js',
    publicPath: '/dist/'
  },
  mode,
  resolve: {
    extensions: ['*', '.js', '.json', '.vue', '.scss'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        include: [resolve('src')]
      },
      {
        test: /\.vue$/,
        use: 'vue-loader',
        // @see 
      },
      {
        test: /\.css$/,
        // @see https://vue-loader.vuejs.org/zh/guide/css-modules.html#%E7%94%A8%E6%B3%95
        use: isPro ? ExtractTextPlugin.extract({
          use: [
            {
              loader: 'css-loader',
              options: { minimize: true }
            }
          ],
          fallback: 'vue-style-loader'
        }) : ['vue-style-loader', 'css-loader']
      },
      {
        test: /\.scss$/,
        use: isPro
          ? ExtractTextPlugin.extract({
              use: [
                {
                  loader: 'css-loader',
                  options: { minimize: true }
                },
                'sass-loader'
              ],
              fallback: 'vue-style-loader'
            })
          : ['vue-style-loader', 'css-loader', 'sass-loader']
      },
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.PORT': JSON.stringify(process.env.PORT),
    }),
  ].concat(isPro ? [
    new ExtractTextPlugin({
      filename: 'css/[name].[hash].css'
    })
  ] : []),
  // optimization: {
  //   splitChunks: {
  //     cacheGroups: {
  //       vendor: {
  //         chunks: "initial",
  //         test: /vue|vue-router|vuex/,
  //         name: "vendor", // 使用 vendor 入口作为公共部分
  //         enforce: true,
  //       },
  //       manifest: {
  //         chunks: 'all',
  //         name: 'manifest'
  //       }
  //     }
  //   }
  // }
}

