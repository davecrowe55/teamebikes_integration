The core Firebase JS SDK is always required and must be listed first
<script src="https://www.gstatic.com/firebasejs/8.2.2/firebase-app.js"></script>

<!----> TODO: Add SDKs for Firebase products that you want to use
     https://firebase.google.com/docs/web/setup#available-libraries -->
<script src="https://www.gstatic.com/firebasejs/8.2.2/firebase-analytics.js"></script> -->

<script>
  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  var firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: "ebike-integrate.firebaseapp.com",
    databaseURL: "https://ebike-integrate-default-rtdb.firebaseio.com",
    projectId: "ebike-integrate",
    storageBucket: "ebike-integrate.appspot.com",
    messagingSenderId: process.env.FIREBASE_SENDER_ID,
    appId: process.env.FIREBASE_API_ID,
    measurementId: "G-ZSHZ6X7HFZ"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();
</script>