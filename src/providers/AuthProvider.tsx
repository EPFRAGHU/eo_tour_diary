import React, { createContext, useContext, useState } from 'react';
import { UserProfile, UserRole } from '@/types';

interface AuthContextType {
  user: UserProfile | null;
  login: (token: string, user: UserProfile) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasRole: (allowedRoles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(() => {
    // Default Officer Profile: Shri Raghunatha Maharana
    const stored = localStorage.getItem('epfo_user_session');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        // Fallback
      }
    }
    return {
      id: 'usr-super-admin-1',
      name: 'Shri Raghunatha Maharana',
      email: 'raghunatha.maharana@gmail.com',
      officialEmail: 'raghunatha.maharana@gmail.com',
      designation: 'Super Administrator / Additional Central PF Commissioner',
      officeRegion: 'HQ / RO Bhubaneswar',
      role: 'SUPER_ADMIN' as UserRole,
      pfStaffId: 'PF-HQ-001',
    };
  });

  const login = (token: string, newUser: UserProfile) => {
    localStorage.setItem('epfo_jwt_token', token);
    localStorage.setItem('epfo_user_session', JSON.stringify(newUser));
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem('epfo_jwt_token');
    localStorage.removeItem('epfo_user_session');
    setUser(null);
  };

  const hasRole = (allowedRoles: UserRole[]): boolean => {
    if (!user) return false;
    if (user.role === 'SUPER_ADMIN' || user.email.toLowerCase() === 'raghunatha.maharana@gmail.com') return true;
    return allowedRoles.includes(user.role);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, isLoading, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
