import React, { useState } from 'react';
import { X, Globe, Smartphone, Monitor, LogOut, Ban, CheckCircle2 } from 'lucide-react';
import { ExtendedUserProfile, UserSessionItem } from '@/types';

interface LoginSecurityModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: ExtendedUserProfile | null;
  sessions: UserSessionItem[];
  onTerminateSession: (sessionId: string) => void;
  onTerminateAllSessions: (userId: string) => void;
}

export const LoginSecurityModal: React.FC<LoginSecurityModalProps> = ({
  isOpen,
  onClose,
  user,
  sessions,
  onTerminateSession,
  onTerminateAllSessions,
}) => {
  const [blockedIps, setBlockedIps] = useState<string[]>([]);
  const [whitelistedIps, setWhitelistedIps] = useState<string[]>(['192.168.1.153']);
  const [actionMsg, setActionMsg] = useState('');

  if (!isOpen || !user) return null;

  const userSessions = sessions.filter((s) => s.userId === user.id || s.userEmail === user.officialEmail);

  const handleBlockIp = (ip: string) => {
    if (!blockedIps.includes(ip)) {
      setBlockedIps([...blockedIps, ip]);
      setActionMsg(`IP Address ${ip} added to blocked firewall blacklist.`);
      setTimeout(() => setActionMsg(''), 3000);
    }
  };

  const handleWhitelistIp = (ip: string) => {
    if (!whitelistedIps.includes(ip)) {
      setWhitelistedIps([...whitelistedIps, ip]);
      setActionMsg(`IP Address ${ip} added to trusted whitelist.`);
      setTimeout(() => setActionMsg(''), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-card border border-border rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border bg-gradient-to-r from-epfo-navy to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/10">
              <Globe className="w-5 h-5 text-epfo-accent" />
            </div>
            <div>
              <h2 className="text-base font-bold">Login Security & Session Management</h2>
              <p className="text-xs text-white/70">{user.name} ({user.officialEmail})</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {actionMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{actionMsg}</span>
            </div>
          )}

          {/* Quick Session Controls */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-epfo-navy dark:text-epfo-accent uppercase tracking-wider">
                Active Concurrent Sessions ({userSessions.length})
              </h3>
              <p className="text-[11px] text-muted-foreground">Monitor real-time device connections & remote logout</p>
            </div>
            <button
              onClick={() => {
                onTerminateAllSessions(user.id);
                setActionMsg('All active sessions terminated. User logged out on all devices.');
                setTimeout(() => setActionMsg(''), 3000);
              }}
              disabled={userSessions.length === 0}
              className="px-3 py-1.5 text-xs font-bold text-red-600 dark:text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 rounded-xl transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout All Devices</span>
            </button>
          </div>

          {/* Session List */}
          <div className="space-y-3">
            {userSessions.length === 0 ? (
              <div className="p-6 text-center border border-dashed border-border rounded-2xl text-xs text-muted-foreground">
                No active device sessions found for this user.
              </div>
            ) : (
              userSessions.map((sess) => (
                <div key={sess.id} className="p-4 rounded-2xl border border-border bg-card/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-epfo-navy/10 dark:bg-epfo-accent/20 text-epfo-navy dark:text-epfo-accent mt-0.5">
                      {sess.device.toLowerCase().includes('mobile') || sess.device.toLowerCase().includes('tab') ? (
                        <Smartphone className="w-5 h-5" />
                      ) : (
                        <Monitor className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold">{sess.device} — {sess.browser}</h4>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                          Active ({sess.sessionDuration})
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        OS: {sess.os} • IP: <span className="font-mono">{sess.ipAddress}</span> • Location: {sess.location}
                      </p>
                      <p className="text-[10px] text-muted-foreground">Last active: {new Date(sess.lastActive).toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleWhitelistIp(sess.ipAddress)}
                      className="px-2.5 py-1 text-[10px] font-semibold border border-border rounded-lg bg-card hover:bg-muted"
                    >
                      Whitelist IP
                    </button>
                    <button
                      onClick={() => handleBlockIp(sess.ipAddress)}
                      className="px-2.5 py-1 text-[10px] font-semibold text-amber-600 dark:text-amber-400 border border-amber-500/30 rounded-lg bg-amber-500/10 hover:bg-amber-500/20"
                    >
                      Block IP
                    </button>
                    <button
                      onClick={() => onTerminateSession(sess.id)}
                      className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Terminate Session"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Firewall Rules Overview */}
          <div className="p-4 rounded-2xl bg-muted/30 border border-border grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <h4 className="font-bold text-muted-foreground uppercase text-[10px] tracking-wider mb-2 flex items-center gap-1.5">
                <Ban className="w-3.5 h-3.5 text-red-500" /> Blocked IP Blacklist ({blockedIps.length})
              </h4>
              {blockedIps.length === 0 ? (
                <p className="text-muted-foreground text-[11px]">No IP addresses blocked.</p>
              ) : (
                <ul className="space-y-1">
                  {blockedIps.map((ip) => (
                    <li key={ip} className="font-mono text-red-500 font-bold">{ip}</li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <h4 className="font-bold text-muted-foreground uppercase text-[10px] tracking-wider mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Trusted IP Whitelist ({whitelistedIps.length})
              </h4>
              <ul className="space-y-1">
                {whitelistedIps.map((ip) => (
                  <li key={ip} className="font-mono text-emerald-500 font-bold">{ip}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
