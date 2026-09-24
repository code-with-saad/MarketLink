import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser, selectToken } from '../store/slices/authSlice';

/**
 * ProtectedRoute component
 * Checks for token and user role.
 * If not authenticated, redirects to /login.
 * If role is not allowed, redirects to the user's role-appropriate dashboard.
 */
const ProtectedRoute = ({ allowedRoles = [] }) => {
  const token = useSelector(selectToken);
  const user = useSelector(selectCurrentUser);

  if (!token) {
    const search = window.location.search;
    const hasReason = search.includes('reason=expired');
    return <Navigate to={hasReason ? `/login${search}` : `/login?reason=expired`} replace />;
  }

  // If user object is not yet loaded, or roles are specified and user's role is not included
  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    if (user.role === 'farmer') {
      return <Navigate to="/farmer/dashboard" replace />;
    }
    if (user.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/customer/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
