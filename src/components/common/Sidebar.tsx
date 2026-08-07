import React from 'react';
import {
  LayoutDashboard,
  CalendarDays,
  FileCheck2,
  Receipt,
  FileSpreadsheet,
  Building2,
  Settings,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'tours', label: 'Tour Schedule', icon: CalendarDays, badge: 'Active' },
    { id: 'inspections', label: 'Inspection Logs', icon: FileCheck2, badge: null },
    { id: 'claims', label: 'TA / DA Claims', icon: Receipt, badge: '3 Pending' },
    { id: 'reports', label: 'Monthly Reports', icon: FileSpreadsheet, badge: null },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-border bg-card/50 backdrop-blur-sm min-h-[calc(100vh-3.5rem)] p-4 justify-between">
      <div className="space-y-6">
        {/* Navigation Group */}
        <div>
          <div className="px-3 mb-2 text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
            EO Tour Workspace
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={cn(
                    'w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 group',
                    isActive
                      ? 'bg-epfo-navy text-white shadow-md shadow-epfo-navy/20'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/70'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={cn('w-4 h-4 transition-colors', isActive ? 'text-epfo-accent' : 'text-muted-foreground group-hover:text-foreground')} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge ? (
                    <span className={cn(
                      'text-[10px] px-2 py-0.5 rounded-full font-bold',
                      isActive
                        ? 'bg-epfo-accent text-white'
                        : 'bg-muted text-muted-foreground group-hover:bg-muted-foreground/20'
                    )}>
                      {item.badge}
                    </span>
                  ) : (
                    <ChevronRight className={cn('w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity', isActive && 'opacity-100 text-epfo-accent')} />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Quick Info Box */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-epfo-navy/5 to-epfo-accent/10 border border-epfo-navy/10 space-y-2">
          <div className="flex items-center gap-2 text-epfo-navy dark:text-epfo-slate font-bold text-xs">
            <Building2 className="w-4 h-4 text-epfo-accent" />
            <span>EPFO Regional Office</span>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            All submitted Tour Diaries and Inspection Notes are digitally signed & logged as per EPFO Field Inspection Manual.
          </p>
        </div>
      </div>

      {/* Footer Settings */}
      <div className="pt-4 border-t border-border">
        <button
          onClick={() => alert('Settings configuration modal')}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <Settings className="w-4 h-4" />
          <span>System Settings</span>
        </button>
      </div>
    </aside>
  );
};
