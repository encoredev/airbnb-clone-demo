import { User } from "firebase/auth";
import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { auth } from "../lib/fb";

export default function useFirebaseAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const authStateChanged = async (u: User | null) => {
    if (!u) {
      setUser(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setUser(u);
    setLoading(false);
  };

  // listen for Firebase state change
  useEffect(() => {
    const prom = (async () => {
      const unsubscribe = auth.onAuthStateChanged(authStateChanged);
      return () => unsubscribe();
    })();

    return () => {
      prom.then((unsub) => unsub());
    };
  }, []);

  return {
    user,
    loading,
  };
}

interface AuthUserData {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthUserData>({
  user: null,
  loading: true,
});

export const AuthUserProvider: FC<PropsWithChildren> = ({ children }) => {
  const auth = useFirebaseAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

// custom hook to use the authUserContext and access authUser and loading
export const useAuth = () => useContext(AuthContext);
