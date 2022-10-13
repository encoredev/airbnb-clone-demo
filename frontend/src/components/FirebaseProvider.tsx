import firebase from "firebase/compat/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import {
  useState,
  useEffect,
  PropsWithChildren,
  FC,
  createContext,
  useContext,
} from "react";

interface AuthUser {
  uid: string;
  email: string;
}

const formatAuthUser = (user: any) => ({
  uid: user.uid,
  email: user.email,
});

export default function useFirebaseAuth() {
  const [authUser, setAuthUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const authStateChanged = async (authState: any) => {
    if (!authState) {
      setAuthUser(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    var formattedUser = formatAuthUser(authState);
    setAuthUser(formattedUser);
    setLoading(false);
  };

  // listen for Firebase state change
  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(authStateChanged);
    return () => unsubscribe();
  }, []);

  return {
    authUser,
    loading,
  };
}

interface AuthUserData {
  authUser: null | AuthUser;
  loading: boolean;
}

const AuthContext = createContext<AuthUserData>({
  authUser: null,
  loading: true,
});

export const AuthUserProvider: FC<PropsWithChildren> = ({ children }) => {
  const auth = useFirebaseAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

// custom hook to use the authUserContext and access authUser and loading
export const useAuth = () => useContext(AuthContext);
