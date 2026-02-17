import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { CheckCircle2, AlertCircle, Download, ArrowRight, Loader2 } from 'lucide-react';

export default function ReportReview() {
  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onGenerate = async () => {
    setError(null);
    const excelId = localStorage.getItem('excel_id');
    if (!excelId) {
      setError('Please upload the Excel file before generating.');
      return;
    }
    setIsGenerating(true);
    try {
      const res = await fetch(`${API_BASE}/api/reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          report_type: 'annual',
          excel_id: excelId,
          generate_now: true,
        }),
      });
      if (!res.ok) {
        const detail = await res.text();
        throw new Error(detail || 'Failed to generate report');
      }
      const data = await res.json();
      if (data?.report_id) {
        navigate(`/reports/${data.report_id}`);
        return;
      }
      setError('Report created, but no report ID returned.');
    } catch (err: any) {
      setError(err?.message || 'Failed to generate report');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Link to="/reports/new/upload" className="text-sm text-blue-600 hover:text-blue-700 font-medium mb-4 inline-block">
          ← Back to Upload
        </Link>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Review & Generate Report</h1>
        <p className="text-slate-600">Review extracted data and generate your AMLCO Annual Report</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl p-8 text-white shadow-lg">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Ready to Generate Report</h2>
                <p className="text-blue-100">
                  All critical data has been extracted. Generate your draft AMLCO Annual Report now.
                </p>
              </div>
              <Loader2 className={`w-6 h-6 animate-spin ${isGenerating ? 'opacity-100' : 'opacity-0'}`} />
            </div>
            <button
              className="w-full py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center space-x-2 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
              onClick={onGenerate}
              disabled={isGenerating}
            >
              <span>{isGenerating ? 'Generating...' : 'Generate Report'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            {error && <p className="mt-3 text-sm text-yellow-100">{error}</p>}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Report Details</h3>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-slate-500 mb-1">Report Type</p>
                <p className="text-sm font-medium text-slate-900">AMLCO Annual Report</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Entity</p>
                <p className="text-sm font-medium text-slate-900">Egard Management Ltd</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Reporting Period</p>
                <p className="text-sm font-medium text-slate-900">January 1 - December 31, 2025</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Documents Processed</p>
                <p className="text-sm font-medium text-slate-900">6 files</p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
            <h3 className="text-sm font-semibold text-slate-900 mb-2">Important</h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              This is a draft report. You must review all content, verify accuracy, and make necessary
              edits before submitting to CySEC.
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              Missing data has been clearly flagged and should be addressed before final submission.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
