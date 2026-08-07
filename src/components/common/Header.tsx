import React from 'react';
import { Shield, Bell, Search, UserCheck, LogOut } from 'lucide-react';
import { UserProfile } from '@/types';
import { ThemeSwitcher } from './ThemeSwitcher';
import { useAuth } from '@/providers/AuthProvider';

interface HeaderProps {
  user: UserProfile;
  activeTab: string;
}

export const Header: React.FC<HeaderProps> = ({ user, activeTab }) => {
  const { logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 bg-background/85 backdrop-blur-md border-b border-border px-4 lg:px-8 py-3 transition-colors">
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
        {/* Left Branding / Page Title */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-epfo-navy to-epfo-blue text-white shadow-md shadow-epfo-navy/20 ring-1 ring-white/20">
            <Shield className="w-5 h-5 text-epfo-accent" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-wider text-epfo-accent uppercase">EPFO Portal</span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] bg-epfo-navy/10 dark:bg-epfo-navy/40 text-epfo-navy dark:text-epfo-slate px-2 py-0.5 rounded-full font-medium">
                {user.officeRegion}
              </span>
            </div>
            <h1 className="text-base font-bold capitalize text-foreground tracking-tight">
              {activeTab === 'dashboard' && 'Officer Dashboard'}
              {activeTab === 'tours' && 'Tour Program Schedule'}
              {activeTab === 'inspections' && 'Field Inspection Logs'}
              {activeTab === 'followups' && 'Pending Compliance Follow-ups'}
              {activeTab === 'establishments' && 'Establishments Registry'}
              {activeTab === 'documents' && 'Digital Document Vault'}
              {activeTab === 'communication' && 'Employer Communication & Call Liaison'}
              {activeTab === 'claims' && 'TA / DA Claims Management'}
              {activeTab === 'reports' && 'Monthly Tour Diary Reports'}
            </h1>
          </div>
        </div>

        {/* Right Action Icons & User Badge */}
        <div className="flex items-center gap-3">
          {/* Theme Switcher */}
          <ThemeSwitcher />

          {/* Quick Search */}
          <div className="hidden md:flex items-center gap-2 bg-muted/60 hover:bg-muted transition-colors rounded-lg px-3 py-1.5 text-xs text-muted-foreground border border-border/50">
            <Search className="w-3.5 h-3.5" />
            <span>Search establishments, tours...</span>
            <kbd className="ml-4 font-mono text-[10px] bg-background border rounded px-1.5 py-0.5 text-muted-foreground">⌘K</kbd>
          </div>

          {/* Notifications */}
          <button
            aria-label="Notifications"
            className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-epfo-accent"></span>
          </button>

          {/* Officer Profile Badge */}
          <div className="flex items-center gap-2 pl-3 border-l border-border">
            <div className="w-8 h-8 rounded-full bg-epfo-navy text-white font-bold flex items-center justify-center text-xs ring-2 ring-epfo-accent/30 shadow-sm">
              {user.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="hidden sm:block text-left text-xs leading-tight">
              <div className="font-semibold text-foreground flex items-center gap-1">
                {user.name}
                <UserCheck className="w-3 h-3 text-emerald-500" />
              </div>
              <div className="text-[10px] text-muted-foreground font-bold flex items-center gap-1">
                <span className="px-1.5 py-0.2 rounded bg-epfo-accent/10 text-epfo-accent uppercase">
                  {user.role}
                </span>
                <span>{user.designation}</span>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={logout}
              title="Sign Out of Officer Session"
              className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors ml-1"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
