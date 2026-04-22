import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Landing from './pages/Landing/Landing';
import Login from './pages/Login/Login';
import DashboardLayout from './layouts/DashboardLayout/DashboardLayout';
import Dashboard from './pages/Dashboard/Dashboard';
import PatientProfile from './pages/PatientProfile/PatientProfile';
import Medications from './pages/Medications/Medications';
import Appointments from './pages/Appointments/Appointments';
import DailyChecklist from './pages/DailyChecklist/DailyChecklist';
import HealthRecords from './pages/HealthRecords/HealthRecords';
import DailyLogs from './pages/DailyLogs/DailyLogs';
import Settings from './pages/Settings/Settings';

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" richColors />
      <BrowserRouter>
        <Routes>
          {/* Rotas Públicas */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          
          {/* Rotas Protegidas (Dashboard) */}
          <Route 
            path="/app" 
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/app/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="profile" element={<PatientProfile />} />
            <Route path="medications" element={<Medications />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="checklist" element={<DailyChecklist />} />
            <Route path="health" element={<HealthRecords />} />
            <Route path="logs" element={<DailyLogs />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
