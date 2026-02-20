import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, FileText, Upload } from "lucide-react";
import { getTemplateSections, uploadDocument, createReport } from "../api.js";

export default function SetupPage({ onCreated }) {
  const [templateSections, setTemplateSections] = useState([]);
  const [reportType, setReportType] = useState("annual");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  // Track per-section data: { [sectionName]: { documentIds: [], urls: [] } }
  const [sectionData, setSectionData] = useState({});
  const [uploadingSection, setUploadingSection] = useState(null);

  useEffect(() => {
    const fetchTemplateSections = async () => {
      try {
        setLoading(true);
        const data = await getTemplateSections();
        setTemplateSections(data.section_names || []);
        setError("");
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTemplateSections();
  }, []);

  const handleFileUpload = async (sectionName, file) => {
    if (!file) return;
    setError("");
    setUploadingSection(sectionName);
    try {
      setStatus(`Uploading document for ${sectionName}...`);
      const data = await uploadDocument(file);
      const documentId = data.document_id;

      setSectionData((prev) => ({
        ...prev,
        [sectionName]: {
          ...prev[sectionName],
          documentIds: [...(prev[sectionName]?.documentIds || []), documentId],
        },
      }));
      setStatus(`Document uploaded to ${sectionName}`);
    } catch (e) {
      setError(e.message);
      setStatus("");
    } finally {
      setUploadingSection(null);
    }
  };

  const handleUrlChange = (sectionName, urlIndex, url) => {
    setSectionData((prev) => ({
      ...prev,
      [sectionName]: {
        ...prev[sectionName],
        urls: prev[sectionName]?.urls?.map((u, idx) => (idx === urlIndex ? url : u)) || [url],
      },
    }));
  };

  const handleAddUrl = (sectionName) => {
    setSectionData((prev) => ({
      ...prev,
      [sectionName]: {
        ...prev[sectionName],
        urls: [...(prev[sectionName]?.urls || []), ""],
      },
    }));
  };

  const handleRemoveUrl = (sectionName, urlIndex) => {
    setSectionData((prev) => ({
      ...prev,
      [sectionName]: {
        ...prev[sectionName],
        urls: prev[sectionName]?.urls?.filter((_, idx) => idx !== urlIndex) || [],
      },
    }));
  };

  const handleRemoveDocument = (sectionName, docIndex) => {
    setSectionData((prev) => ({
      ...prev,
      [sectionName]: {
        ...prev[sectionName],
        documentIds: prev[sectionName]?.documentIds?.filter((_, idx) => idx !== docIndex) || [],
      },
    }));
  };

  const getSectionCount = () => {
    return Object.values(sectionData).filter((data) => {
      const hasDocuments = data.documentIds && data.documentIds.length > 0;
      const hasUrls = data.urls && data.urls.some((url) => url.trim() !== "");
      return hasDocuments || hasUrls;
    }).length;
  };

  const handleCreate = async () => {
    setError("");
    setStatus("Generating report...");
    setGenerating(true);
    try {
      // Build sections array with only sections that have data
      const sections = templateSections
        .filter((sectionName) => {
          const data = sectionData[sectionName] || {};
          const hasDocuments = data.documentIds && data.documentIds.length > 0;
          const hasUrls = data.urls && data.urls.some((url) => url.trim() !== "");
          return hasDocuments || hasUrls;
        })
        .map((sectionName) => {
          const data = sectionData[sectionName] || {};
          // Filter out empty URLs
          const filteredUrls = (data.urls || []).filter((url) => url.trim() !== "");
          return {
            section_name: sectionName,
            document_ids: data.documentIds || [],
            urls: filteredUrls,
          };
        });

      const reportData = await createReport({
        report_type: reportType,
        sections,
        generate_now: true,
      });
      setStatus("Done. Opening editor...");
      onCreated(reportData.report_id);
    } catch (e) {
      setError(e.message);
      setStatus("");
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-slate-600">Loading template sections...</p>
        </div>
      </div>
    );
  }

  const sectionCount = getSectionCount();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Link to="/dashboard" className="text-sm text-blue-600 hover:text-blue-700 font-medium mb-4 inline-block">
          ← Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Create New Report</h1>
        <p className="text-slate-600">Upload documents or enter URLs for each section you want to include.</p>
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

        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">
              Template Sections ({templateSections.length})
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Upload a document or enter a URL for each section to include in your report. Sections with no data will be skipped.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
            {templateSections.map((sectionName) => {
              const data = sectionData[sectionName] || {};
              const hasFile = data.documentIds && data.documentIds.length > 0;
              const hasUrl = data.urls && data.urls[0];
              const isLoading = uploadingSection === sectionName;

              return (
                <div
                  key={sectionName}
                  className="border border-slate-200 rounded-lg p-4 hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-medium text-slate-900 text-sm">{sectionName}</h3>
                    {(hasFile || hasUrl) && (
                      <div className="flex gap-1">
                        {hasFile && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 text-xs rounded">
                            ✓ File
                          </span>
                        )}
                        {hasUrl && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 text-xs rounded">
                            ✓ URL
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    {/* Document Upload Section */}
                    <div>
                      <label className="block text-xs text-slate-600 mb-2">Upload Documents</label>
                      <input
                        type="file"
                        disabled={isLoading}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleFileUpload(sectionName, file);
                            e.target.value = "";
                          }
                        }}
                        className="block w-full text-xs text-slate-700 file:mr-2 file:rounded file:border-0 file:bg-blue-50 file:px-3 file:py-1 file:text-xs file:font-medium hover:file:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      {data.documentIds && data.documentIds.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {data.documentIds.map((docId, idx) => (
                            <div
                              key={`${sectionName}-doc-${idx}`}
                              className="flex items-center justify-between bg-green-50 rounded px-2 py-1"
                            >
                              <span className="text-xs text-slate-700 truncate flex-1">
                                {docId}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleRemoveDocument(sectionName, idx)}
                                className="ml-2 text-xs text-red-600 hover:text-red-700 font-medium"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* URLs Section */}
                    <div>
                      <label className="block text-xs text-slate-600 mb-2">Add URLs</label>
                      <div className="space-y-2">
                        {data.urls && data.urls.length > 0 ? (
                          <>
                            {data.urls.map((url, idx) => (
                              <div key={`${sectionName}-url-${idx}`} className="flex gap-1">
                                <input
                                  type="url"
                                  placeholder="https://example.com"
                                  value={url}
                                  onChange={(e) => handleUrlChange(sectionName, idx, e.target.value)}
                                  className="flex-1 text-xs border border-slate-300 rounded px-2 py-1.5 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleRemoveUrl(sectionName, idx)}
                                  className="px-2 py-1.5 text-xs text-red-600 hover:text-red-700 font-medium border border-red-300 rounded hover:bg-red-50"
                                >
                                  ✕
                                </button>
                              </div>
                            ))}
                          </>
                        ) : null}
                        <button
                          type="button"
                          onClick={() => handleAddUrl(sectionName)}
                          className="w-full text-xs px-2 py-1.5 border border-dashed border-slate-300 rounded text-slate-600 hover:border-slate-400 hover:bg-slate-50 transition-colors"
                        >
                          + Add URL
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleCreate}
            disabled={sectionCount === 0}
            className="inline-flex items-center space-x-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <span>Generate Report ({sectionCount} section{sectionCount !== 1 ? "s" : ""})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {(status || error) && !generating && (
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

      {generating && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-sm w-full mx-4">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative w-12 h-12">
                <div className="absolute inset-0 rounded-full border-4 border-slate-200"></div>
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 animate-spin"></div>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-slate-900">Generating Report</p>
                <p className="text-xs text-slate-600 mt-1">This may take a moment...</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
