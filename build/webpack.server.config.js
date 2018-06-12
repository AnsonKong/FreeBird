const merge = require('webpack-merge')
const nodeExternals = require('webpack-node-externals')
const baseConfig = require('./webpack.base.config')
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')
const path = require('path')
const isProduction = process.env.NODE_ENV === 'production'

module.exports = merge(baseConfig, {
  entry: path.resolve(__dirname, '../app/view/entry-server.js'),
  target: 'node',
  output: {
    path: path.resolve(__dirname, '../app/ssr'),
    libraryTarget: 'commonjs2'
  },
  externals: nodeExternals({
    whitelist: [/\.css$/, /\?vue&type=style/]
  }),
  plugins: [
    new VueSSRServerPlugin()
  ]
})
