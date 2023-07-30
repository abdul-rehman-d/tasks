import { PropsWithChildren, createContext, useCallback, useEffect, useState } from "react"
import { User, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth"
import { auth, db } from "../firebase"
import { onValue, push, ref } from "firebase/database"

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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    });
  
    return () => {
      unsubscribe();
    }
  }, [])

  useEffect(() => {
    let unsubscribe: () => void;
    async function getGroups() {
      if (currentUser) {
        console.log(currentUser.uid, 'running query')
        const dbRef = ref(db, 'groups/');
        unsubscribe = onValue(dbRef, (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            const newGroups: Group[] = [];
            for (const key in data) {
              if (currentUser.uid in data[key].members) {
                newGroups.push({
                  id: key,
                  name: data[key].name,
                  members: data[key].members,
                });
              }
            }
            setGroups(newGroups);
          }
        });
      }
    }
    getGroups();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    }
  }, [currentUser])

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

  const createGroup = useCallback(async (name: string) => {
    try {
      console.log('name', name)
      if (currentUser && name) {
        push(ref(db, 'groups/'), {
          name,
          members: {
            [currentUser.uid]: true,
          },
        });
      }
    } catch (e) {
      console.error("Error creating group: ", e);
    }
  }, [currentUser]);

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