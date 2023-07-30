import { PropsWithChildren, useContext } from 'react'
import { AuthContext } from '../contexts/AuthProvider';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }: PropsWithChildren) {
  const { currentUser } = useContext(AuthContext);

  if (currentUser === null) {
    return <Navigate to="/login" />;
  }
  
  return children;
}

export default ProtectedRoute