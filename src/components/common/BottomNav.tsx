import React from 'react';
import {
  LayoutDashboard,
  CalendarDays,
  FileCheck2,
  Receipt,
  FileSpreadsheet
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const items = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'tours', label: 'Tours', icon: CalendarDays },
    { id: 'inspections', label: 'Inspect', icon: FileCheck2 },
    { id: 'claims', label: 'Claims', icon: Receipt },
    { id: 'reports', label: 'Reports', icon: FileSpreadsheet },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-lg border-t border-border px-2 py-1.5 shadow-lg">
      <nav className="flex items-center justify-around">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                'flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-200 min-w-[60px]',
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
