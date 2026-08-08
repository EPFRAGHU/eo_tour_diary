import React, { useState } from 'react';
import {
  Trash2,
  AlertOctagon,
  CheckCircle2,
  Database,
  Building,
  CalendarDays,
  FileCheck2,
  Receipt,
  FileText,
  RefreshCw,
  Sparkles,
  ShieldAlert,
  X
} from 'lucide-react';
import { purgeAllPortalData, purgeSpecificModule, loadSampleDataset } from '@/lib/appStorage';
import { ExtendedUserProfile } from '@/types';

interface DataPurgeManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: ExtendedUserProfile;
  counts: {
    establishments: number;
    tours: number;
    inspections: number;
    claims: number;
    documents: number;
  };
  onDataReset: () => void;
}

export const DataPurgeManagementModal: React.FC<DataPurgeManagementModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  counts,
  onDataReset,
}) => {
  const [confirmInput, setConfirmInput] = useState('');
  const [selectedModule, setSelectedModule] = useState<string>('ALL');
  const [isProcessing, setIsProcessing] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  if (!isOpen) return null;

  const totalRecords = counts.establishments + counts.tours + counts.inspections + counts.claims + counts.documents;

  const handleExecutePurge = () => {
    if (confirmInput.trim().toUpperCase() !== 'DELETE') {
      setNotification({ type: 'error', message: 'Please type DELETE in the confirmation box to proceed.' });
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      if (selectedModule === 'ALL') {
        purgeAllPortalData(currentUser?.email);
        setNotification({
          type: 'success',
          message: `Purged all ${totalRecords} records across the portal. App is now in 100% clean Live Mode.`,
        });
      } else {
        const count = purgeSpecificModule(selectedModule as any, currentUser?.email);
        setNotification({
          type: 'success',
          message: `Successfully purged all ${count} records from ${selectedModule}.`,
        });
      }

      onDataReset();
      setIsProcessing(false);
      setConfirmInput('');
      setTimeout(() => {
        onClose();
      }, 1800);
    }, 600);
  };

  const handleLoadDemo = () => {
    setIsProcessing(true);
    setTimeout(() => {
      loadSampleDataset(currentUser?.email);
      onDataReset();
      setIsProcessing(false);
      setNotification({ type: 'success', message: 'Standard EPFO Odisha sample dataset loaded successfully.' });
      setTimeout(() => {
        onClose();
      }, 1500);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-card border border-border/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-red-950 via-slate-900 to-slate-900 text-white border-b border-red-900/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-red-500/20 border border-red-500/30 text-red-400">
              <AlertOctagon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold tracking-tight">Super Admin Master Data Purge & Reset Center</h3>
                <span className="px-2 py-0.5 text-[9px] font-black uppercase bg-red-500 text-white rounded-full">
                  SUPER_ADMIN ONLY
                </span>
              </div>
              <p className="text-xs text-white/70 mt-0.5">
                Remove all mock/dummy data, clear incorrect entries, and switch the application to clean Live Mode.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto text-xs">
          {notification && (
            <div
              className={`p-4 rounded-2xl border flex items-center gap-3 font-bold text-xs ${
                notification.type === 'success'
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                  : 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30'
              }`}
            >
              {notification.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
              <span>{notification.message}</span>
            </div>
          )}

          {/* Live Data Inventory Counts */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2">
              <Database className="w-4 h-4 text-epfo-accent" />
              <span>Current Live Database Records ({totalRecords} Total)</span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {[
                { label: 'Establishments', count: counts.establishments, icon: Building, key: 'establishments' },
                { label: 'Tour Programs', count: counts.tours, icon: CalendarDays, key: 'tours' },
                { label: 'Inspection Logs', count: counts.inspections, icon: FileCheck2, key: 'inspections' },
                { label: 'TA / DA Claims', count: counts.claims, icon: Receipt, key: 'claims' },
                { label: 'Vault Documents', count: counts.documents, icon: FileText, key: 'documents' },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.key}
                    className="p-3 rounded-2xl border border-border bg-muted/20 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2 text-foreground font-semibold">
                      <Icon className="w-4 h-4 text-epfo-accent" />
                      <span>{item.label}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-card font-mono font-bold text-xs border border-border">
                      {item.count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Scope Selector */}
          <div className="p-4 rounded-2xl border border-border bg-card space-y-3">
            <label className="block font-bold text-foreground">Select Purge Scope</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'ALL', label: '💥 Purge Everything (All 5 Modules)' },
                { id: 'establishments', label: '🏢 Clear Establishments Only' },
                { id: 'tours', label: '📅 Clear Tour Programs Only' },
                { id: 'inspections', label: '📝 Clear Inspections Only' },
                { id: 'claims', label: '💰 Clear Claims Only' },
                { id: 'documents', label: '📁 Clear Documents Only' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setSelectedModule(m.id)}
                  className={`p-2.5 rounded-xl border text-left font-bold text-[11px] transition-all ${
                    selectedModule === m.id
                      ? 'border-red-500 bg-red-500/10 text-red-600 dark:text-red-400 ring-2 ring-red-500/20'
                      : 'border-border bg-muted/20 hover:bg-muted text-muted-foreground'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Security Safeguard Confirmation */}
          <div className="p-4 rounded-2xl border border-red-500/30 bg-red-500/5 space-y-3">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-bold">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>Type "DELETE" to confirm permanent purge action:</span>
            </div>
            <input
              type="text"
              placeholder='Type DELETE here'
              value={confirmInput}
              onChange={(e) => setConfirmInput(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-red-500/40 bg-background font-mono font-bold text-xs uppercase focus:ring-2 focus:ring-red-500 outline-none"
            />
            <p className="text-[11px] text-muted-foreground">
              This action is logged in the permanent Super Admin Audit Trail and immediately removes records from local storage.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-muted/40 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleLoadDemo}
            disabled={isProcessing}
            className="px-3.5 py-2 rounded-xl border border-border bg-card hover:bg-muted text-xs font-bold text-foreground transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-epfo-accent" />
            <span>Load Odisha Demo Dataset</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleExecutePurge}
              disabled={isProcessing || confirmInput.trim().toUpperCase() !== 'DELETE'}
              className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold shadow-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              <span>Execute Permanent Purge</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
