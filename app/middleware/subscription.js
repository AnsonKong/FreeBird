const webPush = require('web-push')
const db = require('../lib/db')
// const subscribers = []
module.exports = {
  async register (ctx, next) {
    if (ctx.state.user) {
      const subscription = ctx.request.body.subscription
      // associate subscription with user
      const userDoc = await db.associateSubscription(ctx.state.user, subscription)
      // subscribers.push(subscription)
      ctx.status = 201
    } else {
      ctx.status = 401
    }
    // const req = ctx.request
    // const subscription = req.body.subscription;
    // const options = {
    //   TTL: req.body.ttl
    // };
    // return webPush.sendNotification(subscription, payload, options)
    // .then(function() {
    //   ctx.status = 201
    // })
    // .catch(function(err) {
    //   ctx.status = 500
    // });
  },

}
function schedule () {
  setInterval(function() {
    const options = {
      TTL: 0
    };
    subscribers.forEach(subscription => {
      webPush.sendNotification(subscription, 'this is a schedule task', options)
    })
  }, 5000)
}