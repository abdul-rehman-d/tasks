import { PropsWithChildren, createContext, useCallback, useState } from "react"

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

  const login = useCallback((email: string, password: string) => {
    setCurrentUser({
      id: '1',
      email,
      password,
      groups: [],
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