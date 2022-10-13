import { FC, useEffect, useRef, useState } from "react";
import {
  connectAuthEmulator,
  getAuth,
  onAuthStateChanged,
} from "firebase/auth";
import * as firebaseui from "firebaseui";
import "firebaseui/dist/firebaseui.css";
import firebase from "firebase/compat/app";

const firebaseConfig = {
  apiKey: "AIzaSyC0lLjSHni7M27IVRckV0Apv_qdMuPMmaQ",
  authDomain: "encore-firebase-demo.firebaseapp.com",
  projectId: "encore-firebase-demo",
  storageBucket: "encore-firebase-demo.appspot.com",
  messagingSenderId: "447374240293",
  appId: "1:447374240293:web:fa2a8d7d4a68d23aa8edcc",
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

const auth = getAuth();

// Connect to the Firebase emulator in development.
if (process.env.NODE_ENV === "development") {
  connectAuthEmulator(auth, "http://localhost:9099");
}

interface Props {
  // Callback that will be passed the FirebaseUi instance before it is
  // started. This allows access to certain configuration options such as
  // disableAutoSignIn().
  uiCallback?(ui: firebaseui.auth.AuthUI): void;
  // The Firebase App auth instance to use.
  className?: string;
}

// Configure FirebaseUI.
const uiConfig = {
  // Popup signin flow rather than redirect flow.
  signInFlow: "popup",
  // We will display Google and Facebook as auth providers.
  signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
  callbacks: {
    // Avoid redirects after sign-in.
    signInSuccessWithAuthResult: () => false,
  },
};

const FirebaseAuthPage = ({ className, uiCallback }: Props) => {
  const [userSignedIn, setUserSignedIn] = useState(false);
  const elementRef = useRef(null);
  const firebaseAuth = firebase.auth();

  useEffect(() => {
    // Get or Create a firebaseUI instance.
    const firebaseUiWidget =
      firebaseui.auth.AuthUI.getInstance() ||
      new firebaseui.auth.AuthUI(firebaseAuth);
    if (uiConfig.signInFlow === "popup") firebaseUiWidget.reset();

    // We track the auth state to reset firebaseUi if the user signs out.
    const unregisterAuthObserver = onAuthStateChanged(
      firebaseAuth as any,
      (user) => {
        if (!user && userSignedIn) firebaseUiWidget.reset();
        setUserSignedIn(!!user);
      }
    );

    // Trigger the callback if any was set.
    if (uiCallback) uiCallback(firebaseUiWidget);

    // Render the firebaseUi Widget.
    // @ts-ignore
    firebaseUiWidget.start(elementRef.current, uiConfig);

    return () => {
      unregisterAuthObserver();
      firebaseUiWidget.reset();
    };
  }, [firebaseui, uiConfig]);

  return <div className={className} ref={elementRef} />;
};

const Login: FC = (props) => {
  const [isSignedIn, setIsSignedIn] = useState(false); // Local signed-in state.

  // Listen to the Firebase Auth state and set the local state.
  useEffect(() => {
    const unregisterAuthObserver = firebase
      .auth()
      .onAuthStateChanged((user) => {
        setIsSignedIn(!!user);
      });
    return () => unregisterAuthObserver(); // Make sure we un-register Firebase observers when the component unmounts.
  }, []);

  if (!isSignedIn) {
    return (
      <div>
        <FirebaseAuthPage />
      </div>
    );
  }

  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="mt-10">
        <p>
          Welcome {firebase.auth().currentUser!.displayName}! You are now
          signed-in!
        </p>
      </div>
    </div>
  );
};

export default Login;
