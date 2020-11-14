import firebase from 'firebase'

const firebaseConfig = {
    apiKey: "AIzaSyDS7gQ7DxDfRLztK9hIqjxTzc7WfWyOrrQ",
    authDomain: "discord-mern-clone-73add.firebaseapp.com",
    databaseURL: "https://discord-mern-clone-73add.firebaseio.com",
    projectId: "discord-mern-clone-73add",
    storageBucket: "discord-mern-clone-73add.appspot.com",
    messagingSenderId: "85847119163",
    appId: "1:85847119163:web:28c7aabd4b2e48ea24131e"
  };

const firebaseApp = firebase.initializeApp(firebaseConfig)

const db = firebaseApp.firestore()
const auth = firebase.auth()
const provider = new firebase.auth.GoogleAuthProvider()

export { auth, provider }
export default db