import React from 'react';
import {
  LayoutDashboard,
  CalendarDays,
  FileCheck2,
  AlertTriangle,
  FileSpreadsheet,
  Wifi,
  WifiOff
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNetworkStatus } from '@/lib/offlineStorage';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const isOnline = useNetworkStatus();

  const items = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'tours', label: 'Tours', icon: CalendarDays },
    { id: 'inspections', label: 'Inspect', icon: FileCheck2 },
    { id: 'followups', label: 'Follow-up', icon: AlertTriangle },
    { id: 'reports', label: 'Reports', icon: FileSpreadsheet },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-lg border-t border-border px-2 py-1.5 shadow-lg">
      {/* Network Connectivity Status Indicator Bar */}
      <div className="flex items-center justify-between px-3 py-0.5 mb-1 text-[9px] font-mono border-b border-border/40">
        <div className="flex items-center gap-1">
          {isOnline ? (
            <>
              <Wifi className="w-3 h-3 text-emerald-500" />
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">ONLINE (Auto-Sync Active)</span>
            </>
          ) : (
            <>
              <WifiOff className="w-3 h-3 text-red-500 animate-pulse" />
              <span className="text-red-500 font-bold">OFFLINE MODE (Drafts Saved Locally)</span>
            </>
          )}
        </div>
        <span className="text-muted-foreground font-bold">EPFO Mobile PWA</span>
      </div>

      <nav className="flex items-center justify-around">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                'flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all duration-200 min-w-[64px] min-h-[48px] touch-manipulation',
                isActive
                  ? 'text-epfo-accent font-bold scale-105'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <div className={cn('p-1 rounded-lg transition-colors', isActive && 'bg-epfo-accent/10')}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] tracking-tight mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
