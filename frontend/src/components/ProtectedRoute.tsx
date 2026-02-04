import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../hooks';
import { AppLayout } from './layout/AppLayout';

interface Props {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <AppLayout>{children}</AppLayout>;
};

