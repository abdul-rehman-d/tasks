import { Routes, Route, Navigate } from 'react-router-dom';

import MainPage from './pages/MainPage';
import { useContext } from 'react';
import { AuthContext } from './contexts/AuthProvider';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import GroupsPage from './pages/GroupsPage';

function App() {
  const { currentUser } = useContext(AuthContext);
  return (
    <Routes>
      <Route
        path="/"
        element={<ProtectedRoute><GroupsPage /></ProtectedRoute>}
      />
      <Route
        path="/group/:id"
        element={<ProtectedRoute><MainPage /></ProtectedRoute>}
      />
      <Route
        path="/login"
        element={currentUser ? <Navigate to="/" /> : <LoginPage />} />
    </Routes>
  )
}

export default App
