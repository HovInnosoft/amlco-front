import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, FileText } from "lucide-react";
import { uploadSource, uploadAnnualReport, createReport } from "../api.js";

export default function SetupPage({ onCreated }) {
  const [file, setFile] = useState(null);
  const [sections, setSections] = useState([]);
  const [sourceIds, setSourceIds] = useState([]);
  const [reportFile, setReportFile] = useState(null);
  const [annualReportId, setAnnualReportId] = useState("");
  const [reportType, setReportType] = useState("annual");
  const [step, setStep] = useState("upload"); // upload | review
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const handleUpload = async () => {
    setError("");
    setStatus("Uploading & parsing source file...");
    try {
      const data = await uploadSource(file);
      const uploadedSections = data.sections || [];
      setSections((prev) => [...prev, ...uploadedSections]);

      const id = data.source_id || data.excel_id || "";
      if (id) setSourceIds((prev) => (prev.includes(id) ? prev : [...prev, id]));

      const mode = data.parse_mode ? ` (${data.parse_mode})` : "";
      setStatus(`Parsed sections: ${uploadedSections.length}${mode}`);
      setFile(null);
    } catch (e) {
      setError(e.message);
      setStatus("");
    }
  };

  const handleAnnualReportUpload = async () => {
    if (!reportFile) return;
    setError("");
    setStatus("Uploading annual report...");
    try {
      const data = await uploadAnnualReport(reportFile);
      setAnnualReportId(data.annual_report_id || "");
      setStatus("Annual report uploaded.");
      setReportFile(null);
    } catch (e) {
      setError(e.message);
      setStatus("");
    }
  };

  const goReview = () => {
    setError("");
    setStep("review");
  };

  const goUpload = () => {
    setError("");
    setStep("upload");
  };

  const handleCreate = async () => {
    setError("");
    setStatus("Generating report...");
    try {
      const latestSourceId = sourceIds.length ? sourceIds[sourceIds.length - 1] : undefined;
      const data = await createReport({
        report_type: reportType,
        annual_report_id: annualReportId,
        source_id: latestSourceId,
        sections,
        generate_now: true,
      });
      setStatus("Done. Opening editor...");
      onCreated(data.report_id);
    } catch (e) {
      setError(e.message);
      setStatus("");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Link to="/dashboard" className="text-sm text-blue-600 hover:text-blue-700 font-medium mb-4 inline-block">
          ← Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Create New Report</h1>
        <p className="text-slate-600">Upload source documents, review parsed sections, and generate your draft.</p>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Report Type</h2>
          <select
            className="w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm"
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
          >
            <option value="annual">AMLCO Annual Report</option>
          </select>
        </div>

        {step === "upload" && (
          <>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Source File</h2>
              <p className="text-sm text-slate-600 mb-4">
                Upload one source file at a time. Parsed sections will be appended.
              </p>
              <input
                type="file"
                accept="*/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="block w-full text-sm text-slate-700 file:mr-4 file:rounded-lg file:border-0 file:bg-slate-100 file:px-4 file:py-2 file:text-sm file:font-medium hover:file:bg-slate-200"
              />
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  {sourceIds.length} source file(s) uploaded • {sections.length} section(s) parsed
                </span>
                <button
                  type="button"
                  onClick={handleUpload}
                  disabled={!file}
                  className="inline-flex items-center space-x-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <span>Upload Source File</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Annual Report (Optional)</h2>
              <input
                type="file"
                onChange={(e) => setReportFile(e.target.files?.[0] || null)}
                className="block w-full text-sm text-slate-700 file:mr-4 file:rounded-lg file:border-0 file:bg-slate-100 file:px-4 file:py-2 file:text-sm file:font-medium hover:file:bg-slate-200"
              />
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  {annualReportId ? "Annual report uploaded" : "No annual report uploaded"}
                </span>
                <button
                  type="button"
                  onClick={handleAnnualReportUpload}
                  disabled={!reportFile}
                  className="inline-flex items-center space-x-2 px-5 py-2.5 bg-slate-700 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <span>Upload Annual Report</span>
                </button>
              </div>
              {annualReportId && (
                <p className="text-xs text-green-700 mt-3">Annual report id: {annualReportId}</p>
              )}
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={goReview}
                disabled={sections.length === 0}
                className="inline-flex items-center space-x-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <span>Review Parsed Content</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </>
        )}

        {step === "review" && (
          <>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200">
              <div className="p-6 border-b border-slate-200">
                <h2 className="text-lg font-semibold text-slate-900">Parsed Sections ({sections.length})</h2>
              </div>
              <div className="divide-y divide-slate-200">
                {sections.length === 0 && (
                  <div className="p-6 text-sm text-slate-500">No parsed sections yet.</div>
                )}
                {sections.map((section, idx) => {
                  const preview = section.source_texts?.[0]?.text || "";
                  const title =
                    section.title ||
                    section.section_title ||
                    section.name ||
                    `Section ${idx + 1}`;
                  return (
                    <div key={`${title}-${idx}`} className="p-4 hover:bg-slate-50 transition-colors">
                      <div className="flex items-start space-x-3">
                        <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileText className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-slate-900">{title}</p>
                          <p className="text-xs text-slate-600 mt-1">{String(preview).slice(0, 220) || "No preview text."}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={goUpload}
                className="inline-flex items-center space-x-2 px-6 py-2.5 bg-white text-slate-700 rounded-lg font-medium hover:bg-slate-100 transition-colors border border-slate-300"
              >
                <span>Upload More Docs</span>
              </button>
              <button
                type="button"
                onClick={handleCreate}
                className="inline-flex items-center space-x-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                <span>Generate Report</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </>
        )}

        {(status || error) && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            {status && (
              <p className="text-sm text-green-700 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{status}</span>
              </p>
            )}
            {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
