import React, { useState } from 'react';
import { XCircle, Upload, FileText, Image, FileSpreadsheet, Archive, Folder } from 'lucide-react';
import { DocumentRecord, FileFormatType, EstablishmentDTO } from '@/types';

interface DocumentUploadModalProps {
  isOpen: boolean;
  establishments: EstablishmentDTO[];
  onClose: () => void;
  onUpload: (doc: Omit<DocumentRecord, 'id' | 'currentVersion' | 'versions'>) => void;
}

export const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
  isOpen,
  establishments,
  onClose,
  onUpload,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    category: 'INSPECTION_NOTE' as DocumentRecord['category'],
    refNumber: `OR/DO/CTC/Compliance/${new Date().getFullYear()}/${Math.floor(100 + Math.random() * 900)}`,
    establishmentCode: establishments[0]?.establishmentCode || 'OR/BBS/0006276/000',
    fileFormat: 'PDF' as FileFormatType,
    fileName: '',
    fileSize: '1.5 MB',
  });

  if (!isOpen) return null;

  const selectedEst = establishments.find(
    (e) => e.establishmentCode.toUpperCase() === formData.establishmentCode.toUpperCase()
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    onUpload({
      title: formData.title,
      category: formData.category,
      refNumber: formData.refNumber,
      uploadedAt: new Date().toISOString().split('T')[0],
      fileSize: formData.fileSize || '1.2 MB',
      establishmentCode: formData.establishmentCode,
      establishmentName: selectedEst?.name || 'M/s Jindal Stainless Steel Ltd',
      folderPath: `/${formData.establishmentCode.replace(/\//g, '-')}/${formData.category}/`,
      fileFormat: formData.fileFormat,
    });

    onClose();
  };

  const handleFileDrop = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const ext = file.name.split('.').pop()?.toLowerCase();
      let format: FileFormatType = 'PDF';
      if (['jpg', 'jpeg', 'png', 'webp'].includes(ext || '')) format = 'PHOTO';
      if (['doc', 'docx'].includes(ext || '')) format = 'WORD';
      if (['xls', 'xlsx', 'csv'].includes(ext || '')) format = 'EXCEL';
      if (['zip', 'rar', '7z'].includes(ext || '')) format = 'ZIP';

      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);

      setFormData({
        ...formData,
        title: formData.title || file.name.replace(/\.[^/.]+$/, ''),
        fileName: file.name,
        fileFormat: format,
        fileSize: `${sizeMb} MB`,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-card w-full max-w-lg rounded-2xl border border-border shadow-2xl p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-epfo-accent" />
            <h3 className="text-base font-bold text-foreground">Upload Document to Vault</h3>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1 rounded-lg">
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Establishment Folder Assignment */}
          <div className="space-y-1">
            <label className="font-bold text-foreground flex items-center gap-1.5">
              <Folder className="w-4 h-4 text-epfo-accent" />
              <span>Assign to Establishment Folder *</span>
            </label>
            <select
              value={formData.establishmentCode}
              onChange={(e) => setFormData({ ...formData, establishmentCode: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-epfo-accent outline-none font-bold"
            >
              {establishments.map((est) => (
                <option key={est.id} value={est.establishmentCode}>
                  📁 /{est.establishmentCode.replace(/\//g, '-')} ({est.name})
                </option>
              ))}
            </select>
          </div>

          {/* File Upload Drop Zone */}
          <div className="border-2 border-dashed border-border hover:border-epfo-accent rounded-2xl p-5 text-center space-y-2 bg-muted/30 transition-colors relative cursor-pointer">
            <input
              type="file"
              onChange={handleFileDrop}
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx,.zip"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="flex items-center justify-center gap-3 text-muted-foreground">
              <Image className="w-5 h-5 text-blue-500" />
              <FileText className="w-5 h-5 text-red-500" />
              <FileSpreadsheet className="w-5 h-5 text-emerald-500" />
              <Archive className="w-5 h-5 text-purple-500" />
            </div>
            <p className="text-xs font-bold text-foreground">
              {formData.fileName ? `Selected: ${formData.fileName}` : 'Click or Drag & Drop File Here'}
            </p>
            <p className="text-[10px] text-muted-foreground">
              Supports Photo (JPG/PNG), PDF, Word, Excel, ZIP (Max 50MB)
            </p>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-foreground">Document Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Form 11 Inspection Report - Security Contract Audit"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-epfo-accent outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-foreground">Document Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-epfo-accent outline-none"
              >
                <option value="INSPECTION_NOTE">Inspection Report / Note</option>
                <option value="NOTICE_7A">Section 7A Enquiry Notice</option>
                <option value="DAMAGES_14B">Section 14B Order</option>
                <option value="TA_RECEIPT">TA / DA Receipt Voucher</option>
                <option value="OFFICE_ORDER">Office Order Directive</option>
                <option value="GENERAL">General Document</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-foreground">File Type Format *</label>
              <select
                value={formData.fileFormat}
                onChange={(e) => setFormData({ ...formData, fileFormat: e.target.value as FileFormatType })}
                className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-epfo-accent outline-none font-bold"
              >
                <option value="PDF">PDF Document (.pdf)</option>
                <option value="PHOTO">Photo / Image (.jpg, .png)</option>
                <option value="WORD">Word Document (.docx)</option>
                <option value="EXCEL">Excel Spreadsheet (.xlsx)</option>
                <option value="ZIP">ZIP Archive (.zip)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-foreground">Reference / Letter Number *</label>
            <input
              type="text"
              required
              placeholder="OR/DO/CTC/Compliance/2026/810"
              value={formData.refNumber}
              onChange={(e) => setFormData({ ...formData, refNumber: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-background border border-border focus:ring-2 focus:ring-epfo-accent outline-none font-mono"
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
              <Upload className="w-3.5 h-3.5 text-epfo-accent" />
              Upload to Vault (v1.0)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
