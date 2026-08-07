import React, { useState, useRef } from 'react';
import {
  Building2,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Eye,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Building
} from 'lucide-react';
import { EstablishmentDTO, CoverageStatus, InspectionLogItem } from '@/types';
import { EstablishmentFormModal } from '@/components/establishments/EstablishmentFormModal';
import { EstablishmentProfileModal } from '@/components/establishments/EstablishmentProfileModal';

interface EstablishmentsProps {
  establishments: EstablishmentDTO[];
  inspections: InspectionLogItem[];
  onAddEstablishment: (est: Omit<EstablishmentDTO, 'id'>) => void;
  onUpdateEstablishment: (est: EstablishmentDTO) => void;
  onDeleteEstablishment: (id: string) => void;
  onImportEstablishments: (ests: Omit<EstablishmentDTO, 'id'>[]) => void;
}

export const Establishments: React.FC<EstablishmentsProps> = ({
  establishments,
  inspections,
  onAddEstablishment,
  onUpdateEstablishment,
  onDeleteEstablishment,
  onImportEstablishments,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [districtFilter, setDistrictFilter] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEstablishment, setEditingEstablishment] = useState<EstablishmentDTO | null>(null);
  const [viewingEstablishment, setViewingEstablishment] = useState<EstablishmentDTO | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter Logic
  const filtered = establishments.filter((e) => {
    const matchesSearch =
      e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.establishmentCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || e.coverageStatus === statusFilter;
    const matchesDistrict = districtFilter === 'ALL' || e.district.toLowerCase() === districtFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesDistrict;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // CSV Export Handler
  const handleExportCSV = () => {
    const headers = ['Establishment Code', 'Name', 'Location', 'District', 'Coverage Status', 'Industry Sector'];
    const rows = filtered.map((e) => [
      `"${e.establishmentCode}"`,
      `"${e.name.replace(/"/g, '""')}"`,
      `"${e.location.replace(/"/g, '""')}"`,
      `"${e.district}"`,
      `"${e.coverageStatus}"`,
      `"${e.industryType || ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `EPFO_Establishments_Master_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // CSV Import Handler
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n').filter((l) => l.trim().length > 0);
      const parsed: Omit<EstablishmentDTO, 'id'>[] = [];

      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(',').map((p) => p.replace(/^"|"$/g, '').trim());
        if (parts.length >= 3) {
          parsed.push({
            establishmentCode: parts[0] || `IMPORT-${Date.now()}-${i}`,
            name: parts[1] || 'Imported Establishment',
            location: parts[2] || 'Regional Jurisdiction',
            district: parts[3] || 'Cuttack',
            coverageStatus: (parts[4] as CoverageStatus) || 'COVERED',
            industryType: parts[5] || 'General Industry',
          });
        }
      }

      if (parsed.length > 0) {
        onImportEstablishments(parsed);
        alert(`Successfully imported ${parsed.length} establishment master records!`);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-foreground">Establishments Master Registry</h2>
          <p className="text-xs text-muted-foreground">
            Manage covered & eligible establishments, coverage statuses, inspection profiles, and district offices.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            accept=".csv"
            onChange={handleFileUpload}
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-card border border-border/80 hover:bg-muted text-xs font-semibold shadow-sm transition-all"
          >
            <Upload className="w-4 h-4 text-epfo-accent" />
            <span>Import CSV</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-card border border-border/80 hover:bg-muted text-xs font-semibold shadow-sm transition-all"
          >
            <Download className="w-4 h-4 text-emerald-500" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => {
              setEditingEstablishment(null);
              setIsFormOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-epfo-navy hover:bg-epfo-blue text-white font-bold text-xs shadow-md transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 text-epfo-accent" />
            <span>Register Establishment</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search code, establishment name, or station..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-background border border-border text-xs focus:ring-2 focus:ring-epfo-accent outline-none"
            />
          </div>

          {/* Coverage Status Filter */}
          <div className="relative">
            <Filter className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-background border border-border text-xs focus:ring-2 focus:ring-epfo-accent outline-none"
            >
              <option value="ALL">All Coverage Statuses</option>
              <option value="COVERED">Covered Sec 1(3)</option>
              <option value="UNCOVERED">Uncovered / Eligible</option>
              <option value="EXEMPTED">Exempted Estt</option>
              <option value="CLUSTER_HANDLOOM">PMVBRY Cluster / Handloom</option>
              <option value="GOVT_UNDERTAKING">Government Undertaking</option>
            </select>
          </div>

          {/* District Filter */}
          <div className="relative">
            <Building className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
            <select
              value={districtFilter}
              onChange={(e) => {
                setDistrictFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-background border border-border text-xs focus:ring-2 focus:ring-epfo-accent outline-none"
            >
              <option value="ALL">All District Offices</option>
              <option value="Cuttack">District Office, Cuttack</option>
              <option value="Jajpur">Jajpur District</option>
              <option value="Angul">Angul District</option>
              <option value="Nayagarh">Nayagarh District</option>
            </select>
          </div>
        </div>
      </div>

      {/* Establishments Data Table */}
      {paginated.length === 0 ? (
        <div className="p-12 text-center bg-card border border-dashed rounded-2xl space-y-3">
          <Building2 className="w-10 h-10 mx-auto text-muted-foreground stroke-1" />
          <h3 className="text-sm font-bold text-foreground">No Establishments Found</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Try adjusting your search criteria or register a new establishment record.
          </p>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-4 overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-muted-foreground font-bold">
                <th className="py-3 px-3">Estt Code</th>
                <th className="py-3 px-3">Establishment Name</th>
                <th className="py-3 px-3">District & Location</th>
                <th className="py-3 px-3">Coverage Status</th>
                <th className="py-3 px-3">Industry Sector</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {paginated.map((est) => (
                <tr key={est.id} className="hover:bg-muted/20 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-epfo-navy dark:text-epfo-slate">
                    {est.establishmentCode}
                  </td>
                  <td className="py-3 px-3 font-semibold text-foreground">{est.name}</td>
                  <td className="py-3 px-3">
                    <span className="font-bold text-foreground">{est.district}</span>
                    <span className="text-muted-foreground block text-[11px]">{est.location}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                      {est.coverageStatus}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-muted-foreground">{est.industryType || 'N/A'}</td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setViewingEstablishment(est)}
                        title="View Profile & History"
                        className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500 text-blue-600 hover:text-white transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          setEditingEstablishment(est);
                          setIsFormOpen(true);
                        }}
                        title="Edit Record"
                        className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500 text-amber-600 hover:text-white transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete establishment profile for ${est.name}?`)) {
                            onDeleteEstablishment(est.id);
                          }
                        }}
                        title="Delete Record"
                        className="p-1.5 rounded-lg bg-destructive/10 hover:bg-destructive text-destructive hover:text-white transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Showing {paginated.length} of {filtered.length} Establishments (Page {currentPage} of {totalPages})
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
      )}

      {/* Modals */}
      <EstablishmentFormModal
        isOpen={isFormOpen}
        establishment={editingEstablishment}
        onClose={() => {
          setIsFormOpen(false);
          setEditingEstablishment(null);
        }}
        onSave={(data) => {
          if ('id' in data) {
            onUpdateEstablishment(data as EstablishmentDTO);
          } else {
            onAddEstablishment(data);
          }
        }}
      />

      <EstablishmentProfileModal
        establishment={viewingEstablishment}
        inspections={inspections}
        onClose={() => setViewingEstablishment(null)}
      />
    </div>
  );
};
