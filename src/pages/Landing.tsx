import { Link } from 'react-router-dom';
import { FileText, Clock, Shield, TrendingDown, CheckCircle2, ArrowRight } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      <nav className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold text-slate-900">ReportFlow</span>
            </div>

            <Link
              to="/dashboard"
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
            >
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pt-20 pb-16 text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-8">
            <span>For Administrative Service Providers regulated by CySEC</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            Cut Report Preparation Time
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              From Days to Minutes
            </span>
          </h1>

          <p className="text-xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Stop manually collecting data across systems. Let AI draft your regulatory reports
            while you maintain full control over the final submission.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-16">
            <Link
              to="/dashboard"
              className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
            >
              <span>Start Free Trial</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <button className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition-colors border-2 border-slate-200">
              Watch Demo
            </button>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center space-y-6 md:space-y-0 md:space-x-12 text-sm text-slate-600">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <span>Full data security</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <span>CySEC-aligned structure</span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Save Hours Per Report</h3>
            <p className="text-slate-600 leading-relaxed">
              Reduce AMLCO Annual Report preparation from days to under an hour. Stop chasing data across spreadsheets and emails.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-6">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Reduce Risk</h3>
            <p className="text-slate-600 leading-relaxed">
              AI highlights missing data and gaps before submission. No assumptions made, full transparency on what's included.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-6">
              <TrendingDown className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">Stay in Control</h3>
            <p className="text-slate-600 leading-relaxed">
              This is a drafting assistant, not a compliance engine. You review, edit, and approve everything before filing.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-12 shadow-sm border border-slate-200 mb-20">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">How It Works</h2>
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                  1
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">Select Your Report</h4>
                  <p className="text-slate-600">Choose AMLCO Annual Report and see the required document checklist</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">Upload Your Files</h4>
                  <p className="text-slate-600">Drag and drop available documents - AI extracts relevant data automatically</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                  3
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-1">Review & Download</h4>
                  <p className="text-slate-600">Get your CySEC-aligned draft with clear flags for missing data, ready to review and file</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl p-12 text-center mb-20 shadow-xl">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Save Hours Every Month?</h2>
          <p className="text-blue-100 mb-8 text-lg">Join ASPs already using ReportFlow to streamline compliance</p>
          <Link
            to="/dashboard"
            className="inline-flex items-center space-x-2 px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-lg"
          >
            <span>Get Started Now</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>

      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-slate-600 text-sm">
            <p className="mb-2">A compliance productivity tool for Administrative Service Providers</p>
            <p className="text-slate-400">Not a compliance guarantee - you maintain full control and responsibility</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
