import { PropsWithChildren, useContext } from 'react'
import { AuthContext } from '../contexts/AuthProvider';
import { Navigate } from 'react-router-dom';
import Navbar from './Navbar';

function ProtectedRoute({ children }: PropsWithChildren) {
  const { currentUser, authIsReady } = useContext(AuthContext);

  if (currentUser === null && authIsReady) {
    return <Navigate to="/login" />;
  }
  
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

export default ProtectedRoute