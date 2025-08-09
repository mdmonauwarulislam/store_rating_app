import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return (
      <nav className="bg-blue-600 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="text-white text-xl font-bold">
              Store Rating App
            </Link>
            <div className="flex space-x-4">
              <Link to="/login" className="text-white hover:text-blue-200 px-3 py-2 rounded">
                Login
              </Link>
              <Link to="/signup" className="bg-blue-700 text-white hover:bg-blue-800 px-4 py-2 rounded">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-blue-600 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/dashboard" className="text-white text-xl font-bold">
            Store Rating App
          </Link>
          <div className="flex items-center space-x-6">
            <span className="text-blue-100">Welcome, {user.name}</span>
            
            {user.role === 'system_admin' && (
              <>
                <Link to="/dashboard" className="text-white hover:text-blue-200 px-3 py-2 rounded">
                  Dashboard
                </Link>
                <Link to="/users" className="text-white hover:text-blue-200 px-3 py-2 rounded">
                  Users
                </Link>
                <Link to="/stores" className="text-white hover:text-blue-200 px-3 py-2 rounded">
                  Stores
                </Link>
              </>
            )}
            
            {user.role === 'normal_user' && (
              <Link to="/dashboard" className="text-white hover:text-blue-200 px-3 py-2 rounded">
                Stores
              </Link>
            )}
            
            {user.role === 'store_owner' && (
              <Link to="/dashboard" className="text-white hover:text-blue-200 px-3 py-2 rounded">
                Dashboard
              </Link>
            )}
            
            <Link to="/update-password" className="text-white hover:text-blue-200 px-3 py-2 rounded">
              Update Password
            </Link>
            <button 
              onClick={handleLogout} 
              className="bg-blue-700 text-white hover:bg-blue-800 px-4 py-2 rounded"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
