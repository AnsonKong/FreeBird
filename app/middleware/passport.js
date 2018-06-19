'use strict'
const isProduction = process.env.NODE_ENV === 'production'

const oauth = require(`../config/oauth.${isProduction ? 'prod' : 'dev'}`)
const axios = require('axios')
const sessionConst = require('../lib/session-const')
const db = require('../lib/db')

module.exports = {
  async logout (ctx, next) {
    // delete session_user
    ctx.cookies.set(sessionConst.sessionUserKey)
    if (ctx.state.user) {
      // delete subscription
      await db.deleteSubscription(ctx.state.user)
    }
    ctx.redirect('/')
  },
  async request (ctx, next) {
    ctx.redirect(`https://github.com/login/oauth/authorize?client_id=${oauth.client_id}`)
    ctx.body = 'Redirecting to GitHub OAuth...'
  },
  async callback (ctx, next) {
    const code = ctx.query.code
    if (code) {
      let access_token
      // get access_token
      await axios.post('https://github.com/login/oauth/access_token', {
        client_id: oauth.client_id,
        client_secret: oauth.client_secret,
        code
      }, {
        headers: {
          'Accept': 'application/json'
        }
      })
      .then(response => {
        access_token = response.data.access_token
      })
      .catch(err => {
        throw err
      });
      // get user info
      const response = await axios.get('https://api.github.com/user', {
        headers: {
          'Authorization': `token ${access_token}`
        }
      })
      const user = response.data
      // save to db
      const doc = await db.insertUser(user)
      // save to session
      ctx.cookies.set(sessionConst.sessionUserKey, JSON.stringify(user), {
        maxAge: sessionConst.sessionUserMaxAge,
        signed: true
      })
      // put in session
      ctx.redirect('/')
    } else {
      ctx.status = 403
      ctx.body = null
    }
  }
}
