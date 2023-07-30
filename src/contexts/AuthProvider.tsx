import { PropsWithChildren, createContext, useCallback, useEffect, useState } from "react"
import { User, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth"
import { auth } from "../firebase"
import Loader from "../components/Loader"

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


  const login = useCallback(async (email: string, password: string) => {
    setAuthIsReady(false);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      setCurrentUser(userCredential.user);
      return
    } catch (error1) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        setCurrentUser(userCredential.user);
        return
      } catch (error2) {
        console.log(error1);
        console.log(error2);
        return
      }
    }
  }, []);

  const logout = useCallback(() => {
    signOut(auth)
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
      {authIsReady
      ? children
      : <Loader />
      }
    </AuthContext.Provider>
  )
}

export default AuthProvider