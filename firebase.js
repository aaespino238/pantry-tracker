// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCZyytFpzb9zDB0K96yZ2_gM51nO4ylldI",
  authDomain: "inventory-management-2a198.firebaseapp.com",
  projectId: "inventory-management-2a198",
  storageBucket: "inventory-management-2a198.appspot.com",
  messagingSenderId: "408740616910",
  appId: "1:408740616910:web:1ef19a10e435284190ce9f",
  measurementId: "G-CBSXJHZ2QW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app)

export {firestore}