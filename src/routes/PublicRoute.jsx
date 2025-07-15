import React from 'react';
import { Navigate } from 'react-router-dom';
import { isTokenExpired } from '../utils/jwtUtils';

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  if (token && !isTokenExpired(token)) {
    return <Navigate to="/" />; // Redirect to dashboard
  }

  return children;
};

export default PublicRoute;
