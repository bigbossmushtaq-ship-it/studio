
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { uploadBytesResumable } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  "projectId": "tuneflow-meg7z",
  "appId": "1:772294500650:web:c977452b7c0d3ad7c77e53",
  "storageBucket": "tuneflow-meg7z.appspot.com",
  "apiKey": "AIzaSyDzosPxByJmbb-7xVzaKEgGOF8OixcGNj0",
  "authDomain": "tuneflow-meg7z.firebaseapp.com",
  "messagingSenderId": "772294500650"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get a reference to the database service
export const db = getFirestore(app);

// Get a reference to the storage service
export const storage = getStorage(app);

    

    
