import React from 'react';
import { XCircle, FileCheck2, History } from 'lucide-react';
import { EstablishmentDTO, InspectionLogItem } from '@/types';
import { formatDate } from '@/lib/utils';

interface EstablishmentProfileModalProps {
  establishment: EstablishmentDTO | null;
  inspections: InspectionLogItem[];
  onClose: () => void;
}

export const EstablishmentProfileModal: React.FC<EstablishmentProfileModalProps> = ({
  establishment,
  inspections,
  onClose,
}) => {
  if (!establishment) return null;

  const history = inspections.filter(
    (i) => i.establishmentCode.toUpperCase() === establishment.establishmentCode.toUpperCase()
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-card w-full max-w-2xl rounded-2xl border border-border shadow-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-border pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-black bg-epfo-navy text-white px-2 py-0.5 rounded">
                {establishment.establishmentCode}
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                {establishment.coverageStatus}
              </span>
            </div>
            <h2 className="text-lg font-extrabold text-foreground">{establishment.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground p-1 rounded-lg"
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        {/* Establishment Meta Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-muted/40 text-xs">
          <div>
            <span className="text-muted-foreground block text-[10px]">District Office</span>
            <span className="font-bold text-foreground">{establishment.district}</span>
          </div>
          <div>
            <span className="text-muted-foreground block text-[10px]">Station / Location</span>
            <span className="font-bold text-foreground">{establishment.location}</span>
          </div>
          <div>
            <span className="text-muted-foreground block text-[10px]">Industry Sector</span>
            <span className="font-bold text-foreground">{establishment.industryType || 'N/A'}</span>
          </div>
          <div>
            <span className="text-muted-foreground block text-[10px]">Total Visits</span>
            <span className="font-bold text-epfo-accent font-mono">{history.length} Inspected</span>
          </div>
        </div>

        {/* Section 2: Historical Inspection Audit Timeline */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <div className="flex items-center gap-2 font-bold text-xs text-foreground">
              <History className="w-4 h-4 text-epfo-accent" />
              <span>Historical Inspection & Compliance Audit Timeline</span>
            </div>
            <span className="text-[10px] font-mono text-muted-foreground">
              {history.length} Logged Record(s)
            </span>
          </div>

          {history.length === 0 ? (
            <div className="p-8 text-center border border-dashed rounded-xl space-y-2 text-muted-foreground">
              <FileCheck2 className="w-8 h-8 mx-auto stroke-1" />
              <p className="text-xs font-medium">No recorded field visits for this establishment code yet.</p>
            </div>
          ) : (
            <div className="relative pl-4 space-y-4 border-l border-border/80">
              {history.map((log) => (
                <div key={log.id} className="relative space-y-1.5 p-3 rounded-xl bg-muted/30 border border-border/50">
                  <div className="absolute -left-[21px] top-4 w-2.5 h-2.5 rounded-full bg-epfo-accent"></div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-foreground">{log.inspectionPurpose}</span>
                    <span className="font-mono text-[10px] text-muted-foreground font-bold">
                      {formatDate(log.date || log.visitDate || new Date())}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">{log.observations}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="pt-3 border-t border-border flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-epfo-navy text-white text-xs font-bold hover:bg-epfo-blue transition-all"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
};
