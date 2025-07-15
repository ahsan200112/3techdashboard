import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isTokenExpired } from '../utils/jwtUtils';
import { useAuth } from '../context/AuthContext';

const ProtectedDashboardRoute = ({ children }) => {
  const token = localStorage.getItem('token'); // Get token from localStorage
  const { setStoreData, setUserData, storeData } = useAuth();
  const location = useLocation();

  // Token check logic
  if (!token || isTokenExpired(token)) {
    localStorage.removeItem('token'); // Remove token from localStorage
    setStoreData(null);
    setUserData(null);
  }

  const isAuthenticated = token && !isTokenExpired(token);
  const hasStore = storeData ? true : false;

  // 1. Token invalid
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // 2. If store already exists, don't allow access to /store-creation
  if (hasStore && location.pathname === '/store-creation') {
    return <Navigate to="/" />;
  }

  // 3. If store doesn't exist, allow only /store-creation
  if (!hasStore && location.pathname !== '/store-creation') {
    return <Navigate to="/store-creation" />;
  }

  // 4. Allow access
  return children;
};


export default ProtectedDashboardRoute;
