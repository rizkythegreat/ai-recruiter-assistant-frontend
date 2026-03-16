'use client';

import {
  Upload,
  X,
  FileText,
  CheckCircle2,
  Loader2,
  AlertCircle,
  XCircle,
  Database,
  Info
} from 'lucide-react';
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { uploadCVs } from '@/services/cv.service';
import { useApps } from '../hooks/useApps';

interface UploadFile {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
}

const SAMPLE_FILES = [
  'alex-wijaya.pdf',
  'budi-santoso.pdf',
  'dewi-lestari.pdf',
  'rian-pratama.pdf',
  'siti-aminah.pdf'
];

export default function UploadPage() {
  const { userId } = useApps();
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [hasLoadedSamples, setHasLoadedSamples] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) => ({
      file,
      progress: 0,
      status: 'pending' as const
    }));
    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const loadSampleData = async () => {
    try {
      const sampleFilesPromises = SAMPLE_FILES.map(async (filename) => {
        const response = await fetch(`/sample-files/pdf/${filename}`);
        const blob = await response.blob();
        return new File([blob], filename, { type: 'application/pdf' });
      });

      const loadedFiles = await Promise.all(sampleFilesPromises);
      const newFiles = loadedFiles.map((file) => ({
        file,
        progress: 0,
        status: 'pending' as const
      }));
      setFiles((prev) => [...prev, ...newFiles]);
      setHasLoadedSamples(true);
    } catch (err) {
      console.error('Failed to load sample files:', err);
      setUploadError(
        'Failed to load sample files. Make sure they exist in public/sample-files/pdf/'
      );
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    }
  });

  const startUpload = async () => {
    const pendingFiles = files.filter((f) => f.status !== 'completed');
    if (pendingFiles.length === 0) return;

    setIsUploading(true);

    // Mark all pending files as uploading
    setFiles((prev) =>
      prev.map((f) =>
        f.status === 'pending' ? { ...f, status: 'uploading' as const, progress: 0 } : f
      )
    );

    // Run a smooth 3-second progress animation (0 → 95%) in parallel with the API call
    const DURATION_MS = 3000;
    const TICK_MS = 80;
    const increment = 95 / (DURATION_MS / TICK_MS);
    let current = 0;

    const animationPromise = new Promise<void>((resolve) => {
      const interval = setInterval(() => {
        current = Math.min(current + increment, 95);
        setFiles((prev) =>
          prev.map((f) => (f.status === 'uploading' ? { ...f, progress: Math.round(current) } : f))
        );
        if (current >= 95) {
          clearInterval(interval);
          resolve();
        }
      }, TICK_MS);
    });

    try {
      const rawFiles = pendingFiles.map((f) => f.file);
      await Promise.all([uploadCVs(rawFiles, userId), animationPromise]);

      // Mark all as completed
      setFiles((prev) =>
        prev.map((f) =>
          f.status === 'uploading' ? { ...f, progress: 100, status: 'completed' as const } : f
        )
      );
    } catch (err: any) {
      setUploadError(err.message ?? 'Upload failed. Please try again.');
      setFiles((prev) =>
        prev.map((f) => (f.status === 'uploading' ? { ...f, status: 'error' as const } : f))
      );
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Upload Center</h1>
        <p className="text-muted-foreground mt-2 text-slate-500">
          Upload CVs in PDF or Docx format. AI will automatically parse and index them.
        </p>

        <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-3 text-blue-800 text-sm">
          <Info className="w-5 h-5 mt-0.5 shrink-0" />
          <p>
            <strong>System Information:</strong> All sample data provided in this application is
            AI-generated and does not represent real individuals. Any resemblance to actual persons
            is purely coincidental.
          </p>
        </div>
      </div>

      {uploadError && (
        <div className="mt-0 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-800 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span className="flex-1">{uploadError}</span>
          <button
            className="px-2 py-1 hover:bg-red-100 rounded text-red-900 transition-colors"
            onClick={() => setUploadError(null)}>
            Dismiss
          </button>
        </div>
      )}

      <div
        {...getRootProps()}
        className={`mt-2 border-2 border-dashed rounded-3xl p-8 sm:p-16 flex flex-col items-center justify-center transition-all cursor-pointer ${
          isDragActive
            ? 'border-emerald-500 bg-emerald-50/50 scale-[1.01]'
            : 'border-slate-200 hover:border-slate-300 bg-white shadow-sm'
        }`}>
        <input {...getInputProps()} />
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <Upload className={`w-8 h-8 ${isDragActive ? 'text-primary' : 'text-base-content/40'}`} />
        </div>
        <p className="text-lg font-medium text-base-content">Drag & drop files here</p>
        <p className="text-sm text-base-content/50 mt-1">or click to browse from your computer</p>
        <p className="text-xs text-base-content/40 mt-4 uppercase font-semibold tracking-wider">
          Supports PDF, DOCX (Max 10MB)
        </p>
      </div>
      <div className="flex gap-4 justify-between items-center flex-wrap">
        <p className="text-xs text-slate-400">
          Or use pre-built sample CVs to quickly explore the app.
        </p>
        <button
          onClick={loadSampleData}
          disabled={isUploading || hasLoadedSamples}
          className="flex cursor-pointer items-center gap-2 px-4 border-2 border-dashed hover:border-slate-300 border-slate-200 py-2 bg-white hover:bg-slate-200 text-slate-700 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed shrink-0">
          <Database className="w-4 h-4" />
          {hasLoadedSamples ? 'Sample Data Added' : 'Use Sample Data'}
        </button>
      </div>

      {files.length > 0 && (
        <div className="bg-base-100 border border-base-300 rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-base-300 bg-base-200 flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-semibold text-sm">Files to upload ({files.length})</h3>
            <div className="flex items-center gap-2">
              {isUploading ? (
                <div className="flex items-center gap-2 text-primary text-sm font-medium">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="hidden sm:inline">Processing with AI...</span>
                </div>
              ) : (
                <button
                  onClick={startUpload}
                  disabled={files.every((f) => f.status === 'completed')}
                  className="btn btn-primary btn-sm">
                  Start Upload
                </button>
              )}
              {files.length > 0 && (
                <button
                  onClick={() => {
                    setFiles([]);
                    setHasLoadedSamples(false);
                  }}
                  disabled={isUploading}
                  className="px-3 py-1.5 cursor-pointer text-slate-500 hover:text-slate-800 text-sm transition-colors disabled:opacity-50">
                  Clear All
                </button>
              )}
            </div>
          </div>
          <div className="divide-y divide-base-200 max-h-96 overflow-y-auto">
            {files.map((fileObj, idx) => (
              <div key={idx} className="p-4 flex items-center gap-4">
                <FileText className="w-8 h-8 text-base-content/20 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-base-content truncate">
                      {fileObj.file.name}
                    </span>
                    <span className="text-xs text-base-content/50">
                      {(fileObj.file.size / 1024).toFixed(1)} KB
                    </span>
                  </div>
                  {fileObj.status !== 'pending' && (
                    <progress
                      className={`progress w-full ${fileObj.status === 'completed' ? 'progress-success' : 'progress-primary'}`}
                      value={fileObj.progress}
                      max="100"></progress>
                  )}
                </div>
                <div className="shrink-0 ml-2">
                  {fileObj.status === 'completed' ? (
                    <CheckCircle2 className="w-5 h-5 text-success" />
                  ) : fileObj.status === 'error' ? (
                    <XCircle className="w-5 h-5 text-error" />
                  ) : (
                    <button
                      onClick={() => removeFile(idx)}
                      disabled={isUploading}
                      className="btn btn-ghost btn-xs text-base-content/40 hover:text-error">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
