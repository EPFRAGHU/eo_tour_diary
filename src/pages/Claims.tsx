import React, { useState } from 'react';
import { Receipt, Plus, Clock, XCircle, FileText, Trash2 } from 'lucide-react';
import { ClaimItem, TourProgramItem } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';

interface ClaimsProps {
  claims: ClaimItem[];
  tours: TourProgramItem[];
  onAddClaim: (claim: Omit<ClaimItem, 'id' | 'createdAt'>) => void;
  onDeleteClaim?: (id: string) => void;
}

export const Claims: React.FC<ClaimsProps> = ({ claims, tours, onAddClaim, onDeleteClaim }) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    tourId: tours[0]?.id || '',
    taAmount: 0,
    daAmount: 0,
    hotelAmount: 0,
    otherAmount: 0,
    remarks: '',
  });

  const totalCalculated =
    Number(formData.taAmount) +
    Number(formData.daAmount) +
    Number(formData.hotelAmount) +
    Number(formData.otherAmount);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (totalCalculated <= 0) return;

    const selectedTour = tours.find((t) => t.id === formData.tourId);

    onAddClaim({
      tourId: formData.tourId || 'tour-default',
      tourTitle: selectedTour?.title || 'Field Tour Claim',
      officerId: 'eo-101',
      totalAmount: totalCalculated,
      taAmount: Number(formData.taAmount),
      daAmount: Number(formData.daAmount),
      hotelAmount: Number(formData.hotelAmount),
      otherAmount: Number(formData.otherAmount),
      status: 'SUBMITTED',
      remarks: formData.remarks,
    });

    setFormData({
      tourId: tours[0]?.id || '',
      taAmount: 0,
      daAmount: 0,
      hotelAmount: 0,
      otherAmount: 0,
      remarks: '',
    });
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-foreground">TA / DA Reimbursement Claims</h2>
          <p className="text-xs text-muted-foreground">
            Submit Travelling Allowance and Daily Allowance claims according to official EPFO entitlement grades.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-epfo-navy hover:bg-epfo-blue text-white font-bold text-xs shadow-md transition-all active:scale-95"
        >
          <Plus className="w-4 h-4 text-epfo-accent" />
          Prepare TA/DA Claim Bill
        </button>
      </div>

      {/* Claims List */}
      {claims.length === 0 ? (
        <div className="p-12 text-center bg-card border border-dashed rounded-2xl space-y-3">
          <Receipt className="w-10 h-10 mx-auto text-muted-foreground stroke-1" />
          <h3 className="text-sm font-bold text-foreground">No Claims Submitted Yet</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Prepare and submit itemized TA/DA bills linked to completed tour programs.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {claims.map((claim) => (
            <div
              key={claim.id}
              className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm hover:border-epfo-accent/40 transition-all space-y-4"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-xs font-bold text-foreground">{claim.tourTitle || 'Tour Reimbursement'}</div>
                  <div className="text-[10px] text-muted-foreground font-mono mt-0.5">
                    Submitted: {formatDate(claim.createdAt)}
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  <Clock className="w-3 h-3" />
                  {claim.status}
                </span>
              </div>

              {/* Amount Itemization Breakdown */}
              <div className="grid grid-cols-4 gap-2 text-center p-3 rounded-xl bg-muted/40 text-xs">
                <div>
                  <div className="text-[10px] text-muted-foreground">TA (Travel)</div>
                  <div className="font-bold text-foreground mt-0.5">{formatCurrency(claim.taAmount)}</div>
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground">DA (Daily)</div>
                  <div className="font-bold text-foreground mt-0.5">{formatCurrency(claim.daAmount)}</div>
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground">Hotel</div>
                  <div className="font-bold text-foreground mt-0.5">{formatCurrency(claim.hotelAmount)}</div>
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground">Other</div>
                  <div className="font-bold text-foreground mt-0.5">{formatCurrency(claim.otherAmount)}</div>
                </div>
              </div>

              <div className="pt-2 border-t border-border/60 flex items-center justify-between">
                <span className="text-xs font-bold text-muted-foreground">Total Claim Value</span>
                <div className="flex items-center gap-3">
                  <span className="text-base font-extrabold text-epfo-accent">{formatCurrency(claim.totalAmount)}</span>
                  {onDeleteClaim && (
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete claim for "${claim.tourTitle}"?`)) {
                          onDeleteClaim(claim.id);
                        }
                      }}
                      className="p-1 rounded-lg text-muted-foreground hover:text-red-600 hover:bg-red-500/10 transition-colors"
                      title="Delete Claim Record"
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

      {/* Claim Form Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-lg rounded-2xl border border-border shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-foreground">Prepare TA / DA Claim Bill</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-muted-foreground hover:text-foreground p-1 rounded-lg"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-foreground">Associated Tour Program *</label>
                <select
                  value={formData.tourId}
                  onChange={(e) => setFormData({ ...formData, tourId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-epfo-accent outline-none"
                >
                  {tours.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.title} ({t.month}/{t.year})
                    </option>
                  ))}
                  {tours.length === 0 && <option value="default">General Inspection Tour</option>}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-foreground">TA (Travel Allowance) ₹</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.taAmount}
                    onChange={(e) => setFormData({ ...formData, taAmount: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-epfo-accent outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-foreground">DA (Daily Allowance) ₹</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.daAmount}
                    onChange={(e) => setFormData({ ...formData, daAmount: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-epfo-accent outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-foreground">Hotel / Stay Expenses ₹</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.hotelAmount}
                    onChange={(e) => setFormData({ ...formData, hotelAmount: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-epfo-accent outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-foreground">Other Contingency ₹</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.otherAmount}
                    onChange={(e) => setFormData({ ...formData, otherAmount: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-epfo-accent outline-none"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-epfo-accent/10 border border-epfo-accent/30 flex items-center justify-between">
                <span className="font-bold text-foreground">Computed Bill Total:</span>
                <span className="text-base font-extrabold text-epfo-accent">{formatCurrency(totalCalculated)}</span>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-foreground">Claim Remarks / Ticket References</label>
                <input
                  type="text"
                  placeholder="e.g. Train PNR / Ticket Nos / Hotel Bill Ref No..."
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
                  <FileText className="w-3.5 h-3.5 text-epfo-accent" />
                  Submit Claim Bill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
