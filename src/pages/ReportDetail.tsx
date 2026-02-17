import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Download, CheckCircle2, AlertCircle, Edit3, Share2, Save } from 'lucide-react';

export default function ReportDetail() {
  const { id } = useParams();
  const API_BASE = import.meta.env.VITE_API_BASE || 'https://amlco-report-generator-production.up.railway.app';
  const [title, setTitle] = useState('AMLCO Annual Report');
  const [contentHtml, setContentHtml] = useState('');
  const [baseHtml, setBaseHtml] = useState('');
  const [status, setStatus] = useState<{ status?: string; progress?: number; error?: string }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState('');
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const htmlToText = (html: string) => {
    if (!html) return '';
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return (doc.body?.innerText || '').trim();
  };

  const textToHtml = (text: string) => {
    if (!text) return '';
    const rawLines = text.split(/\n/);
    const blocks: string[] = [];
    const isAllCaps = (line: string) => {
      const letters = line.replace(/[^A-Za-z]/g, '');
      return letters.length >= 4 && letters === letters.toUpperCase();
    };
    for (const raw of rawLines) {
      const line = raw.trim();
      if (!line) continue;
      if (line.startsWith('### ')) {
        blocks.push(`<h3>${line.slice(4).trim()}</h3>`);
        continue;
      }
      if (line.startsWith('## ')) {
        blocks.push(`<h2>${line.slice(3).trim()}</h2>`);
        continue;
      }
      if (line.startsWith('# ')) {
        blocks.push(`<h1>${line.slice(2).trim()}</h1>`);
        continue;
      }
      if (isAllCaps(line) || /^[0-9]+(\.[0-9]+)*\s+/.test(line)) {
        blocks.push(`<h2>${line}</h2>`);
        continue;
      }
      blocks.push(`<p>${line}</p>`);
    }
    return `<div>${blocks.join('')}</div>`;
  };

  useEffect(() => {
    if (!id) return;
    let active = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/api/reports/${id}`);
        if (!res.ok) {
          const detail = await res.text();
          throw new Error(detail || 'Failed to load report');
        }
        const data = await res.json();
        if (!active) return;
        setTitle(data?.title || 'AMLCO Annual Report');
        setContentHtml(data?.content_html || '');
        setBaseHtml(data?.base_html || '');
        setEditedText(htmlToText(data?.content_html || data?.base_html || ''));
        setStatus(data?.status || {});
      } catch (err: any) {
        if (!active) return;
        setError(err?.message || 'Failed to load report');
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [API_BASE, id]);

  const statusLabel = status?.status === 'done'
    ? 'Complete'
    : status?.status === 'running'
      ? 'Generating'
      : status?.status === 'error'
        ? 'Error'
        : 'Draft';

  const onDownload = async () => {
    if (!id) return;
    setDownloadError(null);
    try {
      const res = await fetch(`${API_BASE}/api/reports/${id}/download-docx`);
      if (!res.ok) {
        const detail = await res.text();
        throw new Error(detail || 'Download failed');
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title.replace(/\s+/g, '_') || 'AMLCO_Annual_Report'}.docx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setDownloadError(err?.message || 'Download failed');
    }
  };

  const onToggleEdit = () => {
    setSaveError(null);
    setIsEditing((prev) => !prev);
    if (!isEditing) {
      setEditedText(htmlToText(contentHtml || baseHtml || ''));
    }
  };

  const onSave = async () => {
    if (!id) return;
    setSaveError(null);
    setSaving(true);
    try {
      const html = textToHtml(editedText);
      const res = await fetch(`${API_BASE}/api/reports/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content_html: html }),
      });
      if (!res.ok) {
        const detail = await res.text();
        throw new Error(detail || 'Save failed');
      }
      setContentHtml(html);
      setIsEditing(false);
    } catch (err: any) {
      setSaveError(err?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Link to="/reports" className="text-sm text-blue-600 hover:text-blue-700 font-medium mb-4 inline-block">
          ← Back to Reports
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">{title}</h1>
            <p className="text-slate-600">Egard Management Ltd • Jan 1 - Dec 31, 2025</p>
          </div>
          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-green-100 text-green-700">
            <CheckCircle2 className="w-4 h-4 mr-1.5" />
            {statusLabel}
          </span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">Report Preview</h2>
                <div className="flex items-center space-x-2">
                  <button
                    className={`p-2 rounded-lg transition-colors ${isEditing ? 'bg-slate-200' : 'hover:bg-slate-100'}`}
                    onClick={onToggleEdit}
                    type="button"
                  >
                    <Edit3 className="w-5 h-5 text-slate-600" />
                  </button>
                  {isEditing && (
                    <button
                      className="inline-flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                      onClick={onSave}
                      disabled={saving}
                      type="button"
                    >
                      <Save className="w-4 h-4" />
                      <span>{saving ? 'Saving...' : 'Save'}</span>
                    </button>
                  )}
                  <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                    <Share2 className="w-5 h-5 text-slate-600" />
                  </button>
                  <button
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    onClick={onDownload}
                  >
                    <Download className="w-4 h-4" />
                    <span>Download DOCX</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="p-8 bg-slate-50">
              <div className="bg-white rounded-lg shadow-sm p-12 max-w-4xl mx-auto">
                {loading && <p className="text-slate-600">Loading report...</p>}
                {error && <p className="text-red-600 text-sm">{error}</p>}
                {downloadError && <p className="text-red-600 text-sm">{downloadError}</p>}
                {saveError && <p className="text-red-600 text-sm">{saveError}</p>}
                {!loading && !error && !isEditing && (
                  <div
                    className="report-content"
                    dangerouslySetInnerHTML={{ __html: contentHtml || baseHtml || '<p>No content yet.</p>' }}
                  />
                )}
                {!loading && !error && isEditing && (
                  <textarea
                    className="w-full min-h-[500px] border border-slate-300 rounded-lg p-3 text-sm font-mono"
                    value={editedText}
                    onChange={(e) => setEditedText(e.target.value)}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Report Information</h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-slate-500 mb-1">Report Type</p>
                <p className="text-sm font-medium text-slate-900">AMLCO Annual Report</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Entity</p>
                <p className="text-sm font-medium text-slate-900">Egard Management Ltd</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 rounded-xl p-6 border border-green-200">
            <h3 className="text-sm font-semibold text-slate-900 mb-2">Ready for Review</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              This report has been successfully generated and is ready for your review and any necessary edits
              before submission to CySEC.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
