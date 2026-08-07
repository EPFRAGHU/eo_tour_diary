import React from 'react';
import { ShieldCheck, Printer } from 'lucide-react';
import { TourProgramItem, InspectionLogItem, ClaimItem, UserProfile } from '@/types';
import { formatDate, formatCurrency } from '@/lib/utils';

interface ReportsProps {
  user: UserProfile;
  tours: TourProgramItem[];
  inspections: InspectionLogItem[];
  claims: ClaimItem[];
}

export const Reports: React.FC<ReportsProps> = ({
  user,
  tours,
  inspections,
  claims,
}) => {
  const currentMonth = new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-foreground">Monthly Tour Diary Summary</h2>
          <p className="text-xs text-muted-foreground">
            Official compiled summary for monthly submission to APFC / RPFC In-Charge.
          </p>
        </div>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-epfo-navy hover:bg-epfo-blue text-white font-bold text-xs shadow-md transition-all active:scale-95"
        >
          <Printer className="w-4 h-4 text-epfo-accent" />
          Print / Export Official Diary
        </button>
      </div>

      {/* Printable Report Document Card */}
      <div className="p-6 lg:p-8 rounded-2xl bg-card border border-border/80 shadow-md space-y-6">
        {/* Document Banner Header */}
        <div className="border-b border-border pb-6 text-center space-y-2">
          <div className="text-xs font-black tracking-widest text-epfo-navy dark:text-epfo-slate uppercase">
            EMPLOYEES' PROVIDENT FUND ORGANISATION
          </div>
          <div className="text-xs font-bold text-muted-foreground">
            Regional Office: {user.officeRegion}
          </div>
          <h3 className="text-base font-extrabold text-foreground tracking-tight underline underline-offset-4">
            MONTHLY TOUR DIARY & INSPECTION SUMMARY - {currentMonth.toUpperCase()}
          </h3>
        </div>

        {/* Officer Meta Info */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-muted/40 text-xs">
          <div>
            <span className="text-muted-foreground block text-[10px]">Officer Name</span>
            <span className="font-bold text-foreground">{user.name}</span>
          </div>
          <div>
            <span className="text-muted-foreground block text-[10px]">Designation</span>
            <span className="font-bold text-foreground">{user.designation}</span>
          </div>
          <div>
            <span className="text-muted-foreground block text-[10px]">Office Region</span>
            <span className="font-bold text-foreground">{user.officeRegion}</span>
          </div>
          <div>
            <span className="text-muted-foreground block text-[10px]">Report Date</span>
            <span className="font-mono font-bold text-foreground">{formatDate(new Date())}</span>
          </div>
        </div>

        {/* Section 1: Tour Programs */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-foreground uppercase tracking-wider text-epfo-accent">
            1. Conducted Tour Programs Schedule
          </h4>
          {tours.length === 0 ? (
            <p className="text-xs text-muted-foreground italic">No tour programs recorded in this monthly cycle.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-border bg-muted/50 text-muted-foreground">
                    <th className="py-2 px-3">Tour Title</th>
                    <th className="py-2 px-3">Purpose</th>
                    <th className="py-2 px-3">Dates</th>
                    <th className="py-2 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {tours.map((t) => (
                    <tr key={t.id} className="hover:bg-muted/20">
                      <td className="py-2.5 px-3 font-semibold">{t.title}</td>
                      <td className="py-2.5 px-3">{t.purpose}</td>
                      <td className="py-2.5 px-3 font-mono text-[11px]">
                        {formatDate(t.startDate)} - {formatDate(t.endDate)}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600">
                          {t.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Section 2: Inspections Performed */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-foreground uppercase tracking-wider text-epfo-accent">
            2. Summary of Field Inspection Visits
          </h4>
          {inspections.length === 0 ? (
            <p className="text-xs text-muted-foreground italic">No inspection visits recorded in this monthly cycle.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-border bg-muted/50 text-muted-foreground">
                    <th className="py-2 px-3">Date</th>
                    <th className="py-2 px-3">Establishment Code</th>
                    <th className="py-2 px-3">Establishment Name</th>
                    <th className="py-2 px-3">Location</th>
                    <th className="py-2 px-3">Key Observations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {inspections.map((i) => (
                    <tr key={i.id} className="hover:bg-muted/20">
                      <td className="py-2.5 px-3 font-mono text-[11px]">{formatDate(i.date || i.visitDate || new Date())}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-epfo-navy dark:text-epfo-slate">
                        {i.establishmentCode}
                      </td>
                      <td className="py-2.5 px-3 font-semibold">{i.establishmentName}</td>
                      <td className="py-2.5 px-3">{i.location}</td>
                      <td className="py-2.5 px-3 text-muted-foreground max-w-xs truncate">{i.observations}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Section 3: Financial Claims Summary */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-foreground uppercase tracking-wider text-epfo-accent">
            3. Submitted TA / DA Reimbursement Summary
          </h4>
          {claims.length === 0 ? (
            <p className="text-xs text-muted-foreground italic">No TA/DA reimbursement claims recorded.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-border bg-muted/50 text-muted-foreground">
                    <th className="py-2 px-3">Tour Ref</th>
                    <th className="py-2 px-3">TA Amount</th>
                    <th className="py-2 px-3">DA Amount</th>
                    <th className="py-2 px-3">Hotel & Other</th>
                    <th className="py-2 px-3">Total Claim</th>
                    <th className="py-2 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {claims.map((c) => (
                    <tr key={c.id} className="hover:bg-muted/20">
                      <td className="py-2.5 px-3 font-semibold">{c.tourTitle || 'Field Tour'}</td>
                      <td className="py-2.5 px-3 font-mono">{formatCurrency(c.taAmount)}</td>
                      <td className="py-2.5 px-3 font-mono">{formatCurrency(c.daAmount)}</td>
                      <td className="py-2.5 px-3 font-mono">{formatCurrency(c.hotelAmount + c.otherAmount)}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-epfo-accent">{formatCurrency(c.totalAmount)}</td>
                      <td className="py-2.5 px-3">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-600">
                          {c.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Verification Sign-Off Footer */}
        <div className="pt-8 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Digitally Verified & Logged in EPFO Tour Diary System</span>
          </div>
          <div className="text-right">
            <span className="block font-bold text-foreground">{user.name}</span>
            <span className="text-[10px]">{user.designation}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
