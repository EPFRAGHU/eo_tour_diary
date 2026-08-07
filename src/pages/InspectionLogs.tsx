import React, { useState } from 'react';
import { Plus, Building2, MapPin, Calendar, XCircle, Save, Search } from 'lucide-react';
import { InspectionLogItem, TourProgramItem } from '@/types';
import { formatDate } from '@/lib/utils';

interface InspectionLogsProps {
  inspections: InspectionLogItem[];
  tours: TourProgramItem[];
  onAddInspection: (insp: Omit<InspectionLogItem, 'id'>) => void;
}

export const InspectionLogs: React.FC<InspectionLogsProps> = ({
  inspections,
  tours,
  onAddInspection,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    tourId: tours[0]?.id || '',
    date: new Date().toISOString().split('T')[0],
    establishmentCode: '',
    establishmentName: '',
    location: '',
    inspectionPurpose: '',
    observations: '',
    status: 'CONDUCTED' as const,
  });

  const filteredLogs = inspections.filter(
    (i) =>
      i.establishmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.establishmentCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.establishmentCode || !formData.establishmentName) return;

    onAddInspection({
      tourId: formData.tourId || 'tour-default',
      date: formData.date,
      establishmentCode: formData.establishmentCode.toUpperCase(),
      establishmentName: formData.establishmentName,
      location: formData.location,
      inspectionPurpose: formData.inspectionPurpose,
      observations: formData.observations,
      status: formData.status,
    });

    setFormData({
      tourId: tours[0]?.id || '',
      date: new Date().toISOString().split('T')[0],
      establishmentCode: '',
      establishmentName: '',
      location: '',
      inspectionPurpose: '',
      observations: '',
      status: 'CONDUCTED',
    });
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-foreground">Field Inspection Diary Logs</h2>
          <p className="text-xs text-muted-foreground">
            Digital records of site inspections conducted at covered & coverage-eligible establishments.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-epfo-navy hover:bg-epfo-blue text-white font-bold text-xs shadow-md transition-all active:scale-95"
        >
          <Plus className="w-4 h-4 text-epfo-accent" />
          Log Establishment Inspection
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-3 text-muted-foreground" />
        <input
          type="text"
          placeholder="Filter by establishment code, name, or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border/80 text-xs focus:ring-2 focus:ring-epfo-accent outline-none shadow-sm"
        />
      </div>

      {/* Inspection Cards */}
      {filteredLogs.length === 0 ? (
        <div className="p-12 text-center bg-card border border-dashed rounded-2xl space-y-3">
          <Building2 className="w-10 h-10 mx-auto text-muted-foreground stroke-1" />
          <h3 className="text-sm font-bold text-foreground">No Inspection Records Found</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Record on-field visits, compliance checks, and observations during official tours.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredLogs.map((log) => (
            <div
              key={log.id}
              className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm hover:border-epfo-accent/40 transition-colors space-y-2"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-foreground">{log.establishmentName}</span>
                    <span className="font-mono text-[10px] bg-epfo-navy/10 text-epfo-navy dark:text-epfo-slate px-2 py-0.5 rounded font-bold">
                      {log.establishmentCode}
                    </span>
                  </div>
                  <div className="text-[11px] text-muted-foreground flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-epfo-accent" />
                      {log.location}
                    </span>
                    <span className="flex items-center gap-1 font-mono">
                      <Calendar className="w-3 h-3 text-muted-foreground" />
                      {formatDate(log.date)}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                  {log.status}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-muted/40 text-xs space-y-1">
                <div className="font-semibold text-foreground text-[11px]">Purpose: {log.inspectionPurpose}</div>
                <div className="text-muted-foreground text-[11px] leading-relaxed">
                  <span className="font-medium text-foreground">Observations: </span>
                  {log.observations}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Log Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-lg rounded-2xl border border-border shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-foreground">Record Field Inspection</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-muted-foreground hover:text-foreground p-1 rounded-lg"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-foreground">Establishment Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MH/BAN/0012345/000"
                    value={formData.establishmentCode}
                    onChange={(e) => setFormData({ ...formData, establishmentCode: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-epfo-accent outline-none font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-foreground">Inspection Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-epfo-accent outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-foreground">Establishment Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acme Tech Solutions Pvt Ltd"
                  value={formData.establishmentName}
                  onChange={(e) => setFormData({ ...formData, establishmentName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-epfo-accent outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-foreground">Location / Station *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Plot 14, MIDC Industrial Zone, Pune"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-epfo-accent outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-foreground">Inspection Objective *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Section 7A enquiry verification / 14B damages check / Routine compliance"
                  value={formData.inspectionPurpose}
                  onChange={(e) => setFormData({ ...formData, inspectionPurpose: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-epfo-accent outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-foreground">Observations & Findings *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Record key findings, books examined, non-enrolled staff detected, or compliance status..."
                  value={formData.observations}
                  onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-epfo-accent outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl border border-border font-semibold hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-epfo-navy hover:bg-epfo-blue text-white font-bold shadow-md"
                >
                  <Save className="w-3.5 h-3.5 text-epfo-accent" />
                  Save Inspection Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
