import React from 'react';
import type { ReactNode } from 'react';
import { useAuth } from '../lib/auth';
import { Navigate } from 'react-router-dom';

interface ProtectedAdminRouteProps {
  children: ReactNode;
}

export default function ProtectedAdminRoute({ children }: ProtectedAdminRouteProps) {
  const { isAuthenticated, user } = useAuth();

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to home if not admin
  if (user?.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  // If authenticated and is admin, render the children
  return <>{children}</>;
}
