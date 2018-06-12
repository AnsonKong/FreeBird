module.exports = {
  async add (ctx, next) {
    const db = require('../lib/db')
    await db.insertArticle(ctx.state.user, ctx.request).then(doc => {
      ctx.body = { code: 0 }
    }).catch(err => {
      ctx.body = { code: -1 }
    })
  },
  async gets (ctx, next) {
    const db = require('../lib/db')
    const start = ctx.request.query.start || 0
    const count = ctx.request.query.count || 10

    const docs = await db.getArticles(parseInt(start), parseInt(count))
    ctx.body = docs
  }
}