// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDwCByjC585RZhvfpIV2EXBSt8dsXOR670",
  authDomain: "madadgar-api.firebaseapp.com",
  projectId: "madadgar-api",
  storageBucket: "madadgar-api.firebasestorage.app",
  messagingSenderId: "142575671934",
  appId: "1:142575671934:web:6dbc8b3d6a58154ada562f",
  measurementId: "G-NBWJ9QW9L7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;