import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { UserRole } from '@/types';

interface RoleGuardProps {
  userRole: UserRole;
  allowedRoles: UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  userRole,
  allowedRoles,
  children,
  fallback,
}) => {
  const isAllowed = allowedRoles.includes(userRole) || userRole === 'ADMIN';

  if (isAllowed) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <ShieldAlert className="w-4 h-4 text-red-500 shrink-0" />
        <span>Access Restricted: Requires higher role permission ({allowedRoles.join(' / ')}).</span>
      </div>
      <span className="font-mono text-[9px] bg-red-500/20 px-2 py-0.5 rounded font-bold uppercase">
        Role: {userRole}
      </span>
    </div>
  );
};
