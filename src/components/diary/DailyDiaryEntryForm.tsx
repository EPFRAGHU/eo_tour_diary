import React from 'react';
import { Trash2, ChevronDown, ChevronUp, MapPin, Building2, Car, Hotel, AlertCircle } from 'lucide-react';
import { DayType } from '@/types';

export interface DailyVisitEntry {
  id: string;
  visitDate: string;
  dayType: DayType;
  establishmentName: string;
  establishmentCode: string;
  location: string;
  durationDays: number;
  purpose: string;
  orderRef: string;
  distanceKm: number;
  conveyanceMode: string;
  vehicleDetails: string;
  hotelStayed: boolean;
  hotelName: string;
  hotelDays: number;
  hotelAmount: number;
  reportSubmittedRef: string;
  remarks: string;
}

interface DailyDiaryEntryFormProps {
  entry: DailyVisitEntry;
  index: number;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onChange: (updated: DailyVisitEntry) => void;
  onRemove: () => void;
  errors?: Record<string, string>;
}

export const DailyDiaryEntryForm: React.FC<DailyDiaryEntryFormProps> = ({
  entry,
  index,
  isExpanded,
  onToggleExpand,
  onChange,
  onRemove,
  errors = {},
}) => {
  const handleChange = (field: keyof DailyVisitEntry, value: any) => {
    onChange({
      ...entry,
      [field]: value,
    });
  };

  return (
    <div className="rounded-2xl bg-card border border-border/80 shadow-sm transition-all overflow-hidden">
      {/* Header Bar */}
      <div className="p-4 flex items-center justify-between gap-3 bg-muted/30 border-b border-border/60">
        <div className="flex items-center gap-3 cursor-pointer select-none" onClick={onToggleExpand}>
          <div className="w-7 h-7 rounded-xl bg-epfo-navy text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-sm">
            #{index + 1}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs text-foreground">
                {entry.establishmentName || 'New Visit Entry'}
              </span>
              {entry.establishmentCode && (
                <span className="font-mono text-[10px] bg-epfo-navy/10 text-epfo-navy dark:text-epfo-slate px-1.5 py-0.5 rounded font-bold">
                  {entry.establishmentCode}
                </span>
              )}
            </div>
            <div className="text-[11px] text-muted-foreground flex items-center gap-2 font-mono mt-0.5">
              <span>{entry.visitDate || 'No date set'}</span>
              <span>•</span>
              <span className="text-epfo-accent font-semibold">{entry.dayType}</span>
              {entry.distanceKm > 0 && <span>• {entry.distanceKm} KM</span>}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onRemove}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
            title="Remove Entry"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onToggleExpand}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Entry Form Body */}
      {isExpanded && (
        <div className="p-5 space-y-4 text-xs animate-in fade-in duration-200">
          {/* Row 1: Date, Day Type, Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-foreground">Date of Visit *</label>
              <input
                type="date"
                required
                value={entry.visitDate}
                onChange={(e) => handleChange('visitDate', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-epfo-accent outline-none"
              />
              {errors.visitDate && (
                <p className="text-[10px] text-destructive flex items-center gap-1 mt-0.5">
                  <AlertCircle className="w-3 h-3" /> {errors.visitDate}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="font-bold text-foreground">Day Category *</label>
              <select
                value={entry.dayType}
                onChange={(e) => handleChange('dayType', e.target.value as DayType)}
                className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-epfo-accent outline-none"
              >
                <option value="TOUR_DAY">Tour Day (Field Visit)</option>
                <option value="OFFICE_DAY">Attended Office Day</option>
                <option value="SPECIAL_CAMP">Special Campaign / Camp</option>
                <option value="PUBLIC_HOLIDAY">Public Holiday</option>
                <option value="WEEKEND_SATURDAY">Saturday</option>
                <option value="WEEKEND_SUNDAY">Sunday</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-foreground">Duration (Days)</label>
              <input
                type="number"
                min="1"
                max="30"
                value={entry.durationDays}
                onChange={(e) => handleChange('durationDays', Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-epfo-accent outline-none"
              />
            </div>
          </div>

          {/* Row 2: Establishment Name & Code */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-foreground">Name of Establishment / Factory *</label>
              <div className="relative">
                <Building2 className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="e.g. M/s Jindal Stainless Steel Ltd, Jajpur"
                  value={entry.establishmentName}
                  onChange={(e) => handleChange('establishmentName', e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-epfo-accent outline-none"
                />
              </div>
              {errors.establishmentName && (
                <p className="text-[10px] text-destructive flex items-center gap-1 mt-0.5">
                  <AlertCircle className="w-3 h-3" /> {errors.establishmentName}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <label className="font-bold text-foreground">Establishment Code No.</label>
              <input
                type="text"
                placeholder="e.g. OR/6276, OR/BBS/1238, Not covered"
                value={entry.establishmentCode}
                onChange={(e) => handleChange('establishmentCode', e.target.value.toUpperCase())}
                className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-epfo-accent outline-none font-mono font-bold"
              />
            </div>
          </div>

          {/* Row 3: Location, Purpose, Office Order Ref */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-foreground">Location / Station Visited *</label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="e.g. Danagadi, Jajpur or District Office"
                  value={entry.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-epfo-accent outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-foreground">Cause of Visit / Work Done *</label>
              <input
                type="text"
                placeholder="e.g. PMVBRY campaigning, Compliance Audit, 7A Enquiry"
                value={entry.purpose}
                onChange={(e) => handleChange('purpose', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-epfo-accent outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-foreground">Authorization Order / Ref</label>
              <input
                type="text"
                placeholder="e.g. Comp.Audit/Exempted Est./2024-25/818"
                value={entry.orderRef}
                onChange={(e) => handleChange('orderRef', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-epfo-accent outline-none"
              />
            </div>
          </div>

          {/* Row 4: Conveyance Details (Distance KM, Mode, Vehicle / Companion) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-muted/40 border border-border/50">
            <div className="space-y-1">
              <label className="font-bold text-foreground flex items-center gap-1">
                <Car className="w-3.5 h-3.5 text-epfo-accent" />
                <span>Distance Traveled (KMs)</span>
              </label>
              <input
                type="number"
                min="0"
                placeholder="e.g. 105"
                value={entry.distanceKm}
                onChange={(e) => handleChange('distanceKm', Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-epfo-accent outline-none font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-foreground">Mode of Conveyance</label>
              <select
                value={entry.conveyanceMode}
                onChange={(e) => handleChange('conveyanceMode', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-epfo-accent outline-none"
              >
                <option value="Own Car">Own Car / Four Wheeler</option>
                <option value="Car of another EO">Car of another EO (Shared)</option>
                <option value="Official Car">Departmental Vehicle</option>
                <option value="Public Bus">Public Bus / Express</option>
                <option value="Train / Rail">Train / Rail Transport</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-foreground">Vehicle / Companion Details</label>
              <input
                type="text"
                placeholder="e.g. Accompanied with Sh. M.R. Mohapatra, E.O"
                value={entry.vehicleDetails}
                onChange={(e) => handleChange('vehicleDetails', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-epfo-accent outline-none"
              />
            </div>
          </div>

          {/* Row 5: Hotel Stay Details (Expandable) */}
          <div className="p-3.5 rounded-xl bg-muted/40 border border-border/50 space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-bold text-foreground flex items-center gap-2 cursor-pointer">
                <Hotel className="w-4 h-4 text-purple-500" />
                <span>Hotel / Overnight Stay Required?</span>
              </label>
              <input
                type="checkbox"
                checked={entry.hotelStayed}
                onChange={(e) => handleChange('hotelStayed', e.target.checked)}
                className="w-4 h-4 rounded text-epfo-accent focus:ring-epfo-accent cursor-pointer"
              />
            </div>

            {entry.hotelStayed && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-border/50 animate-in fade-in duration-150">
                <div className="space-y-1">
                  <label className="font-bold text-foreground">Hotel Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Hotel Tathastu Residency"
                    value={entry.hotelName}
                    onChange={(e) => handleChange('hotelName', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-epfo-accent outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-foreground">Stay Days</label>
                  <input
                    type="number"
                    min="1"
                    value={entry.hotelDays}
                    onChange={(e) => handleChange('hotelDays', Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-epfo-accent outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-foreground">Amount Paid (₹)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="1500"
                    value={entry.hotelAmount}
                    onChange={(e) => handleChange('hotelAmount', Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-epfo-accent outline-none font-mono"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Row 6: Report Ref & Remarks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-foreground">No. & Date of Inspection Report</label>
              <input
                type="text"
                placeholder="e.g. Report No. OR/DO/CTC/Compliance/2026/810"
                value={entry.reportSubmittedRef}
                onChange={(e) => handleChange('reportSubmittedRef', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-epfo-accent outline-none font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-foreground">Remarks / Approval Notes</label>
              <input
                type="text"
                placeholder="e.g. May be allowed to take own car / Photos shared in WhatsApp group"
                value={entry.remarks}
                onChange={(e) => handleChange('remarks', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-epfo-accent outline-none"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
