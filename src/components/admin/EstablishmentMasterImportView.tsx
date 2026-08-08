import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileSpreadsheet,
  Download,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Database,
  RefreshCw,
  Search,
  Check,
  Edit2,
  Trash2,
  Sparkles,
  Info
} from 'lucide-react';
import { EstablishmentDTO, CoverageStatus, ExtendedUserProfile } from '@/types';
import { formatOdishaEstCode, ODISHA_DISTRICTS } from '@/lib/utils';
import { logUserActivity, DEFAULT_SUPER_ADMIN } from '@/lib/userStorage';

interface StagedRecord {
  id: string;
  establishmentCode: string;
  originalCode: string;
  name: string;
  location: string;
  district: string;
  coverageStatus: CoverageStatus;
  industryType?: string;
  primaryContact?: string;
  contactPhone?: string;
  contactEmail?: string;
  totalEmployees?: number;
  status: 'VALID' | 'WARNING' | 'ERROR' | 'EXISTING_UPDATE';
  validationMessage?: string;
  selected: boolean;
}

interface EstablishmentMasterImportViewProps {
  establishments: EstablishmentDTO[];
  onImportEstablishments: (imported: Omit<EstablishmentDTO, 'id'>[]) => void;
  onAddEstablishment?: (est: Omit<EstablishmentDTO, 'id'>) => void;
  onUpdateEstablishment?: (est: EstablishmentDTO) => void;
  onDeleteEstablishment?: (id: string) => void;
  currentUser?: ExtendedUserProfile;
}

const SAMPLE_ODISHA_ESTABLISHMENTS_CSV = `Establishment Code,Establishment Name,Location / Address,District,Coverage Status,Industry Sector,Primary Contact,Contact Phone,Contact Email,PF Beneficiaries
OR/BBS/0006276/000,M/s Jindal Stainless Steel Ltd,Kalinganagar Industrial Complex Danagadi,Jajpur,COVERED,Manufacturing / Metallurgy,Shri A. K. Patnaik,9437012345,compliance@jindalstainless.com,4500
OR/BBS/0001238/000,M/s Bhimtanagar Sukinda Chromite Mines,Sukinda Valley PO Kaliapani,Jajpur,EXEMPTED,Mining & Extraction,Ms. Sunita Jena,9437098765,hr@sukindamines.co.in,1820
OR/BBS/0005077/000,M/s NTPC Kanhia Thermal Power Plant,Kanhia Stage II Deepshikha,Angul,COVERED,Power Generation & Energy,Shri B. C. Mohanty,9861054321,admin@ntpckaniha.gov.in,3200
OR/BBS/0016917/024,M/s Executive Engineer Mahanadi South Division,Jobra Irrigation Colony,Cuttack,GOVT_UNDERTAKING,Public Works / Irrigation,Shri P. K. Das,9437112233,ee.mahanadi@odisha.gov.in,640
OR/BBS/0045231/000,Apex Logistics & Freight India Pvt Ltd,Plot 14 Choudwar Industrial Estate,Cuttack,COVERED,Logistics & Warehousing,Shri Rakesh Sahu,9777123456,contact@apexlogistics.in,210
OR/BBS/0088210/000,Tata Steel Meramandali Cold Rolling Plant,Narendrapur Hindol Road,Dhenkanal,COVERED,Steel & Heavy Engineering,Shri S. K. Mishra,9438001122,hr.dhenkanal@tatasteel.com,5100
OR/BBS/0099412/000,NALCO Smelter & Captive Power Plant,Nalco Nagar Angul Township,Angul,EXEMPTED,Aluminium & Smelting,Shri D. K. Panda,9437009988,compliance@nalcoindia.co.in,6800
OR/BBS/0034190/000,Bhubaneswar Smart City IT Park Infra Pvt Ltd,Infocity Chandaka Industrial Area,Khordha,COVERED,Information Technology & Services,Ms. Ananya Ray,9861112233,hr@smartcityitpark.com,1450
OR/BBS/0071250/000,Puri Jagannath Handloom Weavers Cooperative,Grand Road Badadanda,Puri,CLUSTER_HANDLOOM,Textiles & Handlooms,Shri Jagannath Behera,9437334455,weavers.puri@odishahandloom.org,380
OR/BBS/0022450/000,Indian Oil Corporation Limited Paradip Refinery,Refinery Complex PO Trilochanpur,Jagatsinghpur,COVERED,Petroleum & Refining,Shri R. N. Senapati,9437887766,refinery.paradip@iocl.co.in,4900`;

