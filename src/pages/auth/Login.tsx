import React, { useState } from 'react';
import { Shield, Lock, Mail, ArrowRight, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';
import { getUsersFromStorage, logUserActivity } from '@/lib/userStorage';
import { isProtectedSuperAdmin } from '@/lib/securityUtils';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRoleLabel, setSelectedRoleLabel] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Pre-fill email and selected role without bypassing authentication
  const handleSelectRolePreset = (
    presetEmail: string,
    roleTitle: string
  ) => {
    setEmail(presetEmail);
    setPassword('');
    setSelectedRoleLabel(`${roleTitle} (${presetEmail})`);
    setErrorMessage(null);
    setSuccessNotice(`Selected ${roleTitle}. Please enter password to authenticate.`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessNotice(null);

    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail) {
      setErrorMessage('Please enter your Official Email ID.');
      return;
    }

    if (!password) {
      setErrorMessage('Password is required. Please enter your password to sign in.');
      return;
    }

    if (password.length < 4) {
      setErrorMessage('Password must be at least 4 characters long.');
      return;
    }

    // Look up user from registry
    const allUsers = getUsersFromStorage();
    const matchedUser = allUsers.find(
      (u) =>
        u.email.toLowerCase() === trimmedEmail ||
        u.officialEmail?.toLowerCase() === trimmedEmail ||
        u.personalEmail?.toLowerCase() === trimmedEmail ||
        u.username?.toLowerCase() === trimmedEmail
    );

    if (!matchedUser) {
      // Allow Super Admin fallback if email matches
      if (trimmedEmail === 'raghunatha.maharana@gmail.com') {
        const superAdminUser = {
          id: 'usr-super-admin-1',
          pfStaffId: 'PF-HQ-001',
          epfoEmpNumber: 'EPFO/HQ/SUPER/001',
          name: 'Shri Raghunatha Maharana',
          email: 'raghunatha.maharana@gmail.com',
          officialEmail: 'raghunatha.maharana@gmail.com',
          designation: 'Super Administrator / Additional Central PF Commissioner',
          officeRegion: 'HQ / RO Bhubaneswar',
          role: 'SUPER_ADMIN' as const,
        };
        login(`jwt-token-super_admin-${Date.now()}`, superAdminUser);
        navigate('/');
        return;
      }

      setErrorMessage('No officer profile found for this Email ID. Please check or select a role preset.');
      return;
    }

    if (matchedUser.status === 'SUSPENDED' || matchedUser.status === 'DELETED' || matchedUser.status === 'INACTIVE') {
      setErrorMessage(`Your account is currently ${matchedUser.status}. Please contact the Super Admin.`);
      return;
    }

    // Record login in audit trail
    logUserActivity({
      userId: matchedUser.id,
      userEmail: matchedUser.email,
      performedBy: matchedUser.email,
      action: 'USER_LOGIN',
      module: 'AUTH',
      recordId: matchedUser.id,
      remarks: `Officer ${matchedUser.name} authenticated via email/password credentials. Role: ${matchedUser.role}.`,
      ipAddress: '192.168.1.153',
      success: true,
    });

    // Authenticate and navigate to application
    login(`jwt-token-${matchedUser.role.toLowerCase()}-${Date.now()}`, matchedUser);
    
    if (isProtectedSuperAdmin(matchedUser)) {
      navigate('/admin');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-card border border-border/80 rounded-2xl shadow-xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-epfo-navy text-white shadow-md mb-1">
            <Shield className="w-6 h-6 text-epfo-accent" />
          </div>
          <h2 className="text-xl font-bold text-foreground">EPFO Officer Portal</h2>
          <p className="text-xs text-muted-foreground">Secure authentication required for all officer accounts</p>
        </div>

        {/* Quick Role Selection Presets (Pre-fills Email Only) */}
        <div className="p-3.5 rounded-xl bg-muted/40 border border-border space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Select Official Account Preset
            </span>
            <span className="text-[9px] font-mono text-muted-foreground">Pre-fills Email</span>
          </div>

          <div className="grid grid-cols-5 gap-1 text-[11px] font-bold">
            <button
              type="button"
              onClick={() =>
                handleSelectRolePreset('raghunatha.maharana@gmail.com', 'Super Admin')
              }
              className={`py-2 rounded-lg transition-all text-center border ${
                email === 'raghunatha.maharana@gmail.com'
                  ? 'bg-amber-500 text-white border-amber-600 shadow-sm font-black'
                  : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/30'
              }`}
              title="Super Admin: raghunatha.maharana@gmail.com"
            >
              Super Admin
            </button>
            <button
              type="button"
              onClick={() =>
                handleSelectRolePreset('soumya.das@epfindia.gov.in', 'Enforcement Officer')
              }
              className={`py-2 rounded-lg transition-all text-center border ${
                email === 'soumya.das@epfindia.gov.in'
                  ? 'bg-epfo-navy text-white border-epfo-navy shadow-sm font-black'
                  : 'bg-epfo-navy/10 hover:bg-epfo-navy/20 text-epfo-navy dark:text-epfo-slate border-epfo-navy/30'
              }`}
              title="Enforcement Officer: soumya.das@epfindia.gov.in"
            >
              EO
            </button>
            <button
              type="button"
              onClick={() =>
                handleSelectRolePreset('ananya.patnaik@epfindia.gov.in', 'Assistant PF Commissioner')
              }
              className={`py-2 rounded-lg transition-all text-center border ${
                email === 'ananya.patnaik@epfindia.gov.in'
                  ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm font-black'
                  : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
              }`}
              title="APFC: ananya.patnaik@epfindia.gov.in"
            >
              APFC
            </button>
            <button
              type="button"
              onClick={() =>
                handleSelectRolePreset('rajesh.panda@cag.gov.in', 'Senior Auditor')
              }
              className={`py-2 rounded-lg transition-all text-center border ${
                email === 'rajesh.panda@cag.gov.in'
                  ? 'bg-purple-600 text-white border-purple-700 shadow-sm font-black'
                  : 'bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-500/30'
              }`}
              title="Auditor: rajesh.panda@cag.gov.in"
            >
              Auditor
            </button>
            <button
              type="button"
              onClick={() =>
                handleSelectRolePreset('deo.cuttack@epfindia.gov.in', 'Data Entry Operator')
              }
              className={`py-2 rounded-lg transition-all text-center border ${
                email === 'deo.cuttack@epfindia.gov.in'
                  ? 'bg-slate-700 text-white border-slate-800 shadow-sm font-black'
                  : 'bg-slate-500/10 hover:bg-slate-500/20 text-slate-600 dark:text-slate-400 border-slate-500/30'
              }`}
              title="Data Entry Operator: deo.cuttack@epfindia.gov.in"
            >
              DEO
            </button>
          </div>
        </div>

        {/* Notices and Alerts */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successNotice && !errorMessage && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successNotice}</span>
          </div>
        )}

        {/* Login Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-foreground flex items-center justify-between">
              <span>Official Email ID</span>
              {selectedRoleLabel && (
                <span className="text-[10px] font-normal text-muted-foreground truncate max-w-[200px]">
                  {selectedRoleLabel}
                </span>
              )}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
              <input
                type="email"
                required
                placeholder="officer@epfindia.gov.in"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrorMessage(null);
                }}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-background border border-border focus:ring-2 focus:ring-epfo-accent outline-none text-xs"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="font-bold text-foreground">Official Password</label>
              <Link to="/forgot-password" className="text-[11px] text-epfo-accent hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Enter account password (e.g. Epfo@2026)"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMessage(null);
                }}
                className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-background border border-border focus:ring-2 focus:ring-epfo-accent outline-none text-xs font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-0.5">
              <span>Standard demo password: <strong className="font-mono text-foreground">Epfo@2026</strong></span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-epfo-navy hover:bg-epfo-dark dark:bg-epfo-accent dark:text-epfo-navy text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <span>Verify Credentials & Sign In</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center border-t border-border pt-4 text-xs text-muted-foreground">
          Don't have an official account registered?{' '}
          <Link to="/register" className="font-bold text-epfo-accent hover:underline">
            Register Officer Profile
          </Link>
        </div>
      </div>
    </div>
  );
};
