import React, { useState } from 'react';
import { FileCheck2, Plus, MapPin, CheckCircle2, Clock, XCircle, Table, Trash2, Send } from 'lucide-react';
import { InspectionLogItem, TourProgramItem } from '@/types';
import { formatDate } from '@/lib/utils';
import { EditableVisitTable } from '@/components/diary/EditableVisitTable';

interface InspectionLogsProps {
  inspections: InspectionLogItem[];
  tours: TourProgramItem[];
  onAddInspection: (inspection: Omit<InspectionLogItem, 'id'>) => void;
  onDeleteInspection?: (id: string) => void;
}

export const InspectionLogs: React.FC<InspectionLogsProps> = ({
  inspections,
  tours,
  onAddInspection,
  onDeleteInspection,
}) => {
  const [viewMode, setViewMode] = useState<'TABLE' | 'CARDS'>('TABLE');
  const [showModal, setShowModal] = useState(false);
  const [localInspections, setLocalInspections] = useState<InspectionLogItem[]>(inspections);

  const [formData, setFormData] = useState({
    tourId: tours[0]?.id || '',
    date: new Date().toISOString().split('T')[0],
    establishmentCode: '',
    establishmentName: '',
    location: '',
    inspectionPurpose: '',
    observations: '',
    status: 'CONDUCTED' as const,
    distanceKm: 0,
  });

  const handleCreateInspection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.establishmentCode || !formData.establishmentName) return;

    const newInsp: Omit<InspectionLogItem, 'id'> = {
      tourId: formData.tourId,
      date: formData.date,
      establishmentCode: formData.establishmentCode.toUpperCase(),
      establishmentName: formData.establishmentName,
      location: formData.location,
      inspectionPurpose: formData.inspectionPurpose,
      observations: formData.observations,
      status: formData.status,
      distanceKm: Number(formData.distanceKm),
    };

    onAddInspection(newInsp);
    setLocalInspections([{ ...newInsp, id: `insp-${Date.now()}` }, ...localInspections]);

    setFormData({
      tourId: tours[0]?.id || '',
      date: new Date().toISOString().split('T')[0],
      establishmentCode: '',
      establishmentName: '',
      location: '',
      inspectionPurpose: '',
      observations: '',
      status: 'CONDUCTED',
      distanceKm: 0,
    });
    setShowModal(false);
  };

  const handleUpdateLocalInspection = (updated: InspectionLogItem) => {
    setLocalInspections(localInspections.map((i) => (i.id === updated.id ? updated : i)));
  };

  const handleDeleteLocalInspection = (id: string) => {
    setLocalInspections(localInspections.filter((i) => i.id !== id));
  };

  const handleAddLocalInspection = (newInsp: Omit<InspectionLogItem, 'id'>) => {
    const item: InspectionLogItem = { ...newInsp, id: `insp-${Date.now()}` };
    onAddInspection(newInsp);
    setLocalInspections([item, ...localInspections]);
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-foreground">Field Inspection Visit Logs</h2>
          <p className="text-xs text-muted-foreground">
            Official record of site visits, 7A/14B enquiry audits, and PMVBRY campaign inspections.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Mode Switcher */}
          <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl border border-border/60">
            <button
              onClick={() => setViewMode('TABLE')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                viewMode === 'TABLE' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Table className="w-3.5 h-3.5 text-epfo-accent" />
              <span>Editable Table View</span>
            </button>
            <button
              onClick={() => setViewMode('CARDS')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                viewMode === 'CARDS' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>Card Feed</span>
            </button>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-epfo-navy hover:bg-epfo-blue text-white font-bold text-xs shadow-md transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 text-epfo-accent" />
            <span>Log Field Visit</span>
          </button>
        </div>
      </div>

      {/* Main View Mode Rendering */}
      {viewMode === 'TABLE' ? (
        <EditableVisitTable
          inspections={localInspections}
          onAddInspection={handleAddLocalInspection}
          onUpdateInspection={handleUpdateLocalInspection}
          onDeleteInspection={handleDeleteLocalInspection}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {localInspections.map((insp) => (
            <div
              key={insp.id}
              className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm hover:shadow-md transition-all space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <span className="font-mono text-[10px] font-bold text-epfo-accent bg-epfo-accent/10 px-2 py-0.5 rounded-full">
                    {insp.establishmentCode}
                  </span>
                  <h3 className="text-sm font-bold text-foreground">{insp.establishmentName}</h3>
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <CheckCircle2 className="w-3 h-3" />
                  {insp.status}
                </span>
              </div>

              <div className="text-xs font-semibold text-foreground">{insp.inspectionPurpose}</div>

              <p className="text-xs text-muted-foreground leading-relaxed bg-muted/30 p-2.5 rounded-xl border border-border/40">
                "{insp.observations}"
              </p>

              <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground font-mono">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-epfo-navy shrink-0" />
                  <span>{insp.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                    <span>{formatDate(insp.date || insp.visitDate || new Date())}</span>
                  </div>

                  {onDeleteInspection && (
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete inspection record for "${insp.establishmentName}"?`)) {
                          onDeleteInspection(insp.id);
                        }
                      }}
                      className="p-1 rounded-lg text-muted-foreground hover:text-red-600 hover:bg-red-500/10 transition-colors ml-1"
                      title="Delete Inspection Record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Log Visit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-lg rounded-2xl border border-border shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-foreground">Log Field Inspection Note</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-muted-foreground hover:text-foreground p-1 rounded-lg"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateInspection} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-foreground">Establishment Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="OR/6276 or MH/BAN/0045231/000"
                    value={formData.establishmentCode}
                    onChange={(e) => setFormData({ ...formData, establishmentCode: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-epfo-accent outline-none font-mono font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-foreground">Visit Date *</label>
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
                  placeholder="e.g. M/s Jindal Stainless Steel Ltd"
                  value={formData.establishmentName}
                  onChange={(e) => setFormData({ ...formData, establishmentName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-epfo-accent outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-foreground">Location / Station *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Danagadi, Jajpur"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-epfo-accent outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-foreground">Distance (KM)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="105"
                    value={formData.distanceKm}
                    onChange={(e) => setFormData({ ...formData, distanceKm: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-epfo-accent outline-none font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-foreground">Inspection Purpose *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Section 7A Enquiry / PMVBRY Campaign / Coverage Check"
                  value={formData.inspectionPurpose}
                  onChange={(e) => setFormData({ ...formData, inspectionPurpose: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-epfo-accent outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-foreground">Observations & Inspection Note</label>
                <textarea
                  rows={3}
                  placeholder="Record findings, employee attendance check, Form 11 notice issued..."
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
                  <Send className="w-3.5 h-3.5 text-epfo-accent" />
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
