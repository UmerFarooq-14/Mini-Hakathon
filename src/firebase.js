
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCE1XYhGu_b7vu80uupbT4Dnat6WybEsq0",
  authDomain: "hakathon-4e7e5.firebaseapp.com",
  projectId: "hakathon-4e7e5",
  storageBucket: "hakathon-4e7e5.firebasestorage.app",
  messagingSenderId: "862162652053",
  appId: "1:862162652053:web:66672c5a5058aa7a80c49c",
  measurementId: "G-1D1WVKQLZ7"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app)
export {auth,db}