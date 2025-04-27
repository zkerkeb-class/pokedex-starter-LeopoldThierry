import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const userData = JSON.parse(localStorage.getItem('userData'));

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Si l'utilisateur n'a pas de starter et n'est pas sur la page de sélection
  if (!userData?.starterPokemon && !window.location.pathname.includes('starter-selection')) {
    return <Navigate to="/starter-selection" replace />;
  }
  if (userData?.isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default ProtectedRoute; 