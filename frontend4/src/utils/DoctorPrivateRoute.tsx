import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useDoctorAuth } from '../context/useDoctorAuth';

const DoctorPrivateRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useDoctorAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default DoctorPrivateRoute;
