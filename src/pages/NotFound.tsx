import React from 'react';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center space-y-5">
      <div className="w-16 h-16 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center border border-destructive/20 shadow-lg">
        <ShieldAlert className="w-8 h-8" />
      </div>
      <div className="space-y-2 max-w-md">
        <h1 className="text-4xl font-extrabold text-foreground tracking-tight">404</h1>
        <h2 className="text-base font-bold text-foreground">Page Not Found</h2>
        <p className="text-xs text-muted-foreground leading-relaxed">
          The requested tour diary record or portal route does not exist or has been relocated.
        </p>
      </div>
      <button
        onClick={() => navigate('/')}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-epfo-navy hover:bg-epfo-blue text-white font-bold text-xs shadow-md transition-all active:scale-95"
      >
        <ArrowLeft className="w-4 h-4 text-epfo-accent" />
        Return to Portal Dashboard
      </button>
    </div>
  );
};
