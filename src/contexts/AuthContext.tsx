import { createContext, ReactNode, useEffect, useState } from "react";
import { firebase, auth } from "../services/firebase";

interface User {
  id: string;
  name: string;
  avatar: string;
}

interface IAuthContext {
  user: User | undefined;
  signInWithGoogle: () => Promise<void>;
}

interface IAuthContextProvider {
  children: ReactNode;
}

export const AuthContext = createContext({} as IAuthContext);

export function AuthContextProvider({ children }: IAuthContextProvider) {
  const [user, setUser] = useState<User>();
  useEffect(() => {
    // usado para parar o eventListener;
    // para não dar erro, quando o useEffect sair de tela;
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const { displayName, photoURL, uid } = user;
        if (!displayName || !photoURL) {
          throw new Error("Missing information from Google Account.");
        }
        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL,
        });
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);
  async function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    const result = await auth.signInWithPopup(provider);
    if (result.user) {
      const { displayName, photoURL, uid } = result.user;
      if (!displayName || !photoURL) {
        throw new Error("Missing information from Google Account.");
      }
      setUser({
        id: uid,
        name: displayName,
        avatar: photoURL,
      });
    }
  }

  return (
    <AuthContext.Provider value={{ user, signInWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
}
