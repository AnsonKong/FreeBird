'use strict'

/**
 * Module dependencies.
 */

const path = require('path')
const { createBundleRenderer } = require('vue-server-renderer')
const vfsUtil = require('../lib/VFSUtil')

/**
 * Expose `render()`.
 */

module.exports = render

/**
 * server-side-render vue pages
 * @param {Application} app
 * @param {Object} options
 * @api public
 */
function render(app, opts) {
  opts = opts || {};
  opts.env = 'env' in opts ? opts.env : 'development'

  const isProduction = opts.env === 'production'
  const serverBundleURL = path.resolve(__dirname, '../ssr/vue-ssr-server-bundle.json')
  const clientManifestURL = path.resolve(__dirname, '../public/vue-ssr-client-manifest.json')
  const template = require('fs').readFileSync(path.resolve(__dirname, '../view/index.template.html'), 'utf-8')

  let serverBundle
  let clientManifest
  let renderer
  // build up VFS in development
  if (!isProduction) {
    const MemoryFS = require("memory-fs");
    const webpackServerConfig = require('../../build/webpack.server.config.js')
    const webpackClientConfig = require('../../build/webpack.client.config.js')
    const webpack = require('webpack')

    const vfs = new MemoryFS()
    // attach `vfs` to app
    app.vfs = vfs
    // build up Webpack dynamic complie
    const serverCompiler = webpack([webpackServerConfig, webpackClientConfig])
    serverCompiler.outputFileSystem = vfs
    const serverWatching = serverCompiler.watch({
      aggregateTimeout: 300,
      poll: undefined
    }, (err, stats) => {
      if (err) {
        console.error(err);
        return;
      }
      // re-init renderer every complie
      serverBundle = JSON.parse(vfsUtil.extract(vfs, serverBundleURL))
      clientManifest = JSON.parse(vfsUtil.extract(vfs, clientManifestURL))
      _initRenderer()
    
      console.log(stats.toString({
        chunks: false,  // Makes the build much quieter
        colors: true    // Shows colors in the console
      }));
    })
  } else {
    serverBundle = require(serverBundleURL)
    clientManifest = require(clientManifestURL)
    _initRenderer()
  }

  function _initRenderer () {
    renderer = createBundleRenderer(serverBundle, {
      runInNewContext: false,
      template,
      clientManifest
    })
  }
  
  return async (ctx, next) => {
    // skip static files
    if (path.extname(ctx.path) !== '') {
      return next()
    }

    const user = ctx.state.user
    const context = { url: ctx.url, user }
    await renderer.renderToString(context).then(html => {
      ctx.body = html
    }).catch(err => {
      throw err
    })
  }
}
