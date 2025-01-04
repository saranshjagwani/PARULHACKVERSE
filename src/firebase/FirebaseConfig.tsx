// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
import {getAuth} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBvfRO53OpXpC9FjkW37o9yi_Mx1lNyq6U",
  authDomain: "ecomove-3652c.firebaseapp.com",
  projectId: "ecomove-3652c",
  storageBucket: "ecomove-3652c.firebasestorage.app",
  messagingSenderId: "728467947549",
  appId: "1:728467947549:web:0555e1309728a1305c86f4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const fireDB=getFirestore(app);
const auth=getAuth(app);

export{fireDB,auth}