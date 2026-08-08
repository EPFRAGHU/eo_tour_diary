import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';
import { isProtectedSuperAdmin, logAuditAction } from '@/lib/securityUtils';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import { AccessDenied } from '@/pages/auth/AccessDenied';

interface SuperAdminRouteProps {
  children: React.ReactNode;
}

export const SuperAdminRoute: React.FC<SuperAdminRouteProps> = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && user && !isProtectedSuperAdmin(user)) {
      logAuditAction(
        user.name || user.email || 'Anonymous',
        user.role || 'READ_ONLY',
        'ADMIN_ACCESS_DENIED',
        location.pathname,
        `Direct URL navigation to ${location.pathname} blocked. Super Admin clearance required. Current role: ${user.role}.`,
        'BLOCKED'
      );
    }
  }, [isLoading, user, location.pathname]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isProtectedSuperAdmin(user)) {
    return <AccessDenied />;
  }

  return <>{children}</>;
};
