// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCHvgRxCZBjiUgDcc6Kub763RTZ33ST8Rs",
  authDomain: "chats-clone.firebaseapp.com",
  projectId: "chats-clone",
  storageBucket: "chats-clone.appspot.com",
  messagingSenderId: "224458509763",
  appId: "1:224458509763:web:75a8ee741a97307ffa0176",
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
//là một cơ sở dữ liệu NoSQL
const auth = getAuth(app);
//cung cấp các tính năng xác thực người dùng với nhiều phương thức đăng nhập khác nhau như email/password, Facebook, Google, Twitter, GitHub, v.v.
const provider = new GoogleAuthProvider();
export { db, auth, provider };
