// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAHcXmJmznzTiYr5M2NW144svmXfWXpOxc",
  authDomain: "nasaastroids-904d4.firebaseapp.com",
  projectId: "nasaastroids-904d4",
  storageBucket: "nasaastroids-904d4.appspot.com",
  messagingSenderId: "812405614103",
  appId: "1:812405614103:web:5daa6fffa4ee8c56ff9e52",
  measurementId: "G-B0VC01P0P6",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
