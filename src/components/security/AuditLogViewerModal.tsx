import React, { useState, useEffect } from 'react';
import { ShieldCheck, XCircle, Search, Clock, User, Shield, CheckCircle2 } from 'lucide-react';
import { getAuditLogs, AuditLogEntry } from '@/lib/securityUtils';
import { formatDate } from '@/lib/utils';

interface AuditLogViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuditLogViewerModal: React.FC<AuditLogViewerModalProps> = ({ isOpen, onClose }) => {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isOpen) {
      setLogs(getAuditLogs());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredLogs = logs.filter(
    (l) =>
      l.actorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.resourceTarget.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-card w-full max-w-3xl rounded-2xl border border-border shadow-2xl p-6 space-y-5 max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-epfo-navy text-white flex items-center justify-center">
              <Shield className="w-4 h-4 text-epfo-accent" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">Security Audit Log & Activity Stream</h3>
              <p className="text-xs text-muted-foreground">
                Append-only immutable audit trail tracking system events, user actions, and RBAC permission checks.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1 rounded-lg">
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input Bar */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search actor, action key, resource, or log details..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-background border border-border text-xs focus:ring-2 focus:ring-epfo-accent outline-none"
          />
        </div>

        {/* Log List Table / Stream */}
        <div className="overflow-y-auto flex-1 custom-scrollbar space-y-2 text-xs pr-1">
          {filteredLogs.length === 0 ? (
            <div className="p-8 text-center border border-dashed rounded-xl space-y-2 text-muted-foreground">
              <ShieldCheck className="w-8 h-8 mx-auto text-emerald-500 stroke-1" />
              <p>No security audit logs match the current search criteria.</p>
            </div>
          ) : (
            filteredLogs.map((log) => (
              <div
                key={log.id}
                className="p-3.5 rounded-xl bg-muted/30 border border-border/50 space-y-1.5 font-sans"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] bg-epfo-navy text-white px-2 py-0.5 rounded font-bold uppercase">
                      {log.action}
                    </span>
                    <span className="font-bold text-foreground flex items-center gap-1">
                      <User className="w-3 h-3 text-muted-foreground" />
                      {log.actorName}
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground">({log.actorRole})</span>
                  </div>

                  <div className="flex items-center gap-2 font-mono text-[10px] text-muted-foreground">
                    <Clock className="w-3 h-3 text-muted-foreground" />
                    <span>{formatDate(log.timestamp)}</span>
                  </div>
                </div>

                <div className="text-[11px] text-foreground font-medium">{log.details}</div>

                <div className="pt-1 flex items-center justify-between text-[10px] font-mono text-muted-foreground border-t border-border/40">
                  <span>Target: <strong className="text-foreground">{log.resourceTarget}</strong></span>
                  <span className="flex items-center gap-1 text-emerald-500 font-bold">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{log.status}</span>
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
