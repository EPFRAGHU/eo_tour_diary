import React from 'react';
import {
  Calendar,
  FileCheck2,
  Receipt,
  MapPin,
  Clock,
  CheckCircle2,
  TrendingUp,
  PlusCircle
} from 'lucide-react';
import { UserProfile, TourProgramItem, InspectionLogItem, ClaimItem } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';

interface DashboardProps {
  user: UserProfile;
  tours: TourProgramItem[];
  inspections: InspectionLogItem[];
  claims: ClaimItem[];
  onNavigate: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  user,
  tours,
  inspections,
  claims,
  onNavigate,
}) => {
  const activeTours = tours.filter((t) => t.status === 'IN_PROGRESS' || t.status === 'APPROVED');
  const pendingClaimsCount = claims.filter((c) => c.status === 'DRAFT' || c.status === 'SUBMITTED').length;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-epfo-navy via-epfo-blue to-epfo-accent text-white p-6 shadow-xl">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-epfo-accent border border-white/20">
            <span>Enforcement Officer Portal</span>
          </div>
          <h2 className="text-xl lg:text-2xl font-extrabold tracking-tight">
            Welcome back, {user.name}
          </h2>
          <p className="text-xs lg:text-sm text-slate-200 max-w-2xl leading-relaxed">
            Record field inspections, manage monthly tour programs, and submit official TA/DA reimbursement claims directly with digital audit verification.
          </p>

          <div className="pt-3 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('tours')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-epfo-accent hover:bg-epfo-accent/90 text-white font-bold text-xs shadow-md transition-all active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              Propose New Tour Program
            </button>
            <button
              onClick={() => onNavigate('inspections')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-all"
            >
              <FileCheck2 className="w-4 h-4" />
              Log Inspection Record
            </button>
          </div>
        </div>

        {/* Decorative Background Accents */}
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-epfo-accent/20 rounded-full blur-2xl pointer-events-none"></div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Tours */}
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-medium">
            <span>Active Tour Programs</span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-foreground">{activeTours.length}</div>
          <div className="text-[11px] text-muted-foreground flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-blue-500" />
            <span>Scheduled for current month</span>
          </div>
        </div>

        {/* Inspections Completed */}
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-medium">
            <span>Establishments Inspected</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <FileCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-foreground">{inspections.length}</div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Logged with establishment codes</span>
          </div>
        </div>

        {/* Pending Claims */}
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-medium">
            <span>Pending TA/DA Claims</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-foreground">{pendingClaimsCount}</div>
          <div className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
            Awaiting verification & disbursal
          </div>
        </div>

        {/* Total Reimbursed */}
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-medium">
            <span>Claim Value Approved</span>
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-foreground">
            {formatCurrency(claims.reduce((acc, c) => acc + c.totalAmount, 0))}
          </div>
          <div className="text-[11px] text-muted-foreground">
            Total for current fiscal period
          </div>
        </div>
      </div>

      {/* Active Tour Details & Recent Inspection Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Tour Programs */}
        <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-sm text-foreground">
              <Calendar className="w-4 h-4 text-epfo-accent" />
              <span>Current Tour Program</span>
            </div>
            <button
              onClick={() => onNavigate('tours')}
              className="text-xs font-semibold text-epfo-accent hover:underline"
            >
              View All
            </button>
          </div>

          {tours.length === 0 ? (
            <div className="p-8 text-center border border-dashed rounded-xl space-y-2 text-muted-foreground">
              <Calendar className="w-8 h-8 mx-auto stroke-1" />
              <p className="text-xs font-medium">No tour programs scheduled currently.</p>
              <button
                onClick={() => onNavigate('tours')}
                className="text-xs text-epfo-accent font-bold hover:underline"
              >
                + Create Tour Proposal
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {tours.slice(0, 3).map((tour) => (
                <div
                  key={tour.id}
                  className="p-3.5 rounded-xl bg-muted/40 hover:bg-muted/70 transition-colors border border-border/50 flex items-start justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-foreground">{tour.title}</div>
                    <div className="text-[11px] text-muted-foreground flex items-center gap-2">
                      <MapPin className="w-3 h-3 text-epfo-accent" />
                      <span>{tour.purpose}</span>
                    </div>
                    <div className="text-[10px] text-muted-foreground font-mono">
                      {formatDate(tour.startDate)} - {formatDate(tour.endDate)}
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    {tour.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Field Inspection Overview */}
        <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-sm text-foreground">
              <FileCheck2 className="w-4 h-4 text-epfo-accent" />
              <span>Inspection Records</span>
            </div>
            <button
              onClick={() => onNavigate('inspections')}
              className="text-xs font-semibold text-epfo-accent hover:underline"
            >
              Log New Entry
            </button>
          </div>

          {inspections.length === 0 ? (
            <div className="p-8 text-center border border-dashed rounded-xl space-y-2 text-muted-foreground">
              <FileCheck2 className="w-8 h-8 mx-auto stroke-1" />
              <p className="text-xs font-medium">No establishment inspection records logged yet.</p>
              <button
                onClick={() => onNavigate('inspections')}
                className="text-xs text-epfo-accent font-bold hover:underline"
              >
                + Record Site Inspection
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {inspections.slice(0, 3).map((insp) => (
                <div
                  key={insp.id}
                  className="p-3.5 rounded-xl bg-muted/40 hover:bg-muted/70 transition-colors border border-border/50 space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground">{insp.establishmentName}</span>
                    <span className="text-[10px] font-mono font-bold text-epfo-navy dark:text-epfo-slate bg-muted px-1.5 py-0.5 rounded">
                      {insp.establishmentCode}
                    </span>
                  </div>
                  <div className="text-[11px] text-muted-foreground flex items-center justify-between">
                    <span>{insp.location}</span>
                    <span className="text-[10px] font-mono">{formatDate(insp.date)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
