import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';
import StoreList from './pages/StoreList';
import OwnerDashboard from './pages/OwnerDashboard';
import ChangePassword from './pages/ChangePassword';

const PrivateRoute = ({ children, role }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/login" />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin" element={<PrivateRoute role="admin"><AdminDashboard /></PrivateRoute>} />
          <Route path="/stores" element={<PrivateRoute role="user"><StoreList /></PrivateRoute>} />
          <Route path="/owner" element={<PrivateRoute role="store_owner"><OwnerDashboard /></PrivateRoute>} />
          <Route path="/change-password" element={<PrivateRoute><ChangePassword /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;