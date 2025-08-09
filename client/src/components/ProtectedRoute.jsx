import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, roles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles.length > 0 && !roles.includes(user.role)) {
    if (user.role === 'ADMIN') return <Navigate to="/dashboard" replace />;
    if (user.role === 'USER') return <Navigate to="/user-dashboard" replace />;
    if (user.role === 'STORE_OWNER') return <Navigate to="/store-dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
