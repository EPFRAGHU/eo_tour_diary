import React, { useState } from 'react';
import { ShieldCheck, Search, Eye, FileSpreadsheet } from 'lucide-react';
import { UserActivityLogItem } from '@/types';

interface AuditLogsViewProps {
  activityLogs: UserActivityLogItem[];
}

export const AuditLogsView: React.FC<AuditLogsViewProps> = ({ activityLogs }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModule, setSelectedModule] = useState<string>('ALL');
  const [selectedLog, setSelectedLog] = useState<UserActivityLogItem | null>(null);

  const filteredLogs = activityLogs.filter((log) => {
    const matchesSearch =
      log.performedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.remarks && log.remarks.toLowerCase().includes(searchTerm.toLowerCase())) ||
      log.ipAddress.includes(searchTerm);

    const matchesModule = selectedModule === 'ALL' || log.module === selectedModule;

    return matchesSearch && matchesModule;
  });

  const handleExportCSV = () => {
    const headers = ['Timestamp', 'Performed By', 'Action', 'Module', 'IP Address', 'Device', 'Status', 'Remarks'];
    const rows = filteredLogs.map((l) => [
      l.timestamp,
      `"${l.performedBy}"`,
      `"${l.action}"`,
      `"${l.module}"`,
      `"${l.ipAddress}"`,
      `"${l.device || ''}"`,
      l.success ? 'SUCCESS' : 'FAILED',
      `"${l.remarks || ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `epfo_audit_logs_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-card border border-border">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-epfo-navy text-white dark:bg-epfo-accent dark:text-epfo-navy">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold">System Security & Audit Trail Logs</h3>
            <p className="text-xs text-muted-foreground">Immutable audit logs of all user actions, security triggers, and configuration edits</p>
          </div>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2 text-xs font-bold text-epfo-navy dark:text-epfo-accent border border-border bg-card hover:bg-muted rounded-xl transition-all flex items-center gap-2"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
          <span>Export Audit Log CSV</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by action, user email, IP..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-input bg-card focus:ring-2 focus:ring-epfo-navy outline-none"
          />
        </div>

        <div>
          <select
            value={selectedModule}
            onChange={(e) => setSelectedModule(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-input bg-card focus:ring-2 focus:ring-epfo-navy outline-none"
          >
            <option value="ALL">All System Modules</option>
            <option value="USER_MANAGEMENT">User Management</option>
            <option value="SYSTEM">System & Config</option>
            <option value="AUTH">Authentication</option>
            <option value="Tour Diary">Tour Diary</option>
            <option value="Establishments">Establishments</option>
            <option value="Documents">Documents</option>
          </select>
        </div>

        <div className="text-xs text-muted-foreground flex items-center justify-end font-semibold">
          Showing {filteredLogs.length} of {activityLogs.length} audit records
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="border border-border rounded-2xl overflow-hidden bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-muted/60 font-bold border-b border-border text-muted-foreground uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-3.5">Timestamp</th>
                <th className="p-3.5">Performed By</th>
                <th className="p-3.5">Action Code</th>
                <th className="p-3.5">Target Module</th>
                <th className="p-3.5">IP & Device</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-muted-foreground">
                    No matching audit logs found.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-3.5 font-mono text-[11px] text-muted-foreground whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="p-3.5 font-semibold text-foreground">{log.performedBy}</td>
                    <td className="p-3.5 font-mono font-bold text-epfo-navy dark:text-epfo-accent">{log.action}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-muted text-muted-foreground">
                        {log.module}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono text-[11px] text-muted-foreground">{log.ipAddress}</td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                        log.success ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-red-500/10 text-red-500'
                      }`}>
                        {log.success ? 'SUCCESS' : 'FAILED'}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="p-1.5 rounded-lg border border-border hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h4 className="font-bold text-sm flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-epfo-accent" /> Audit Record #{selectedLog.id}
              </h4>
              <button onClick={() => setSelectedLog(null)} className="p-1 rounded hover:bg-muted text-muted-foreground">
                <Eye className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2 text-xs">
              <p><strong>Timestamp:</strong> {new Date(selectedLog.timestamp).toString()}</p>
              <p><strong>Performed By:</strong> {selectedLog.performedBy}</p>
              <p><strong>Action:</strong> {selectedLog.action}</p>
              <p><strong>Module:</strong> {selectedLog.module}</p>
              <p><strong>IP Address:</strong> {selectedLog.ipAddress}</p>
              <p><strong>Device Info:</strong> {selectedLog.device || 'N/A'}</p>
              <p><strong>Remarks / Detail:</strong> {selectedLog.remarks || 'None'}</p>
            </div>
            <div className="pt-3 text-right">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-1.5 text-xs font-semibold rounded-xl bg-epfo-navy text-white hover:bg-epfo-dark dark:bg-epfo-accent dark:text-epfo-navy"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
