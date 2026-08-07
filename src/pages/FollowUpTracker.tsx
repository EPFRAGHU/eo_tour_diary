import React, { useState } from 'react';
import {
  Plus,
  Clock,
  Calendar,
  CheckCircle2,
  Edit2,
  Trash2,
  Search,
  Filter
} from 'lucide-react';
import { FollowUpItem, EstablishmentDTO } from '@/types';
import { formatDate } from '@/lib/utils';
import { FollowUpModal } from '@/components/followups/FollowUpModal';

interface FollowUpTrackerProps {
  establishments: EstablishmentDTO[];
  onNavigate?: (tab: string) => void;
}

export const FollowUpTracker: React.FC<FollowUpTrackerProps> = ({ establishments }) => {
  const [statusTab, setStatusTab] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFollowUp, setEditingFollowUp] = useState<FollowUpItem | null>(null);

  const [followUps, setFollowUps] = useState<FollowUpItem[]>([
    {
      id: 'f-1',
      establishmentCode: 'MH/BAN/0045231/000',
      establishmentName: 'Apex Logistics & Freight India Pvt Ltd',
      dueDate: '2026-08-14',
      nextVisitDate: '2026-08-18',
      type: 'FORM_11_NOTICE',
      priority: 'HIGH',
      status: 'PENDING',
      description: 'Enrolment of 18 non-contributing security staff detected during 7A audit. Notice issued to employer.',
    },
    {
      id: 'f-2',
      establishmentCode: 'OR/6276',
      establishmentName: 'M/s Jindal Stainless Steel Ltd',
      dueDate: '2026-08-18',
      nextVisitDate: '2026-08-22',
      type: '14B_DAMAGES',
      priority: 'HIGH',
      status: 'IN_PROGRESS',
      description: '14B damages notice hearing verification for default period May-July 2026.',
    },
    {
      id: 'f-3',
      establishmentCode: 'OR/BBS/1238',
      establishmentName: 'M/s Bhimtanagar Sukinda Chromite Mines',
      dueDate: '2026-08-10',
      nextVisitDate: '2026-08-15',
      type: '7A_ENQUIRY',
      priority: 'MEDIUM',
      status: 'PENDING',
      description: 'Reconcile attendance & salary statements for contractor staff under Section 7A enquiry.',
    },
    {
      id: 'f-4',
      establishmentCode: 'OR/BBS/5077',
      establishmentName: 'M/s NTPC Kanhia Thermal Power Plant',
      dueDate: '2026-08-01',
      nextVisitDate: '2026-08-05',
      type: 'PMVBRY_CAMP',
      priority: 'LOW',
      status: 'COMPLETED',
      description: 'Conducted PMVBRY cluster awareness drive and registered 45 weavers.',
    },
  ]);

  // Filter Logic
  const filtered = followUps.filter((item) => {
    const matchesStatus = statusTab === 'ALL' || item.status === statusTab;
    const matchesPriority = priorityFilter === 'ALL' || item.priority === priorityFilter;
    const matchesSearch =
      item.establishmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.establishmentCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesPriority && matchesSearch;
  });

  const getPriorityBadge = (priority: FollowUpItem['priority']) => {
    switch (priority) {
      case 'HIGH':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/10 text-red-600 border border-red-500/20">🔴 HIGH PRIORITY</span>;
      case 'MEDIUM':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20">🟡 MEDIUM</span>;
      case 'LOW':
      default:
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 border border-blue-500/20">🔵 LOW</span>;
    }
  };

  const getStatusBadge = (status: FollowUpItem['status']) => {
    switch (status) {
      case 'COMPLETED':
        return <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">🟢 COMPLETED</span>;
      case 'IN_PROGRESS':
        return <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20">🟡 IN PROGRESS</span>;
      case 'OVERDUE':
        return <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-600 border border-red-500/20">🔴 OVERDUE</span>;
      case 'PENDING':
      default:
        return <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 border border-blue-500/20">🔵 PENDING</span>;
    }
  };

  const handleSaveFollowUp = (data: Omit<FollowUpItem, 'id'> | FollowUpItem) => {
    if ('id' in data) {
      setFollowUps(followUps.map((f) => (f.id === data.id ? (data as FollowUpItem) : f)));
    } else {
      const newObj: FollowUpItem = {
        ...(data as Omit<FollowUpItem, 'id'>),
        id: `f-${Date.now()}`,
      };
      setFollowUps([newObj, ...followUps]);
    }
    setEditingFollowUp(null);
  };

  const handleToggleStatus = (id: string) => {
    setFollowUps(
      followUps.map((f) => {
        if (f.id === id) {
          const nextStatus = f.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
          return { ...f, status: nextStatus };
        }
        return f;
      })
    );
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this follow-up action item?')) {
      setFollowUps(followUps.filter((f) => f.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-foreground">Follow-up & Pending Work Tracking System</h2>
          <p className="text-xs text-muted-foreground">
            Compliance action items, Form 11 notice reminders, 7A enquiry deadlines, and scheduled next site visits.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingFollowUp(null);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-epfo-navy hover:bg-epfo-blue text-white font-bold text-xs shadow-md transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4 text-epfo-accent" />
          <span>+ Create Follow-up Item</span>
        </button>
      </div>

      {/* Status Pipeline Tabs & Toolbar */}
      <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-3 text-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-1 bg-muted/60 p-1 rounded-xl border border-border/60">
            {['ALL', 'PENDING', 'IN_PROGRESS', 'COMPLETED', 'OVERDUE'].map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusTab(tab)}
                className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors ${
                  statusTab === tab ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab === 'ALL' && `All (${followUps.length})`}
                {tab === 'PENDING' && `Pending (${followUps.filter((f) => f.status === 'PENDING').length})`}
                {tab === 'IN_PROGRESS' && `In Progress (${followUps.filter((f) => f.status === 'IN_PROGRESS').length})`}
                {tab === 'COMPLETED' && `Completed (${followUps.filter((f) => f.status === 'COMPLETED').length})`}
                {tab === 'OVERDUE' && `Overdue (${followUps.filter((f) => f.status === 'OVERDUE').length})`}
              </button>
            ))}
          </div>

          {/* Priority Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-background border border-border outline-none font-bold"
            >
              <option value="ALL">All Priorities</option>
              <option value="HIGH">🔴 High Priority</option>
              <option value="MEDIUM">🟡 Medium Priority</option>
              <option value="LOW">🔵 Low Priority</option>
            </select>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search follow-up description, establishment code, or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-background border border-border text-xs focus:ring-2 focus:ring-epfo-accent outline-none"
          />
        </div>
      </div>

      {/* Main Grid: Follow-up Cards List (Left 2 cols) + Chronological Timeline (Right 1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols): Follow-up Cards */}
        <div className="lg:col-span-2 space-y-4">
          {filtered.length === 0 ? (
            <div className="p-12 text-center bg-card border border-dashed rounded-2xl space-y-3">
              <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-500 stroke-1" />
              <h3 className="text-sm font-bold text-foreground">No Follow-up Action Items Found</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                All field compliance action items are up to date!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm hover:shadow-md transition-all space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-foreground">{item.establishmentName}</span>
                        <span className="font-mono text-[10px] bg-epfo-navy/10 text-epfo-navy dark:text-epfo-slate px-1.5 py-0.5 rounded font-bold">
                          {item.establishmentCode}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {getPriorityBadge(item.priority)}
                        {getStatusBadge(item.status)}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingFollowUp(item);
                          setIsModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
                        title="Edit Action Item"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-foreground leading-relaxed bg-muted/30 p-3 rounded-xl border border-border/40 font-sans">
                    "{item.description}"
                  </p>

                  <div className="pt-2 border-t border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-amber-500" />
                        <span>Due: <strong className="text-foreground">{formatDate(item.dueDate)}</strong></span>
                      </div>
                      {item.nextVisitDate && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-epfo-accent" />
                          <span>Next Visit: <strong className="text-epfo-accent">{formatDate(item.nextVisitDate)}</strong></span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleToggleStatus(item.id)}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
                          item.status === 'COMPLETED'
                            ? 'bg-muted border border-border text-muted-foreground'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                        }`}
                      >
                        {item.status === 'COMPLETED' ? 'Reopen Task' : '✓ Mark Complete'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column (1 col): Chronological Timeline Stream View */}
        <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2 font-bold text-xs text-foreground">
              <Clock className="w-4 h-4 text-epfo-accent" />
              <span>Compliance Reminders Timeline</span>
            </div>
            <span className="font-mono text-[10px] text-muted-foreground">{followUps.length} Items</span>
          </div>

          <div className="relative pl-4 space-y-4 border-l border-border/80 text-xs">
            {followUps.map((item) => (
              <div key={item.id} className="relative space-y-1 p-3 rounded-xl bg-muted/30 border border-border/50">
                <div className={`absolute -left-[21px] top-4 w-2.5 h-2.5 rounded-full ${item.priority === 'HIGH' ? 'bg-red-500' : 'bg-amber-500'}`}></div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground">{item.type.replace('_', ' ')}</span>
                  <span className="font-mono text-[10px] text-muted-foreground">{formatDate(item.dueDate)}</span>
                </div>
                <div className="text-[11px] font-mono text-epfo-navy dark:text-epfo-slate font-bold">
                  {item.establishmentName}
                </div>
                <p className="text-[11px] text-muted-foreground leading-snug truncate">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Follow-up Create / Edit Modal */}
      <FollowUpModal
        isOpen={isModalOpen}
        followUp={editingFollowUp}
        establishments={establishments}
        onClose={() => {
          setIsModalOpen(false);
          setEditingFollowUp(null);
        }}
        onSave={handleSaveFollowUp}
      />
    </div>
  );
};
