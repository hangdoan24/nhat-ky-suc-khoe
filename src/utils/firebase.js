import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyA3ShhfKHa87eXdqogMLD0WxgBZIk85JDw",
  authDomain: "nhat-ky-suc-khoe.firebaseapp.com",
  projectId: "nhat-ky-suc-khoe",
  storageBucket: "nhat-ky-suc-khoe.firebasestorage.app",
  messagingSenderId: "669339507296",
  appId: "1:669339507296:web:f566fa147107aca7ab8105"
}

const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)