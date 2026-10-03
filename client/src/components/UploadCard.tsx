import React, { useRef, useState } from 'react';
import { Upload, X, RefreshCw, CheckCircle2, Image as ImageIcon } from 'lucide-react';

interface UploadCardProps {
  type: 'claim' | 'evidence';
  title: string;
  subtitle: string;
  file: File | null;
  previewUrl: string | null;
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
  disabled?: boolean;
}

export const UploadCard: React.FC<UploadCardProps> = ({
  type,
  title,
  subtitle,
  file,
  previewUrl,
  onFileSelect,
  onFileRemove,
  disabled = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const isClaim = type === 'claim';
  const badgeLabel = isClaim ? 'STEP 1: THE CLAIM' : 'STEP 2: THE EVIDENCE';

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (isValidImage(droppedFile)) {
        onFileSelect(droppedFile);
      } else {
        alert('Unsupported file type. Please upload a PNG, JPG, JPEG, or WEBP image.');
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (isValidImage(selectedFile)) {
        onFileSelect(selectedFile);
      } else {
        alert('Unsupported file type. Please upload a PNG, JPG, JPEG, or WEBP image.');
      }
    }
  };

  const isValidImage = (file: File) => {
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml'];
    return validTypes.includes(file.type.toLowerCase());
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div
      className={`relative flex flex-col rounded-2xl border transition-all duration-200 ${
        isClaim
          ? 'border-indigo-500/20 bg-slate-900/60 shadow-lg shadow-indigo-950/20'
          : 'border-cyan-500/20 bg-slate-900/60 shadow-lg shadow-cyan-950/20'
      } ${isDragging ? 'ring-2 ring-indigo-400 border-indigo-400 bg-slate-800/80 scale-[1.01]' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-white/5 px-5 py-4">
        <div>
          <span
            className={`inline-block text-[11px] font-bold tracking-wider uppercase ${
              isClaim ? 'text-indigo-400' : 'text-cyan-400'
            }`}
          >
            {badgeLabel}
          </span>
          <h3 className="text-lg font-bold text-white tracking-tight">{title}</h3>
          <p className="text-xs text-slate-400">{subtitle}</p>
        </div>

        {file && (
          <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Loaded
          </span>
        )}
      </div>

      {/* Main Body: Upload Area or Preview */}
      <div className="flex-1 p-5">
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
          className="hidden"
          onChange={handleInputChange}
          disabled={disabled}
        />

        {!file && !previewUrl ? (
          /* Empty Upload State */
          <div
            onClick={() => !disabled && inputRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                inputRef.current?.click();
              }
            }}
            className={`group flex min-h-[260px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition-all ${
              isClaim
                ? 'border-indigo-500/30 hover:border-indigo-400 hover:bg-indigo-500/5'
                : 'border-cyan-500/30 hover:border-cyan-400 hover:bg-cyan-500/5'
            }`}
          >
            <div
              className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl transition-transform group-hover:scale-110 ${
                isClaim
                  ? 'bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500/20'
                  : 'bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500/20'
              }`}
            >
              <Upload className="h-7 w-7" />
            </div>

            <p className="mb-1 text-sm font-semibold text-slate-200 group-hover:text-white">
              Drag & drop image here, or{' '}
              <span className={isClaim ? 'text-indigo-400 underline' : 'text-cyan-400 underline'}>
                browse
              </span>
            </p>
            <p className="text-xs text-slate-400">
              Supports PNG, JPG, JPEG, WEBP (Max 10MB)
            </p>
          </div>
        ) : (
          /* Image Loaded State */
          <div className="flex flex-col gap-4">
            <div className="relative overflow-hidden rounded-xl border border-white/10 bg-slate-950 flex items-center justify-center min-h-[220px] max-h-[300px]">
              <img
                src={previewUrl || ''}
                alt={`${title} Preview`}
                className="max-h-[300px] w-full object-contain p-2"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
              
              {/* Floating Action Buttons */}
              <div className="absolute bottom-3 right-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  title="Replace image"
                  disabled={disabled}
                  className="flex items-center gap-1 rounded-lg bg-slate-900/90 border border-white/20 px-3 py-1.5 text-xs font-medium text-slate-200 backdrop-blur-sm transition-colors hover:bg-slate-800 hover:text-white"
                >
                  <RefreshCw className="h-3.5 w-3.5 text-indigo-400" />
                  Replace
                </button>
                <button
                  type="button"
                  onClick={onFileRemove}
                  title="Remove image"
                  disabled={disabled}
                  className="flex items-center gap-1 rounded-lg bg-rose-950/80 border border-rose-500/30 px-3 py-1.5 text-xs font-medium text-rose-300 backdrop-blur-sm transition-colors hover:bg-rose-900 hover:text-white"
                >
                  <X className="h-3.5 w-3.5" />
                  Remove
                </button>
              </div>
            </div>

            {/* File Metadata Info */}
            <div className="flex items-center justify-between rounded-lg border border-white/5 bg-slate-950/50 px-3.5 py-2 text-xs text-slate-400">
              <div className="flex items-center gap-2 truncate pr-2">
                <ImageIcon className="h-4 w-4 shrink-0 text-slate-400" />
                <span className="truncate font-mono text-slate-300">
                  {file?.name || 'pre-seeded_demo_image.svg'}
                </span>
              </div>
              <span className="shrink-0 font-mono text-slate-500">
                {file ? formatFileSize(file.size) : 'Demo Asset'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
