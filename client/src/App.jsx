import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import StoreOwnerDashboard from './pages/StoreOwnerDashboard';
import ManageUsers from './pages/ManageUsers';
import ManageStores from './pages/ManageStores';
import UpdatePassword from './pages/UpdatePassword';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected layout for authenticated users */}
          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/dashboard" replace />} />

            {/* Admin Routes */}
            <Route path="/dashboard" element={<ProtectedRoute roles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/users" element={<ProtectedRoute roles={['ADMIN']}><ManageUsers /></ProtectedRoute>} />
            <Route path="/stores" element={<ProtectedRoute roles={['ADMIN']}><ManageStores /></ProtectedRoute>} />

            {/* User Routes */}
            <Route path="/user-dashboard" element={<ProtectedRoute roles={['USER']}><UserDashboard /></ProtectedRoute>} />

            {/* Store Owner Routes */}
            <Route path="/store-dashboard" element={<ProtectedRoute roles={['STORE_OWNER']}><StoreOwnerDashboard /></ProtectedRoute>} />

            {/* Shared Route */}
            <Route path="/update-password" element={<UpdatePassword />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
