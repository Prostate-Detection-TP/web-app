// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'



const firebaseConfig = {
    apiKey: "AIzaSyA52lKvi8nrDiP1_t1o5ZVaCxoE8q2hJrM",
    authDomain: "prost-det.firebaseapp.com",
    projectId: "prost-det",
    storageBucket: "prost-det.appspot.com",
    messagingSenderId: "1053380617189",
    appId: "1:1053380617189:web:3d8b70dc721a706b0b050c",
    measurementId: "G-SNDX53CR8Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//initialize firebase auth
const auth = getAuth()


export { app, auth }