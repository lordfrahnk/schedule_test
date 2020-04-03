import firebase from 'firebase'
import 'firebase/firestore'

// firebase init goes here
const config = {
  apiKey: "AIzaSyBdkWLLUwsaI1KDpmW8pLzxSVt9rvJe8Ck",
  authDomain: "scheduler-dfc68.firebaseapp.com",
  databaseURL: "https://scheduler-dfc68.firebaseio.com",
  projectId: "scheduler-dfc68",
  storageBucket: "scheduler-dfc68.appspot.com",
  messagingSenderId: "525041330600",
  appId: "1:525041330600:web:c65120eaadcba0854a959d"
}

firebase.initializeApp(config)

// firebase utils
const db = firebase.firestore()

export { db }
