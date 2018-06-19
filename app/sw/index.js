const v = 3
const oldName = `freebird-v${v - 1}`
const cacheName = `freebird-v${v}`
self.addEventListener('install', function(event) {
  console.log('installed: ' + cacheName)
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll([
        '/',
        '/public/bg.jpg'
      ]);
    })
  );
});

self.addEventListener('activate', function(event) {
  console.log('activate')
})

self.addEventListener('fetch', function(event) {
  event.respondWith(
    fetch(event.request).then(res => {
      if (isCachable(event.request)) {
        return caches.open(cacheName).then(function(cache) {
          cache.put(event.request, res.clone())
          return res
        })
      } else {
        return res
      }
    }).catch(function() {
      return caches.match(event.request);
    })
  );
});

/**
 * only cache request under registration scope
 * @param {Request} request 
 */
function isCachable(request) {
  return (request.method === 'GET' && request.url.indexOf(registration.scope) === 0)
}

self.addEventListener('push', function(event) {
  console.log('push received')
  const payload = event.data ? event.data.text() : '/'
  event.waitUntil(
    self.registration.showNotification('Notification', {
      body: 'Someone just commented your article, click here to check it out!',
      icon: '/public/icon-192.png',
      data: payload
    })
  )
})

self.addEventListener('notificationclick', function(event) {
  console.log('On notification click: ', event.notification.tag);
  event.notification.close();
  // open new window to the article
  event.waitUntil(clients.openWindow(event.notification.data))
});