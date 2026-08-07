import React, { useState } from 'react';
import { Shield, Lock, Mail, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';
import { UserRole } from '@/types';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRoleSelect = (role: UserRole) => {
    const mockUsers: Record<string, any> = {
      EO: {
        id: 'eo-101',
        pfStaffId: 'EPFO/EO/4502',
        name: 'Shri Rajesh Sharma',
        email: 'rajesh.sharma@epfindia.gov.in',
        designation: 'Enforcement Officer (EO/AO)',
        officeRegion: 'RO Mumbai (Bandra)',
        role: 'EO',
      },
      EO_AO: {
        id: 'eo-101',
        pfStaffId: 'EPFO/EO/4502',
        name: 'Shri Rajesh Sharma',
        email: 'rajesh.sharma@epfindia.gov.in',
        designation: 'Enforcement Officer (EO/AO)',
        officeRegion: 'RO Mumbai (Bandra)',
        role: 'EO',
      },
      APFC: {
        id: 'apfc-201',
        pfStaffId: 'EPFO/APFC/1104',
        name: 'Smt. Anita Roy',
        email: 'anita.roy@epfindia.gov.in',
        designation: 'Assistant PF Commissioner (Compliance)',
        officeRegion: 'RO Mumbai (Bandra)',
        role: 'APFC',
      },
      ADMIN: {
        id: 'admin-001',
        pfStaffId: 'EPFO/ADM/0001',
        name: 'System Administrator',
        email: 'admin.portal@epfindia.gov.in',
        designation: 'Portal Administrator',
        officeRegion: 'Headquarters, New Delhi',
        role: 'ADMIN',
      },
      VIEWER: {
        id: 'viewer-301',
        pfStaffId: 'EPFO/AUD/9901',
        name: 'Auditor Inspection Viewer',
        email: 'auditor.view@epfindia.gov.in',
        designation: 'Audit & Vigilance Inspector',
        officeRegion: 'RO Mumbai (Bandra)',
        role: 'VIEWER',
      },
    };

    const targetUser = mockUsers[role] || mockUsers.EO;
    login(`jwt-token-${role.toLowerCase()}-${Date.now()}`, targetUser);
    navigate('/');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleRoleSelect('EO');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-card border border-border/80 rounded-2xl shadow-xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-epfo-navy text-white shadow-md mb-1">
            <Shield className="w-6 h-6 text-epfo-accent" />
          </div>
          <h2 className="text-xl font-bold text-foreground">EPFO Officer Portal</h2>
          <p className="text-xs text-muted-foreground">Sign in with official credentials or select role</p>
        </div>

        {/* Quick Demo Role Selector */}
        <div className="p-3 rounded-xl bg-muted/40 border border-border space-y-2">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block text-center">
            Demo Login by Officer Role
          </span>
          <div className="grid grid-cols-4 gap-1.5 text-xs font-bold">
            <button
              type="button"
              onClick={() => handleRoleSelect('EO')}
              className="py-1.5 rounded-lg bg-epfo-navy/10 hover:bg-epfo-navy hover:text-white text-epfo-navy dark:text-epfo-slate transition-colors text-center"
            >
              EO
            </button>
            <button
              type="button"
              onClick={() => handleRoleSelect('APFC')}
              className="py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-600 hover:text-white text-emerald-600 dark:text-emerald-400 transition-colors text-center"
            >
              APFC
            </button>
            <button
              type="button"
              onClick={() => handleRoleSelect('ADMIN')}
              className="py-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-600 hover:text-white text-purple-600 dark:text-purple-400 transition-colors text-center"
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => handleRoleSelect('VIEWER')}
              className="py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-600 hover:text-white text-amber-600 dark:text-amber-400 transition-colors text-center"
            >
              Viewer
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-foreground">Official Email ID</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
              <input
                type="email"
                required
                placeholder="officer@epfindia.gov.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-epfo-accent outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="font-bold text-foreground">Password</label>
              <Link to="/forgot-password" className="text-[11px] text-epfo-accent hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-epfo-accent outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-epfo-navy hover:bg-epfo-blue text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all"
          >
            <span>Sign In to Tour Diary</span>
            <ArrowRight className="w-4 h-4 text-epfo-accent" />
          </button>
        </form>

        <div className="text-center border-t border-border pt-4 text-xs text-muted-foreground">
          Don't have an officer account?{' '}
          <Link to="/register" className="font-bold text-epfo-accent hover:underline">
            Register Officer Profile
          </Link>
        </div>
      </div>
    </div>
  );
};
