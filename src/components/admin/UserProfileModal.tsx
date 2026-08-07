import React, { useState } from 'react';
import { X, User, CalendarDays, FolderOpen, Activity, Shield, Settings, Phone, Building, Briefcase, Globe, Smartphone } from 'lucide-react';
import { ExtendedUserProfile, TourProgramItem, DocumentRecord, UserActivityLogItem, UserSessionItem, RolePermissionsMap } from '@/types';
import { isProtectedSuperAdmin } from '@/lib/securityUtils';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: ExtendedUserProfile | null;
  tours: TourProgramItem[];
  documents: DocumentRecord[];
  activityLogs: UserActivityLogItem[];
  sessions: UserSessionItem[];
  rbacMatrix: RolePermissionsMap;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  tours,
  documents,
  activityLogs,
  sessions,
  rbacMatrix,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'tours' | 'documents' | 'activity' | 'sessions' | 'permissions' | 'settings'>('profile');

  if (!isOpen || !user) return null;

  const isSuperAdmin = isProtectedSuperAdmin(user);
  const userTours = tours.filter((t) => t.officerId === user.id || t.officerId === user.employeeId);
  const userLogs = activityLogs.filter((l) => l.userId === user.id || l.userEmail === user.officialEmail);
  const userSessions = sessions.filter((s) => s.userId === user.id || s.userEmail === user.officialEmail);
  const permissionsForRole = rbacMatrix[user.role] || {};

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-card border border-border rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header Profile Banner */}
        <div className="px-6 py-5 border-b border-border bg-gradient-to-r from-epfo-navy via-epfo-dark to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={user.avatarUrl || user.photoUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'}
                alt={user.name}
                className="w-14 h-14 rounded-2xl border-2 border-epfo-accent object-cover shadow-md"
              />
              {isSuperAdmin && (
                <span className="absolute -top-1 -right-1 p-1 bg-epfo-accent text-epfo-navy rounded-full shadow" title="Super Admin">
                  <Shield className="w-3.5 h-3.5 fill-current" />
                </span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold">{user.name}</h2>
                <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                  user.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                  user.status === 'LOCKED' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                  'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}>
                  {user.status}
                </span>
              </div>
              <p className="text-xs text-white/80 flex items-center gap-2 mt-0.5">
                <Briefcase className="w-3.5 h-3.5 text-epfo-accent shrink-0" />
                <span>{user.designation}</span>
                <span className="text-white/40">•</span>
                <span className="font-mono text-epfo-accent text-[11px]">{user.employeeId}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-border bg-muted/30 px-6 gap-2 overflow-x-auto">
          {[
            { id: 'profile', label: 'Profile Information', icon: User },
            { id: 'tours', label: `Tour Diary (${userTours.length})`, icon: CalendarDays },
            { id: 'documents', label: `Documents (${documents.length})`, icon: FolderOpen },
            { id: 'activity', label: `Activity (${userLogs.length})`, icon: Activity },
            { id: 'sessions', label: `Sessions (${userSessions.length})`, icon: Globe },
            { id: 'permissions', label: 'Permissions Matrix', icon: Shield },
            { id: 'settings', label: 'Account Settings', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-3.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                  isActive
                    ? 'border-epfo-navy text-epfo-navy dark:border-epfo-accent dark:text-epfo-accent bg-card'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Tab 1: Profile Information */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 rounded-2xl bg-muted/40 border border-border space-y-3">
                  <h4 className="text-xs font-bold text-epfo-navy dark:text-epfo-accent uppercase tracking-wider flex items-center gap-2">
                    <User className="w-4 h-4" /> Personal Profile
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-border/50">
                      <span className="text-muted-foreground">Username:</span>
                      <span className="font-mono font-semibold">{user.username}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-border/50">
                      <span className="text-muted-foreground">Gender:</span>
                      <span className="font-semibold">{user.gender || 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-border/50">
                      <span className="text-muted-foreground">Date of Birth:</span>
                      <span className="font-semibold">{user.dob || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-muted-foreground">Personal Email:</span>
                      <span className="font-semibold text-epfo-accent truncate max-w-[140px]" title={user.personalEmail}>{user.personalEmail || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-muted/40 border border-border space-y-3">
                  <h4 className="text-xs font-bold text-epfo-navy dark:text-epfo-accent uppercase tracking-wider flex items-center gap-2">
                    <Building className="w-4 h-4" /> Official Assignment
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-border/50">
                      <span className="text-muted-foreground">Office:</span>
                      <span className="font-semibold">{user.office}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-border/50">
                      <span className="text-muted-foreground">District:</span>
                      <span className="font-semibold">{user.district}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-border/50">
                      <span className="text-muted-foreground">Region / Zone:</span>
                      <span className="font-semibold">{user.region}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-muted-foreground">Reporting Officer:</span>
                      <span className="font-semibold">{user.reportingOfficer || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-muted/40 border border-border space-y-3">
                  <h4 className="text-xs font-bold text-epfo-navy dark:text-epfo-accent uppercase tracking-wider flex items-center gap-2">
                    <Phone className="w-4 h-4" /> Contact & Security
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-border/50">
                      <span className="text-muted-foreground">Official Email:</span>
                      <span className="font-semibold text-epfo-accent truncate max-w-[140px]" title={user.officialEmail}>{user.officialEmail}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-border/50">
                      <span className="text-muted-foreground">Mobile:</span>
                      <span className="font-semibold">{user.mobile}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-border/50">
                      <span className="text-muted-foreground">MFA Enabled:</span>
                      <span className={`font-bold ${user.isMfaEnabled ? 'text-emerald-500' : 'text-muted-foreground'}`}>
                        {user.isMfaEnabled ? 'YES' : 'NO'}
                      </span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-muted-foreground">Last Login:</span>
                      <span className="font-mono text-[11px]">{user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {user.notes && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-epfo-navy/5 to-epfo-accent/10 border border-epfo-navy/10 space-y-1">
                  <h4 className="text-xs font-bold text-epfo-navy dark:text-epfo-accent uppercase tracking-wider">Administrative Remarks</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{user.notes}</p>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Tour Diary History */}
          {activeTab === 'tours' && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-epfo-navy dark:text-epfo-accent uppercase tracking-wider">Assigned Tour Schedules</h4>
              {userTours.length === 0 ? (
                <div className="p-8 text-center border border-dashed border-border rounded-2xl text-xs text-muted-foreground">
                  No tour programs associated with this user.
                </div>
              ) : (
                <div className="space-y-2">
                  {userTours.map((tour) => (
                    <div key={tour.id} className="p-3.5 rounded-xl border border-border bg-card flex items-center justify-between">
                      <div>
                        <h5 className="text-xs font-bold">{tour.title}</h5>
                        <p className="text-[11px] text-muted-foreground">{tour.purpose}</p>
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-epfo-navy/10 text-epfo-navy dark:bg-epfo-accent/20 dark:text-epfo-accent">
                        {tour.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Documents */}
          {activeTab === 'documents' && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-epfo-navy dark:text-epfo-accent uppercase tracking-wider">Associated Records & Reports</h4>
              <div className="p-8 text-center border border-dashed border-border rounded-2xl text-xs text-muted-foreground">
                Document vault records linked to officer account ({documents.length} repository folders indexed).
              </div>
            </div>
          )}

          {/* Tab 4: Activity Logs */}
          {activeTab === 'activity' && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-epfo-navy dark:text-epfo-accent uppercase tracking-wider">User Action Timeline</h4>
              <div className="space-y-2">
                {userLogs.map((log) => (
                  <div key={log.id} className="p-3 rounded-xl border border-border bg-card text-xs flex items-center justify-between">
                    <div>
                      <span className="font-semibold">{log.action}</span>
                      <p className="text-[11px] text-muted-foreground">{log.remarks || `Module: ${log.module}`}</p>
                    </div>
                    <span className="text-[10px] font-mono text-muted-foreground">{new Date(log.timestamp).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 5: Login Sessions */}
          {activeTab === 'sessions' && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-epfo-navy dark:text-epfo-accent uppercase tracking-wider">Active Device Sessions</h4>
              <div className="space-y-2">
                {userSessions.map((sess) => (
                  <div key={sess.id} className="p-3.5 rounded-xl border border-border bg-card flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Smartphone className="w-4 h-4 text-epfo-navy dark:text-epfo-accent" />
                      <div>
                        <h5 className="text-xs font-bold">{sess.device} — {sess.browser} ({sess.os})</h5>
                        <p className="text-[11px] text-muted-foreground">IP: {sess.ipAddress} • {sess.location}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                      ACTIVE SESSION
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 6: Permissions Matrix */}
          {activeTab === 'permissions' && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-epfo-navy dark:text-epfo-accent uppercase tracking-wider">Effective Permissions for Role: {user.role}</h4>
              <div className="border border-border rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-muted/50 font-bold border-b border-border">
                    <tr>
                      <th className="p-2.5">Module</th>
                      <th className="p-2.5">Granted Action Privileges</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {Object.entries(permissionsForRole).map(([mod, actions]) => (
                      <tr key={mod}>
                        <td className="p-2.5 font-semibold">{mod}</td>
                        <td className="p-2.5">
                          {actions.length === 0 ? (
                            <span className="text-muted-foreground italic">No access</span>
                          ) : (
                            <div className="flex flex-wrap gap-1">
                              {actions.map((act) => (
                                <span key={act} className="px-2 py-0.5 text-[10px] font-semibold bg-epfo-navy/10 text-epfo-navy dark:bg-epfo-accent/20 dark:text-epfo-accent rounded-md">
                                  {act}
                                </span>
                              ))}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 7: Account Settings */}
          {activeTab === 'settings' && (
            <div className="p-4 rounded-2xl bg-muted/40 border border-border space-y-4 text-xs">
              <h4 className="text-xs font-bold text-epfo-navy dark:text-epfo-accent uppercase tracking-wider">Security & Account Configuration</h4>
              <p className="text-muted-foreground">Account Status: <strong className="text-foreground">{user.status}</strong></p>
              <p className="text-muted-foreground">Multi-Factor Auth: <strong className="text-foreground">{user.isMfaEnabled ? 'Enabled' : 'Disabled'}</strong></p>
              <p className="text-muted-foreground">Registered on: <strong className="text-foreground">{user.createdDate}</strong> by <strong className="text-foreground">{user.createdBy}</strong></p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
