self.addEventListener('install', function(event) {
  console.log('install')
  event.waitUntil(
    caches.open('v1').then(function(cache) {
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
        return caches.open('v1').then(function(cache) {
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