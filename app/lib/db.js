const url = 'mongodb://localhost:27017'
const dbName = 'freebird'
const usersCollection = 'users'
const articlesCollection = 'articles'
const commentsCollection = 'comments'
const notificationsCollection = 'notifications'
const ObjectId = require('mongodb').ObjectId

let db = null

module.exports = {
  init () {
    const MongoClient = require('mongodb').MongoClient
    MongoClient.connect(url, function(err, client) {
      if (!err) {
        db = client.db(dbName)
        console.log('MongoDB connected!')
      } else {
        throw err
      }
    })
  },
  getDb () {
    return db
  },
  async insertUser (user) {
    let doc = await this.findUser(user.id)
    if (doc) {
      return doc
    } else {
      const collection = db.collection(usersCollection)
      return await collection.insertOne(user)
    }
  },
  async findUser (id) {
    const collection = db.collection(usersCollection)
    return await collection.findOne({ id })
  },
  async associateSubscription (user, subscription) {
    const collection = db.collection(usersCollection)
    return await collection.findOneAndUpdate({ id: user.id }, { $set: { subscription } })
  },
  async deleteSubscription (user) {
    const collection = db.collection(usersCollection)
    return await collection.findOneAndUpdate({ id: user.id }, { $set: { subscription: null } })
  },
  async likeArticle (id) {
    const collection = db.collection(articlesCollection)
    return await collection.findOneAndUpdate({ _id: ObjectId(id) }, { $inc: { like: 1 } })
  },
  async likeComment (id) {
    const collection = db.collection(commentsCollection)
    return await collection.findOneAndUpdate({ _id: ObjectId(id) }, { $inc: { like: 1 } })
  },
  async commentArticle (id, comment, user) {
    const collection = db.collection(commentsCollection)
    const doc = { article: id, comment, user: user ? user.id : null, like: 0, time: new Date() }
    const insertedResult = await collection.insertOne(doc)
    const commentDoc = await collection.findOne({ _id: insertedResult.insertedId })
    // check if the article author is available
    const articleDoc = await this.getArticle(id)
    if (articleDoc.user) {
      // check if the user has subscription
      const u = db.collection(usersCollection)
      const authorDoc = await u.findOne({ id: articleDoc.user })
      if (authorDoc && authorDoc.subscription) {
        const notify = db.collection(notificationsCollection)
        await notify.insertOne({
          type: 'comment',
          article: id,
          author: authorDoc.id,
          comment: commentDoc._id.toString(),
          commenter: user ? user.id : null
        })
      }
    }
    return await this._formatComment(doc)
  },
  async _formatComment (doc) {
    if (doc.user) {
      doc.user = await this.findUser(doc.user)
    }
    return doc
  },
  async insertArticle (user, req) {
    const content = req.body.content
    const userAgent = req.body.userAgent
    const ip = req.ip
    
    const collection = db.collection(articlesCollection)
    const userId = user ? user.id : null
    const author = user ? user.name : 'anonymous'
    const avatar = user ? user.avatar_url : null
    
    const doc = { 
      user: userId, 
      content, 
      author, 
      avatar,
      like: 0,
      time: new Date(),
      userAgent,
      ip
    }
    return await collection.insertOne(doc).then(() => {
      return doc
    })
  },
  async getComments (article) {
    const collection = db.collection(commentsCollection)
    
    let cursor = collection.find({ article })
    cursor.sort({ like: -1, time: -1 })
    const comments = await cursor.toArray()

    for (let i = 0;i < comments.length;i++) {
      await this._formatComment(comments[i])
    }
    return comments
  },
  async getArticles (since, count) {
    const collection = db.collection(articlesCollection)
    const cursor = collection.find({})
    if (since) {
      cursor.filter({ time: { $lt: new Date(since) } })
    }
    cursor.sort({ time: -1 })
    cursor.limit(count)
    const docs = await cursor.toArray()
    for (let i = 0;i < docs.length;i++) {
      await this._formatArticle(docs[i])
    }
    return docs
  },
  async getArticle (id) {
    const collection = db.collection(articlesCollection)
    const doc = await collection.findOne({ _id: ObjectId(id) })
    return await this._formatArticle(doc)
  },
  async _formatArticle (doc) {
    doc.comments_count = await this._getArticleCommentsCount(doc._id.toString())
    return doc
  },
  async _getArticleCommentsCount (article) {
    const collection = db.collection(commentsCollection)
    return await collection.count({ article })
  }
}
