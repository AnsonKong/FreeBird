const url = 'mongodb://localhost:27017'
const dbName = 'freebird'
const usersCollection = 'users'
const articlesCollection = 'articles'

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
    });
  },
  async insertUser (user) {
    let doc = await this.findUser(user)
    if (!doc) {
      const collection = db.collection(usersCollection)
      doc = await collection.insertOne(user)
    }
    return doc
  },
  async findUser (user) {
    const collection = db.collection(usersCollection)
    return await collection.findOne({ id: user.id })
  },
  async insertArticle (user, req) {
    const content = req.body.content
    const userAgent = req.body.userAgent
    const ip = req.ip

    const collection = db.collection(articlesCollection)
    const userId = user ? user.id : null
    const author = user ? user.name : 'anonymous'
    const avatar = user ? user.avatar_url : null
    return await collection.insertOne({ 
      user: userId, 
      content, 
      author, 
      avatar,
      time: new Date(),
      userAgent,
      ip
    })
  },
  async getArticles (start, count) {
    const collection = db.collection(articlesCollection)
    return await collection.find({}, {
      skip: start,
      limit: count
    }).sort('time', -1).toArray()
  }
}
