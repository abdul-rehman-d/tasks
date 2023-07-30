import { PropsWithChildren, useContext } from 'react'
import { AuthContext } from '../contexts/AuthProvider';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }: PropsWithChildren) {
  const { currentUser, authIsReady } = useContext(AuthContext);

  if (currentUser === null && authIsReady) {
    return <Navigate to="/login" />;
  }
  
  return children;
}

export default ProtectedRoute