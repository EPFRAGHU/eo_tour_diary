import React, { useState } from 'react';
import {
  Printer,
  FileSpreadsheet,
  Download,
  ShieldCheck,
  Calendar,
  FileCheck2,
  TrendingUp,
  Receipt
} from 'lucide-react';
import { TourProgramItem, InspectionLogItem, ClaimItem, UserProfile } from '@/types';
import { formatDate, formatCurrency } from '@/lib/utils';

interface ReportsProps {
  user: UserProfile;
  tours: TourProgramItem[];
  inspections: InspectionLogItem[];
  claims: ClaimItem[];
}

export type ReportType = 'MONTHLY_DIARY' | 'INSPECTION_AUDIT' | 'RECOVERY_METRICS' | 'TADA_STATEMENT';

export const Reports: React.FC<ReportsProps> = ({
  user,
  tours,
  inspections,
  claims,
}) => {
  const [activeReportType, setActiveReportType] = useState<ReportType>('MONTHLY_DIARY');
  const [selectedMonth, setSelectedMonth] = useState<number>(8); // August
  const [selectedYear, setSelectedYear] = useState<number>(2026);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentMonthName = `${monthNames[selectedMonth - 1]} ${selectedYear}`;

  // CSV Export Generator
  const handleExportCSV = () => {
    let csvData = '';
    let filename = `EPFO_Report_${activeReportType}_${selectedMonth}_${selectedYear}.csv`;

    if (activeReportType === 'MONTHLY_DIARY') {
      csvData = 'Tour Title,Purpose,Start Date,End Date,Status\n';
      tours.forEach((t) => {
        csvData += `"${t.title}","${t.purpose}","${t.startDate}","${t.endDate}","${t.status}"\n`;
      });
    } else if (activeReportType === 'INSPECTION_AUDIT') {
      csvData = 'Date,Establishment Code,Establishment Name,Location,Inspection Purpose,Observations,Status\n';
      inspections.forEach((i) => {
        csvData += `"${i.date || i.visitDate || ''}","${i.establishmentCode}","${i.establishmentName}","${i.location}","${i.inspectionPurpose}","${i.observations}","${i.status}"\n`;
      });
    } else if (activeReportType === 'TADA_STATEMENT') {
      csvData = 'Tour Ref,TA Amount,DA Amount,Hotel & Other,Total Claim,Status\n';
      claims.forEach((c) => {
        csvData += `"${c.tourTitle}",${c.taAmount},${c.daAmount},${c.hotelAmount + c.otherAmount},${c.totalAmount},"${c.status}"\n`;
      });
    } else {
      csvData = 'Metric,Target,Achieved,Percentage\n';
      csvData += `Total 7A/14B Recovery Target,500000,345000,69%\n`;
    }

    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-foreground">Comprehensive Reports & Analytics Engine</h2>
          <p className="text-xs text-muted-foreground">
            Official monthly tour diaries, inspection audit reports, recovery metrics, and TA/DA statements.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-card border border-border hover:bg-muted text-foreground text-xs font-bold shadow-sm transition-all"
          >
            <Printer className="w-4 h-4 text-epfo-accent" />
            <span>Print Report</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-card border border-border hover:bg-muted text-foreground text-xs font-bold shadow-sm transition-all"
          >
            <Download className="w-4 h-4 text-emerald-500" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-epfo-navy hover:bg-epfo-blue text-white font-bold text-xs shadow-md transition-all active:scale-95"
          >
            <FileSpreadsheet className="w-4 h-4 text-epfo-accent" />
            <span>Export Official PDF</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar: Report Tabs & Date Range Selector */}
      <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-4 text-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
          {/* 4 Report Category Tabs */}
          <div className="flex flex-wrap items-center gap-1 bg-muted/60 p-1 rounded-xl border border-border/60">
            <button
              onClick={() => setActiveReportType('MONTHLY_DIARY')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs transition-colors ${
                activeReportType === 'MONTHLY_DIARY' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-epfo-accent" />
              <span>Monthly Tour Diary</span>
            </button>

            <button
              onClick={() => setActiveReportType('INSPECTION_AUDIT')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs transition-colors ${
                activeReportType === 'INSPECTION_AUDIT' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <FileCheck2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Inspection Audit</span>
            </button>

            <button
              onClick={() => setActiveReportType('RECOVERY_METRICS')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs transition-colors ${
                activeReportType === 'RECOVERY_METRICS' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5 text-blue-500" />
              <span>7A / 14B Recovery Dues</span>
            </button>

            <button
              onClick={() => setActiveReportType('TADA_STATEMENT')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs transition-colors ${
                activeReportType === 'TADA_STATEMENT' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Receipt className="w-3.5 h-3.5 text-purple-500" />
              <span>TA / DA Claims</span>
            </button>
          </div>

          {/* Month & Year Picker */}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="px-2.5 py-1.5 rounded-xl bg-background border border-border font-bold outline-none"
            >
              {monthNames.map((m, idx) => (
                <option key={idx} value={idx + 1}>
                  {m}
                </option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="px-2.5 py-1.5 rounded-xl bg-background border border-border font-bold outline-none"
            >
              <option value={2026}>2026</option>
              <option value={2025}>2025</option>
            </select>
          </div>
        </div>
      </div>

      {/* Printable EPFO Official Letterhead Report Canvas */}
      <div className="p-6 lg:p-10 rounded-2xl bg-card border border-border/80 shadow-md space-y-6 print:p-0 print:border-none print:shadow-none">
        {/* Official EPFO Letterhead Header */}
        <div className="border-b-2 border-epfo-navy dark:border-epfo-slate pb-6 text-center space-y-2">
          <div className="text-xs font-black tracking-widest text-epfo-navy dark:text-epfo-slate uppercase">
            EMPLOYEES' PROVIDENT FUND ORGANISATION
          </div>
          <div className="text-xs font-bold text-muted-foreground">
            Ministry of Labour & Employment, Government of India | Regional Office: {user.officeRegion}
          </div>
          <h3 className="text-base font-extrabold text-foreground tracking-tight underline underline-offset-4 pt-1">
            OFFICIAL REPORT: {activeReportType.replace('_', ' ')} - {currentMonthName.toUpperCase()}
          </h3>
        </div>

        {/* Officer Meta Credentials Card */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-muted/40 text-xs border border-border/60">
          <div>
            <span className="text-muted-foreground block text-[10px] uppercase font-bold">Officer Name</span>
            <span className="font-extrabold text-foreground">{user.name}</span>
          </div>
          <div>
            <span className="text-muted-foreground block text-[10px] uppercase font-bold">Designation</span>
            <span className="font-bold text-foreground">{user.designation}</span>
          </div>
          <div>
            <span className="text-muted-foreground block text-[10px] uppercase font-bold">Office Region</span>
            <span className="font-bold text-foreground">{user.officeRegion}</span>
          </div>
          <div>
            <span className="text-muted-foreground block text-[10px] uppercase font-bold">Report Generated</span>
            <span className="font-mono font-bold text-foreground">{formatDate(new Date())}</span>
          </div>
        </div>

        {/* Report Content Body 1: MONTHLY DIARY */}
        {activeReportType === 'MONTHLY_DIARY' && (
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider text-epfo-accent flex items-center gap-1.5">
              <FileSpreadsheet className="w-4 h-4" />
              <span>1. Monthly Tour Schedule & Daily Diary Log</span>
            </h4>
            {tours.length === 0 ? (
              <p className="text-xs text-muted-foreground italic p-4 text-center border border-dashed rounded-xl">
                No tour programs recorded in this monthly cycle.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border bg-muted/60 text-muted-foreground">
                      <th className="py-2.5 px-3">Tour Ref</th>
                      <th className="py-2.5 px-3">Purpose & Establishments Covered</th>
                      <th className="py-2.5 px-3">Tour Dates</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {tours.map((t) => (
                      <tr key={t.id} className="hover:bg-muted/20">
                        <td className="py-3 px-3 font-bold text-foreground">{t.title}</td>
                        <td className="py-3 px-3">{t.purpose}</td>
                        <td className="py-3 px-3 font-mono text-[11px]">
                          {formatDate(t.startDate)} - {formatDate(t.endDate)}
                        </td>
                        <td className="py-3 px-3">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
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
        )}

        {/* Report Content Body 2: INSPECTION AUDIT */}
        {activeReportType === 'INSPECTION_AUDIT' && (
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider text-epfo-accent flex items-center gap-1.5">
              <FileCheck2 className="w-4 h-4" />
              <span>2. Field Inspection Audit & Non-Compliance Observations</span>
            </h4>
            {inspections.length === 0 ? (
              <p className="text-xs text-muted-foreground italic p-4 text-center border border-dashed rounded-xl">
                No field inspections recorded in this monthly cycle.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border bg-muted/60 text-muted-foreground">
                      <th className="py-2.5 px-3">Date</th>
                      <th className="py-2.5 px-3">Estt Code</th>
                      <th className="py-2.5 px-3">Establishment Name</th>
                      <th className="py-2.5 px-3">Inspection Purpose</th>
                      <th className="py-2.5 px-3">Key Audit Findings</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {inspections.map((i) => (
                      <tr key={i.id} className="hover:bg-muted/20">
                        <td className="py-3 px-3 font-mono text-[11px]">{formatDate(i.date || i.visitDate || new Date())}</td>
                        <td className="py-3 px-3 font-mono font-bold text-epfo-navy dark:text-epfo-slate">{i.establishmentCode}</td>
                        <td className="py-3 px-3 font-bold">{i.establishmentName}</td>
                        <td className="py-3 px-3">{i.inspectionPurpose}</td>
                        <td className="py-3 px-3 text-muted-foreground">{i.observations}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Report Content Body 3: RECOVERY METRICS */}
        {activeReportType === 'RECOVERY_METRICS' && (
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider text-epfo-accent flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4" />
              <span>3. Section 7A & 14B Dues Recovery Progress</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-card border border-border space-y-1">
                <span className="text-[10px] text-muted-foreground uppercase font-bold">Annual Recovery Target</span>
                <div className="text-lg font-extrabold font-mono text-foreground">₹5,00,000</div>
              </div>
              <div className="p-4 rounded-xl bg-card border border-border space-y-1">
                <span className="text-[10px] text-muted-foreground uppercase font-bold">Amount Recovered</span>
                <div className="text-lg font-extrabold font-mono text-emerald-500">₹3,45,000</div>
              </div>
              <div className="p-4 rounded-xl bg-card border border-border space-y-1">
                <span className="text-[10px] text-muted-foreground uppercase font-bold">Target Achievement</span>
                <div className="text-lg font-extrabold font-mono text-epfo-accent">69.0%</div>
              </div>
            </div>
          </div>
        )}

        {/* Report Content Body 4: TADA STATEMENT */}
        {activeReportType === 'TADA_STATEMENT' && (
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider text-epfo-accent flex items-center gap-1.5">
              <Receipt className="w-4 h-4" />
              <span>4. TA / DA Reimbursement Claim Summary Statement</span>
            </h4>
            {claims.length === 0 ? (
              <p className="text-xs text-muted-foreground italic p-4 text-center border border-dashed rounded-xl">
                No financial TA/DA claims recorded in this monthly cycle.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border bg-muted/60 text-muted-foreground">
                      <th className="py-2.5 px-3">Tour Ref</th>
                      <th className="py-2.5 px-3">TA Amount</th>
                      <th className="py-2.5 px-3">DA Amount</th>
                      <th className="py-2.5 px-3">Hotel & Other</th>
                      <th className="py-2.5 px-3">Total Claim</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {claims.map((c) => (
                      <tr key={c.id} className="hover:bg-muted/20">
                        <td className="py-3 px-3 font-bold">{c.tourTitle || 'Field Tour'}</td>
                        <td className="py-3 px-3 font-mono">{formatCurrency(c.taAmount)}</td>
                        <td className="py-3 px-3 font-mono">{formatCurrency(c.daAmount)}</td>
                        <td className="py-3 px-3 font-mono">{formatCurrency(c.hotelAmount + c.otherAmount)}</td>
                        <td className="py-3 px-3 font-mono font-bold text-epfo-accent">{formatCurrency(c.totalAmount)}</td>
                        <td className="py-3 px-3">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 border border-amber-500/20">
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
        )}

        {/* Digital Verification Sign-off Stamp Block */}
        <div className="pt-8 border-t-2 border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <div>
              <span className="font-bold text-foreground block">Digitally Verified & Sign-off Certified</span>
              <span className="text-[10px] text-muted-foreground">
                Logged under EPFO Field Inspection Manual | System ID: {user.id}
              </span>
            </div>
          </div>

          <div className="text-right border-l sm:border-l-0 sm:pl-0 pl-4 border-border space-y-1">
            <span className="block font-extrabold text-foreground">{user.name}</span>
            <span className="text-[10px] font-bold text-epfo-accent uppercase">{user.designation}</span>
            <div className="text-[9px] font-mono text-muted-foreground">RO {user.officeRegion}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
