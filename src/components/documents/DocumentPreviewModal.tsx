import React, { useState } from 'react';
import {
  XCircle,
  FileText,
  Image as ImageIcon,
  FileSpreadsheet,
  Archive,
  Download,
  Trash2,
  RefreshCw,
  History,
  Folder
} from 'lucide-react';
import { DocumentRecord } from '@/types';
import { formatDate } from '@/lib/utils';

interface DocumentPreviewModalProps {
  document: DocumentRecord | null;
  onClose: () => void;
  onReplaceVersion: (docId: string, newFileNotes: string) => void;
  onDeleteDocument: (docId: string) => void;
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  document,
  onClose,
  onReplaceVersion,
  onDeleteDocument,
}) => {
  const [showReplaceForm, setShowReplaceForm] = useState(false);
  const [changeNotes, setChangeNotes] = useState('');

  if (!document) return null;

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'PHOTO':
        return <ImageIcon className="w-8 h-8 text-blue-500" />;
      case 'EXCEL':
        return <FileSpreadsheet className="w-8 h-8 text-emerald-500" />;
      case 'ZIP':
        return <Archive className="w-8 h-8 text-purple-500" />;
      case 'WORD':
        return <FileText className="w-8 h-8 text-indigo-500" />;
      case 'PDF':
      default:
        return <FileText className="w-8 h-8 text-red-500" />;
    }
  };

  const handleReplaceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onReplaceVersion(document.id, changeNotes || 'Updated document revision');
    setShowReplaceForm(false);
    setChangeNotes('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-card w-full max-w-2xl rounded-2xl border border-border shadow-2xl p-6 space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-muted/50 border border-border">
              {getFormatIcon(document.fileFormat)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-black bg-epfo-navy text-white px-2 py-0.5 rounded">
                  {document.currentVersion}
                </span>
                <span className="font-mono text-[10px] bg-epfo-accent/10 text-epfo-accent font-bold px-2 py-0.5 rounded-full">
                  {document.fileFormat}
                </span>
              </div>
              <h2 className="text-base font-extrabold text-foreground mt-1">{document.title}</h2>
              <div className="text-xs text-muted-foreground font-mono flex items-center gap-1 mt-0.5">
                <Folder className="w-3.5 h-3.5 text-epfo-accent" />
                <span>{document.folderPath}</span>
              </div>
            </div>
          </div>

          <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1 rounded-lg">
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-muted/40 text-xs">
          <div>
            <span className="text-muted-foreground block text-[10px]">Establishment Code</span>
            <span className="font-bold font-mono text-foreground">{document.establishmentCode}</span>
          </div>
          <div>
            <span className="text-muted-foreground block text-[10px]">Reference Number</span>
            <span className="font-bold font-mono text-foreground">{document.refNumber}</span>
          </div>
          <div>
            <span className="text-muted-foreground block text-[10px]">File Size</span>
            <span className="font-bold font-mono text-foreground">{document.fileSize}</span>
          </div>
          <div>
            <span className="text-muted-foreground block text-[10px]">Last Uploaded</span>
            <span className="font-bold text-foreground">{formatDate(document.uploadedAt)}</span>
          </div>
        </div>

        {/* Action Trigger Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-muted/30 border border-border/50">
          <div className="flex items-center gap-2">
            <button
              onClick={() => alert(`Downloading ${document.title}...`)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-epfo-navy text-white text-xs font-bold hover:bg-epfo-blue transition-all"
            >
              <Download className="w-3.5 h-3.5 text-epfo-accent" />
              <span>Download File</span>
            </button>

            <button
              onClick={() => setShowReplaceForm(!showReplaceForm)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card border border-border text-xs font-bold hover:bg-muted transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5 text-amber-500" />
              <span>Replace File (New Version)</span>
            </button>
          </div>

          <button
            onClick={() => {
              if (confirm(`Delete document "${document.title}" and all past revision logs?`)) {
                onDeleteDocument(document.id);
                onClose();
              }
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-destructive/10 text-destructive text-xs font-bold hover:bg-destructive hover:text-white transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Document</span>
          </button>
        </div>

        {/* Replace File Form */}
        {showReplaceForm && (
          <form onSubmit={handleReplaceSubmit} className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-3 text-xs animate-in fade-in duration-150">
            <div className="font-bold text-foreground flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-amber-500" />
              <span>Upload Replacement File Revision</span>
            </div>
            <input
              type="file"
              required
              className="w-full text-xs text-muted-foreground file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-epfo-navy file:text-white hover:file:bg-epfo-blue cursor-pointer"
            />
            <input
              type="text"
              placeholder="Revision notes (e.g. Revised Section 7A enquiry statement added)"
              value={changeNotes}
              onChange={(e) => setChangeNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-background border border-border outline-none"
            />
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowReplaceForm(false)}
                className="px-3 py-1.5 rounded-lg border border-border font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-amber-500 text-white font-bold shadow"
              >
                Save New Version Revision
              </button>
            </div>
          </form>
        )}

        {/* Version History Audit Log */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <div className="flex items-center gap-2 font-bold text-xs text-foreground">
              <History className="w-4 h-4 text-epfo-accent" />
              <span>Document Revision & Version History</span>
            </div>
            <span className="text-[10px] font-mono text-muted-foreground">
              {document.versions?.length || 1} Revision(s) Logged
            </span>
          </div>

          <div className="relative pl-4 space-y-3 border-l border-border/80">
            {(document.versions || [
              {
                version: document.currentVersion,
                uploadedAt: document.uploadedAt,
                uploadedBy: 'Rajesh Sharma (EO/AO)',
                fileName: `${document.title}.pdf`,
                fileSize: document.fileSize,
                changeNotes: 'Initial document upload',
              },
            ]).map((ver, idx) => (
              <div key={idx} className="relative space-y-1 p-3 rounded-xl bg-muted/30 border border-border/50 text-xs">
                <div className="absolute -left-[21px] top-3.5 w-2.5 h-2.5 rounded-full bg-epfo-accent"></div>
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-epfo-navy dark:text-epfo-slate">{ver.version}</span>
                  <span className="text-[10px] text-muted-foreground font-mono">{formatDate(ver.uploadedAt)}</span>
                </div>
                <div className="font-semibold text-foreground">{ver.fileName}</div>
                <div className="text-[11px] text-muted-foreground leading-relaxed flex items-center justify-between">
                  <span>{ver.changeNotes || 'Document update'}</span>
                  <span className="font-mono text-[10px]">{ver.fileSize}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
