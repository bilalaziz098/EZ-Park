// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "",
  authDomain: "finalyearproject-a6282.firebaseapp.com",
  projectId: "finalyearproject-a6282",
  storageBucket: "finalyearproject-a6282.appspot.com",
  messagingSenderId: "196162558099",
  appId: "1:196162558099:web:64cd2ea78b2d6980e2d566",
  measurementId: "G-ELEE05PLLC"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const firestore = getFirestore(app);