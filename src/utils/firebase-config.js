// Import the functions you need from the SDKs you need
const config = {
  apiKey: "AIzaSyBIp6u_X-pnki-DLedgYWMPQskFSIrstaE",
  authDomain: "funpark-96a09.firebaseapp.com",
  projectId: "funpark-96a09",
  storageBucket: "funpark-96a09.appspot.com",
  messagingSenderId: "736955073140",
  appId: "1:736955073140:web:84210bf77e58293ef34721",
  measurementId: "G-88M202KDTS"
};



export function getFirebaseConfig () {
  if (!config || !config.apiKey) {
    throw new Error('No Firebase configuration object provided.' + '\n' +
      'Add your web app\'s configuration object to firebase-config.js');
  } else {
    return config;
  }
}
