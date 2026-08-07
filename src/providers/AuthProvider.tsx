import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, UserProfile } from '@/types';

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: UserProfile) => void;
  logout: () => void;
  hasRole: (roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USERS: Record<string, UserProfile> = {
  eo: {
    id: 'eo-101',
    pfStaffId: 'EPFO/EO/4502',
    name: 'Shri Rajesh Sharma',
    email: 'rajesh.sharma@epfindia.gov.in',
    designation: 'Enforcement Officer (EO/AO)',
    officeRegion: 'RO Mumbai (Bandra)',
    role: 'EO',
  },
  apfc: {
    id: 'apfc-201',
    pfStaffId: 'EPFO/APFC/1104',
    name: 'Smt. Anita Roy',
    email: 'anita.roy@epfindia.gov.in',
    designation: 'Assistant PF Commissioner (Compliance)',
    officeRegion: 'RO Mumbai (Bandra)',
    role: 'APFC',
  },
  admin: {
    id: 'admin-001',
    pfStaffId: 'EPFO/ADM/0001',
    name: 'System Administrator',
    email: 'admin.portal@epfindia.gov.in',
    designation: 'Portal Administrator',
    officeRegion: 'Headquarters, New Delhi',
    role: 'ADMIN',
  },
  viewer: {
    id: 'viewer-301',
    pfStaffId: 'EPFO/AUD/9901',
    name: 'Auditor Inspection Viewer',
    email: 'auditor.view@epfindia.gov.in',
    designation: 'Audit & Vigilance Inspector',
    officeRegion: 'RO Mumbai (Bandra)',
    role: 'VIEWER',
  },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(DEMO_USERS.eo);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('auth_token') || 'demo-jwt-token-eo');
  const [isLoading] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');
    const storedRole = localStorage.getItem('auth_role') as UserRole | null;

    if (storedToken) {
      setToken(storedToken);
      if (storedRole && storedRole.toLowerCase() in DEMO_USERS) {
        setUser(DEMO_USERS[storedRole.toLowerCase()]);
      } else {
        setUser(DEMO_USERS.eo);
      }
    }
  }, []);

  const login = (newToken: string, newUser: UserProfile) => {
    localStorage.setItem('auth_token', newToken);
    localStorage.setItem('auth_role', newUser.role);
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_role');
    setToken(null);
    setUser(null);
  };

  const hasRole = (roles: UserRole[]) => {
    if (!user) return false;
    if (user.role === 'ADMIN') return true;
    return roles.includes(user.role) || (roles.includes('EO') && user.role === 'EO_AO');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        logout,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
