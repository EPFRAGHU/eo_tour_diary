import React, { useState } from 'react';
import { XCircle, Send, FilePlus, PhoneCall, DollarSign } from 'lucide-react';

interface QuickActionModalProps {
  actionType: 'RECOVERY' | 'CALL' | 'DOCUMENT' | null;
  onClose: () => void;
  onSubmitAction: (type: string, data: any) => void;
}

export const QuickActionModal: React.FC<QuickActionModalProps> = ({
  actionType,
  onClose,
  onSubmitAction,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    amount: 0,
    category: '7A_ENQUIRY',
    notes: '',
    phone: '',
    date: new Date().toISOString().split('T')[0],
  });

  if (!actionType) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitAction(actionType, formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-card w-full max-w-lg rounded-2xl border border-border shadow-2xl p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            {actionType === 'RECOVERY' && <DollarSign className="w-5 h-5 text-emerald-500" />}
            {actionType === 'CALL' && <PhoneCall className="w-5 h-5 text-blue-500" />}
            {actionType === 'DOCUMENT' && <FilePlus className="w-5 h-5 text-epfo-accent" />}
            <h3 className="text-base font-bold text-foreground">
              {actionType === 'RECOVERY' && 'Log 7A / 14B Recovery Payment'}
              {actionType === 'CALL' && 'Record Official Call & Liaison Log'}
              {actionType === 'DOCUMENT' && 'Upload Inspection Document / Notice'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground p-1 rounded-lg"
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {actionType === 'RECOVERY' && (
            <>
              <div className="space-y-1">
                <label className="font-bold text-foreground">Establishment Code & Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. OR/6276 M/s Jindal Stainless Steel"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-epfo-accent outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-foreground">Recovery Type *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-epfo-accent outline-none"
                  >
                    <option value="7A_ENQUIRY">Section 7A Dues Recovery</option>
                    <option value="14B_DAMAGES">Section 14B Damages</option>
                    <option value="7Q_INTEREST">Section 7Q Interest</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-foreground">Amount Recovered (₹) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="50000"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-epfo-accent outline-none"
                  />
                </div>
              </div>
            </>
          )}

          {actionType === 'CALL' && (
            <>
              <div className="space-y-1">
                <label className="font-bold text-foreground">Establishment / Contact Person *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mr. Anil Das (HR Manager - Titan Tech)"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-epfo-accent outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-foreground">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-epfo-accent outline-none font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-foreground">Call Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-epfo-accent outline-none"
                  />
                </div>
              </div>
            </>
          )}

          {actionType === 'DOCUMENT' && (
            <>
              <div className="space-y-1">
                <label className="font-bold text-foreground">Document Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Form 11 Inspection Report - MIDC Zone"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-epfo-accent outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-foreground">Document Reference No *</label>
                <input
                  type="text"
                  required
                  placeholder="OR/DO/CTC/Compliance/2026/810"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-epfo-accent outline-none font-mono"
                />
              </div>
            </>
          )}

          <div className="space-y-1">
            <label className="font-bold text-foreground">Notes / Discussion Remarks</label>
            <textarea
              rows={2}
              placeholder="Record details of conversation, challan reference, or document notes..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
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
              <Send className="w-3.5 h-3.5 text-epfo-accent" />
              Submit Log
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