export const EstablishmentMasterImportView: React.FC<EstablishmentMasterImportViewProps> = ({
  establishments,
  onImportEstablishments,
  currentUser,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<string | null>(null);
  const [stagedRecords, setStagedRecords] = useState<StagedRecord[]>([]);
  const [importStrategy, setImportStrategy] = useState<'MERGE_UPSERT' | 'SKIP_DUPLICATES' | 'REPLACE_ALL'>('MERGE_UPSERT');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'VALID' | 'WARNING' | 'EXISTING_UPDATE' | 'ERROR'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<StagedRecord>>({});
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'upload' | 'explorer'>('upload');
  const [explorerSearch, setExplorerSearch] = useState('');
  const [explorerDistrict, setExplorerDistrict] = useState('ALL');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  // Helper to parse CSV text
  const parseCSVContent = (content: string, sourceName: string) => {
    try {
      const lines = content.split(/\r?\n/).filter((line) => line.trim().length > 0);
      if (lines.length <= 1) {
        showNotification('error', 'CSV file appears to be empty or has only headers.');
        return;
      }

      // Check header line
      const headerLine = lines[0];
      const headers = parseCSVLine(headerLine).map((h) => h.toLowerCase().replace(/[^a-z0-9]/g, ''));

      // Map column indexes
      const codeIdx = headers.findIndex((h) => h.includes('code') || h.includes('estcode') || h.includes('epfo') || h.includes('id'));
      const nameIdx = headers.findIndex((h) => h.includes('name') || h.includes('company') || h.includes('establishment') || h.includes('employer'));
      const locIdx = headers.findIndex((h) => h.includes('location') || h.includes('address') || h.includes('area') || h.includes('place'));
      const distIdx = headers.findIndex((h) => h.includes('district') || h.includes('dist') || h.includes('zone'));
      const covIdx = headers.findIndex((h) => h.includes('coverage') || h.includes('status') || h.includes('type') || h.includes('category'));
      const indIdx = headers.findIndex((h) => h.includes('industry') || h.includes('sector') || h.includes('business'));
      const contactIdx = headers.findIndex((h) => h.includes('contact') || h.includes('person') || h.includes('hr'));
      const phoneIdx = headers.findIndex((h) => h.includes('phone') || h.includes('mobile') || h.includes('tel'));
      const emailIdx = headers.findIndex((h) => h.includes('email') || h.includes('mail'));
      const empIdx = headers.findIndex((h) => h.includes('beneficiar') || h.includes('emp') || h.includes('headcount') || h.includes('worker'));

      const existingCodes = new Set(establishments.map((e) => e.establishmentCode.toUpperCase().trim()));

      const parsed: StagedRecord[] = [];

      for (let i = 1; i < lines.length; i++) {
        const row = parseCSVLine(lines[i]);
        if (row.length === 0 || row.every((c) => !c.trim())) continue;

        const rawCode = (codeIdx !== -1 && row[codeIdx]) ? row[codeIdx].trim() : `IMP-${Date.now()}-${i}`;
        const rawName = (nameIdx !== -1 && row[nameIdx]) ? row[nameIdx].trim() : (row[1] || `Establishment #${i}`);
        const rawLoc = (locIdx !== -1 && row[locIdx]) ? row[locIdx].trim() : (row[2] || 'Odisha Region');
        const rawDist = (distIdx !== -1 && row[distIdx]) ? row[distIdx].trim() : (row[3] || 'Cuttack');
        const rawCov = (covIdx !== -1 && row[covIdx]) ? row[covIdx].trim().toUpperCase() : 'COVERED';
        const rawInd = (indIdx !== -1 && row[indIdx]) ? row[indIdx].trim() : 'General Industry';
        const rawContact = contactIdx !== -1 && row[contactIdx] ? row[contactIdx].trim() : undefined;
        const rawPhone = phoneIdx !== -1 && row[phoneIdx] ? row[phoneIdx].trim() : undefined;
        const rawEmail = emailIdx !== -1 && row[emailIdx] ? row[emailIdx].trim() : undefined;
        const rawEmp = empIdx !== -1 && row[empIdx] ? parseInt(row[empIdx].replace(/[^0-9]/g, '')) || undefined : undefined;

        // Normalize coverage status
        let normalizedCoverage: CoverageStatus = 'COVERED';
        if (rawCov.includes('EXEMPT')) normalizedCoverage = 'EXEMPTED';
        else if (rawCov.includes('UNCOVER')) normalizedCoverage = 'UNCOVERED';
        else if (rawCov.includes('HANDLOOM') || rawCov.includes('CLUSTER')) normalizedCoverage = 'CLUSTER_HANDLOOM';
        else if (rawCov.includes('GOVT') || rawCov.includes('UNDERTAKING')) normalizedCoverage = 'GOVT_UNDERTAKING';

        // Format establishment code with Odisha prefix
        const formattedCode = formatOdishaEstCode(rawCode, rawDist);

        // Validation assessment
        let status: 'VALID' | 'WARNING' | 'EXISTING_UPDATE' | 'ERROR' = 'VALID';
        let validationMessage = 'Record ready for master staging.';

        const isDuplicate = existingCodes.has(formattedCode.toUpperCase());

        if (isDuplicate) {
          status = 'EXISTING_UPDATE';
          validationMessage = 'Establishment code already exists in master registry. Will be updated.';
        } else if (!rawName || rawName.length < 3) {
          status = 'WARNING';
          validationMessage = 'Establishment name is very short or missing.';
        } else if (!rawLoc || rawLoc.length < 2) {
          status = 'WARNING';
          validationMessage = 'Location address detail is sparse.';
        }

        parsed.push({
          id: `staged-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 4)}`,
          establishmentCode: formattedCode,
          originalCode: rawCode,
          name: rawName,
          location: rawLoc,
          district: rawDist,
          coverageStatus: normalizedCoverage,
          industryType: rawInd,
          primaryContact: rawContact,
          contactPhone: rawPhone,
          contactEmail: rawEmail,
          totalEmployees: rawEmp,
          status,
          validationMessage,
          selected: true,
        });
      }

      setStagedRecords(parsed);
      setFileName(sourceName);
      showNotification('success', `Parsed ${parsed.length} establishment master records from ${sourceName}.`);
    } catch (err: any) {
      showNotification('error', `Failed to parse file: ${err.message || 'Invalid format'}`);
    }
  };

  // Helper for parsing CSV lines with quote support
  const parseCSVLine = (text: string): string[] => {
    const result: string[] = [];
    let cur = '';
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (char === '"') {
        if (inQuotes && text[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        result.push(cur.trim());
        cur = '';
      } else {
        cur += char;
      }
    }
    result.push(cur.trim());
    return result;
  };

  // File drop handler
  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      processUploadedFile(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      processUploadedFile(file);
    }
  };

  const processUploadedFile = (file: File) => {
    setFileName(file.name);
    setFileSize(`${(file.size / 1024).toFixed(1)} KB`);

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        parseCSVContent(content, file.name);
      }
    };
    reader.readAsText(file);
  };

  // Load sample dataset
  const handleLoadSampleData = () => {
    parseCSVContent(SAMPLE_ODISHA_ESTABLISHMENTS_CSV, 'EPFO_Odisha_Standard_Master_Sample.csv');
    setFileSize('2.4 KB');
  };

  // Download official CSV template
  const handleDownloadTemplate = () => {
    const blob = new Blob([SAMPLE_ODISHA_ESTABLISHMENTS_CSV], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `EPFO_Establishment_Master_Official_Template_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showNotification('success', 'Downloaded standard EPFO Odisha Establishment Master Template.');
  };

  // Toggle selection
  const handleToggleSelectAll = (checked: boolean) => {
    setStagedRecords(stagedRecords.map((r) => ({ ...r, selected: checked })));
  };

  const handleToggleSelectRow = (id: string) => {
    setStagedRecords(stagedRecords.map((r) => (r.id === id ? { ...r, selected: !r.selected } : r)));
  };

  const handleDeleteStagedRow = (id: string) => {
    setStagedRecords(stagedRecords.filter((r) => r.id !== id));
  };

  // Start inline editing
  const handleStartEdit = (record: StagedRecord) => {
    setEditingId(record.id);
    setEditFormData({ ...record });
  };

  const handleSaveEdit = (id: string) => {
    setStagedRecords(
      stagedRecords.map((r) => {
        if (r.id === id) {
          const updated = { ...r, ...editFormData } as StagedRecord;
          updated.establishmentCode = formatOdishaEstCode(updated.establishmentCode, updated.district);
          return updated;
        }
        return r;
      })
    );
    setEditingId(null);
    setEditFormData({});
    showNotification('info', 'Record updated in staging grid.');
  };

  // Final Commit to Master Registry
  const handleCommitImport = () => {
    const selected = stagedRecords.filter((r) => r.selected);
    if (selected.length === 0) {
      showNotification('error', 'Please select at least one record to import.');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      try {
        let finalToImport: Omit<EstablishmentDTO, 'id'>[] = [];

        if (importStrategy === 'SKIP_DUPLICATES') {
          finalToImport = selected
            .filter((r) => r.status !== 'EXISTING_UPDATE')
            .map((r) => ({
              establishmentCode: r.establishmentCode,
              name: r.name,
              location: r.location,
              district: r.district,
              coverageStatus: r.coverageStatus,
              industryType: r.industryType,
            }));
        } else {
          // MERGE_UPSERT or REPLACE_ALL
          finalToImport = selected.map((r) => ({
            establishmentCode: r.establishmentCode,
            name: r.name,
            location: r.location,
            district: r.district,
            coverageStatus: r.coverageStatus,
            industryType: r.industryType,
          }));
        }

        onImportEstablishments(finalToImport);

        // Audit Trail Logging
        logUserActivity({
          userId: currentUser?.id || 'super-admin',
          userEmail: currentUser?.email || DEFAULT_SUPER_ADMIN.email,
          performedBy: currentUser?.email || DEFAULT_SUPER_ADMIN.email,
          action: 'ESTABLISHMENT_MASTER_BULK_IMPORTED',
          module: 'Establishments',
          recordId: `imp-${Date.now()}`,
          remarks: `Bulk imported ${finalToImport.length} establishment master records via CSV (${fileName || 'Manual Upload'}) with strategy ${importStrategy}.`,
          ipAddress: '192.168.1.153',
          success: true,
        });

        setIsProcessing(false);
        setStagedRecords([]);
        setFileName(null);
        showNotification('success', `Successfully integrated ${finalToImport.length} establishments into the Master Registry!`);
        setActiveTab('explorer');
      } catch (err: any) {
        setIsProcessing(false);
        showNotification('error', `Failed to commit records: ${err.message || 'Error occurred'}`);
      }
    }, 600);
  };

  // Filtered records in staging
  const filteredStaged = stagedRecords.filter((r) => {
    const matchesFilter =
      filterStatus === 'ALL' ||
      (filterStatus === 'VALID' && r.status === 'VALID') ||
      (filterStatus === 'WARNING' && r.status === 'WARNING') ||
      (filterStatus === 'EXISTING_UPDATE' && r.status === 'EXISTING_UPDATE') ||
      (filterStatus === 'ERROR' && r.status === 'ERROR');

    const matchesSearch =
      !searchQuery ||
      r.establishmentCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.district.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  // Summary counts
  const validCount = stagedRecords.filter((r) => r.status === 'VALID').length;
  const updateCount = stagedRecords.filter((r) => r.status === 'EXISTING_UPDATE').length;
  const warningCount = stagedRecords.filter((r) => r.status === 'WARNING').length;
  const selectedCount = stagedRecords.filter((r) => r.selected).length;

  // Filtered live explorer
  const filteredLive = establishments.filter((e) => {
    const matchesSearch =
      !explorerSearch ||
      e.establishmentCode.toLowerCase().includes(explorerSearch.toLowerCase()) ||
      e.name.toLowerCase().includes(explorerSearch.toLowerCase()) ||
      e.location.toLowerCase().includes(explorerSearch.toLowerCase());

    const matchesDistrict = explorerDistrict === 'ALL' || e.district.toLowerCase() === explorerDistrict.toLowerCase();

    return matchesSearch && matchesDistrict;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-2xl border shadow-xl flex items-center gap-3 text-xs font-bold animate-in fade-in slide-in-from-top-4 ${
            toast.type === 'success'
              ? 'bg-emerald-500 text-white border-emerald-600'
              : toast.type === 'error'
              ? 'bg-red-500 text-white border-red-600'
              : 'bg-epfo-navy text-white border-epfo-dark'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : toast.type === 'error' ? (
            <XCircle className="w-5 h-5" />
          ) : (
            <Info className="w-5 h-5" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-epfo-navy to-slate-900 text-white border border-white/10 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-epfo-accent/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
              <UploadCloud className="w-7 h-7 text-epfo-accent" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black tracking-tight">Establishment Master Bulk Ingestion Engine</h2>
                <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase bg-epfo-accent text-epfo-navy rounded-full">
                  SUPER ADMIN PORTAL
                </span>
              </div>
              <p className="text-xs text-white/70 mt-1">
                Batch import, validate, auto-format Odisha/Bhubaneswar codes (OR/BBS/...), resolve duplicates, and sync with live EPFO registries.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleDownloadTemplate}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white transition-all flex items-center gap-2 shadow-sm"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Download Official CSV Template</span>
            </button>

            <button
              onClick={handleLoadSampleData}
              className="px-3.5 py-2 rounded-xl bg-epfo-accent hover:bg-amber-400 text-epfo-navy text-xs font-bold transition-all flex items-center gap-2 shadow-md"
            >
              <Sparkles className="w-4 h-4" />
              <span>Load 10 Odisha Sample Records</span>
            </button>
          </div>
        </div>

        {/* Quick Tabs in Header */}
        <div className="flex items-center gap-2 mt-6 border-t border-white/10 pt-4">
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'upload'
                ? 'bg-white text-epfo-navy shadow-md'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>CSV / Excel Ingestion & Staging ({stagedRecords.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('explorer')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'explorer'
                ? 'bg-white text-epfo-navy shadow-md'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Live Master Registry Explorer ({establishments.length})</span>
          </button>
        </div>
      </div>

      {activeTab === 'upload' && (
        <>
          {/* Upload Drag & Drop Box */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleFileDrop}
            className={`p-8 rounded-2xl border-2 border-dashed transition-all duration-200 text-center relative ${
              dragActive
                ? 'border-epfo-accent bg-epfo-accent/5 scale-[1.005]'
                : 'border-border bg-card hover:border-epfo-accent/60'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.txt,.tsv"
              onChange={handleFileInputChange}
              className="hidden"
            />

            <div className="flex flex-col items-center justify-center space-y-3">
              <div className="p-4 rounded-full bg-epfo-navy/5 dark:bg-white/5 border border-border">
                <UploadCloud className="w-8 h-8 text-epfo-accent" />
              </div>

              <div>
                <h3 className="text-sm font-bold text-foreground">
                  Drop your Establishment Master CSV file here, or{' '}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-epfo-accent hover:underline font-extrabold"
                  >
                    browse files
                  </button>
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Supports comma-separated (.csv), tab-delimited (.tsv), or semicolon text formats up to 25MB.
                </p>
              </div>

              {fileName && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20">
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>{fileName} ({fileSize})</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setStagedRecords([]);
                      setFileName(null);
                    }}
                    className="hover:text-red-500 ml-1"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Staging & Review Section */}
          {stagedRecords.length > 0 && (
            <div className="space-y-4">
              {/* Controls and Strategy Bar */}
              <div className="p-4 rounded-2xl bg-card border border-border flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-sm">
                <div className="flex flex-wrap items-center gap-3">
                  {/* Strategy Selector */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                      Duplicate Conflict Strategy
                    </label>
                    <select
                      value={importStrategy}
                      onChange={(e) => setImportStrategy(e.target.value as any)}
                      className="px-3 py-1.5 rounded-xl border border-input bg-background text-xs font-bold focus:ring-2 focus:ring-epfo-navy outline-none"
                    >
                      <option value="MERGE_UPSERT">🔄 Merge & Update Existing (Upsert)</option>
                      <option value="SKIP_DUPLICATES">⏭️ Skip Existing Duplicates</option>
                      <option value="REPLACE_ALL">⚠️ Replace Entire Registry</option>
                    </select>
                  </div>

                  {/* Filter Status */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                      Filter Records
                    </label>
                    <div className="flex items-center gap-1">
                      {[
                        { id: 'ALL', label: `All (${stagedRecords.length})` },
                        { id: 'VALID', label: `Ready (${validCount})`, color: 'text-emerald-500' },
                        { id: 'EXISTING_UPDATE', label: `Updates (${updateCount})`, color: 'text-blue-500' },
                        { id: 'WARNING', label: `Warnings (${warningCount})`, color: 'text-amber-500' },
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setFilterStatus(tab.id as any)}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            filterStatus === tab.id
                              ? 'bg-epfo-navy text-white dark:bg-epfo-accent dark:text-epfo-navy shadow-sm'
                              : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Commit Action Button */}
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search staged..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8 pr-3 py-1.5 rounded-xl border border-input bg-background text-xs font-medium focus:ring-2 focus:ring-epfo-navy outline-none w-44"
                    />
                  </div>

                  <button
                    onClick={handleCommitImport}
                    disabled={isProcessing || selectedCount === 0}
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                    <span>Commit Import ({selectedCount} records)</span>
                  </button>
                </div>
              </div>

              {/* Data Table */}
              <div className="border border-border rounded-2xl overflow-hidden bg-card shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-muted/70 font-bold border-b border-border text-muted-foreground uppercase text-[10px]">
                      <tr>
                        <th className="p-3 w-10 text-center">
                          <input
                            type="checkbox"
                            checked={stagedRecords.length > 0 && stagedRecords.every((r) => r.selected)}
                            onChange={(e) => handleToggleSelectAll(e.target.checked)}
                            className="rounded text-epfo-accent"
                          />
                        </th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Formatted Est Code</th>
                        <th className="p-3">Establishment Name</th>
                        <th className="p-3">District</th>
                        <th className="p-3">Location</th>
                        <th className="p-3">Coverage</th>
                        <th className="p-3">Industry</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredStaged.map((row) => {
                        const isEditing = editingId === row.id;
                        return (
                          <tr
                            key={row.id}
                            className={`hover:bg-muted/30 transition-colors ${
                              !row.selected ? 'opacity-40 bg-muted/10' : ''
                            }`}
                          >
                            <td className="p-3 text-center">
                              <input
                                type="checkbox"
                                checked={row.selected}
                                onChange={() => handleToggleSelectRow(row.id)}
                                className="rounded text-epfo-accent"
                              />
                            </td>

                            <td className="p-3">
                              {row.status === 'VALID' && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[10px]">
                                  <CheckCircle2 className="w-3 h-3" /> Ready
                                </span>
                              )}
                              {row.status === 'EXISTING_UPDATE' && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold text-[10px]">
                                  <RefreshCw className="w-3 h-3" /> Update
                                </span>
                              )}
                              {row.status === 'WARNING' && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-[10px]">
                                  <AlertTriangle className="w-3 h-3" /> Review
                                </span>
                              )}
                            </td>

                            <td className="p-3 font-mono font-bold text-foreground">
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={editFormData.establishmentCode || ''}
                                  onChange={(e) => setEditFormData({ ...editFormData, establishmentCode: e.target.value })}
                                  className="px-2 py-1 border border-input rounded text-xs w-36 font-mono bg-background"
                                />
                              ) : (
                                <span>{row.establishmentCode}</span>
                              )}
                            </td>

                            <td className="p-3 font-semibold text-foreground max-w-xs truncate">
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={editFormData.name || ''}
                                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                                  className="px-2 py-1 border border-input rounded text-xs w-full bg-background"
                                />
                              ) : (
                                <div>
                                  <div>{row.name}</div>
                                  {row.primaryContact && (
                                    <div className="text-[10px] text-muted-foreground">
                                      Contact: {row.primaryContact} ({row.contactPhone || 'N/A'})
                                    </div>
                                  )}
                                </div>
                              )}
                            </td>

                            <td className="p-3">
                              {isEditing ? (
                                <select
                                  value={editFormData.district || 'Cuttack'}
                                  onChange={(e) => setEditFormData({ ...editFormData, district: e.target.value })}
                                  className="px-2 py-1 border border-input rounded text-xs bg-background"
                                >
                                  {ODISHA_DISTRICTS.map((d) => (
                                    <option key={d} value={d}>
                                      {d}
                                    </option>
                                  ))}
                                </select>
                              ) : (
                                <span className="px-2 py-0.5 rounded bg-muted font-semibold text-[11px]">
                                  {row.district}
                                </span>
                              )}
                            </td>

                            <td className="p-3 text-muted-foreground max-w-xs truncate">
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={editFormData.location || ''}
                                  onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
                                  className="px-2 py-1 border border-input rounded text-xs w-full bg-background"
                                />
                              ) : (
                                <span>{row.location}</span>
                              )}
                            </td>

                            <td className="p-3">
                              {isEditing ? (
                                <select
                                  value={editFormData.coverageStatus || 'COVERED'}
                                  onChange={(e) => setEditFormData({ ...editFormData, coverageStatus: e.target.value as CoverageStatus })}
                                  className="px-2 py-1 border border-input rounded text-xs bg-background"
                                >
                                  <option value="COVERED">COVERED</option>
                                  <option value="EXEMPTED">EXEMPTED</option>
                                  <option value="UNCOVERED">UNCOVERED</option>
                                  <option value="CLUSTER_HANDLOOM">CLUSTER_HANDLOOM</option>
                                  <option value="GOVT_UNDERTAKING">GOVT_UNDERTAKING</option>
                                </select>
                              ) : (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-epfo-navy/10 text-epfo-navy dark:bg-epfo-accent/20 dark:text-epfo-accent">
                                  {row.coverageStatus}
                                </span>
                              )}
                            </td>

                            <td className="p-3 text-muted-foreground">
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={editFormData.industryType || ''}
                                  onChange={(e) => setEditFormData({ ...editFormData, industryType: e.target.value })}
                                  className="px-2 py-1 border border-input rounded text-xs bg-background"
                                />
                              ) : (
                                <span>{row.industryType || 'General'}</span>
                              )}
                            </td>

                            <td className="p-3 text-right space-x-1.5">
                              {isEditing ? (
                                <button
                                  onClick={() => handleSaveEdit(row.id)}
                                  className="p-1 rounded bg-emerald-500 text-white hover:bg-emerald-600"
                                  title="Save Changes"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleStartEdit(row)}
                                  className="p-1 rounded bg-muted text-muted-foreground hover:text-foreground"
                                  title="Edit Record"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                              )}

                              <button
                                onClick={() => handleDeleteStagedRow(row.id)}
                                className="p-1 rounded bg-muted text-muted-foreground hover:text-red-500"
                                title="Discard Record"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Live Master Explorer Tab */}
      {activeTab === 'explorer' && (
        <div className="p-6 rounded-2xl bg-card border border-border space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
            <div>
              <h3 className="text-sm font-bold text-foreground">Current Live Establishment Master Database</h3>
              <p className="text-xs text-muted-foreground">
                Showing all active establishments registered under Regional Office Bhubaneswar & District Offices.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={explorerDistrict}
                onChange={(e) => setExplorerDistrict(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-input bg-background text-xs font-bold focus:ring-2 focus:ring-epfo-navy outline-none"
              >
                <option value="ALL">All Odisha Districts</option>
                {ODISHA_DISTRICTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search live master..."
                  value={explorerSearch}
                  onChange={(e) => setExplorerSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-xl border border-input bg-background text-xs font-medium focus:ring-2 focus:ring-epfo-navy outline-none w-56"
                />
              </div>
            </div>
          </div>

          <div className="border border-border rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/60 font-bold border-b border-border text-muted-foreground uppercase text-[10px]">
                <tr>
                  <th className="p-3">Est Code</th>
                  <th className="p-3">Establishment Name</th>
                  <th className="p-3">District</th>
                  <th className="p-3">Location / Jurisdiction</th>
                  <th className="p-3">Coverage Status</th>
                  <th className="p-3">Industry Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredLive.map((est) => (
                  <tr key={est.id} className="hover:bg-muted/30">
                    <td className="p-3 font-mono font-bold text-foreground">{est.establishmentCode}</td>
                    <td className="p-3 font-semibold text-foreground">{est.name || est.establishmentName}</td>
                    <td className="p-3 font-semibold">{est.district}</td>
                    <td className="p-3 text-muted-foreground">{est.location}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        {est.coverageStatus}
                      </span>
                    </td>
                    <td className="p-3 text-muted-foreground">{est.industryType || 'General'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
