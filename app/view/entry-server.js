import { createApp } from './app'

export default context => {
  return new Promise((resolve, reject) => {
    const { app, router, store } = createApp()

    // setup store
    if (context.user) {
      store.dispatch('updateUser', context.user)
    }
    router.push(context.url)
    
    router.onReady(() => {
      const matchedComponents = router.getMatchedComponents()
      if (!matchedComponents.length) {
        return reject({ code: 404 })
      }

      Promise.all(matchedComponents.map(c => {
        if (c.asyncData) {
          return c.asyncData({
            store,
            route: router.currentRoute
          })
        }
      })).then(() => {
        context.state = store.state

        resolve(app)
      }).catch(reject)
    }, reject)
  })
}
