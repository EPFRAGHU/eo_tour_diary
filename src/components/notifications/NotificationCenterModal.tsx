import React, { useState } from 'react';
import {
  Bell,
  XCircle,
  MapPin,
  Clock,
  FileWarning,
  CheckCircle2,
  AlertCircle,
  Trash2,
  CheckCheck,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export type NotificationType =
  | 'PENDING_VISIT'
  | 'UPCOMING_FOLLOWUP'
  | 'MISSING_DOC'
  | 'REMINDER'
  | 'SYSTEM_ALERT';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  timestamp: string;
  isRead: boolean;
  targetTab?: string;
  esttCode?: string;
}

interface NotificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (tab: string) => void;
}

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<string>('ALL');

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'n-1',
      title: 'Pending Site Visit Scheduled Today',
      message: 'Field visit scheduled for M/s Bharat Security & Allied Services (OR/6019). Form 11 notice verification due.',
      type: 'PENDING_VISIT',
      timestamp: new Date().toISOString(),
      isRead: false,
      targetTab: 'tours',
      esttCode: 'OR/6019',
    },
    {
      id: 'n-2',
      title: 'Form 11 Inspection Notice Missing',
      message: 'Inspection note scan for Apex Logistics & Freight India (MH/BAN/0045231) pending document upload.',
      type: 'MISSING_DOC',
      timestamp: '2026-08-06',
      isRead: false,
      targetTab: 'documents',
      esttCode: 'MH/BAN/0045231',
    },
    {
      id: 'n-3',
      title: 'Upcoming Section 7A Enquiry Due Date',
      message: 'Section 7A dues hearing reminder for M/s Bhimtanagar Sukinda Chromite Mines (OR/BBS/1238) due in 3 days.',
      type: 'UPCOMING_FOLLOWUP',
      timestamp: '2026-08-05',
      isRead: false,
      targetTab: 'followups',
      esttCode: 'OR/BBS/1238',
    },
    {
      id: 'n-4',
      title: 'Tour Program Approved by APFC',
      message: 'APFC (Compliance) approved Tour Program: Special Compliance Drive - Andheri East Zone.',
      type: 'SYSTEM_ALERT',
      timestamp: '2026-08-04',
      isRead: true,
      targetTab: 'tours',
    },
    {
      id: 'n-5',
      title: 'Monthly Tour Diary Submission Reminder',
      message: 'Reminder to submit finalized monthly tour diary report for August 2026 before end of month.',
      type: 'REMINDER',
      timestamp: '2026-08-02',
      isRead: false,
      targetTab: 'reports',
    },
  ]);

  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === 'ALL') return true;
    if (activeTab === 'UNREAD') return !n.isRead;
    return n.type === activeTab;
  });

  const handleMarkAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleMarkAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
  };

  const handleClear = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const getTypeIcon = (type: NotificationType) => {
    switch (type) {
      case 'PENDING_VISIT':
        return <MapPin className="w-4 h-4 text-emerald-500" />;
      case 'MISSING_DOC':
        return <FileWarning className="w-4 h-4 text-red-500" />;
      case 'UPCOMING_FOLLOWUP':
        return <Clock className="w-4 h-4 text-amber-500" />;
      case 'REMINDER':
        return <AlertCircle className="w-4 h-4 text-blue-500" />;
      case 'SYSTEM_ALERT':
      default:
        return <ShieldCheck className="w-4 h-4 text-epfo-accent" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-end p-4 lg:p-6 animate-in fade-in duration-200">
      <div className="bg-card w-full max-w-md rounded-2xl border border-border shadow-2xl space-y-4 max-h-[85vh] overflow-hidden flex flex-col">
        {/* Top Header */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-muted/30">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Bell className="w-5 h-5 text-epfo-accent" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-epfo-accent animate-pulse"></span>
              )}
            </div>
            <h3 className="text-sm font-bold text-foreground">Notification Center</h3>
            <span className="font-mono text-[10px] bg-epfo-navy text-white px-2 py-0.5 rounded-full font-bold">
              {unreadCount} New
            </span>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-[11px] font-bold text-epfo-accent hover:underline flex items-center gap-1"
                title="Mark all as read"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark all read</span>
              </button>
            )}
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1 rounded-lg">
              <XCircle className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="px-4 flex items-center gap-1 overflow-x-auto custom-scrollbar text-xs">
          {[
            { id: 'ALL', label: `All (${notifications.length})` },
            { id: 'UNREAD', label: `Unread (${unreadCount})` },
            { id: 'PENDING_VISIT', label: 'Visits' },
            { id: 'UPCOMING_FOLLOWUP', label: 'Follow-ups' },
            { id: 'MISSING_DOC', label: 'Missing Docs' },
            { id: 'SYSTEM_ALERT', label: 'System' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-epfo-navy text-white shadow-sm'
                  : 'bg-muted/60 text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Notifications List Body */}
        <div className="p-4 space-y-3 overflow-y-auto flex-1 custom-scrollbar">
          {filteredNotifications.length === 0 ? (
            <div className="p-8 text-center border border-dashed rounded-xl space-y-2 text-muted-foreground text-xs">
              <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500 stroke-1" />
              <p>No notifications matching this filter.</p>
            </div>
          ) : (
            filteredNotifications.map((item) => (
              <div
                key={item.id}
                className={`p-3.5 rounded-xl border transition-all space-y-2 text-xs relative ${
                  item.isRead
                    ? 'bg-card border-border/60 opacity-80'
                    : 'bg-muted/40 border-epfo-accent/40 shadow-sm'
                }`}
              >
                {!item.isRead && (
                  <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-epfo-accent"></div>
                )}

                <div className="flex items-start gap-2.5 pr-4">
                  <div className="shrink-0 pt-0.5">{getTypeIcon(item.type)}</div>
                  <div className="space-y-0.5">
                    <h4 className="font-bold text-foreground leading-snug">{item.title}</h4>
                    {item.esttCode && (
                      <span className="inline-block font-mono text-[9px] bg-epfo-navy/10 text-epfo-navy dark:text-epfo-slate px-1.5 py-0.2 rounded font-bold">
                        {item.esttCode}
                      </span>
                    )}
                    <p className="text-[11px] text-muted-foreground leading-relaxed font-sans">{item.message}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border/40 text-[10px] font-mono text-muted-foreground">
                  <span>{formatDate(item.timestamp)}</span>

                  <div className="flex items-center gap-2">
                    {item.targetTab && onNavigate && (
                      <button
                        onClick={() => {
                          onNavigate(item.targetTab!);
                          handleMarkAsRead(item.id);
                          onClose();
                        }}
                        className="font-bold text-epfo-accent hover:underline flex items-center gap-0.5"
                      >
                        <span>Take Action</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    )}

                    {!item.isRead && (
                      <button
                        onClick={() => handleMarkAsRead(item.id)}
                        className="text-muted-foreground hover:text-foreground font-bold"
                        title="Mark Read"
                      >
                        Read
                      </button>
                    )}

                    <button
                      onClick={() => handleClear(item.id)}
                      className="text-muted-foreground hover:text-destructive p-0.5"
                      title="Clear"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
