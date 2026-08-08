import React, { useState, useEffect } from 'react';
import { XCircle, Calendar, Save, AlertTriangle, Building2, Clock } from 'lucide-react';
import { FollowUpItem, EstablishmentDTO } from '@/types';

interface FollowUpModalProps {
  isOpen: boolean;
  followUp?: FollowUpItem | null;
  establishments: EstablishmentDTO[];
  onClose: () => void;
  onSave: (item: Omit<FollowUpItem, 'id'> | FollowUpItem) => void;
}

export const FollowUpModal: React.FC<FollowUpModalProps> = ({
  isOpen,
  followUp,
  establishments,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    establishmentCode: establishments[0]?.establishmentCode || 'OR/BBS/0006276/000',
    establishmentName: establishments[0]?.name || 'M/s Jindal Stainless Steel Ltd',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    nextVisitDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    type: 'FORM_11_NOTICE' as FollowUpItem['type'],
    priority: 'HIGH' as FollowUpItem['priority'],
    status: 'PENDING' as FollowUpItem['status'],
    description: '',
  });

  useEffect(() => {
    if (followUp) {
      setFormData({
        establishmentCode: followUp.establishmentCode,
        establishmentName: followUp.establishmentName,
        dueDate: followUp.dueDate,
        nextVisitDate: followUp.nextVisitDate || '',
        type: followUp.type,
        priority: followUp.priority,
        status: followUp.status,
        description: followUp.description,
      });
    } else {
      setFormData({
        establishmentCode: establishments[0]?.establishmentCode || 'OR/BBS/0006276/000',
        establishmentName: establishments[0]?.name || 'M/s Jindal Stainless Steel Ltd',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        nextVisitDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        type: 'FORM_11_NOTICE',
        priority: 'HIGH',
        status: 'PENDING',
        description: '',
      });
    }
  }, [followUp, isOpen, establishments]);

  if (!isOpen) return null;

  const handleEsttSelect = (code: string) => {
    const found = establishments.find((e) => e.establishmentCode === code);
    setFormData({
      ...formData,
      establishmentCode: code,
      establishmentName: found?.name || formData.establishmentName,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description) return;

    if (followUp) {
      onSave({
        ...followUp,
        ...formData,
      });
    } else {
      onSave(formData);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-card w-full max-w-lg rounded-2xl border border-border shadow-2xl p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-bold text-foreground">
              {followUp ? 'Edit Follow-up Action Item' : 'Create Pending Follow-up Action'}
            </h3>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1 rounded-lg">
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Establishment Select */}
          <div className="space-y-1">
            <label className="font-bold text-foreground flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-epfo-accent" />
              <span>Select Establishment *</span>
            </label>
            <select
              value={formData.establishmentCode}
              onChange={(e) => handleEsttSelect(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-epfo-accent outline-none font-bold"
            >
              {establishments.map((est) => (
                <option key={est.id} value={est.establishmentCode}>
                  {est.establishmentCode} - {est.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-foreground">Follow-up Category *</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-epfo-accent outline-none"
              >
                <option value="FORM_11_NOTICE">Form 11 Non-enrolment Notice</option>
                <option value="7A_ENQUIRY">Section 7A Dues Enquiry</option>
                <option value="14B_DAMAGES">Section 14B Default Damages</option>
                <option value="COVERAGE_CHECK">Sec 1(3)(b) Coverage Eligibility</option>
                <option value="PMVBRY_CAMP">PMVBRY Cluster Awareness Camp</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-foreground">Priority Level *</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-epfo-accent outline-none font-bold"
              >
                <option value="HIGH">🔴 High Priority</option>
                <option value="MEDIUM">🟡 Medium Priority</option>
                <option value="LOW">🔵 Low Priority</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-foreground flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                <span>Reminder Due Date *</span>
              </label>
              <input
                type="date"
                required
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-epfo-accent outline-none font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-foreground flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-epfo-accent" />
                <span>Scheduled Next Site Visit</span>
              </label>
              <input
                type="date"
                value={formData.nextVisitDate}
                onChange={(e) => setFormData({ ...formData, nextVisitDate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-epfo-accent outline-none font-mono"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-foreground">Follow-up Action Description *</label>
            <textarea
              rows={3}
              required
              placeholder="Describe pending action item, worker enrolment count, Section 7A hearing notice details..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-epfo-accent outline-none"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-3 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-border font-semibold hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-epfo-navy hover:bg-epfo-blue text-white font-bold shadow-md"
            >
              <Save className="w-3.5 h-3.5 text-epfo-accent" />
              <span>{followUp ? 'Update Action Item' : 'Save Follow-up Item'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
