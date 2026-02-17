import { Download as DownloadIcon } from 'lucide-react';

export default function Download() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-12 max-w-2xl w-full">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center mx-auto mb-6">
          <DownloadIcon className="w-8 h-8 text-white" />
        </div>

        <h1 className="text-3xl font-bold text-slate-900 text-center mb-4">
          Download ReportFlow App
        </h1>

        <p className="text-slate-600 text-center mb-8">
          Click the button below to download the complete source code for your ASP Regulatory Report Automation application.
        </p>

        <div className="flex justify-center mb-8">
          <a
            href="/reportflow-app.zip"
            download="reportflow-app.zip"
            className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg hover:shadow-xl"
          >
            <DownloadIcon className="w-5 h-5" />
            <span>Download ZIP (58KB)</span>
          </a>
        </div>

        <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
          <h3 className="font-semibold text-slate-900 mb-4">After downloading:</h3>
          <ol className="space-y-2 text-slate-600">
            <li className="flex items-start space-x-2">
              <span className="font-semibold text-blue-600">1.</span>
              <span>Extract the ZIP file to your preferred location</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="font-semibold text-blue-600">2.</span>
              <span>Open terminal in the project folder</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="font-semibold text-blue-600">3.</span>
              <span>Run <code className="bg-slate-200 px-2 py-1 rounded text-sm">npm install</code></span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="font-semibold text-blue-600">4.</span>
              <span>Run <code className="bg-slate-200 px-2 py-1 rounded text-sm">npm run dev</code></span>
            </li>
          </ol>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-slate-500">
            The app will start on <span className="font-mono text-slate-700">http://localhost:5173</span>
          </p>
        </div>
      </div>
    </div>
  );
}
