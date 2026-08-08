import React, { useState } from 'react';
import { Trash2, ChevronDown, ChevronUp, MapPin, Building2, Car, Camera, Navigation } from 'lucide-react';
import { DayType } from '@/types';
import { getCurrentGPSLocation } from '@/lib/gpsUtils';
import { CameraUploadModal } from '@/components/mobile/CameraUploadModal';
import { formatOdishaEstCode } from '@/lib/utils';

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
  photoUrl?: string;
  gpsCoords?: string;
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
}) => {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isGPSLoading, setIsGPSLoading] = useState(false);

  const handleChange = (field: keyof DailyVisitEntry, value: any) => {
    onChange({
      ...entry,
      [field]: value,
    });
  };

  // GPS Check-in Handler
  const handleFetchGPS = async () => {
    setIsGPSLoading(true);
    try {
      const coords = await getCurrentGPSLocation();
      const gpsStr = `Lat: ${coords.latitude.toFixed(4)}, Long: ${coords.longitude.toFixed(4)}`;
      handleChange('gpsCoords', gpsStr);
      if (!entry.location) {
        handleChange('location', `Field Visit Geo (${gpsStr})`);
      }
      alert(`GPS Check-in successful! Captured: ${gpsStr}`);
    } catch (err: any) {
      alert(`GPS check-in notice: Could not fetch automatic location (${err.message}). Defaulting to region GPS.`);
      handleChange('gpsCoords', 'Lat: 20.4625, Long: 85.8828 (Cuttack, Odisha)');
    } finally {
      setIsGPSLoading(false);
    }
  };

  const handleCapturePhoto = (photoUrl: string) => {
    handleChange('photoUrl', photoUrl);
    alert('Inspection photo attached to visit entry successfully!');
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
              <span className="font-extrabold text-sm text-foreground">
                {entry.establishmentName || 'New Visit Entry'}
              </span>
              {entry.establishmentCode && (
                <span className="font-mono text-[10px] bg-epfo-accent/10 text-epfo-accent px-1.5 py-0.2 rounded font-bold">
                  {entry.establishmentCode}
                </span>
              )}
            </div>
            <div className="text-[11px] text-muted-foreground flex items-center gap-2">
              <span>{entry.visitDate}</span>
              <span>•</span>
              <span className="uppercase font-mono">{entry.dayType}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Mobile Action Buttons */}
          <button
            type="button"
            onClick={handleFetchGPS}
            disabled={isGPSLoading}
            className="p-2 rounded-xl bg-epfo-accent/10 hover:bg-epfo-accent/20 text-epfo-accent font-bold text-xs flex items-center gap-1 transition-all"
            title="GPS Check-in Location"
          >
            <Navigation className={`w-3.5 h-3.5 ${isGPSLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">GPS</span>
          </button>

          <button
            type="button"
            onClick={() => setIsCameraOpen(true)}
            className="p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center gap-1 transition-all"
            title="Take Field Photo"
          >
            <Camera className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Camera</span>
          </button>

          <button
            type="button"
            onClick={onToggleExpand}
            className="p-2 rounded-xl hover:bg-muted text-muted-foreground transition-colors"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={onRemove}
            className="p-2 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
            title="Delete Entry"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Expanded Accordion Form */}
      {isExpanded && (
        <div className="p-4 space-y-4 text-xs">
          {/* Row 1: Date & Day Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-foreground">Visit Date *</label>
              <input
                type="date"
                required
                value={entry.visitDate}
                onChange={(e) => handleChange('visitDate', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-epfo-accent outline-none font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-foreground">Day Type *</label>
              <select
                value={entry.dayType}
                onChange={(e) => handleChange('dayType', e.target.value as DayType)}
                className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-epfo-accent outline-none font-bold"
              >
                <option value="TOUR_DAY">TOUR DAY (Field Visit)</option>
                <option value="OFFICE_DAY">OFFICE DAY (Headquarters)</option>
                <option value="SPECIAL_CAMP">SPECIAL CAMP (PMVBRY)</option>
                <option value="WEEKEND_SATURDAY">SATURDAY</option>
                <option value="WEEKEND_SUNDAY">SUNDAY</option>
                <option value="PUBLIC_HOLIDAY">PUBLIC HOLIDAY</option>
              </select>
            </div>
          </div>

          {/* Row 2: Establishment Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="font-bold text-foreground flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-epfo-accent" />
                <span>Establishment Name *</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g., M/s Jindal Stainless Steel Ltd"
                value={entry.establishmentName}
                onChange={(e) => handleChange('establishmentName', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-epfo-accent outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-foreground">Estt Code / Reg *</label>
              <input
                type="text"
                placeholder="e.g., OR/BBS/0000000/000"
                value={entry.establishmentCode}
                onChange={(e) => handleChange('establishmentCode', e.target.value)}
                onBlur={(e) => {
                  if (e.target.value.trim()) {
                    handleChange('establishmentCode', formatOdishaEstCode(e.target.value));
                  }
                }}
                className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-epfo-accent outline-none font-mono uppercase"
              />
            </div>
          </div>

          {/* Row 3: Location & GPS Check-in Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="font-bold text-foreground flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-epfo-navy dark:text-epfo-slate" />
                  <span>Location / Place *</span>
                </label>
                {entry.gpsCoords && (
                  <span className="text-[9px] font-mono text-emerald-500 font-bold">✓ Geo-tagged</span>
                )}
              </div>
              <input
                type="text"
                required
                placeholder="Location / Village / MIDC Zone"
                value={entry.location}
                onChange={(e) => handleChange('location', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-epfo-accent outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-foreground">Inspection Purpose / Objective *</label>
              <input
                type="text"
                required
                placeholder="e.g., 7A Enquiry Records Examination"
                value={entry.purpose}
                onChange={(e) => handleChange('purpose', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-epfo-accent outline-none"
              />
            </div>
          </div>

          {/* Row 4: Conveyance & Distance */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-foreground flex items-center gap-1">
                <Car className="w-3.5 h-3.5 text-epfo-accent" />
                <span>Mode of Travel</span>
              </label>
              <select
                value={entry.conveyanceMode}
                onChange={(e) => handleChange('conveyanceMode', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-epfo-accent outline-none"
              >
                <option value="OWN_CAR">Own Car (Grade IV)</option>
                <option value="TAXI_HIRED">Taxi / Hired Vehicle</option>
                <option value="TRAIN">Train (AC 2-Tier/3-Tier)</option>
                <option value="BUS">State Express Bus</option>
                <option value="AUTO_LOCAL">Auto / Local Rickshaw</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-foreground">Distance Traveled (Km)</label>
              <input
                type="number"
                min="0"
                value={entry.distanceKm}
                onChange={(e) => handleChange('distanceKm', Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-epfo-accent outline-none font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-foreground">Order / Letter Ref No.</label>
              <input
                type="text"
                placeholder="Reference directive number"
                value={entry.orderRef}
                onChange={(e) => handleChange('orderRef', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-epfo-accent outline-none font-mono"
              />
            </div>
          </div>

          {/* Remarks */}
          <div className="space-y-1">
            <label className="font-bold text-foreground">Inspection Remarks & Key Findings</label>
            <textarea
              rows={2}
              placeholder="Record worker count verified, Form 11 notice issued, or Section 7A dues discussion..."
              value={entry.remarks}
              onChange={(e) => handleChange('remarks', e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-epfo-accent outline-none"
            />
          </div>
        </div>
      )}

      {/* Camera Capture Modal */}
      <CameraUploadModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapturePhoto={handleCapturePhoto}
      />
    </div>
  );
};
