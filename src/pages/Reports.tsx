import { Link } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { FileText, Download, Eye, CheckCircle2, AlertCircle, Plus, Search, Trash2 } from 'lucide-react';

export default function Reports() {
  const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';
  const [reports, setReports] = useState<
    Array<{
      id: string;
      title: string;
      status?: { status?: string; progress?: number; error?: string };
      created_at?: string;
      updated_at?: string;
      completeness?: number;
    }>
  >([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const loadReports = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/reports`);
      if (!res.ok) {
        const detail = await res.text();
        throw new Error(detail || 'Failed to load reports');
      }
      const data = await res.json();
      setReports(data?.reports || []);
    } catch (err: any) {
      setError(err?.message || 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    const load = async () => {
      if (!active) return;
      try {
        await loadReports();
      } catch (err: any) {
        if (!active) return;
        setError(err?.message || 'Failed to load reports');
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [API_BASE]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return reports;
    return reports.filter((r) => (r.title || '').toLowerCase().includes(q));
  }, [query, reports]);

  const completedCount = reports.filter((r) => r.status?.status === 'done').length;

  const formatDate = (value?: string) => {
    if (!value) return '';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleDateString();
  };

  const onDownload = async (reportId: string, title: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/reports/${reportId}/download-docx`);
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
    } catch (err) {
      // silent for now
    }
  };

  const onDelete = async (reportId: string) => {
    const ok = window.confirm('Delete this report? This cannot be undone.');
    if (!ok) return;
    setDeleteError(null);
    const snapshot = reports;
    setReports((prev) => prev.filter((r) => r.id !== reportId));
    try {
      const res = await fetch(`${API_BASE}/api/reports/${reportId}`, { method: 'DELETE' });
      if (!res.ok) {
        const detail = await res.text();
        throw new Error(detail || 'Delete failed');
      }
      await loadReports();
    } catch (err) {
      setReports(snapshot);
      setDeleteError('Delete failed. Please try again.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Report Library</h1>
          <p className="text-slate-600">View and download all generated reports</p>
        </div>
        <Link
          to="/reports/new"
          className="inline-flex items-center space-x-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          <span>New Report</span>
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-6">
        <div className="p-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search reports by name, entity, or period..."
              className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-slate-900">{reports.length}</span>
          </div>
          <h3 className="text-sm font-medium text-slate-600">Total Reports</h3>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-2xl font-bold text-slate-900">{completedCount}</span>
          </div>
          <h3 className="text-sm font-medium text-slate-600">Completed</h3>
        </div>


      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center space-x-4">
            <button className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-medium text-sm">
              All Reports
            </button>
            <button className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium text-sm transition-colors">
              Completed
            </button>
        
          </div>
        </div>

        <div className="divide-y divide-slate-200">
          {loading && <div className="p-6 text-sm text-slate-600">Loading reports...</div>}
          {error && <div className="p-6 text-sm text-red-600">{error}</div>}
          {deleteError && <div className="p-6 text-sm text-red-600">{deleteError}</div>}
          {!loading && !error && filtered.length === 0 && (
            <div className="p-6 text-sm text-slate-600">No reports yet.</div>
          )}
          {filtered.map((r) => (
            <div key={r.id} className="block p-6 hover:bg-slate-50 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-1">{r.title}</h3>
                        <p className="text-sm text-slate-600">Egard Management Ltd</p>
                      </div>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        {r.status?.status === 'done' ? 'Complete' : 'Draft'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-xs text-slate-500 mb-3">
                      <span>Generated: {formatDate(r.updated_at || r.created_at) || '—'}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Link
                        to={`/reports/${r.id}`}
                        className="inline-flex items-center space-x-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View</span>
                      </Link>
                      <button
                        className="inline-flex items-center space-x-1 px-3 py-1.5 bg-white text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-100 transition-colors border border-slate-300"
                        onClick={() => onDownload(r.id, r.title)}
                        type="button"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download</span>
                      </button>
                      <button
                        className="inline-flex items-center space-x-1 px-3 py-1.5 bg-white text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors border border-red-200"
                        onClick={() => onDelete(r.id)}
                        type="button"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
