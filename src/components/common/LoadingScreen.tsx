import React from 'react';
import { Shield } from 'lucide-react';

export const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center space-y-4">
      <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-epfo-navy to-epfo-blue text-white shadow-xl ring-4 ring-epfo-accent/20 animate-pulse">
        <Shield className="w-8 h-8 text-epfo-accent" />
      </div>
      <div className="text-center space-y-1">
        <h3 className="text-sm font-bold text-foreground">EPFO EO Tour Diary</h3>
        <p className="text-xs text-muted-foreground">Authenticating & loading workspace baseline...</p>
      </div>
      <div className="flex items-center gap-1.5 pt-2">
        <div className="w-2 h-2 rounded-full bg-epfo-accent animate-bounce"></div>
        <div className="w-2 h-2 rounded-full bg-epfo-accent animate-bounce [animation-delay:0.2s]"></div>
        <div className="w-2 h-2 rounded-full bg-epfo-accent animate-bounce [animation-delay:0.4s]"></div>
      </div>
    </div>
  );
};
