import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    // Check for authentication token/flag in localStorage
    const isAuthenticated = localStorage.getItem('isAdminAuthenticated') === 'true';

    return isAuthenticated ? children : <Navigate to="/admin/login" />;
};

export default PrivateRoute;