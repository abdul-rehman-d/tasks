import { PropsWithChildren, createContext, useCallback, useEffect, useState } from "react"
import { User, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth"
import { auth } from "../firebase"

export type AuthContextType = {
  currentUser: User | null
  login: (email: string, password: string) => void
  logout: () => void
  authIsReady: boolean
}

export const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  login: () => {},
  logout: () => {},
  authIsReady: false,
})

const AuthProvider = ({ children }: PropsWithChildren) => {
  const [ authIsReady, setAuthIsReady ] = useState<boolean>(false);
  const [ currentUser, setCurrentUser ] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
      setAuthIsReady(true);
    });
  
    return () => {
      unsubscribe();
    }
  }, [])


  const login = useCallback((email: string, password: string) => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setCurrentUser(userCredential.user);
      })
      .catch((error1) => {
        createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            setCurrentUser(userCredential.user);
          })
          .catch((error2) => {
            console.log(error1);
            console.log(error2);
          });
      });
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
  }, []);


  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        logout,
        authIsReady,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider