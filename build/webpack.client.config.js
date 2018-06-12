const merge = require('webpack-merge')
const baseConfig = require('./webpack.base.config')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
const path = require('path')

module.exports = merge(baseConfig, {
  entry: path.resolve(__dirname, '../app/view/entry-client.js'),
  output: {
    filename: '[name].[chunkhash].js',
    path: path.resolve(__dirname, '../app/public'),
    publicPath: '/public/'
  },
  plugins: [
    new VueSSRClientPlugin()
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
      name: false,
      cacheGroups: {
        'vue': {
          test: /[\\/]vue[\\/]/,
        },
        'vue-router': {
          test: /[\\/]vue\-router[\\/]/,
        },
        'vuex': {
          test: /[\\/]vuex[\\/]/,
        }
      },
    },
  }
})
