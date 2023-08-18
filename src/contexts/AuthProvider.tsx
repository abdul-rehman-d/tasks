import { PropsWithChildren, createContext, useCallback, useEffect, useState } from "react"
import { User, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth"
import { auth } from "../firebase"
import Loader from "../components/Loader"
import { useToast } from "./ToastContainer"
import { FirebaseError } from "firebase/app"

export type AuthContextType = {
  currentUser: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  authIsReady: boolean
  isLoggingIn: boolean
}

export const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  login: () => new Promise(() => {}),
  logout: () => {},
  authIsReady: false,
  isLoggingIn: false,
})

const AuthProvider = ({ children }: PropsWithChildren) => {
  const [ authIsReady, setAuthIsReady ] = useState<boolean>(false);
  const [ isLoggingIn, setIsLoggingIn ] = useState<boolean>(false);
  const [ currentUser, setCurrentUser ] = useState<User | null>(null);

  const toast = useToast();

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


  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setIsLoggingIn(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      setCurrentUser(userCredential.user);
      return true;
    } catch (error1) {
      if (
        error1 instanceof FirebaseError &&
        error1.code !== 'auth/user-not-found'
      ) {
        setIsLoggingIn(false);
        toast("Email or password is incorrect.", {
          type: "error",
        });
        return false;
      }

      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        setCurrentUser(userCredential.user);
        return true;
      } catch (error2) {
        if (error2 instanceof FirebaseError) {
          const message = error2.message
            .replace('Firebase: ', '')
            .replace(` (${error2.code})`, '')
          toast(message, {
            type: "error",
          });
        }
        setIsLoggingIn(false);
        return false;
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
        isLoggingIn,
      }}
    >
      {authIsReady
      ? children
      : <Loader label="Checking Session..." />
      }
    </AuthContext.Provider>
  )
}

export default AuthProvider