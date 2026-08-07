import React, { useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  FileText,
  PhoneCall,
  Upload,
  Navigation,
  History,
  Copy,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Check,
  MapPin
} from 'lucide-react';
import { InspectionLogItem } from '@/types';
import { formatDate } from '@/lib/utils';
import { QuickActionModal } from '@/components/dashboard/QuickActionModal';
import { EstablishmentProfileModal } from '@/components/establishments/EstablishmentProfileModal';

interface EditableVisitTableProps {
  inspections: InspectionLogItem[];
  onAddInspection: (insp: Omit<InspectionLogItem, 'id'>) => void;
  onUpdateInspection: (insp: InspectionLogItem) => void;
  onDeleteInspection: (id: string) => void;
}

export const EditableVisitTable: React.FC<EditableVisitTableProps> = ({
  inspections,
  onAddInspection,
  onUpdateInspection,
  onDeleteInspection,
}) => {
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<InspectionLogItem>>({});
  
  // Sort State
  const [sortField, setSortField] = useState<'date' | 'establishmentName' | 'location' | 'distanceKm'>('date');
  const [sortAsc, setSortAsc] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Modal Triggers
  const [activeModalType, setActiveModalType] = useState<'RECOVERY' | 'CALL' | 'DOCUMENT' | null>(null);
  const [profileModalEst, setProfileModalEst] = useState<any | null>(null);

  // Sort Handler
  const handleSort = (field: 'date' | 'establishmentName' | 'location' | 'distanceKm') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const sortedList = [...inspections].sort((a, b) => {
    let valA = (sortField === 'date' ? (a.date || a.visitDate) : (a as any)[sortField]) || '';
    let valB = (sortField === 'date' ? (b.date || b.visitDate) : (b as any)[sortField]) || '';

    if (typeof valA === 'string') valA = valA.toLowerCase();
    if (typeof valB === 'string') valB = valB.toLowerCase();

    if (valA < valB) return sortAsc ? -1 : 1;
    if (valA > valB) return sortAsc ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedList.length / itemsPerPage) || 1;
  const paginatedList = sortedList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Trigger 1: Add New Row Directly
  const handleAddNewRow = () => {
    const newRow: Omit<InspectionLogItem, 'id'> = {
      tourId: 'tour-1',
      date: new Date().toISOString().split('T')[0],
      establishmentCode: 'OR/NEW',
      establishmentName: 'New Establishment Visit',
      location: 'Cuttack Station',
      inspectionPurpose: 'Compliance Audit Verification',
      observations: 'Inspected attendance records & ECR return filings.',
      status: 'CONDUCTED',
      distanceKm: 25,
      conveyanceMode: 'Own Car',
    };
    onAddInspection(newRow);
  };

  // Trigger 2: Edit Row Toggle
  const handleStartEdit = (item: InspectionLogItem) => {
    setEditingRowId(item.id);
    setEditFormData({ ...item });
  };

  // Trigger 3: Save Inline Row Edits
  const handleSaveEdit = (id: string) => {
    if (editFormData && editingRowId === id) {
      onUpdateInspection(editFormData as InspectionLogItem);
      setEditingRowId(null);
      setEditFormData({});
    }
  };

  // Trigger 5: Print / Export PDF
  const handleExportPDF = () => {
    window.print();
  };

  // Trigger 8: Navigate / Map Directions
  const handleNavigateMap = (location: string) => {
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
    window.open(mapsUrl, '_blank');
  };

  // Trigger 10: Duplicate Row
  const handleDuplicateRow = (item: InspectionLogItem) => {
    const duplicated: Omit<InspectionLogItem, 'id'> = {
      tourId: item.tourId,
      date: item.date || item.visitDate || new Date().toISOString().split('T')[0],
      establishmentCode: item.establishmentCode,
      establishmentName: `${item.establishmentName} (Copy)`,
      location: item.location,
      inspectionPurpose: item.inspectionPurpose,
      observations: item.observations,
      status: item.status,
      distanceKm: item.distanceKm,
      conveyanceMode: item.conveyanceMode,
    };
    onAddInspection(duplicated);
  };

  return (
    <div className="space-y-4">
      {/* Action Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-card border border-border/80 shadow-sm">
        <div>
          <h3 className="text-sm font-bold text-foreground">Inline-Editable Inspection Visit Table</h3>
          <p className="text-xs text-muted-foreground">
            Sort, paginate, edit rows inline, clone visits, export PDFs, and launch location maps.
          </p>
        </div>

        {/* Action Trigger 1: Add New Row Button */}
        <button
          onClick={handleAddNewRow}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-epfo-navy hover:bg-epfo-blue text-white font-bold text-xs shadow-md transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4 text-epfo-accent" />
          <span>+ Add Visit Row</span>
        </button>
      </div>

      {/* Modern Table Container with Sticky Header */}
      <div className="rounded-2xl bg-card border border-border/80 shadow-md overflow-hidden">
        <div className="max-h-[600px] overflow-y-auto overflow-x-auto custom-scrollbar relative">
          <table className="w-full text-xs text-left border-collapse">
            {/* Sticky Header Row */}
            <thead className="sticky top-0 z-20 bg-background/95 backdrop-blur-md border-b border-border text-muted-foreground font-bold shadow-sm">
              <tr>
                <th className="py-3 px-3.5 cursor-pointer hover:text-foreground" onClick={() => handleSort('date')}>
                  <div className="flex items-center gap-1">
                    <span>Date</span>
                    <ArrowUpDown className="w-3 h-3 text-epfo-accent" />
                  </div>
                </th>
                <th className="py-3 px-3.5 cursor-pointer hover:text-foreground" onClick={() => handleSort('establishmentName')}>
                  <div className="flex items-center gap-1">
                    <span>Establishment Code & Name</span>
                    <ArrowUpDown className="w-3 h-3 text-epfo-accent" />
                  </div>
                </th>
                <th className="py-3 px-3.5 cursor-pointer hover:text-foreground" onClick={() => handleSort('location')}>
                  <div className="flex items-center gap-1">
                    <span>Station / Location</span>
                    <ArrowUpDown className="w-3 h-3 text-epfo-accent" />
                  </div>
                </th>
                <th className="py-3 px-3.5 cursor-pointer hover:text-foreground" onClick={() => handleSort('distanceKm')}>
                  <div className="flex items-center gap-1">
                    <span>Distance</span>
                    <ArrowUpDown className="w-3 h-3 text-epfo-accent" />
                  </div>
                </th>
                <th className="py-3 px-3.5">Purpose & Key Findings</th>
                <th className="py-3 px-3.5 text-center min-w-[280px]">10 Row Action Triggers</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border/60">
              {paginatedList.map((item) => {
                const isEditing = editingRowId === item.id;
                return (
                  <tr key={item.id} className="hover:bg-muted/20 transition-colors group">
                    {/* Date Cell */}
                    <td className="py-3 px-3.5 font-mono text-[11px]">
                      {isEditing ? (
                        <input
                          type="date"
                          value={editFormData.date || editFormData.visitDate || ''}
                          onChange={(e) => setEditFormData({ ...editFormData, date: e.target.value })}
                          className="px-2 py-1 rounded bg-background border border-border outline-none"
                        />
                      ) : (
                        <span className="font-semibold text-foreground">
                          {formatDate(item.date || item.visitDate || new Date())}
                        </span>
                      )}
                    </td>

                    {/* Establishment Code & Name Cell */}
                    <td className="py-3 px-3.5">
                      {isEditing ? (
                        <div className="space-y-1">
                          <input
                            type="text"
                            value={editFormData.establishmentCode || ''}
                            onChange={(e) => setEditFormData({ ...editFormData, establishmentCode: e.target.value.toUpperCase() })}
                            className="w-full px-2 py-1 rounded bg-background border border-border font-mono font-bold outline-none"
                          />
                          <input
                            type="text"
                            value={editFormData.establishmentName || ''}
                            onChange={(e) => setEditFormData({ ...editFormData, establishmentName: e.target.value })}
                            className="w-full px-2 py-1 rounded bg-background border border-border font-semibold outline-none"
                          />
                        </div>
                      ) : (
                        <div>
                          <div className="font-extrabold text-foreground">{item.establishmentName}</div>
                          <span className="font-mono text-[10px] bg-epfo-navy/10 text-epfo-navy dark:text-epfo-slate px-1.5 py-0.5 rounded font-bold inline-block mt-0.5">
                            {item.establishmentCode}
                          </span>
                        </div>
                      )}
                    </td>

                    {/* Location Cell */}
                    <td className="py-3 px-3.5">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editFormData.location || ''}
                          onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
                          className="w-full px-2 py-1 rounded bg-background border border-border outline-none"
                        />
                      ) : (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-epfo-accent shrink-0" />
                          <span>{item.location}</span>
                        </div>
                      )}
                    </td>

                    {/* Distance Cell */}
                    <td className="py-3 px-3.5 font-mono">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editFormData.distanceKm || 0}
                          onChange={(e) => setEditFormData({ ...editFormData, distanceKm: Number(e.target.value) })}
                          className="w-20 px-2 py-1 rounded bg-background border border-border outline-none font-mono"
                        />
                      ) : (
                        <span className="font-bold text-foreground">{item.distanceKm || 0} KM</span>
                      )}
                    </td>

                    {/* Purpose Cell */}
                    <td className="py-3 px-3.5">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editFormData.inspectionPurpose || ''}
                          onChange={(e) => setEditFormData({ ...editFormData, inspectionPurpose: e.target.value })}
                          className="w-full px-2 py-1 rounded bg-background border border-border outline-none"
                        />
                      ) : (
                        <div>
                          <div className="font-semibold text-foreground text-[11px]">{item.inspectionPurpose}</div>
                          <div className="text-[10px] text-muted-foreground truncate max-w-xs">{item.observations}</div>
                        </div>
                      )}
                    </td>

                    {/* 10 Row Action Buttons Cell */}
                    <td className="py-3 px-3.5 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {/* Trigger 2 & 3: Edit / Save */}
                        {isEditing ? (
                          <button
                            onClick={() => handleSaveEdit(item.id)}
                            title="Save Row Edits"
                            className="p-1.5 rounded-lg bg-emerald-500 text-white shadow-sm transition-all"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleStartEdit(item)}
                            title="Edit Row Inline"
                            className="p-1.5 rounded-lg bg-muted hover:bg-epfo-navy hover:text-white transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {/* Trigger 4: Delete */}
                        <button
                          onClick={() => {
                            if (confirm(`Delete visit row for ${item.establishmentName}?`)) {
                              onDeleteInspection(item.id);
                            }
                          }}
                          title="Delete Row"
                          className="p-1.5 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        {/* Trigger 5: PDF Export */}
                        <button
                          onClick={handleExportPDF}
                          title="Print / Export PDF"
                          className="p-1.5 rounded-lg text-muted-foreground hover:bg-purple-500/10 hover:text-purple-600 transition-colors"
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </button>

                        {/* Trigger 6: Call */}
                        <button
                          onClick={() => setActiveModalType('CALL')}
                          title="Log Phone Call / Liaison"
                          className="p-1.5 rounded-lg text-muted-foreground hover:bg-blue-500/10 hover:text-blue-600 transition-colors"
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                        </button>

                        {/* Trigger 7: Upload Document */}
                        <button
                          onClick={() => setActiveModalType('DOCUMENT')}
                          title="Upload Attachment / Receipt"
                          className="p-1.5 rounded-lg text-muted-foreground hover:bg-amber-500/10 hover:text-amber-600 transition-colors"
                        >
                          <Upload className="w-3.5 h-3.5" />
                        </button>

                        {/* Trigger 8: Navigate Map */}
                        <button
                          onClick={() => handleNavigateMap(item.location)}
                          title="Open Location Directions Map"
                          className="p-1.5 rounded-lg text-muted-foreground hover:bg-emerald-500/10 hover:text-emerald-600 transition-colors"
                        >
                          <Navigation className="w-3.5 h-3.5" />
                        </button>

                        {/* Trigger 9: History Audit */}
                        <button
                          onClick={() =>
                            setProfileModalEst({
                              establishmentCode: item.establishmentCode,
                              name: item.establishmentName,
                              location: item.location,
                              district: 'Cuttack',
                              coverageStatus: 'COVERED',
                            })
                          }
                          title="View Historical Inspection Log"
                          className="p-1.5 rounded-lg text-muted-foreground hover:bg-indigo-500/10 hover:text-indigo-600 transition-colors"
                        >
                          <History className="w-3.5 h-3.5" />
                        </button>

                        {/* Trigger 10: Duplicate Row */}
                        <button
                          onClick={() => handleDuplicateRow(item)}
                          title="Clone / Duplicate Row"
                          className="p-1.5 rounded-lg text-muted-foreground hover:bg-epfo-accent/10 hover:text-epfo-accent transition-colors"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Table Footer with Pagination Controls */}
        <div className="p-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground bg-muted/20">
          <span>
            Showing {paginatedList.length} of {sortedList.length} Visit Entries (Page {currentPage} of {totalPages})
          </span>

          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              className="p-1.5 rounded-lg border border-border disabled:opacity-40 hover:bg-muted"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              className="p-1.5 rounded-lg border border-border disabled:opacity-40 hover:bg-muted"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Action Modals */}
      <QuickActionModal
        actionType={activeModalType}
        onClose={() => setActiveModalType(null)}
        onSubmitAction={(type) => alert(`Saved ${type} log successfully!`)}
      />

      <EstablishmentProfileModal
        establishment={profileModalEst}
        inspections={inspections}
        onClose={() => setProfileModalEst(null)}
      />
    </div>
  );
};
