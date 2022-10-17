import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC0lLjSHni7M27IVRckV0Apv_qdMuPMmaQ",
  authDomain: "encore-firebase-demo.firebaseapp.com",
  projectId: "encore-firebase-demo",
  storageBucket: "encore-firebase-demo.appspot.com",
  messagingSenderId: "447374240293",
  appId: "1:447374240293:web:fa2a8d7d4a68d23aa8edcc",
};

const fbApp = initializeApp(firebaseConfig);

const auth = getAuth();

// Connect to the Firebase emulator in development.
// if (process.env.NODE_ENV === "development") {
//   connectAuthEmulator(auth, "http://localhost:9099");
// }

export { fbApp, auth };
