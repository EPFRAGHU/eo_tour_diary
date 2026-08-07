import React, { useState } from 'react';
import { CalendarDays, Plus, MapPin, CheckCircle2, Clock, XCircle, Send } from 'lucide-react';
import { TourProgramItem } from '@/types';
import { formatDate } from '@/lib/utils';

interface TourProgramsProps {
  tours: TourProgramItem[];
  onAddTour: (tour: Omit<TourProgramItem, 'id' | 'createdAt'>) => void;
}

export const TourPrograms: React.FC<TourProgramsProps> = ({ tours, onAddTour }) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    purpose: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    startDate: '',
    endDate: '',
    remarks: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.startDate || !formData.endDate) return;

    onAddTour({
      officerId: 'eo-101',
      title: formData.title,
      purpose: formData.purpose,
      month: Number(formData.month),
      year: Number(formData.year),
      startDate: formData.startDate,
      endDate: formData.endDate,
      status: 'SUBMITTED',
      remarks: formData.remarks,
      inspectionsCount: 0,
    });

    setFormData({
      title: '',
      purpose: '',
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      startDate: '',
      endDate: '',
      remarks: '',
    });
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-foreground">Monthly Tour Program Proposals</h2>
          <p className="text-xs text-muted-foreground">
            Schedule and submit official tour itineraries for APFC/RPFC approval as per EPFO norms.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-epfo-navy hover:bg-epfo-blue text-white font-bold text-xs shadow-md transition-all active:scale-95"
        >
          <Plus className="w-4 h-4 text-epfo-accent" />
          Propose Tour Schedule
        </button>
      </div>

      {/* Tour List Grid */}
      {tours.length === 0 ? (
        <div className="p-12 text-center bg-card border border-dashed rounded-2xl space-y-3">
          <CalendarDays className="w-10 h-10 mx-auto text-muted-foreground stroke-1" />
          <h3 className="text-sm font-bold text-foreground">No Tour Programs Proposed</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Click the button above to schedule your monthly field inspection itinerary.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tours.map((tour) => (
            <div
              key={tour.id}
              className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm hover:shadow-md transition-all space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-epfo-accent bg-epfo-accent/10 px-2 py-0.5 rounded-full">
                    Month: {tour.month}/{tour.year}
                  </span>
                  <h3 className="text-sm font-bold text-foreground">{tour.title}</h3>
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <CheckCircle2 className="w-3 h-3" />
                  {tour.status}
                </span>
              </div>

              <div className="text-xs text-muted-foreground flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-epfo-navy shrink-0" />
                <span className="line-clamp-2">{tour.purpose}</span>
              </div>

              <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground font-mono">
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>{formatDate(tour.startDate)} - {formatDate(tour.endDate)}</span>
                </div>
                {tour.remarks && (
                  <span className="text-[10px] italic text-muted-foreground truncate max-w-[150px]">
                    "{tour.remarks}"
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Proposal Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-lg rounded-2xl border border-border shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-foreground">Propose Monthly Tour Program</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-muted-foreground hover:text-foreground p-1 rounded-lg"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-foreground">Tour Program Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Special Inspection Tour - Industrial Estate Sector 4"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-epfo-accent outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-foreground">Target Coverage / Purpose *</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Details of establishments to inspect, coverage objective, compliance verification..."
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-epfo-accent outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-foreground">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-epfo-accent outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-foreground">End Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-epfo-accent outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-foreground">Remarks / Justification</label>
                <input
                  type="text"
                  placeholder="Optional reference letter number or directive source"
                  value={formData.remarks}
                  onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
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
                  Submit Proposal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
