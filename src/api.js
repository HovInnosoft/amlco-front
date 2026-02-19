const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

export async function uploadSource(file) {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch(`${API_BASE}/api/upload-source`, { method: "POST", body: fd });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Upload failed");
  return data; // {source_id, sections, parse_mode}
}

export async function uploadAnnualReport(file) {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch(`${API_BASE}/api/upload-annual-report`, { method: "POST", body: fd });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Upload failed");
  return data; // {annual_report_id}
}

export async function createReport({ report_type, annual_report_id, source_id, sections, generate_now = false }) {
  const res = await fetch(`${API_BASE}/api/reports`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ report_type, annual_report_id, source_id, sections, generate_now }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Create report failed");
  return data; // {report_id}
}
