// firebase-messaging-sw.js

// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js");
importScripts(
    "https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js"
);

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
    apiKey: "AIzaSyAU-KlK94rJyP6a_A3lRhmLgGA0qq-ru4c",
    authDomain: "sunib-curhat.firebaseapp.com",
    databaseURL: "https://sunib-curhat.firebaseio.com",
    projectId: "sunib-curhat",
    storageBucket: "sunib-curhat.appspot.com",
    messagingSenderId: "1054913270809",
    appId: "1:1054913270809:web:bd182360399e82b7f6c688",
    measurementId: "G-RE72N4NJFJ"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: __dirname + '/favicon.ico'
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});