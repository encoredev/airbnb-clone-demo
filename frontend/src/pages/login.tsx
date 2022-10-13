import dynamic from "next/dynamic";
import { FC } from "react";

const FirebaseAuth = dynamic(() => import("../components/FirebaseAuthPage"), {
  loading: () => <div>Loading...</div>,
  ssr: false,
});

const Login: FC = (props) => {
  return <FirebaseAuth />;
};

export default Login;
