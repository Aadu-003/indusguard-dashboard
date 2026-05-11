// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDFkIEYHoVvEy8Z1HBgQZ2DXfh3LsdRnbg",
  authDomain: "indusgaurd-d7452.firebaseapp.com",
  databaseURL: "https://indusgaurd-d7452-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "indusgaurd-d7452",
  storageBucket: "indusgaurd-d7452.firebasestorage.app",
  messagingSenderId: "989958762122",
  appId: "1:989958762122:web:8fb885bb8ebee016a18773",
  measurementId: "G-35B0E9Z55Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const database = getDatabase(app);