import { Link } from 'react-router-dom';
import { useRef, useState } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, ArrowRight, X } from 'lucide-react';

export default function ReportUpload() {
  const API_BASE = import.meta.env.VITE_API_BASE || 'https://amlco-report-generator-production.up.railway.app';
  const dataInputRef = useRef<HTMLInputElement | null>(null);
  const [dataFiles, setDataFiles] = useState<File[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<
    Array<{
      file: File;
      addedAt: number;
      kind: 'data';
      status: 'uploading' | 'uploaded' | 'error';
      serverId?: string;
      deleteUrl?: string;
    }>
  >([]);

  const uploadExcel = async (file: File) => {
    const form = new FormData();
    form.append('file', file);
    const res = await fetch(`${API_BASE}/api/upload-excel`, { method: 'POST', body: form });
    if (!res.ok) {
      const detail = await res.text();
      throw new Error(detail || 'Upload failed');
    }
    return res.json();
  };

  const uploadDocument = async (file: File) => {
    const form = new FormData();
    form.append('file', file);
    const res = await fetch(`${API_BASE}/api/upload-document`, { method: 'POST', body: form });
    if (!res.ok) {
      const detail = await res.text();
      throw new Error(detail || 'Upload failed');
    }
    return res.json();
  };

  const onPickDataFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (dataInputRef.current) {
      dataInputRef.current.value = '';
    }
    setDataFiles(files);
    const now = Date.now();
    const items = files.map((file, idx) => ({
      file,
      addedAt: now + idx,
      kind: 'data' as const,
      status: 'uploading' as const,
    }));
    setUploadedFiles((prev) => [...prev, ...items]);

    for (const item of items) {
      try {
        const isExcel = item.file.name.toLowerCase().endsWith('.xlsx');
        const result = isExcel ? await uploadExcel(item.file) : await uploadDocument(item.file);
        const serverId = isExcel ? result.excel_id : result.document_id;
        const deleteUrl = isExcel
          ? `${API_BASE}/api/upload-excel/${serverId}`
          : `${API_BASE}/api/upload-document/${serverId}`;
        setUploadedFiles((prev) =>
          prev.map((f) =>
            f.addedAt === item.addedAt ? { ...f, status: 'uploaded', serverId, deleteUrl } : f
          )
        );
        if (isExcel && serverId) {
          localStorage.setItem('excel_id', serverId);
        }
      } catch (err) {
        setUploadedFiles((prev) =>
          prev.map((f) => (f.addedAt === item.addedAt ? { ...f, status: 'error' } : f))
        );
      }
    }
  };

  const removeUploaded = async (index: number) => {
    const target = uploadedFiles[index];
    if (target?.deleteUrl) {
      try {
        await fetch(target.deleteUrl, { method: 'DELETE' });
      } catch (err) {
        // Keep UI responsive even if backend delete fails
      }
    }
    setUploadedFiles((prev) => {
      const next = prev.filter((_, i) => i !== index);
      const nextData = next.filter((item) => item.kind === 'data').map((item) => item.file);
      setDataFiles(nextData);
      return next;
    });
    if (target?.kind === 'data' && target?.file?.name?.toLowerCase().endsWith('.xlsx')) {
      localStorage.removeItem('excel_id');
    }
  };

  const formatBytes = (bytes: number) => {
    if (!bytes) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unit = 0;
    while (size >= 1024 && unit < units.length - 1) {
      size /= 1024;
      unit += 1;
    }
    const value = unit === 0 ? Math.round(size) : Math.round(size * 10) / 10;
    return `${value} ${units[unit]}`;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Link to="/reports/new" className="text-sm text-blue-600 hover:text-blue-700 font-medium mb-4 inline-block">
          ← Back to Report Selection
        </Link>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Upload Documents</h1>
        <p className="text-slate-600">Upload the documents needed for your AMLCO Annual Report</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div
            className="bg-white rounded-xl shadow-sm border-2 border-dashed border-slate-300 p-12 text-center hover:border-blue-400 transition-colors cursor-pointer"
            onClick={() => dataInputRef.current?.click()}
          >
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Drop files here or click to browse</h3>
            <p className="text-sm text-slate-600 mb-4">
              Supports PDF, DOCX, XLSX, CSV and more. Maximum 50MB per file.
            </p>
            <button
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              type="button"
            >
              Browse Files
            </button>
            {dataFiles.length > 0 && (
              <p className="text-xs text-slate-700 mt-3">{dataFiles.length} file(s) selected</p>
            )}
            <input
              ref={dataInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={onPickDataFiles}
            />
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">Uploaded Files ({uploadedFiles.length})</h2>
            </div>
            <div className="divide-y divide-slate-200">
              {uploadedFiles.length === 0 && (
                <div className="p-6 text-sm text-slate-500">No files uploaded yet.</div>
              )}
              {uploadedFiles.map((item, index) => (
                <div key={`${item.file.name}-${item.addedAt}`} className="p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">{item.file.name}</p>
                        <p className="text-xs text-slate-500">{formatBytes(item.file.size)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      {item.status === 'uploaded' && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                      {item.status === 'uploading' && <AlertCircle className="w-5 h-5 text-blue-500" />}
                      {item.status === 'error' && <AlertCircle className="w-5 h-5 text-red-500" />}
                      <button
                        className="p-1 hover:bg-slate-200 rounded transition-colors"
                        onClick={() => removeUploaded(index)}
                        type="button"
                      >
                        <X className="w-4 h-4 text-slate-400" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end items-center">
            <Link
              to="/reports/new/review"
              className="inline-flex items-center space-x-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              <span>Continue to Review</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
