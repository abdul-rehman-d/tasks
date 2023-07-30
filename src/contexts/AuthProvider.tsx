import { PropsWithChildren, createContext, useCallback, useEffect, useState } from "react"
import { getAuth, User, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth"
import "../firebase"

export type AuthContextType = {
  currentUser: User | null
  login: (email: string, password: string) => void
  logout: () => void
  groups: Group[]
  createGroup: (name: string) => void
}

export const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  login: () => {},
  logout: () => {},
  groups: [],
  createGroup: () => {},
})

const AuthProvider = ({ children }: PropsWithChildren) => {
  const [ currentUser, setCurrentUser ] = useState<User | null>(null);
  const [ groups, setGroups ] = useState<Group[]>([]);
  const auth = getAuth();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    });
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

  const createGroup = useCallback((name: string) => {
    setGroups((groups) => [...groups, {
      id: String(groups.length + 1),
      name,
      tasks: [],
    }]);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        logout,
        groups,
        createGroup,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider