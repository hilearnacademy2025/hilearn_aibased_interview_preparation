import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f2ee]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c8601a]"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole) {
    if (requiredRole === 'admin' && user.role !== 'admin') {
      return <Navigate to="/dashboard" replace />;
    }
    if (requiredRole === 'user' && user.role !== 'user') {
      return <Navigate to="/admin" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
