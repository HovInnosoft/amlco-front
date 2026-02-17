import { Link } from 'react-router-dom';
import { FileText, Plus, Clock, TrendingUp, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">


      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-2xl font-bold text-slate-900">12.4h</span>
          </div>
          <h3 className="text-sm font-medium text-slate-600 mb-1">Time Saved</h3>
          <p className="text-xs text-slate-500">This month</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-slate-900">8</span>
          </div>
          <h3 className="text-sm font-medium text-slate-600 mb-1">Reports Generated</h3>
          <p className="text-xs text-slate-500">Last 30 days</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-2xl font-bold text-slate-900">95%</span>
          </div>
          <h3 className="text-sm font-medium text-slate-600 mb-1">Avg Completion</h3>
          <p className="text-xs text-slate-500">Data completeness</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">Quick Actions</h2>
            </div>
            <div className="p-6">
              <Link
                to="/reports/new"
                className="flex items-center justify-between p-6 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl text-white hover:from-blue-700 hover:to-cyan-700 transition-all shadow-md hover:shadow-lg group"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-colors">
                    <Plus className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Create New Report</h3>
                    <p className="text-blue-100 text-sm">Start AMLCO Annual Report generation</p>
                  </div>
                </div>
                <div className="text-3xl font-light">→</div>
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200">
           
            <div className="divide-y divide-slate-200">
  
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl p-6 text-white shadow-md">
            <h3 className="text-lg font-semibold mb-3">Upcoming Deadline</h3>
            <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
              <p className="text-sm text-blue-100 mb-1">AMLCO Annual Report</p>
              <p className="text-2xl font-bold mb-1">Feb 28, 2026</p>
              <p className="text-sm text-blue-100">37 days remaining</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Need Help?</h3>
            <div className="space-y-3">
              <a href="#" className="block text-sm text-blue-600 hover:text-blue-700 font-medium">
                View documentation
              </a>
              <a href="#" className="block text-sm text-blue-600 hover:text-blue-700 font-medium">
                Watch tutorial video
              </a>
              <a href="#" className="block text-sm text-blue-600 hover:text-blue-700 font-medium">
                Contact support
              </a>
            </div>
          </div>

          <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
            <h3 className="text-sm font-semibold text-slate-900 mb-2">Disclaimer</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              ReportFlow is a drafting assistant. You maintain full control and responsibility for reviewing,
              editing, and approving all reports before submission to CySEC.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
