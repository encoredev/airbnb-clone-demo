import "firebaseui/dist/firebaseui.css";
import dynamic from "next/dynamic";

const FirebaseAuthPage = dynamic(() => import("./ClientSideFirebaseAuthPage"), {
  ssr: false,
});
export default FirebaseAuthPage;
