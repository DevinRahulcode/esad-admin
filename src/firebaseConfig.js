// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAuq5eTlOOnA5noIEiNmvwS55ANjfgnIwE",
    authDomain: "hr-app-4f41f.firebaseapp.com",
    projectId: "hr-app-4f41f",
    storageBucket: "hr-app-4f41f.firebasestorage.app",
    messagingSenderId: "1010889436643",
    appId: "1:1010889436643:web:235726692ddc89fc34c4d6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth and Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);