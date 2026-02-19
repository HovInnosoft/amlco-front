import { useState } from "react";
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
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Setup Report</h1>

      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
        <label className="block text-sm font-medium text-slate-700">Report Type</label>
        <select
          className="w-full border border-slate-300 rounded-lg px-3 py-2"
          value={reportType}
          onChange={(e) => setReportType(e.target.value)}
        >
          <option value="annual">Annual</option>
        </select>
      </div>

      {step === "upload" && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
            <label className="block text-sm font-medium text-slate-700">Source File</label>
            <input
              type="file"
              accept="*/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="block w-full text-sm"
            />
            <button
              type="button"
              onClick={handleUpload}
              disabled={!file}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-60"
            >
              Upload Source File
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
            <label className="block text-sm font-medium text-slate-700">Annual Report (Optional)</label>
            <input
              type="file"
              onChange={(e) => setReportFile(e.target.files?.[0] || null)}
              className="block w-full text-sm"
            />
            <button
              type="button"
              onClick={handleAnnualReportUpload}
              disabled={!reportFile}
              className="px-4 py-2 rounded-lg bg-slate-700 text-white disabled:opacity-60"
            >
              Upload Annual Report
            </button>
            {annualReportId && (
              <p className="text-xs text-green-700">Annual report uploaded: {annualReportId}</p>
            )}
          </div>

          <button
            type="button"
            onClick={goReview}
            disabled={sections.length === 0}
            className="px-4 py-2 rounded-lg bg-emerald-600 text-white disabled:opacity-60"
          >
            Review Parsed Content
          </button>
        </div>
      )}

      {step === "review" && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Parsed Sections</h2>
            <div className="space-y-3">
              {sections.length === 0 && <p className="text-sm text-slate-600">No parsed sections yet.</p>}
              {sections.map((section, idx) => {
                const preview = section.source_texts?.[0]?.text || "";
                const title =
                  section.title ||
                  section.section_title ||
                  section.name ||
                  `Section ${idx + 1}`;
                return (
                  <div key={`${title}-${idx}`} className="border border-slate-200 rounded-lg p-3">
                    <p className="text-sm font-medium text-slate-900">{title}</p>
                    <p className="text-xs text-slate-600 mt-1">{String(preview).slice(0, 180)}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={goUpload}
              className="px-4 py-2 rounded-lg bg-slate-200 text-slate-800"
            >
              Upload More Docs
            </button>
            <button
              type="button"
              onClick={handleCreate}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white"
            >
              Generate Report
            </button>
          </div>
        </div>
      )}

      {status && <p className="text-sm text-slate-700">{status}</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
