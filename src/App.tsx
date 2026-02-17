import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import ReportNew from './pages/ReportNew';
import ReportUpload from './pages/ReportUpload';
import ReportReview from './pages/ReportReview';
import Reports from './pages/Reports';
import ReportDetail from './pages/ReportDetail';
import Download from './pages/Download';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/download" element={<Download />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/reports/:id" element={<ReportDetail />} />
          <Route path="/reports/new" element={<ReportNew />} />
          <Route path="/reports/new/upload" element={<ReportUpload />} />
          <Route path="/reports/new/review" element={<ReportReview />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
