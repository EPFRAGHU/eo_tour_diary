import React, { useState, useEffect } from 'react';
import { Plus, Send, CheckCircle2, CalendarDays, FileSpreadsheet } from 'lucide-react';
import { DailyDiaryEntryForm, DailyVisitEntry } from './DailyDiaryEntryForm';
import { exportTourDiaryToExcel } from '@/lib/excelExport';

interface TourDiaryFormBuilderProps {
  initialEntries?: DailyVisitEntry[];
  onSaveDraft?: (entries: DailyVisitEntry[]) => void;
  onSubmitDiary: (title: string, month: number, year: number, entries: DailyVisitEntry[]) => void;
  onCancel?: () => void;
}

export const TourDiaryFormBuilder: React.FC<TourDiaryFormBuilderProps> = ({
  initialEntries,
  onSubmitDiary,
  onCancel,
}) => {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const [month, setMonth] = useState(currentMonth);
  const [year, setYear] = useState(currentYear);
  const [title, setTitle] = useState(`Monthly Tour Diary - ${new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}`);

  const [entries, setEntries] = useState<DailyVisitEntry[]>(() => {
    if (initialEntries && initialEntries.length > 0) return initialEntries;

    // Check localStorage auto-save draft
    const savedDraft = localStorage.getItem('tour_diary_draft');
    if (savedDraft) {
      try {
        return JSON.parse(savedDraft);
      } catch {
        // Fallback to default sample entry
      }
    }

    return [
      {
        id: `entry-${Date.now()}-1`,
        visitDate: new Date().toISOString().split('T')[0],
        dayType: 'TOUR_DAY',
        establishmentName: 'M/s Jindal Stainless Steel Ltd',
        establishmentCode: 'OR/BBS/6276',
        location: 'Danagadi, Jajpur',
        durationDays: 1,
        purpose: 'PMVBRY campaigning & 14B damages check',
        orderRef: 'Comp.Audit/Exempted Est./2024-25/818',
        distanceKm: 105,
        conveyanceMode: 'Own Car',
        vehicleDetails: 'Own car accompanied with Sh. M.R. Mohapatra, E.O',
        hotelStayed: true,
        hotelName: 'Hotel Jajpur Residency',
        hotelDays: 1,
        hotelAmount: 1200,
        reportSubmittedRef: 'OR/DO/CTC/Compliance/2026/810',
        remarks: 'May be allowed to take own car',
      },
    ];
  });

  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const [lastAutoSaved, setLastAutoSaved] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, Record<string, string>>>({});

  // Auto-Save Engine (Saves draft to localStorage every 2 seconds after edit)
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('tour_diary_draft', JSON.stringify(entries));
      const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setLastAutoSaved(now);
    }, 1500);

    return () => clearTimeout(timer);
  }, [entries]);

  // Add new blank visit entry
  const handleAddEntry = () => {
    const newEntry: DailyVisitEntry = {
      id: `entry-${Date.now()}-${entries.length + 1}`,
      visitDate: new Date().toISOString().split('T')[0],
      dayType: 'TOUR_DAY',
      establishmentName: '',
      establishmentCode: '',
      location: '',
      durationDays: 1,
      purpose: '',
      orderRef: '',
      distanceKm: 0,
      conveyanceMode: 'Own Car',
      vehicleDetails: '',
      hotelStayed: false,
      hotelName: '',
      hotelDays: 1,
      hotelAmount: 0,
      reportSubmittedRef: '',
      remarks: '',
    };
    const updated = [...entries, newEntry];
    setEntries(updated);
    setExpandedIndex(updated.length - 1);
  };

  // Update specific entry
  const handleUpdateEntry = (index: number, updated: DailyVisitEntry) => {
    const newEntries = [...entries];
    newEntries[index] = updated;
    setEntries(newEntries);
  };

  // Remove specific entry
  const handleRemoveEntry = (index: number) => {
    if (entries.length === 1) {
      alert('A monthly diary must contain at least one visit entry.');
      return;
    }
    const filtered = entries.filter((_, i) => i !== index);
    setEntries(filtered);
    setExpandedIndex(0);
  };

  // Validate form entries
  const validateForm = (): boolean => {
    const errorsMap: Record<string, Record<string, string>> = {};
    let isValid = true;

    entries.forEach((entry) => {
      const entryErrors: Record<string, string> = {};

      if (!entry.visitDate) {
        entryErrors.visitDate = 'Visit date is required';
        isValid = false;
      }
      if (entry.dayType === 'TOUR_DAY' && !entry.establishmentName) {
        entryErrors.establishmentName = 'Establishment name is required for field visits';
        isValid = false;
      }

      if (Object.keys(entryErrors).length > 0) {
        errorsMap[entry.id] = entryErrors;
      }
    });

    setValidationErrors(errorsMap);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      alert('Please correct the validation errors in your daily diary entries before submitting.');
      return;
    }

    onSubmitDiary(title, Number(month), Number(year), entries);
    localStorage.removeItem('tour_diary_draft');
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Auto-Save Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-card border border-border/80 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-epfo-accent" />
            <h2 className="text-base font-extrabold text-foreground">Monthly Daily Tour Diary Builder</h2>
          </div>
          <p className="text-xs text-muted-foreground">
            Convert daily inspection visits, travel details, and hotel stays into a validated official tour diary.
          </p>
        </div>

        {/* Auto-Save Engine Indicator */}
        <div className="flex items-center gap-3">
          {lastAutoSaved && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold border border-emerald-500/20">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Draft Auto-Saved ({lastAutoSaved})</span>
            </div>
          )}

          <button
            type="button"
            onClick={handleAddEntry}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-epfo-navy hover:bg-epfo-blue text-white font-bold text-xs shadow-md transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 text-epfo-accent" />
            <span>+ Add Visit Entry</span>
          </button>
        </div>
      </div>

      {/* Diary Header Meta Form */}
      <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="space-y-1 sm:col-span-2">
            <label className="font-bold text-foreground">Diary Schedule Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-epfo-accent outline-none font-bold"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="font-bold text-foreground">Month *</label>
              <select
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-epfo-accent outline-none"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {new Date(2026, i, 1).toLocaleString('en-IN', { month: 'long' })}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-foreground">Year *</label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-epfo-accent outline-none font-mono"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Multi-Entry Form Cards Accordion */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-3">
          {entries.map((entry, idx) => (
            <DailyDiaryEntryForm
              key={entry.id}
              entry={entry}
              index={idx}
              isExpanded={expandedIndex === idx}
              onToggleExpand={() => setExpandedIndex(expandedIndex === idx ? null : idx)}
              onChange={(updated) => handleUpdateEntry(idx, updated)}
              onRemove={() => handleRemoveEntry(idx)}
              errors={validationErrors[entry.id]}
            />
          ))}
        </div>

        {/* Bottom Submission & Action Bar */}
        <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-md flex items-center justify-between gap-4">
          <div className="text-xs text-muted-foreground font-mono">
            Total Visit Entries: <span className="font-bold text-foreground">{entries.length}</span> |
            Total Distance: <span className="font-bold text-epfo-accent">{entries.reduce((acc, e) => acc + (e.distanceKm || 0), 0)} KM</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => exportTourDiaryToExcel({ entries, month: 8, year: 2026 })}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-card border border-border hover:bg-muted text-foreground text-xs font-bold shadow-sm transition-all"
              title="Download Current Draft Tour Diary in Excel (.xls)"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
              <span>Export Draft (.xls)</span>
            </button>

            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 rounded-xl border border-border font-semibold text-xs hover:bg-muted"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-epfo-navy hover:bg-epfo-blue text-white font-bold text-xs shadow-md transition-all active:scale-95"
            >
              <Send className="w-4 h-4 text-epfo-accent" />
              <span>Submit Tour Diary for APFC Approval</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
