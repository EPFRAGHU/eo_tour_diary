import React, { useState } from 'react';
import {
  PhoneCall,
  MessageSquare,
  Mail,
  Copy,
  Check,
  Search,
  History
} from 'lucide-react';
import { CallLogItem, EstablishmentDTO } from '@/types';
import { formatDate } from '@/lib/utils';
import { EmployerCommunicationModal } from '@/components/communication/EmployerCommunicationModal';

interface CommunicationHubProps {
  establishments: EstablishmentDTO[];
}

export const CommunicationHub: React.FC<CommunicationHubProps> = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [activeContactModal, setActiveContactModal] = useState<any | null>(null);

  // Sample Employer Contacts Directory
  const [contacts] = useState([
    {
      id: 'cnt-1',
      establishmentCode: 'MH/BAN/0045231/000',
      establishmentName: 'Apex Logistics & Freight India Pvt Ltd',
      contactPerson: 'Mr. Anil Das',
      designation: 'HR Manager',
      phone: '+91 98765 43210',
      email: 'anil.das@apexlogistics.com',
    },
    {
      id: 'cnt-2',
      establishmentCode: 'OR/6276',
      establishmentName: 'M/s Jindal Stainless Steel Ltd',
      contactPerson: 'Shri R.K. Jena',
      designation: 'General Manager (Personnel)',
      phone: '+91 94370 12345',
      email: 'rk.jena@jindalstainless.com',
    },
    {
      id: 'cnt-3',
      establishmentCode: 'OR/BBS/1238',
      name: 'M/s Bhimtanagar Sukinda Chromite Mines',
      establishmentName: 'M/s Bhimtanagar Sukinda Chromite Mines',
      contactPerson: 'Shri M. Swain',
      designation: 'Mine Agent & PRO',
      phone: '+91 99371 88900',
      email: 'mswain@sukindamines.org',
    },
    {
      id: 'cnt-4',
      establishmentCode: 'OR/BBS/5077',
      establishmentName: 'M/s NTPC Kanhia Thermal Power Plant',
      contactPerson: 'Shri S.K. Mohanty',
      designation: 'DGM (HR & Compliance)',
      phone: '+91 98610 55432',
      email: 'skmohanty@ntpc.co.in',
    },
  ]);

  // Communication History Logs State
  const [callLogs, setCallLogs] = useState<CallLogItem[]>([
    {
      id: 'c-1',
      contactName: 'Mr. Anil Das',
      establishmentName: 'Apex Logistics & Freight India Pvt Ltd',
      designation: 'HR Manager',
      phoneNumber: '+91 98765 43210',
      callDate: '2026-08-06',
      purpose: 'ECR Return filing confirmation',
      notes: 'Confirmed 142 employees enrolled in current month return. Agreed to deposit Section 7A dues by Friday.',
    },
    {
      id: 'c-2',
      contactName: 'Shri R.K. Jena',
      establishmentName: 'M/s Jindal Stainless Steel Ltd',
      designation: 'General Manager (Personnel)',
      phoneNumber: '+91 94370 12345',
      callDate: '2026-08-04',
      purpose: 'Section 14B Hearing Notice',
      notes: 'Sent WhatsApp reminder notice regarding 14B damages default period hearing.',
    },
  ]);

  const filteredContacts = contacts.filter(
    (c) =>
      c.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.establishmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.establishmentCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopy = (id: string, phone: string) => {
    navigator.clipboard.writeText(phone);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAddCallLog = (log: Omit<CallLogItem, 'id'>) => {
    const item: CallLogItem = { ...log, id: `c-${Date.now()}` };
    setCallLogs([item, ...callLogs]);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-foreground">Employer Communication & Call Liaison Hub</h2>
          <p className="text-xs text-muted-foreground">
            Direct phone calls, WhatsApp compliance messaging, SMS alerts, and discussion notes audit log.
          </p>
        </div>
      </div>

      {/* Directory & Quick Call Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols): Contact Directory & Actions */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search contact person, estt code, or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-background border border-border text-xs focus:ring-2 focus:ring-epfo-accent outline-none"
              />
            </div>
            <span className="text-[11px] font-mono text-muted-foreground">
              {filteredContacts.length} Contacts Listed
            </span>
          </div>

          <div className="space-y-3">
            {filteredContacts.map((cnt) => (
              <div
                key={cnt.id}
                className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-foreground">{cnt.contactPerson}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 border border-blue-500/20">
                      {cnt.designation}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground font-medium">{cnt.establishmentName}</div>
                  <div className="font-mono text-[10px] font-bold text-epfo-accent">{cnt.establishmentCode}</div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {/* Call Button */}
                  <a
                    href={`tel:${cnt.phone}`}
                    className="p-2 rounded-xl bg-emerald-500 text-white font-bold text-xs hover:bg-emerald-600 transition-all shadow-sm"
                    title="Call Phone Number"
                  >
                    <PhoneCall className="w-4 h-4" />
                  </a>

                  {/* WhatsApp Button */}
                  <button
                    onClick={() => setActiveContactModal(cnt)}
                    className="p-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-all shadow-sm"
                    title="Open WhatsApp Chat & Templates"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>

                  {/* SMS Button */}
                  <button
                    onClick={() => setActiveContactModal(cnt)}
                    className="p-2 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-all shadow-sm"
                    title="Send SMS"
                  >
                    <Mail className="w-4 h-4" />
                  </button>

                  {/* Copy Number */}
                  <button
                    onClick={() => handleCopy(cnt.id, cnt.phone)}
                    className="p-2 rounded-xl bg-muted text-foreground font-bold text-xs hover:bg-muted/80 transition-all"
                    title="Copy Phone Number"
                  >
                    {copiedId === cnt.id ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>

                  {/* Log Note / Full Dialog Trigger */}
                  <button
                    onClick={() => setActiveContactModal(cnt)}
                    className="px-3 py-2 rounded-xl bg-epfo-navy hover:bg-epfo-blue text-white text-xs font-bold transition-all shadow-sm"
                  >
                    Details & Log
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column (1 col): Recent Call & Communication History Stream */}
        <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2 font-bold text-xs text-foreground">
              <History className="w-4 h-4 text-epfo-accent" />
              <span>Recent Call & Liaison Logs</span>
            </div>
            <span className="font-mono text-[10px] text-muted-foreground">{callLogs.length} Total</span>
          </div>

          <div className="relative pl-4 space-y-4 border-l border-border/80 text-xs">
            {callLogs.map((log) => (
              <div key={log.id} className="relative space-y-1 p-3 rounded-xl bg-muted/30 border border-border/50">
                <div className="absolute -left-[21px] top-4 w-2.5 h-2.5 rounded-full bg-epfo-accent"></div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-foreground">{log.contactName}</span>
                  <span className="font-mono text-[10px] text-muted-foreground">{formatDate(log.callDate)}</span>
                </div>
                <div className="text-[10px] font-mono text-epfo-navy dark:text-epfo-slate font-bold">
                  {log.establishmentName}
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">{log.notes}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Communication Modal */}
      <EmployerCommunicationModal
        isOpen={!!activeContactModal}
        contact={activeContactModal}
        historyLogs={callLogs}
        onClose={() => setActiveContactModal(null)}
        onAddCallLog={handleAddCallLog}
      />
    </div>
  );
};
