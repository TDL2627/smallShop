import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { EmailAuthProvider } from "firebase/auth";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAP6qqtkgCl8_JAcT6yNKZZJ0YrMnhGWp8",
  authDomain: "smallshop2627.firebaseapp.com",
  projectId: "smallshop2627",
  storageBucket: "smallshop2627.appspot.com",
  messagingSenderId: "959721602134",
  appId: "1:959721602134:web:548bb9e56ab538dd838ff7"
};

// Initialize Firebase
let app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const provider = new EmailAuthProvider();
const db = getFirestore(app);
const auth = getAuth(app);

export { provider, auth };
export default db;
