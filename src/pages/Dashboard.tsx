import React, { useState } from 'react';
import {
  Calendar,
  FileCheck2,
  MapPin,
  Clock,
  TrendingUp,
  PlusCircle,
  PhoneCall,
  FileText,
  DollarSign,
  AlertTriangle,
  FilePlus,
  Zap,
  Building,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import {
  UserProfile,
  TourProgramItem,
  InspectionLogItem,
  ClaimItem,
  FollowUpItem,
  DocumentRecord,
  CallLogItem,
  RecoveryMetric,
  ActivityFeedItem
} from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import { QuickActionModal } from '@/components/dashboard/QuickActionModal';
import { getDefaultOfficeName } from '@/lib/officeConfig';

interface DashboardProps {
  user: UserProfile;
  tours: TourProgramItem[];
  inspections: InspectionLogItem[];
  claims: ClaimItem[];
  onNavigate: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  user,
  inspections,
  onNavigate,
}) => {
  const [modalType, setModalType] = useState<'RECOVERY' | 'CALL' | 'DOCUMENT' | null>(null);

  // Widget 1: Today's Visits State
  const todayDateStr = new Date().toISOString().split('T')[0];
  const todayVisits = inspections.filter((i) => (i.date || i.visitDate) === todayDateStr || i.status === 'SCHEDULED');

  // Widget 2 & 3: Monthly & Pending Visits Calculation
  const totalMonthlyVisits = inspections.length + 3;
  const completedVisitsCount = inspections.length;
  const pendingVisits = [
    {
      id: 'p-1',
      code: 'OR/BBS/6019',
      name: 'M/S Bharat Security & Allied Services',
      location: 'Dist Office, Cuttack',
      reason: 'PMVBRY enrolment check & Form 11 notice',
      dueDate: '2026-08-12',
    },
    {
      id: 'p-2',
      code: 'OR/BBS/104724',
      name: 'M/S Magma Food Processors',
      location: 'CDA Sector 9, Cuttack',
      reason: 'Coverage eligibility verification under Sec 1(3)(b)',
      dueDate: '2026-08-15',
    },
  ];

  // Widget 4: Follow-ups State
  const [followUps] = useState<FollowUpItem[]>([
    {
      id: 'f-1',
      establishmentCode: 'OR/BBS/0045231/000',
      establishmentName: 'Apex Logistics & Freight India Pvt Ltd',
      dueDate: '2026-08-14',
      type: 'FORM_11_NOTICE',
      priority: 'HIGH',
      status: 'PENDING',
      description: 'Enrolment of 18 non-contributing security staff detected during 7A audit.',
    },
    {
      id: 'f-2',
      establishmentCode: 'OR/BBS/6276',
      establishmentName: 'M/s Jindal Stainless Steel Ltd',
      dueDate: '2026-08-18',
      type: '14B_DAMAGES',
      priority: 'HIGH',
      status: 'PENDING',
      description: '14B damages notice hearing verification for default period May-July.',
    },
  ]);

  // Widget 5: Documents State
  const [documents, setDocuments] = useState<DocumentRecord[]>([
    {
      id: 'd-1',
      title: 'Inspection Report - Apex Logistics 7A Enquiry',
      category: 'INSPECTION_NOTE',
      refNumber: 'OR/DO/CTC/Compliance/810/2026',
      uploadedAt: '2026-08-05',
      fileSize: '1.8 MB',
      establishmentCode: 'OR/BBS/0045231/000',
      establishmentName: 'Apex Logistics & Freight India Pvt Ltd',
      folderPath: '/OR-BBS-0045231-000/Inspection Reports/',
      fileFormat: 'PDF',
      currentVersion: 'v1.2',
      versions: [
        {
          version: 'v1.2',
          uploadedAt: '2026-08-05',
          uploadedBy: 'Raghunatha Maharana (EO/AO)',
          fileName: 'Apex_Logistics_Report.pdf',
          fileSize: '1.8 MB',
        },
      ],
    },
    {
      id: 'd-2',
      title: 'Office Directive - Special Campaign Drive',
      category: 'OFFICE_ORDER',
      refNumber: 'OR/BBS/ADMIN-I/NAN 2.0/457/2023',
      uploadedAt: '2026-08-01',
      fileSize: '420 KB',
      establishmentCode: 'GENERAL',
      establishmentName: 'General Directives',
      folderPath: '/GENERAL/Office Directives/',
      fileFormat: 'PDF',
      currentVersion: 'v1.0',
      versions: [
        {
          version: 'v1.0',
          uploadedAt: '2026-08-01',
          uploadedBy: 'APFC',
          fileName: 'Office_Directive.pdf',
          fileSize: '420 KB',
        },
      ],
    },
  ]);

  // Widget 6: Calls Log State
  const [callLogs] = useState<CallLogItem[]>([
    {
      id: 'c-1',
      contactName: 'Mr. Anil Das',
      establishmentName: 'Titan Tech Solutions',
      designation: 'HR Manager',
      phoneNumber: '+91 98765 43210',
      callDate: '2026-08-06',
      purpose: 'ECR Return filing confirmation',
      notes: 'Confirmed 142 employees enrolled in current month return.',
    },
  ]);

  // Widget 7: Recovery State
  const [recovery, setRecovery] = useState<RecoveryMetric>({
    targetAmount: 500000,
    recoveredAmount: 345000,
    pendingAmount: 155000,
    section7aAmount: 220000,
    section14bAmount: 125000,
  });

  // Widget 8: Activity Feed
  const [activities, setActivities] = useState<ActivityFeedItem[]>([
    {
      id: 'act-1',
      timestamp: '10:45 AM',
      title: 'Inspection Note Uploaded',
      description: 'Uploaded final 7A verification note for Apex Logistics (OR/BBS/0045231/000).',
      category: 'INSPECTION',
      badgeColor: 'bg-emerald-600',
    },
    {
      id: 'act-2',
      timestamp: 'Yesterday',
      title: 'Monthly Tour Proposal Approved',
      description: 'APFC approved Special Compliance Drive for Andheri East Zone.',
      category: 'TOUR',
      badgeColor: 'bg-blue-600',
    },
    {
      id: 'act-3',
      timestamp: '04 Aug',
      title: 'Section 14B Recovery Received',
      description: 'Logged ₹1,25,000 demand payment from Jindal Stainless Steel (OR/BBS/6276).',
      category: 'RECOVERY',
      badgeColor: 'bg-emerald-600',
    },
  ]);

  const handleModalSubmit = (type: string, data: any) => {
    if (type === 'RECOVERY') {
      setRecovery((prev) => ({
        ...prev,
        recoveredAmount: prev.recoveredAmount + Number(data.amount),
        pendingAmount: Math.max(0, prev.pendingAmount - Number(data.amount)),
      }));
      setActivities((prev) => [
        {
          id: `act-${Date.now()}`,
          timestamp: 'Just now',
          title: 'Recovery Payment Logged',
          description: `Logged recovery of ${formatCurrency(data.amount)} for ${data.name}.`,
          category: 'RECOVERY',
          badgeColor: 'bg-emerald-600',
        },
        ...prev,
      ]);
    } else if (type === 'DOCUMENT') {
      setDocuments((prev) => [
        {
          id: `d-${Date.now()}`,
          title: data.name,
          category: 'INSPECTION_NOTE',
          refNumber: data.code || `REF-${Date.now()}`,
          uploadedAt: new Date().toISOString().split('T')[0],
          fileSize: '1.2 MB',
          establishmentCode: 'OR/BBS/6276',
          establishmentName: data.name,
          folderPath: '/OR-BBS-6276/Inspection Reports/',
          fileFormat: 'PDF',
          currentVersion: 'v1.0',
          versions: [
            {
              version: 'v1.0',
              uploadedAt: new Date().toISOString().split('T')[0],
              uploadedBy: 'Raghunatha Maharana (EO/AO)',
              fileName: `${data.name}.pdf`,
              fileSize: '1.2 MB',
            },
          ],
        },
        ...prev,
      ]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Officer Welcome Banner & Quick Action Trigger Bar */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-epfo-navy via-epfo-blue to-epfo-accent text-white p-6 shadow-xl">
        <div className="relative z-10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-epfo-accent border border-white/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Enforcement Officer Portal • {user.officeRegion || getDefaultOfficeName()}</span>
            </div>
            <span className="text-xs font-bold bg-white/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Role: {user.role}
            </span>
          </div>

          <div>
            <h2 className="text-xl lg:text-2xl font-extrabold tracking-tight">
              Welcome back, {user.name}
            </h2>
            <p className="text-xs lg:text-sm text-slate-200 max-w-2xl leading-relaxed mt-1">
              Field inspection summary, 7A/14B recovery targets, document vault, and official liaison diary.
            </p>
          </div>

          {/* Widget 10: Quick Actions Bar */}
          <div className="pt-2 flex flex-wrap gap-2.5">
            <button
              onClick={() => onNavigate('tours')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-epfo-accent hover:bg-epfo-accent/90 text-white font-bold text-xs shadow-md transition-all active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              Propose Tour Schedule
            </button>

            <button
              onClick={() => onNavigate('inspections')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white font-semibold text-xs border border-white/20 transition-all"
            >
              <FileCheck2 className="w-4 h-4 text-emerald-400" />
              Log Field Visit
            </button>

            <button
              onClick={() => setModalType('RECOVERY')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white font-semibold text-xs border border-white/20 transition-all"
            >
              <DollarSign className="w-4 h-4 text-amber-300" />
              Record Recovery (₹)
            </button>

            <button
              onClick={() => setModalType('CALL')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white font-semibold text-xs border border-white/20 transition-all"
            >
              <PhoneCall className="w-4 h-4 text-blue-300" />
              Log Call / Liaison
            </button>

            <button
              onClick={() => setModalType('DOCUMENT')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white font-semibold text-xs border border-white/20 transition-all"
            >
              <FilePlus className="w-4 h-4 text-purple-300" />
              Upload Document
            </button>
          </div>
        </div>

        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-epfo-accent/20 rounded-full blur-2xl pointer-events-none"></div>
      </div>

      {/* Primary Metrics Grid (Cards 1-4) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Widget 1: Today's Visits */}
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold">
            <span>Today's Visits</span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-foreground">{todayVisits.length}</div>
          <p className="text-[11px] text-muted-foreground flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-blue-500" />
            <span>Scheduled for {formatDate(new Date())}</span>
          </p>
        </div>

        {/* Widget 2: Monthly Visits Progress */}
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold">
            <span>Monthly Visits Progress</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <FileCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-black text-foreground">{completedVisitsCount}</div>
            <span className="text-xs font-bold text-muted-foreground">Target: {totalMonthlyVisits}</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (completedVisitsCount / totalMonthlyVisits) * 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Widget 3: Pending Visits */}
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold">
            <span>Pending Visits</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-foreground">{pendingVisits.length}</div>
          <p className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
            <span>Awaiting field site visit</span>
          </p>
        </div>

        {/* Widget 7: Recovery Target Progress */}
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-semibold">
            <span>7A / 14B Recovery</span>
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-epfo-accent">
            {formatCurrency(recovery.recoveredAmount)}
          </div>
          <p className="text-[11px] text-muted-foreground">
            Target: {formatCurrency(recovery.targetAmount)} ({Math.round((recovery.recoveredAmount / recovery.targetAmount) * 100)}% achieved)
          </p>
        </div>
      </div>

      {/* Main Grid: Widgets 1, 3, 4, 7, 8 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Widget 1 & 3 Detailed View: Today's & Pending Visits */}
          <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2 font-bold text-sm text-foreground">
                <Calendar className="w-4 h-4 text-epfo-accent" />
                <span>Today's & Priority Pending Field Visits</span>
              </div>
              <button
                onClick={() => onNavigate('inspections')}
                className="text-xs font-semibold text-epfo-accent hover:underline flex items-center gap-1"
              >
                <span>View All Visits</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {pendingVisits.map((visit) => (
                <div
                  key={visit.id}
                  className="p-3.5 rounded-xl bg-muted/40 hover:bg-muted/70 transition-colors border border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-foreground">{visit.name}</span>
                      <span className="font-mono text-[10px] bg-epfo-navy/10 text-epfo-navy dark:text-epfo-slate px-1.5 py-0.5 rounded font-bold">
                        {visit.code}
                      </span>
                    </div>
                    <div className="text-[11px] text-muted-foreground flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-epfo-accent shrink-0" />
                      <span>{visit.location} • {visit.reason}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20">
                      Due: {formatDate(visit.dueDate)}
                    </span>
                    <button
                      onClick={() => onNavigate('inspections')}
                      className="px-3 py-1 rounded-lg bg-epfo-navy hover:bg-epfo-blue text-white text-[11px] font-bold transition-all"
                    >
                      Start Visit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Widget 4: High Priority Compliance Follow-ups */}
          <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2 font-bold text-sm text-foreground">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>High-Priority Compliance Follow-ups</span>
              </div>
              <span className="text-[10px] font-bold bg-amber-500/10 text-amber-600 px-2 py-0.5 rounded-full">
                {followUps.filter((f) => f.status === 'PENDING').length} Action Items
              </span>
            </div>

            <div className="space-y-3">
              {followUps.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-muted/40 hover:bg-muted/70 transition-colors border border-border/50 space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-xs font-bold text-foreground">{item.establishmentName}</span>
                      <span className="font-mono text-[10px] text-muted-foreground ml-2">({item.establishmentCode})</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-500/10 text-red-600 border border-red-500/20">
                      {item.type.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Widget 6 & 5 Grid: Calls & Documents Vault */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Widget 6: Official Calls & Liaison Log */}
            <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <div className="flex items-center gap-2 font-bold text-xs text-foreground">
                  <PhoneCall className="w-4 h-4 text-blue-500" />
                  <span>Call & Liaison Logs</span>
                </div>
                <button
                  onClick={() => setModalType('CALL')}
                  className="text-[11px] font-bold text-epfo-accent hover:underline"
                >
                  + Log Call
                </button>
              </div>

              <div className="space-y-2.5">
                {callLogs.map((call) => (
                  <div key={call.id} className="p-3 rounded-xl bg-muted/40 text-xs space-y-1">
                    <div className="flex items-center justify-between font-bold text-foreground">
                      <span>{call.contactName}</span>
                      <span className="font-mono text-[10px] text-muted-foreground">{call.phoneNumber}</span>
                    </div>
                    <div className="text-[11px] text-muted-foreground">{call.notes}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Widget 5: Digital Documents Vault */}
            <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <div className="flex items-center gap-2 font-bold text-xs text-foreground">
                  <FileText className="w-4 h-4 text-purple-500" />
                  <span>Document Vault</span>
                </div>
                <button
                  onClick={() => setModalType('DOCUMENT')}
                  className="text-[11px] font-bold text-epfo-accent hover:underline"
                >
                  + Upload
                </button>
              </div>

              <div className="space-y-2.5">
                {documents.map((doc) => (
                  <div key={doc.id} className="p-3 rounded-xl bg-muted/40 text-xs space-y-1">
                    <div className="font-bold text-foreground truncate">{doc.title}</div>
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground font-mono">
                      <span>{doc.refNumber}</span>
                      <span>{doc.fileSize}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (1 col): Widgets 8 & 9 & Recovery Breakdown */}
        <div className="space-y-6">
          {/* Widget 8: Inspection Category Breakdown */}
          <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2 font-bold text-xs text-foreground">
                <Building className="w-4 h-4 text-epfo-accent" />
                <span>Inspection Breakdown</span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-muted/40">
                <span className="font-medium">Covered Establishments</span>
                <span className="font-bold text-foreground">12 Inspected</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-muted/40">
                <span className="font-medium">PMVBRY Cluster / Handloom</span>
                <span className="font-bold text-emerald-600">4 Camps</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-muted/40">
                <span className="font-medium">Exempted Mines / PSUs</span>
                <span className="font-bold text-blue-600">3 Audited</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-muted/40">
                <span className="font-medium">Uncovered Sec 1(3)(b) Check</span>
                <span className="font-bold text-amber-600">2 Pending</span>
              </div>
            </div>
          </div>

          {/* Widget 9: Live Recent Activity Timeline */}
          <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2 font-bold text-xs text-foreground">
                <Clock className="w-4 h-4 text-epfo-accent" />
                <span>Recent Activity Feed</span>
              </div>
            </div>

            <div className="relative pl-4 space-y-4 border-l border-border/80">
              {activities.map((act) => (
                <div key={act.id} className="relative space-y-1">
                  <div className={`absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full ${act.badgeColor || 'bg-epfo-accent'}`}></div>
                  <div className="text-[10px] text-muted-foreground font-mono">{act.timestamp}</div>
                  <div className="text-xs font-bold text-foreground">{act.title}</div>
                  <div className="text-[11px] text-muted-foreground leading-snug">{act.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Modal Trigger */}
      <QuickActionModal
        actionType={modalType}
        onClose={() => setModalType(null)}
        onSubmitAction={handleModalSubmit}
      />
    </div>
  );
};
