const webPush = require('web-push')
const url = require('url')
const fs = require('fs')
const path = require('path')
const vapidPublicKey = fs.readFileSync(path.resolve(__dirname, '../cert/vapid_public.pem'), 'utf-8')
const vapidPrivateKey = fs.readFileSync(path.resolve(__dirname, '../cert/vapid_private.pem'), 'utf-8')
const email = 'mailto:kongweian@163.com'
const interval = 10 * 1000
const notificationsCollection = 'notifications'
const db = require('./db')

module.exports = {
  init () {
    webPush.setVapidDetails(
      email,
      vapidPublicKey,
      vapidPrivateKey
    );
    console.log('VAPID inited!')
    this.startSchedule()
  },
  getPublicKey () {
    return vapidPublicKey
  },
  startSchedule () {
    setInterval(_checkNotifications, interval)
  }
}

async function _checkNotifications() {
  const client = db.getDb()
  if (client) {
    const collection = client.collection(notificationsCollection)
    const notifyDocs = await collection.find({}).toArray()
    for (let i = 0;i < notifyDocs.length;i++) {
      const notifyDoc = notifyDocs[i]
      const authorDoc = await db.findUser(notifyDoc.author)
      webPush.sendNotification(JSON.parse(authorDoc.subscription), `/article/${notifyDoc.article}#${notifyDoc.comment}`)
      .then(function(res) {
        collection.deleteOne({ _id: notifyDoc._id })
      })
      .catch(function(err) {
        console.error(err)
      })
    }
  }
}