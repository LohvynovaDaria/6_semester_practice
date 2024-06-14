// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCPlOtlOS9ZirPFWrLDHBHcqOhIeO6zvnk",
    authDomain: "sellers-list-firebase.firebaseapp.com",
    projectId: "sellers-list-firebase",
    storageBucket: "sellers-list-firebase.appspot.com",
    messagingSenderId: "901495815256",
    appId: "1:901495815256:web:c7d5c154855dcc1a7fde2d",
    measurementId: "G-4XMGL2YRS0"
}; 

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

export const db = getFirestore(app);