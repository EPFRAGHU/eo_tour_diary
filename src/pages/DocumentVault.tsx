import React, { useState } from 'react';
import {
  Folder,
  FolderOpen,
  FileText,
  Image as ImageIcon,
  FileSpreadsheet,
  Archive,
  Upload,
  Search,
  Eye,
  LayoutGrid,
  List
} from 'lucide-react';
import { DocumentRecord, FileFormatType, EstablishmentDTO } from '@/types';
import { DocumentUploadModal } from '@/components/documents/DocumentUploadModal';
import { DocumentPreviewModal } from '@/components/documents/DocumentPreviewModal';

interface DocumentVaultProps {
  establishments: EstablishmentDTO[];
}

export const DocumentVault: React.FC<DocumentVaultProps> = ({ establishments }) => {
  const [selectedFolderCode, setSelectedFolderCode] = useState<string>('ALL');
  const [selectedFormat, setSelectedFormat] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'GRID' | 'LIST'>('GRID');

  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<DocumentRecord | null>(null);

  const [documents, setDocuments] = useState<DocumentRecord[]>([
    {
      id: 'doc-1',
      title: 'Form 11 Inspection Report - Security Staff Enrolment Audit',
      category: 'INSPECTION_NOTE',
      refNumber: 'OR/DO/CTC/Compliance/2026/810',
      uploadedAt: '2026-08-05',
      fileSize: '1.8 MB',
      establishmentCode: 'MH/BAN/0045231/000',
      establishmentName: 'Apex Logistics & Freight India Pvt Ltd',
      folderPath: '/MH-BAN-0045231-000/Inspection Reports/',
      fileFormat: 'PDF',
      currentVersion: 'v1.2',
      versions: [
        {
          version: 'v1.0',
          uploadedAt: '2026-08-01',
          uploadedBy: 'Rajesh Sharma (EO/AO)',
          fileName: 'Apex_Logistics_Draft_Report.pdf',
          fileSize: '1.4 MB',
          changeNotes: 'Initial inspection draft submitted.',
        },
        {
          version: 'v1.2',
          uploadedAt: '2026-08-05',
          uploadedBy: 'Rajesh Sharma (EO/AO)',
          fileName: 'Apex_Logistics_Final_Form11.pdf',
          fileSize: '1.8 MB',
          changeNotes: 'Added signed attendance list & Section 7A notice copy.',
        },
      ],
    },
    {
      id: 'doc-2',
      title: 'Site Inspection Evidence Photo - Factory Gate Enrolment',
      category: 'INSPECTION_NOTE',
      refNumber: 'IMG-20260802-WA0045',
      uploadedAt: '2026-08-02',
      fileSize: '3.4 MB',
      establishmentCode: 'OR/6276',
      establishmentName: 'M/s Jindal Stainless Steel Ltd',
      folderPath: '/OR-6276/Site Photos/',
      fileFormat: 'PHOTO',
      currentVersion: 'v1.0',
      versions: [
        {
          version: 'v1.0',
          uploadedAt: '2026-08-02',
          uploadedBy: 'Rajesh Sharma (EO/AO)',
          fileName: 'Factory_Gate_Inspection.jpg',
          fileSize: '3.4 MB',
          changeNotes: 'Original field photo evidence captured on camera.',
        },
      ],
    },
    {
      id: 'doc-3',
      title: 'Section 7A Enquiry Audit Spreadsheet - Default Period May-July',
      category: 'NOTICE_7A',
      refNumber: 'OR/DO/CTC/Audit/Excel/457',
      uploadedAt: '2026-08-04',
      fileSize: '420 KB',
      establishmentCode: 'OR/BBS/1238',
      establishmentName: 'M/s Bhimtanagar Sukinda Chromite Mines',
      folderPath: '/OR-BBS-1238/7A Enquiry Docs/',
      fileFormat: 'EXCEL',
      currentVersion: 'v1.1',
      versions: [
        {
          version: 'v1.0',
          uploadedAt: '2026-08-03',
          uploadedBy: 'Rajesh Sharma (EO/AO)',
          fileName: 'Chromite_Mines_7A_Statement.xlsx',
          fileSize: '380 KB',
          changeNotes: 'Draft 7A calculation sheet.',
        },
        {
          version: 'v1.1',
          uploadedAt: '2026-08-04',
          uploadedBy: 'Rajesh Sharma (EO/AO)',
          fileName: 'Chromite_Mines_7A_Final.xlsx',
          fileSize: '420 KB',
          changeNotes: 'Reconciled interest calculations under Sec 7Q.',
        },
      ],
    },
    {
      id: 'doc-4',
      title: 'Office Directive - Special Compliance Drive & PMVBRY Campaign',
      category: 'OFFICE_ORDER',
      refNumber: 'OR/BBS/ADMIN-I/NAN 2.0/457/2023',
      uploadedAt: '2026-08-01',
      fileSize: '14.2 MB',
      establishmentCode: 'GENERAL',
      establishmentName: 'General Directives Vault',
      folderPath: '/GENERAL/Office Directives/',
      fileFormat: 'ZIP',
      currentVersion: 'v1.0',
      versions: [
        {
          version: 'v1.0',
          uploadedAt: '2026-08-01',
          uploadedBy: 'APFC (Compliance)',
          fileName: 'Special_Campaign_Directives.zip',
          fileSize: '14.2 MB',
          changeNotes: 'Official guidelines & circular bundle.',
        },
      ],
    },
  ]);

  // Filter Logic
  const filteredDocs = documents.filter((doc) => {
    const matchesFolder = selectedFolderCode === 'ALL' || doc.establishmentCode === selectedFolderCode;
    const matchesFormat = selectedFormat === 'ALL' || doc.fileFormat === selectedFormat;
    const matchesSearch =
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.refNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.establishmentCode.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFolder && matchesFormat && matchesSearch;
  });

  const getFormatIcon = (format: FileFormatType) => {
    switch (format) {
      case 'PHOTO':
        return <ImageIcon className="w-5 h-5 text-blue-500" />;
      case 'EXCEL':
        return <FileSpreadsheet className="w-5 h-5 text-emerald-500" />;
      case 'ZIP':
        return <Archive className="w-5 h-5 text-purple-500" />;
      case 'WORD':
        return <FileText className="w-5 h-5 text-indigo-500" />;
      case 'PDF':
      default:
        return <FileText className="w-5 h-5 text-red-500" />;
    }
  };

  const handleUploadDocument = (data: Omit<DocumentRecord, 'id' | 'currentVersion' | 'versions'>) => {
    const newDoc: DocumentRecord = {
      ...data,
      id: `doc-${Date.now()}`,
      currentVersion: 'v1.0',
      versions: [
        {
          version: 'v1.0',
          uploadedAt: data.uploadedAt,
          uploadedBy: 'Rajesh Sharma (EO/AO)',
          fileName: `${data.title}.${data.fileFormat.toLowerCase()}`,
          fileSize: data.fileSize,
          changeNotes: 'Initial file upload to establishment folder.',
        },
      ],
    };
    setDocuments([newDoc, ...documents]);
  };

  const handleReplaceVersion = (docId: string, newFileNotes: string) => {
    setDocuments(
      documents.map((d) => {
        if (d.id === docId) {
          const vMajor = parseInt(d.currentVersion.replace('v', '').split('.')[0] || '1', 10);
          const vMinor = parseInt(d.currentVersion.replace('v', '').split('.')[1] || '0', 10) + 1;
          const nextVersion = `v${vMajor}.${vMinor}`;
          return {
            ...d,
            currentVersion: nextVersion,
            uploadedAt: new Date().toISOString().split('T')[0],
            versions: [
              {
                version: nextVersion,
                uploadedAt: new Date().toISOString().split('T')[0],
                uploadedBy: 'Rajesh Sharma (EO/AO)',
                fileName: `${d.title}_${nextVersion}.${d.fileFormat.toLowerCase()}`,
                fileSize: d.fileSize,
                changeNotes: newFileNotes,
              },
              ...d.versions,
            ],
          };
        }
        return d;
      })
    );
  };

  const handleDeleteDocument = (docId: string) => {
    setDocuments(documents.filter((d) => d.id !== docId));
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-foreground">Digital Document Vault & Files Repository</h2>
          <p className="text-xs text-muted-foreground">
            Establishment folder tree, version control, multi-format attachments (Photo, PDF, Word, Excel, ZIP).
          </p>
        </div>

        <button
          onClick={() => setIsUploadOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-epfo-navy hover:bg-epfo-blue text-white font-bold text-xs shadow-md transition-all active:scale-95 shrink-0"
        >
          <Upload className="w-4 h-4 text-epfo-accent" />
          <span>Upload Document to Folder</span>
        </button>
      </div>

      {/* Main Grid: Folder Explorer Sidebar (Left) + Document Files Grid (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column: Establishment Folder Directory Tree */}
        <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-3">
          <div className="flex items-center gap-2 font-bold text-xs text-foreground border-b border-border pb-2">
            <Folder className="w-4 h-4 text-epfo-accent" />
            <span>Establishment Folders</span>
          </div>

          <div className="space-y-1 text-xs">
            <button
              onClick={() => setSelectedFolderCode('ALL')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-bold transition-colors ${
                selectedFolderCode === 'ALL'
                  ? 'bg-epfo-navy text-white shadow-sm'
                  : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              <div className="flex items-center gap-2">
                <FolderOpen className="w-4 h-4" />
                <span>All Documents</span>
              </div>
              <span className="font-mono text-[10px] opacity-80">{documents.length}</span>
            </button>

            {establishments.map((est) => {
              const count = documents.filter((d) => d.establishmentCode === est.establishmentCode).length;
              const isSelected = selectedFolderCode === est.establishmentCode;
              return (
                <button
                  key={est.id}
                  onClick={() => setSelectedFolderCode(est.establishmentCode)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors ${
                    isSelected ? 'bg-epfo-navy text-white font-bold shadow-sm' : 'text-muted-foreground hover:bg-muted'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <Folder className="w-3.5 h-3.5 text-epfo-accent shrink-0" />
                    <span className="font-mono text-[11px] truncate">/{est.establishmentCode.replace(/\//g, '-')}</span>
                  </div>
                  <span className="font-mono text-[10px] opacity-70 ml-2">{count}</span>
                </button>
              );
            })}

            <button
              onClick={() => setSelectedFolderCode('GENERAL')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors ${
                selectedFolderCode === 'GENERAL' ? 'bg-epfo-navy text-white font-bold shadow-sm' : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <Folder className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span>/GENERAL/Office Directives</span>
              </div>
              <span className="font-mono text-[10px] opacity-70 ml-2">1</span>
            </button>
          </div>
        </div>

        {/* Right Column: Files Viewer */}
        <div className="lg:col-span-3 space-y-4">
          {/* Toolbar: Search, Format Filter, Layout Toggle */}
          <div className="p-3.5 rounded-2xl bg-card border border-border/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search files by title, ref no..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-background border border-border text-xs focus:ring-2 focus:ring-epfo-accent outline-none"
                />
              </div>

              <select
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-background border border-border text-xs focus:ring-2 focus:ring-epfo-accent outline-none font-bold"
              >
                <option value="ALL">All File Formats</option>
                <option value="PDF">PDF (.pdf)</option>
                <option value="PHOTO">Photo (.jpg, .png)</option>
                <option value="WORD">Word (.docx)</option>
                <option value="EXCEL">Excel (.xlsx)</option>
                <option value="ZIP">ZIP (.zip)</option>
              </select>
            </div>

            {/* Layout Toggle */}
            <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl border border-border/60">
              <button
                onClick={() => setViewMode('GRID')}
                className={`p-1.5 rounded-lg transition-colors ${viewMode === 'GRID' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground'}`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('LIST')}
                className={`p-1.5 rounded-lg transition-colors ${viewMode === 'LIST' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Files Render Grid / List */}
          {filteredDocs.length === 0 ? (
            <div className="p-12 text-center bg-card border border-dashed rounded-2xl space-y-3">
              <Folder className="w-10 h-10 mx-auto text-muted-foreground stroke-1" />
              <h3 className="text-sm font-bold text-foreground">No Files Found in Selected Folder</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Try selecting a different establishment folder or upload a new file.
              </p>
            </div>
          ) : viewMode === 'GRID' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm hover:shadow-md transition-all space-y-3 flex flex-col justify-between group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="p-2.5 rounded-xl bg-muted/50 border border-border/60">
                        {getFormatIcon(doc.fileFormat)}
                      </div>
                      <span className="font-mono text-[10px] font-black bg-epfo-navy text-white px-2 py-0.5 rounded">
                        {doc.currentVersion}
                      </span>
                    </div>

                    <h3 className="text-xs font-bold text-foreground line-clamp-2 leading-snug">
                      {doc.title}
                    </h3>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-border/60 text-[10px]">
                    <div className="flex items-center justify-between text-muted-foreground font-mono">
                      <span>{doc.refNumber}</span>
                      <span>{doc.fileSize}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Folder className="w-3 h-3 text-epfo-accent" />
                      <span className="font-mono truncate">{doc.folderPath}</span>
                    </div>

                    <button
                      onClick={() => setPreviewDoc(doc)}
                      className="w-full mt-1 py-1.5 rounded-xl bg-muted hover:bg-epfo-navy hover:text-white font-bold text-xs text-foreground transition-all flex items-center justify-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview File & History</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-muted-foreground font-bold">
                    <th className="py-2.5 px-3">Format</th>
                    <th className="py-2.5 px-3">Document Title</th>
                    <th className="py-2.5 px-3">Folder Path</th>
                    <th className="py-2.5 px-3">Ref No</th>
                    <th className="py-2.5 px-3">Version</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredDocs.map((doc) => (
                    <tr key={doc.id} className="hover:bg-muted/20 transition-colors">
                      <td className="py-2.5 px-3">{getFormatIcon(doc.fileFormat)}</td>
                      <td className="py-2.5 px-3 font-semibold text-foreground">{doc.title}</td>
                      <td className="py-2.5 px-3 font-mono text-[10px] text-muted-foreground">{doc.folderPath}</td>
                      <td className="py-2.5 px-3 font-mono text-[10px]">{doc.refNumber}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-epfo-navy dark:text-epfo-slate">{doc.currentVersion}</td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={() => setPreviewDoc(doc)}
                          className="px-3 py-1 rounded-lg bg-epfo-navy text-white font-bold text-[11px] hover:bg-epfo-blue transition-all inline-flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3 text-epfo-accent" />
                          <span>Preview</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <DocumentUploadModal
        isOpen={isUploadOpen}
        establishments={establishments}
        onClose={() => setIsUploadOpen(false)}
        onUpload={handleUploadDocument}
      />

      <DocumentPreviewModal
        document={previewDoc}
        onClose={() => setPreviewDoc(null)}
        onReplaceVersion={handleReplaceVersion}
        onDeleteDocument={handleDeleteDocument}
      />
    </div>
  );
};
