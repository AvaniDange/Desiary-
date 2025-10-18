// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage, ref, uploadBytes } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC5vyJx-bYyCZ-JwsGe611nMGxbxJ6haY8",
  authDomain: "desiary-913bc.firebaseapp.com",
  projectId: "desiary-913bc",
  storageBucket: "desiary-913bc.appspot.com",
  messagingSenderId: "405168222671",
  appId: "1:405168222671:web:4b338d14d97258304962ba",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const provider = new GoogleAuthProvider();

export { auth, provider, db, storage };
