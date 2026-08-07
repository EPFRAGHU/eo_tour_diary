import React from 'react';
import { ShieldX, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';

export const AccessDenied: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center space-y-5">
      <div className="w-16 h-16 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center border border-destructive/20 shadow-lg">
        <ShieldX className="w-8 h-8" />
      </div>
      <div className="space-y-2 max-w-md">
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">403 - Access Denied</h1>
        <h2 className="text-sm font-bold text-muted-foreground">Insufficient Permission Level</h2>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Your current officer role (<span className="font-bold text-foreground">{user?.role}</span>) does not have authorization to view or execute actions on this portal module.
        </p>
      </div>
      <button
        onClick={() => navigate('/')}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-epfo-navy hover:bg-epfo-blue text-white font-bold text-xs shadow-md transition-all active:scale-95"
      >
        <ArrowLeft className="w-4 h-4 text-epfo-accent" />
        Return to My Role Dashboard
      </button>
    </div>
  );
};
