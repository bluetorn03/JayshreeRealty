import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, X, Loader2 } from 'lucide-react';
import { api } from '../services/api';

interface ResumeUploaderProps {
  onUploadSuccess: (fileUrl: string, fileName: string) => void;
  currentFileUrl?: string;
}

export const ResumeUploader: React.FC<ResumeUploaderProps> = ({ onUploadSuccess, currentFileUrl }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string>(currentFileUrl || '');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const ALLOWED_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  const validateFile = (file: File): boolean => {
    setError(null);
    if (!ALLOWED_TYPES.includes(file.type) && !file.name.match(/\.(pdf|doc|docx)$/i)) {
      setError('Invalid file format. Only PDF, DOC, and DOCX files are allowed.');
      return false;
    }
    if (file.size > 10 * 1024 * 1024) { // 10MB Limit
      setError('File size exceeds 10MB limit.');
      return false;
    }
    return true;
  };

  const processUpload = async (fileToUpload: File) => {
    if (!validateFile(fileToUpload)) return;

    setFile(fileToUpload);
    setIsUploading(true);
    setUploadProgress(20);

    try {
      const timer = setInterval(() => {
        setUploadProgress(prev => (prev < 85 ? prev + 15 : prev));
      }, 150);

      const res = await api.uploadFile(fileToUpload);
      clearInterval(timer);

      if (res.success && res.fileUrl) {
        setUploadProgress(100);
        setUploadedUrl(res.fileUrl);
        onUploadSuccess(res.fileUrl, fileToUpload.name);
      } else {
        setError('Upload failed. Please try again.');
      }
    } catch (err) {
      setError('Network error uploading file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processUpload(e.target.files[0]);
    }
  };

  const clearFile = () => {
    setFile(null);
    setUploadedUrl('');
    setUploadProgress(0);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-2 font-outfit">
      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
        Upload Resume / CV * (PDF, DOC, DOCX)
      </label>

      {uploadedUrl ? (
        /* Upload Success Preview */
        <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-600 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 truncate max-w-[200px] sm:max-w-[280px]">
                {file ? file.name : 'Resume Attached'}
              </p>
              <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Ready for submission
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={clearFile}
            className="p-1.5 rounded-lg bg-slate-200 hover:bg-red-100 text-slate-600 hover:text-red-600 transition-colors"
            title="Remove file"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        /* Drag-and-Drop Area */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 ${
            isDragging
              ? 'border-[#c5a059] bg-[#c5a059]/10'
              : 'border-slate-300 bg-slate-50 hover:bg-slate-100/80 hover:border-[#c5a059]'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={handleFileSelect}
            className="hidden"
          />

          {isUploading ? (
            <div className="space-y-3 py-2">
              <Loader2 className="w-8 h-8 text-[#c5a059] animate-spin mx-auto" />
              <p className="text-xs font-bold text-slate-700">Uploading Resume... {uploadProgress}%</p>
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden max-w-xs mx-auto">
                <div
                  className="bg-[#c5a059] h-full transition-all duration-300 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-full bg-[#c5a059]/15 text-[#99732b] flex items-center justify-center mx-auto">
                <UploadCloud className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-slate-800">
                Drag & drop your resume here, or <span className="text-[#99732b] underline">browse file</span>
              </p>
              <p className="text-[10px] text-slate-500">Supports PDF, DOC, DOCX (Max 10MB)</p>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="text-red-600 text-[11px] font-semibold flex items-center gap-1 pt-1">
          <AlertCircle className="w-3.5 h-3.5" /> {error}
        </div>
      )}
    </div>
  );
};
