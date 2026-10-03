import React, { useRef, useState } from 'react';
import { Upload, X, RefreshCw, Check, FileImage } from 'lucide-react';

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
  const badgeLabel = isClaim ? 'INPUT // 01: CLAIM' : 'INPUT // 02: EVIDENCE';

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
        alert('Unsupported file format. Please provide PNG, JPG, JPEG, or WEBP.');
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (isValidImage(selectedFile)) {
        onFileSelect(selectedFile);
      } else {
        alert('Unsupported file format. Please provide PNG, JPG, JPEG, or WEBP.');
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
      className={`relative flex flex-col rounded-xl border transition-all duration-150 ${
        isDragging
          ? 'border-zinc-400 bg-zinc-900/90'
          : 'border-zinc-800 bg-[#12141a]'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 px-5 py-3.5">
        <div>
          <span className="font-mono text-[11px] font-semibold tracking-wider text-zinc-400 uppercase">
            {badgeLabel}
          </span>
          <h3 className="font-mono text-base font-bold text-zinc-100 tracking-tight">{title}</h3>
          <p className="text-xs text-zinc-400 mt-0.5">{subtitle}</p>
        </div>

        {file && (
          <span className="flex items-center gap-1 rounded border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-mono text-[11px] font-medium text-emerald-400">
            <Check className="h-3 w-3" />
            STAGED
          </span>
        )}
      </div>

      {/* Main Intake Area */}
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
          /* Empty Intake Zone */
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
            className="group flex min-h-[250px] cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-zinc-700/80 bg-zinc-950/40 p-6 text-center transition-all hover:border-zinc-500 hover:bg-zinc-900/40"
          >
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 group-hover:text-zinc-200 transition-colors">
              <Upload className="h-5 w-5" />
            </div>

            <p className="text-sm font-medium text-zinc-300 group-hover:text-white">
              Drop image here, or <span className="text-zinc-100 underline underline-offset-2">select file</span>
            </p>
            <p className="font-mono text-xs text-zinc-500 mt-1">
              PNG, JPG, JPEG, WEBP &bull; Max 10MB
            </p>
          </div>
        ) : (
          /* Staged Image View */
          <div className="flex flex-col gap-3">
            <div className="relative overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950 flex items-center justify-center min-h-[220px] max-h-[280px]">
              <img
                src={previewUrl || ''}
                alt={`${title} Preview`}
                className="max-h-[280px] w-full object-contain p-2"
              />
              
              {/* Overlay Actions */}
              <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  title="Replace image"
                  disabled={disabled}
                  className="flex items-center gap-1 rounded border border-zinc-700 bg-zinc-900/90 px-2.5 py-1 text-xs font-mono font-medium text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white"
                >
                  <RefreshCw className="h-3 w-3" />
                  Replace
                </button>
                <button
                  type="button"
                  onClick={onFileRemove}
                  title="Remove image"
                  disabled={disabled}
                  className="flex items-center gap-1 rounded border border-zinc-700 bg-zinc-900/90 px-2.5 py-1 text-xs font-mono font-medium text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-red-400"
                >
                  <X className="h-3 w-3" />
                  Clear
                </button>
              </div>
            </div>

            {/* File Telemetry Bar */}
            <div className="flex items-center justify-between rounded border border-zinc-800/80 bg-zinc-950/60 px-3 py-1.5 font-mono text-xs text-zinc-400">
              <div className="flex items-center gap-2 truncate pr-2">
                <FileImage className="h-3.5 w-3.5 shrink-0 text-zinc-500" />
                <span className="truncate text-zinc-300">
                  {file?.name || 'demo_artifact.png'}
                </span>
              </div>
              <span className="shrink-0 text-zinc-500">
                {file ? formatFileSize(file.size) : 'Cached'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
