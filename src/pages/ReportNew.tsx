import { Link } from 'react-router-dom';
import { FileText, CheckCircle2, ArrowRight } from 'lucide-react';

export default function ReportNew() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Link to="/dashboard" className="text-sm text-blue-600 hover:text-blue-700 font-medium mb-4 inline-block">
          ← Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Create New Report</h1>
        <p className="text-slate-600">Select the type of report you want to generate</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <FileText className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-1">AMLCO Annual Report</h3>
                <p className="text-sm text-slate-600 mb-4">
                  Comprehensive annual report for Anti-Money Laundering Compliance Officer,
                  required by CySEC for all Administrative Service Providers
                </p>
              </div>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 ml-4">
                Recommended
              </span>
            </div>

            <div className="bg-slate-50 rounded-lg p-4 mb-4">
              <h4 className="text-sm font-semibold text-slate-900 mb-3">Required Documents:</h4>
              <div className="grid md:grid-cols-2 gap-2">
                <div className="flex items-center space-x-2 text-sm text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <span>Client onboarding records</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <span>Transaction monitoring logs</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <span>Suspicious activity reports</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <span>Training records</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <span>Risk assessments</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <span>Policy documents</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <span>Audit reports</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <span>Previous AMLCO reports</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end">
              <Link
                to="/reports/new/upload"
                className="inline-flex items-center space-x-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-100 rounded-xl p-6 border border-slate-200 opacity-60">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 w-12 h-12 bg-slate-300 rounded-lg flex items-center justify-center">
            <FileText className="w-6 h-6 text-slate-500" />
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-lg font-semibold text-slate-700 mb-1">Monthly Compliance Report</h3>
                <p className="text-sm text-slate-500 mb-3">
                  Coming soon - Monthly summary of compliance activities and KPIs
                </p>
              </div>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-300 text-slate-600 ml-4">
                Coming Soon
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
