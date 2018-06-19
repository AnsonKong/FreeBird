const axios = require('axios')
export function detectNotification () {
  // detect sw
  if ('serviceWorker' in navigator) {
    // wait until sw is ready
    navigator.serviceWorker.ready.then(function(registration) {
      // request for notification permission
      return registration.pushManager.getSubscription().then(async function(subscription) {
        if (subscription) {
          console.log('subscription already exists')
          return subscription
        }
        // fetch VAPID PublicKey
        const response = await axios.get('/vapidPublicKey')
        const vapidPublicKey = await response.data
        const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey)
        console.log('subscription not existed, trying to subscribe...')
        // try to subscribe, this is the time prompt window popup
        return registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertedVapidKey
        }).then(function(subscription) {
          console.log('subscribed successfully!')
          console.log(subscription)
          // register subscription to the Application Server
          axios.post('/subscription/register', {
            subscription: JSON.stringify(subscription)
          })
        }).catch(err => {
          console.log('subscribed failed: ' + err)
        })
      })
    })
  }
}

export function unscribe () {
  // detect sw
  if ('serviceWorker' in navigator) {
    // wait until sw is ready
    navigator.serviceWorker.ready.then(function(reg) {
      // request for notification permission
      reg.pushManager.getSubscription().then(function(subscription) {
        if (subscription) {
          subscription.unsubscribe().then(function(successful) {
            console.info(`You've successfully unsubscribed`)
          }).catch(function(e) {
            console.info(`Unsubscription failed`)
          })
        }
      })
    })
  }
}

function urlBase64ToUint8Array(base64String) {
  var padding = '='.repeat((4 - base64String.length % 4) % 4);
  var base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');
 
  var rawData = window.atob(base64);
  var outputArray = new Uint8Array(rawData.length);
 
  for (var i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}