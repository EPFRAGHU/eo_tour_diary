import React, { useState } from 'react';
import { X, KeyRound, ShieldAlert, Sparkles, CheckCircle2, Unlock, ShieldCheck, RefreshCw, Copy, Check } from 'lucide-react';
import { ExtendedUserProfile } from '@/types';
import { generateTempPassword, validatePasswordStrength } from '@/lib/securityUtils';

interface PasswordManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: ExtendedUserProfile | null;
  onUpdateUser: (updatedUser: ExtendedUserProfile, auditRemark: string) => void;
}

export const PasswordManagementModal: React.FC<PasswordManagementModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdateUser,
}) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [forcePasswordChange, setForcePasswordChange] = useState(true);
  const [generatedTemp, setGeneratedTemp] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen || !user) return null;

  const handleGenerateTempPassword = () => {
    const temp = generateTempPassword();
    setGeneratedTemp(temp);
    setNewPassword(temp);
    setConfirmPassword(temp);
    setError('');
  };

  const handleCopy = () => {
    if (!generatedTemp) return;
    navigator.clipboard.writeText(generatedTemp);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleResetPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!newPassword) {
      setError('Please enter or generate a new password');
      return;
    }

    const check = validatePasswordStrength(newPassword);
    if (!check.isValid) {
      setError(check.error || 'Password does not meet complexity rules');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const updated = {
      ...user,
      failedLoginCount: 0,
      status: user.status === 'LOCKED' ? ('ACTIVE' as const) : user.status,
    };

    onUpdateUser(updated, `Password reset by Super Admin. Force change: ${forcePasswordChange ? 'YES' : 'NO'}`);
    setSuccessMsg(`Password successfully reset for ${user.name}`);
    setTimeout(() => {
      setSuccessMsg('');
      onClose();
    }, 1500);
  };

  const handleToggleMfa = () => {
    const updated = {
      ...user,
      isMfaEnabled: !user.isMfaEnabled,
    };
    onUpdateUser(updated, `Toggled Multi-Factor Authentication to ${!user.isMfaEnabled}`);
  };

  const handleUnlockAccount = () => {
    const updated = {
      ...user,
      status: 'ACTIVE' as const,
      failedLoginCount: 0,
    };
    onUpdateUser(updated, 'Unlocked account and reset failed login counter.');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-card border border-border rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border bg-gradient-to-r from-epfo-navy to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/10">
              <KeyRound className="w-5 h-5 text-epfo-accent" />
            </div>
            <div>
              <h2 className="text-base font-bold">Password & Security Controls</h2>
              <p className="text-xs text-white/70">{user.name} ({user.officialEmail})</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-semibold flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Security Triggers */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleUnlockAccount}
              disabled={user.status !== 'LOCKED'}
              className="p-3 rounded-xl border border-border bg-muted/30 hover:bg-muted font-semibold text-xs text-left flex items-center gap-2.5 transition-all disabled:opacity-50"
            >
              <Unlock className="w-4 h-4 text-emerald-500" />
              <div>
                <div className="font-bold">Unlock Account</div>
                <div className="text-[10px] text-muted-foreground">Clear failed logins ({user.failedLoginCount})</div>
              </div>
            </button>

            <button
              type="button"
              onClick={handleToggleMfa}
              className="p-3 rounded-xl border border-border bg-muted/30 hover:bg-muted font-semibold text-xs text-left flex items-center gap-2.5 transition-all"
            >
              <ShieldCheck className={`w-4 h-4 ${user.isMfaEnabled ? 'text-emerald-500' : 'text-muted-foreground'}`} />
              <div>
                <div className="font-bold">{user.isMfaEnabled ? 'Disable MFA' : 'Enable MFA'}</div>
                <div className="text-[10px] text-muted-foreground">Two-Factor OTP Security</div>
              </div>
            </button>
          </div>

          {/* Password Reset Form */}
          <form onSubmit={handleResetPasswordSubmit} className="space-y-4 pt-4 border-t border-border">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-epfo-navy dark:text-epfo-accent uppercase tracking-wider">
                Reset Account Password
              </h3>
              <button
                type="button"
                onClick={handleGenerateTempPassword}
                className="px-2.5 py-1 text-[11px] font-bold text-epfo-accent bg-epfo-navy rounded-lg hover:bg-epfo-dark transition-all flex items-center gap-1.5"
              >
                <Sparkles className="w-3 h-3" />
                <span>Auto-Generate Password</span>
              </button>
            </div>

            {generatedTemp && (
              <div className="p-3 rounded-xl bg-epfo-navy/5 border border-epfo-navy/20 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold block">Temporary Password:</span>
                  <span className="font-mono text-sm font-bold text-epfo-navy dark:text-epfo-accent">{generatedTemp}</span>
                </div>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-2 py-1 text-[10px] font-bold border border-border rounded-lg bg-card hover:bg-muted flex items-center gap-1"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-input bg-background focus:ring-2 focus:ring-epfo-navy outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-input bg-background focus:ring-2 focus:ring-epfo-navy outline-none"
                />
              </div>

              <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={forcePasswordChange}
                  onChange={(e) => setForcePasswordChange(e.target.checked)}
                  className="rounded border-input text-epfo-navy focus:ring-epfo-navy"
                />
                <span>Force password change on user's next login</span>
              </label>
            </div>

            <div className="pt-3 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-border hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-white bg-epfo-navy hover:bg-epfo-dark dark:bg-epfo-accent dark:text-epfo-navy rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Update Password</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
