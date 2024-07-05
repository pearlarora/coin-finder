import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCShwD7W2r_3toMUglKL5SAWd17vR0cBlM",
  authDomain: "coin-finder-44b97.firebaseapp.com",
  projectId: "coin-finder-44b97",
  storageBucket: "coin-finder-44b97.appspot.com",
  messagingSenderId: "290004743568",
  appId: "1:290004743568:web:066e0d450f25195dd4ef15",
  measurementId: "G-V1JDL9X9M0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
// const analytics = getAnalytics(app);

export default storage;
