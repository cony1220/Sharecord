import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDBySBnACRX93YeMKPgvPOt4V_XJdBIDno",
  authDomain: "sharecord-399bf.firebaseapp.com",
  projectId: "sharecord-399bf",
  storageBucket: "sharecord-399bf.appspot.com",
  messagingSenderId: "653997533153",
  appId: "1:653997533153:web:fc8a9e82d0ec66f11c14a0",
  measurementId: "G-SCN159YX2Y"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const storage = getStorage(app);
export {
  db, auth, provider, storage,
};
