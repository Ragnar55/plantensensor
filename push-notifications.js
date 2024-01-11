
    //kijkt of push notifications gesupport worden
function isPushNotificationSupported() {
    return "serviceWorker" in navigator && "PushManager" in window;
}
  
    //vraagt aan de gebruikt of die push wilt ontvangen en return het antwoord
function initializePushNotifications() {
    return Notification.requestPermission(function(result) {
      return result;
    });
}

function sendNotification() {
    const text = "Take a look at this brand new t-shirt!";
    const title = "New Product Available";
    const options = {
      body: text,
      vibrate: [200, 100, 200],
      tag: "new-product",
      image: img,
      badge: "https://spyna.it/icons/android-icon-192x192.png",
      actions: [{ action: "Detail", title: "View", icon: "https://via.placeholder.com/128/ff0000" }]
    };
    navigator.serviceWorker.ready.then(function(serviceWorker) {
      serviceWorker.showNotification(title, options);
    });
}
  
  /**
   * 
   */
function registerServiceWorker() {
    navigator.serviceWorker.register("/sw.js").then(function(swRegistration) {
      //you can do something with the service wrker registration (swRegistration)
    });
}
  
export {
    isPushNotificationSupported,
    initializePushNotifications,
    registerServiceWorker,
    sendNotification
};