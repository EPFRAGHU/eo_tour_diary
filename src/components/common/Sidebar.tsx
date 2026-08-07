import React from 'react';
import {
  LayoutDashboard,
  CalendarDays,
  FileCheck2,
  Receipt,
  FileSpreadsheet,
  Building2,
  FolderOpen,
  PhoneCall,
  AlertTriangle,
  BarChart3,
  Settings,
  ChevronRight,
  Shield,
  Users,
  Key,
  Building,
  MapPin,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getDefaultOfficeName } from '@/lib/officeConfig';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const workspaceItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'analytics', label: 'Analytics Charts', icon: BarChart3, badge: 'Live' },
    { id: 'tours', label: 'Tour Schedule', icon: CalendarDays, badge: 'Active' },
    { id: 'inspections', label: 'Inspection Logs', icon: FileCheck2, badge: null },
    { id: 'followups', label: 'Pending Follow-ups', icon: AlertTriangle, badge: '4 Pending' },
    { id: 'establishments', label: 'Establishments', icon: Building2, badge: 'Master' },
    { id: 'documents', label: 'Document Vault', icon: FolderOpen, badge: 'v1.2' },
    { id: 'communication', label: 'Employer Communication', icon: PhoneCall, badge: 'Calls' },
    { id: 'claims', label: 'TA / DA Claims', icon: Receipt, badge: '3 Pending' },
    { id: 'reports', label: 'Monthly Reports', icon: FileSpreadsheet, badge: null },
  ];

  const adminItems = [
    { id: 'users', label: 'User Management', icon: Users, badge: 'Admin' },
    { id: 'roles', label: 'Roles & Permissions', icon: Key, badge: 'RBAC' },
    { id: 'departments', label: 'Departments', icon: Building, badge: null },
    { id: 'districts', label: 'Districts', icon: MapPin, badge: null },
    { id: 'audit-logs', label: 'Audit Logs', icon: FileText, badge: 'Logs' },
    { id: 'settings', label: 'System Settings', icon: Settings, badge: null },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-border bg-card/50 backdrop-blur-sm min-h-[calc(100vh-3.5rem)] p-4 justify-between">
      <div className="space-y-6 overflow-y-auto">
        {/* Workspace Group */}
        <div>
          <div className="px-3 mb-2 text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
            EO Tour Workspace
          </div>
          <nav className="space-y-1">
            {workspaceItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={cn(
                    'w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 group',
                    isActive
                      ? 'bg-epfo-navy text-white shadow-md shadow-epfo-navy/20 dark:bg-epfo-accent dark:text-epfo-navy'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/70'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={cn('w-4 h-4 transition-colors', isActive ? 'text-epfo-accent dark:text-epfo-navy' : 'text-muted-foreground group-hover:text-foreground')} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge ? (
                    <span className={cn(
                      'text-[10px] px-2 py-0.5 rounded-full font-bold',
                      isActive
                        ? 'bg-epfo-accent text-white dark:bg-epfo-navy dark:text-white'
                        : 'bg-muted text-muted-foreground group-hover:bg-muted-foreground/20'
                    )}>
                      {item.badge}
                    </span>
                  ) : (
                    <ChevronRight className={cn('w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity', isActive && 'opacity-100 text-epfo-accent dark:text-epfo-navy')} />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Administration Group */}
        <div>
          <div className="px-3 mb-2 text-[11px] font-bold tracking-wider text-epfo-navy dark:text-epfo-accent uppercase flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" />
            <span>Administration</span>
          </div>
          <nav className="space-y-1">
            {adminItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={cn(
                    'w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 group',
                    isActive
                      ? 'bg-epfo-navy text-white shadow-md shadow-epfo-navy/20 dark:bg-epfo-accent dark:text-epfo-navy'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/70'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={cn('w-4 h-4 transition-colors', isActive ? 'text-epfo-accent dark:text-epfo-navy' : 'text-muted-foreground group-hover:text-foreground')} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge ? (
                    <span className={cn(
                      'text-[10px] px-2 py-0.5 rounded-full font-bold',
                      isActive
                        ? 'bg-epfo-accent text-white dark:bg-epfo-navy dark:text-white'
                        : 'bg-muted text-muted-foreground group-hover:bg-muted-foreground/20'
                    )}>
                      {item.badge}
                    </span>
                  ) : (
                    <ChevronRight className={cn('w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity', isActive && 'opacity-100 text-epfo-accent dark:text-epfo-navy')} />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Quick Info Box */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-epfo-navy/5 to-epfo-accent/10 border border-epfo-navy/10 space-y-1.5">
          <div className="flex items-center gap-2 text-epfo-navy dark:text-epfo-slate font-bold text-xs">
            <Building2 className="w-4 h-4 text-epfo-accent" />
            <span>{getDefaultOfficeName()}</span>
          </div>
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            Default Regional/District Office jurisdiction for field inspections & tour diaries.
          </p>
        </div>
      </div>
    </aside>
  );
};
