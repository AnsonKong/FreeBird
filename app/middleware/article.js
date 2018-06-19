const db = require('../lib/db')
module.exports = {
  async addArticle (ctx, next) {
    ctx.body = await db.insertArticle(ctx.state.user, ctx.request)
  },
  async likeArticle (ctx, next) {
    const id = ctx.request.body.id
    await db.likeArticle(id).then(doc => {
      ctx.body = { code: 0 }
    }).catch(err => {
      ctx.body = { code: -1 }
    })
  },
  async getArticles (ctx, next) {
    const since = ctx.request.query.since
    const count = ctx.request.query.count || 10
    ctx.body = await db.getArticles(since, parseInt(count))
  },
  async getArticle (ctx, next) {
    const id = ctx.params.id
    ctx.body = await db.getArticle(id)
  },
  // comments
  async getComments (ctx, next) {
    const article = ctx.request.query.article
    if (article) {
      const since = ctx.request.query.since
      const count = ctx.request.query.count || 10
      ctx.body = await db.getComments(article, since, parseInt(count))
    } else {
      ctx.status = 400
    }
  },
  async addComment (ctx, next) {
    const article = ctx.request.body.article
    const comment = ctx.request.body.comment
    ctx.body = await db.commentArticle(article, comment, ctx.state.user)
  },
  async likeComment (ctx, next) {
    const id = ctx.request.body.id
    await db.likeComment(id).then(doc => {
      ctx.body = { code: 0 }
    }).catch(err => {
      ctx.body = { code: -1 }
    })
  }
}