import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  PieChart,
  MapPin,
  Building2,
  Calendar,
  Filter,
  AlertTriangle,
  FileCheck2,
  ArrowUpRight
} from 'lucide-react';
import { EstablishmentDTO, InspectionLogItem, TourProgramItem } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface AnalyticsDashboardProps {
  establishments: EstablishmentDTO[];
  tours: TourProgramItem[];
  inspections: InspectionLogItem[];
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  establishments,
}) => {
  const [timeHorizon, setTimeHorizon] = useState<'MONTHLY' | 'YEARLY'>('MONTHLY');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('ALL');

  // Chart 1: Monthly Visits Volume Dataset (Jan-Dec 2026)
  const monthlyVisitsData = [
    { month: 'Jan', visits: 8, target: 10 },
    { month: 'Feb', visits: 12, target: 10 },
    { month: 'Mar', visits: 15, target: 12 },
    { month: 'Apr', visits: 10, target: 10 },
    { month: 'May', visits: 14, target: 12 },
    { month: 'Jun', visits: 11, target: 10 },
    { month: 'Jul', visits: 16, target: 14 },
    { month: 'Aug', visits: 12, target: 12 },
    { month: 'Sep', visits: 0, target: 12 },
    { month: 'Oct', visits: 0, target: 12 },
    { month: 'Nov', visits: 0, target: 12 },
    { month: 'Dec', visits: 0, target: 12 },
  ];

  // Chart 2: Section 7A & 14B Recovery Progress Dataset
  const recoveryMetrics = {
    target: 500000,
    recovered: 345000,
    sec7aAmount: 220000,
    sec14bAmount: 125000,
    pendingAmount: 155000,
  };

  // Chart 3: Inspection Status Distribution
  const statusDistribution = [
    { label: 'Conducted / Compliant', count: 65, color: 'bg-emerald-500', text: 'text-emerald-500' },
    { label: 'Non-Compliant Found', count: 25, color: 'bg-red-500', text: 'text-red-500' },
    { label: 'Deferred / Rescheduled', count: 10, color: 'bg-amber-500', text: 'text-amber-500' },
  ];

  // Chart 4: District-Wise Inspection Volume
  const districtData = [
    { district: 'Jajpur', count: 42, percentage: 42 },
    { district: 'Cuttack', count: 28, percentage: 28 },
    { district: 'Angul', count: 18, percentage: 18 },
    { district: 'Khordha', count: 12, percentage: 12 },
  ];

  // Chart 5: Employer Compliance Breakdown
  const employerCompliance = [
    { name: 'M/s Jindal Stainless Steel Ltd', code: 'OR/BBS/0006276/000', status: 'COMPLIANT', score: 98 },
    { name: 'Apex Logistics & Freight India Pvt Ltd', code: 'OR/BBS/0045231/000', status: 'NON_COMPLIANT', score: 62 },
    { name: 'M/s Bhimtanagar Sukinda Chromite Mines', code: 'OR/BBS/0001238/000', status: 'EXEMPTED', score: 95 },
    { name: 'M/s NTPC Kanhia Thermal Power Plant', code: 'OR/BBS/0005077/000', status: 'COMPLIANT', score: 92 },
  ];

  // Chart 6: Yearly YoY Performance Comparison
  const yearlyYoYData = [
    { year: 2024, visits: 110, recovery: 380000 },
    { year: 2025, visits: 142, recovery: 460000 },
    { year: 2026, visits: 98, recovery: 345000 },
  ];

  const maxVisitValue = Math.max(...monthlyVisitsData.map((d) => d.visits), 16);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-foreground">Executive Analytics & Visual Charts Dashboard</h2>
          <p className="text-xs text-muted-foreground">
            Real-time visual insights for field visits, Section 7A/14B recovery dues, district distributions, and YoY trends.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Time Horizon Toggle */}
          <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl border border-border/60">
            <button
              onClick={() => setTimeHorizon('MONTHLY')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                timeHorizon === 'MONTHLY' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Monthly Trend
            </button>
            <button
              onClick={() => setTimeHorizon('YEARLY')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                timeHorizon === 'YEARLY' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Yearly YoY
            </button>
          </div>

          {/* District Filter */}
          <div className="flex items-center gap-1.5 bg-card border border-border px-3 py-1.5 rounded-xl text-xs font-bold">
            <Filter className="w-3.5 h-3.5 text-epfo-accent" />
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="bg-transparent text-foreground outline-none cursor-pointer"
            >
              <option value="ALL">All Districts</option>
              <option value="Jajpur">Jajpur</option>
              <option value="Cuttack">Cuttack</option>
              <option value="Angul">Angul</option>
              <option value="Khordha">Khordha</option>
            </select>
          </div>
        </div>
      </div>

      {/* Top 4 KPI Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-bold">
            <span>Total Visits Conducted</span>
            <FileCheck2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-foreground">98</div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-500 font-bold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+14.2% vs last year</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-bold">
            <span>7A / 14B Recovery Collected</span>
            <TrendingUp className="w-4 h-4 text-epfo-accent" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-epfo-accent">
            {formatCurrency(recoveryMetrics.recovered)}
          </div>
          <div className="text-[11px] text-muted-foreground font-mono">
            69.0% of ₹5,00,000 Target
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-bold">
            <span>Active Establishments</span>
            <Building2 className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-foreground">{establishments.length}</div>
          <div className="text-[11px] text-muted-foreground">
            Master Master Registry
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-bold">
            <span>Non-Compliance Alerts</span>
            <AlertTriangle className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-red-500">2</div>
          <div className="text-[11px] text-muted-foreground">
            Form 11 Inspection Notices
          </div>
        </div>
      </div>

      {/* Row 1 Charts: Visits Breakdown & Recovery Dues Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Monthly Visits Volume (Bar Chart) */}
        <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2 font-bold text-xs text-foreground">
              <BarChart3 className="w-4 h-4 text-epfo-accent" />
              <span>Monthly Inspection Visits Volume ({timeHorizon === 'MONTHLY' ? '2026' : 'YoY Comparison'})</span>
            </div>
            <span className="text-[10px] font-mono text-muted-foreground">Total: 98 Visits</span>
          </div>

          {/* SVG Visual Bar Chart */}
          <div className="h-56 flex items-end justify-between gap-2 pt-6 pb-2 px-2 border-b border-border/60">
            {monthlyVisitsData.map((d, i) => {
              const heightPercent = (d.visits / maxVisitValue) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group relative">
                  {/* Tooltip */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-epfo-navy text-white text-[10px] px-2 py-0.5 rounded font-mono font-bold whitespace-nowrap z-20">
                    {d.visits} Visits
                  </div>
                  {/* Bar */}
                  <div
                    className="w-full bg-gradient-to-t from-epfo-navy to-epfo-accent rounded-t-lg transition-all duration-300 group-hover:brightness-110"
                    style={{ height: `${heightPercent}%` }}
                  ></div>
                  {/* Month Label */}
                  <span className="text-[10px] font-mono font-bold text-muted-foreground">{d.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 2: Section 7A & 14B Recovery Target Progress */}
        <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2 font-bold text-xs text-foreground">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span>Section 7A / 14B Recovery Dues Target Progress</span>
            </div>
            <span className="text-[10px] font-mono text-muted-foreground">Target: ₹5,00,000</span>
          </div>

          <div className="space-y-5 py-2">
            {/* Progress Gauge Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-foreground">Total Dues Collected</span>
                <span className="font-mono text-emerald-500">{formatCurrency(recoveryMetrics.recovered)} / ₹5.00L (69%)</span>
              </div>
              <div className="w-full h-3 rounded-full bg-muted overflow-hidden flex">
                <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: '69%' }}></div>
              </div>
            </div>

            {/* Sub-breakdown: Section 7A vs 14B */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-muted/40 border border-border/50 space-y-1">
                <span className="text-[10px] font-bold text-muted-foreground">Section 7A Dues Recovery</span>
                <div className="font-mono font-extrabold text-foreground">{formatCurrency(recoveryMetrics.sec7aAmount)}</div>
                <div className="text-[10px] text-muted-foreground">63.7% of total collection</div>
              </div>

              <div className="p-3 rounded-xl bg-muted/40 border border-border/50 space-y-1">
                <span className="text-[10px] font-bold text-muted-foreground">Section 14B Damages</span>
                <div className="font-mono font-extrabold text-foreground">{formatCurrency(recoveryMetrics.sec14bAmount)}</div>
                <div className="text-[10px] text-muted-foreground">36.3% of total collection</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2 Charts: Inspection Status Donut & District Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 3: Inspection Status Distribution */}
        <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2 font-bold text-xs text-foreground">
              <PieChart className="w-4 h-4 text-purple-500" />
              <span>Inspection Status Distribution</span>
            </div>
            <span className="text-[10px] font-mono text-muted-foreground">100% Breakdown</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-4">
            {/* Donut Visual */}
            <div className="relative w-36 h-36 rounded-full border-8 border-emerald-500 flex items-center justify-center shadow-inner">
              <div className="w-28 h-28 rounded-full border-8 border-red-500 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full border-8 border-amber-500 flex flex-col items-center justify-center bg-card">
                  <span className="font-mono font-extrabold text-sm">98</span>
                  <span className="text-[9px] text-muted-foreground">Visits</span>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-2.5 text-xs w-full sm:w-auto">
              {statusDistribution.map((s, idx) => (
                <div key={idx} className="flex items-center justify-between gap-4 p-2 rounded-xl bg-muted/30">
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${s.color}`}></span>
                    <span className="font-bold text-foreground">{s.label}</span>
                  </div>
                  <span className={`font-mono font-bold ${s.text}`}>{s.count}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chart 4: District-Wise Inspection Volume */}
        <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2 font-bold text-xs text-foreground">
              <MapPin className="w-4 h-4 text-blue-500" />
              <span>District-Wise Inspection Volume</span>
            </div>
            <span className="text-[10px] font-mono text-muted-foreground">4 Districts</span>
          </div>

          <div className="space-y-3.5 py-1 text-xs">
            {districtData.map((d, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-foreground">{d.district} District</span>
                  <span className="font-mono text-epfo-accent">{d.count} Visits ({d.percentage}%)</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-epfo-navy dark:bg-epfo-slate transition-all duration-300"
                    style={{ width: `${d.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3 Charts: Employer Compliance & Yearly YoY Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 5: Employer Compliance Breakdown */}
        <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2 font-bold text-xs text-foreground">
              <Building2 className="w-4 h-4 text-epfo-accent" />
              <span>Employer Compliance Scores & Audit Matrix</span>
            </div>
            <span className="text-[10px] font-mono text-muted-foreground">4 Master Estt</span>
          </div>

          <div className="space-y-2 text-xs">
            {employerCompliance.map((emp, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-muted/30 border border-border/50 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="font-bold text-foreground">{emp.name}</div>
                  <div className="font-mono text-[10px] text-epfo-accent font-bold">{emp.code}</div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className="block font-mono font-extrabold text-foreground">{emp.score}/100</span>
                    <span className="text-[9px] text-muted-foreground">Compliance Score</span>
                  </div>
                  {emp.status === 'COMPLIANT' ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                      COMPLIANT
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/10 text-red-600 border border-red-500/20">
                      AUDIT NOTICE
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 6: Yearly YoY Performance Comparison */}
        <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2 font-bold text-xs text-foreground">
              <Calendar className="w-4 h-4 text-emerald-500" />
              <span>Year-over-Year (YoY) Annual Growth Comparison</span>
            </div>
            <span className="text-[10px] font-mono text-muted-foreground">2024 - 2026</span>
          </div>

          <div className="space-y-4 py-2 text-xs">
            {yearlyYoYData.map((y, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-muted/40 border border-border/60 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-epfo-navy text-white font-extrabold font-mono flex items-center justify-center text-xs">
                    {y.year}
                  </div>
                  <div>
                    <div className="font-bold text-foreground">{y.visits} Field Visits Conducted</div>
                    <div className="text-[10px] text-muted-foreground">Annual Inspection Volume</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono font-extrabold text-emerald-500">{formatCurrency(y.recovery)}</div>
                  <div className="text-[10px] text-muted-foreground">Dues Recovered</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
