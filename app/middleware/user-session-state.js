const sessionConst = require('../lib/session-const')

module.exports = async (ctx, next) => {
  const str = ctx.cookies.get(sessionConst.sessionUserKey, { signed: true })
  if (str) {
    ctx.state.user = JSON.parse(str)
  }
  await next()
}
