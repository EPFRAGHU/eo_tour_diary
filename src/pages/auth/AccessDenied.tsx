import React from 'react';
import { ShieldX, ArrowLeft, ShieldAlert, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';

export const AccessDenied: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center space-y-5">
      <div className="w-16 h-16 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center border border-destructive/20 shadow-xl animate-in zoom-in-90">
        <ShieldX className="w-8 h-8" />
      </div>

      <div className="space-y-2 max-w-lg">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 font-extrabold text-[11px] border border-red-500/20 mb-2">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>HTTP 403 FORBIDDEN — SECURITY VIOLATION LOGGED</span>
        </div>

        <h1 className="text-3xl font-black text-foreground tracking-tight">Access Denied</h1>
        <h2 className="text-sm font-bold text-muted-foreground">Administration Section Requires Super Admin Clearance</h2>
        
        <p className="text-xs text-muted-foreground leading-relaxed pt-2">
          The Administration section is accessible <strong className="text-foreground">ONLY to the Super Admin</strong> (<code className="font-mono text-epfo-accent">raghunatha.maharana@gmail.com</code>).
        </p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Your current officer role (<span className="font-bold text-foreground">{user?.role || 'Guest'}</span>) does not possess administrative privileges. This access attempt has been recorded in the security audit trail.
        </p>
      </div>

      <div className="p-3.5 rounded-xl border border-border bg-card/60 max-w-sm w-full text-[11px] font-mono text-muted-foreground space-y-1">
        <div className="flex justify-between">
          <span>Officer:</span>
          <span className="font-bold text-foreground">{user?.name || 'Unauthenticated'}</span>
        </div>
        <div className="flex justify-between">
          <span>Role Clearance:</span>
          <span className="font-bold text-red-500">{user?.role || 'NONE'}</span>
        </div>
        <div className="flex justify-between">
          <span>Status:</span>
          <span className="font-bold text-red-500 flex items-center gap-1">
            <Lock className="w-3 h-3" /> REJECTED
          </span>
        </div>
      </div>

      <button
        onClick={() => navigate('/')}
        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-epfo-navy hover:bg-epfo-dark dark:bg-epfo-accent dark:text-epfo-navy text-white font-bold text-xs shadow-lg transition-all active:scale-95"
      >
        <ArrowLeft className="w-4 h-4" />
        Return to Officer Dashboard
      </button>
    </div>
  );
};
