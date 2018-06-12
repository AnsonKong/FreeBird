const Koa = require('koa')
const app = new Koa()
const serve = require('koa-static')
const mount = require('koa-mount')
const router = require('koa-router')()
const logger = require('koa-logger')
const body = require('koa-body')
const ssr = require('./app/middleware/vueSSR')
const passport = require('./app/middleware/passport')
const fs = require('fs')

if (process.env.proxy) {
  app.proxy = true
}

const isProduction = process.env.NODE_ENV === 'production'

// mongodb
require('./app/lib/db').init()

// setup logger
app.use(logger())
// setup session
app.keys = require('./app/config/signedCookieKeys')
app.use(require('./app/middleware/userSessionState'));
// setup ssr
const ssrMiddleware = ssr(app, { env: process.env.NODE_ENV })
if (!isProduction) {
  app.use(require('./app/middleware/vfsStaticFilesCheck')({ vfs: app.vfs }))
}
// setup & mount static files at '/public`
app.use(mount('/public', serve('app/public', {
  maxage: 365 * 24 * 60 * 60 * 1000
})))
// setup routes
const article = require('./app/middleware/article')
router.get('/logout', passport.logout)
router.get('/passport/github', passport.request)
router.get('/passport/github/callback', passport.callback)
router.get('/sw.js', (ctx, next) => {
  ctx.type = 'application/javascript'
  ctx.body = fs.readFileSync('./app/sw/index.js')
})
// articles
router.get('/articles', article.gets)
router.post('/articles', body(), article.add)
// setup vuessr
router.get('*', ssrMiddleware)
app.use(router.routes())

const port = process.env.port || 3000
app.listen(port)
