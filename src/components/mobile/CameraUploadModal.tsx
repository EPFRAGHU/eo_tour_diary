import React, { useState, useRef } from 'react';
import { Camera, XCircle, Check, RefreshCw, Image as ImageIcon } from 'lucide-react';

interface CameraUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapturePhoto: (photoUrl: string, fileName: string) => void;
}

export const CameraUploadModal: React.FC<CameraUploadModalProps> = ({
  isOpen,
  onClose,
  onCapturePhoto,
}) => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Native Camera File Input Handler (capture="environment")
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirmPhoto = () => {
    if (capturedImage) {
      const fileName = `INSP_PHOTO_${Date.now()}.jpg`;
      onCapturePhoto(capturedImage, fileName);
      setCapturedImage(null);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-card w-full max-w-md rounded-2xl border border-border shadow-2xl p-5 space-y-5 text-xs">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-epfo-accent" />
            <h3 className="text-base font-bold text-foreground">Mobile Camera Field Photo Capture</h3>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1 rounded-lg">
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        {/* Hidden Native File Input with capture="environment" */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Camera Preview Area */}
        <div className="relative aspect-video rounded-xl bg-black border border-border/80 overflow-hidden flex flex-col items-center justify-center text-center p-4">
          {capturedImage ? (
            <img src={capturedImage} alt="Captured Field Photo" className="w-full h-full object-contain" />
          ) : (
            <div className="space-y-3">
              <Camera className="w-10 h-10 mx-auto text-epfo-accent animate-pulse stroke-1" />
              <div className="space-y-1">
                <p className="font-bold text-white">Capture Geo-tagged Field Photo</p>
                <p className="text-[11px] text-muted-foreground max-w-xs">
                  Direct camera access for taking establishment entrance, attendance registers, or Form 11 notice photos.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Action Triggers Bar */}
        <div className="space-y-3">
          {capturedImage ? (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setCapturedImage(null)}
                className="flex-1 py-2.5 rounded-xl border border-border font-bold hover:bg-muted flex items-center justify-center gap-1.5"
              >
                <RefreshCw className="w-4 h-4 text-muted-foreground" />
                <span>Retake Photo</span>
              </button>
              <button
                type="button"
                onClick={handleConfirmPhoto}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Attach Photo</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="py-3 rounded-xl bg-epfo-navy hover:bg-epfo-blue text-white font-bold shadow-md flex items-center justify-center gap-2"
              >
                <Camera className="w-4 h-4 text-epfo-accent" />
                <span>Open Camera</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="py-3 rounded-xl bg-card border border-border hover:bg-muted text-foreground font-bold shadow-sm flex items-center justify-center gap-2"
              >
                <ImageIcon className="w-4 h-4 text-epfo-accent" />
                <span>Choose Gallery</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
