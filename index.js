const Koa = require('koa')
const app = new Koa()
const serve = require('koa-static')
const mount = require('koa-mount')
const router = require('koa-router')()
const logger = require('koa-logger')
const body = require('koa-body')
const ssr = require('./app/middleware/vue-ssr')
const passport = require('./app/middleware/passport')
const compress = require('koa-compress')
const fs = require('fs')

if (process.env.proxy) {
  app.proxy = true
}

const isProduction = process.env.NODE_ENV === 'production'

// mongodb
require('./app/lib/db').init()
// web-push-util
require('./app/lib/web-push-util').init()

// setup logger
app.use(logger())
// setup session
app.keys = require('./app/config/signed-cookie-keys')
app.use(require('./app/middleware/user-session-state'));
// setup ssr
const ssrMiddleware = ssr(app, { env: process.env.NODE_ENV })
if (!isProduction) {
  app.use(require('./app/middleware/vfs-static-files-check')({ vfs: app.vfs }))
}
// setup & mount static files at '/public`
app.use(mount('/public', serve('app/public', {
  maxage: 365 * 24 * 60 * 60 * 1000
})))
// setup routes
router.get('/logout', passport.logout)
router.get('/passport/github', passport.request)
router.get('/passport/github/callback', passport.callback)
const swBuffer = fs.readFileSync('./app/sw/index.js')
router.get('/sw.js', (ctx, next) => {
  ctx.type = 'application/javascript'
  ctx.body = swBuffer
})
// articles
const article = require('./app/middleware/article')
router.get('/api/articles', article.getArticles)
router.get('/api/article/:id', article.getArticle)
router.post('/api/articles', body(), article.addArticle)
router.post('/api/article/like', body(), article.likeArticle)
// comments
router.post('/api/comments', body(), article.addComment)
router.post('/api/comment/like', body(), article.likeComment)
router.get('/api/comments', article.getComments)
// push notifications
router.get('/vapidPublicKey', function(ctx, next) {
  ctx.body = require('./app/lib/web-push-util').getPublicKey()
});
router.post('/subscription/register', body(), require('./app/middleware/subscription').register)
// setup vuessr
router.get('*', ssrMiddleware)
app.use(compress())
app.use(router.routes())

const port = process.env.port || 3000
app.listen(port)
