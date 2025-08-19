
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDzosPxByJmbb-7xVzaKEgGOF8OixcGNj0",
  authDomain: "tuneflow-meg7z.firebaseapp.com",
  projectId: "tuneflow-meg7z",
  storageBucket: "tuneflow-meg7z.appspot.com",
  messagingSenderId: "772294500650",
  appId: "1:772294500650:web:c977452b7c0d3ad7c77e53"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get a reference to the database service
export const db = getFirestore(app);

// Get a reference to the storage service
export const storage = getStorage(app);
