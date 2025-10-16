import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { DoctorAuthProvider } from '../context/DoctorAuthContext';
import DoctorPrivateRoute from '../utils/DoctorPrivateRoute';
import PrivateRoute from '../utils/PrivateRoute';
import AuthenticationPage from '../pages/AuthenticationPage';
import Dashboard from '../pages/Dashboard';
import ReportScanner from '../pages/ReportScanner';
import MedicineVerifier from '../pages/MedicineVerifier';
import MedicineAnalyzer from '../pages/MedicineAnalyzer';
import Store from '../pages/Store';
import PrescriptionValidator from '../pages/PrescriptionValidator';
import ChatBot from '../pages/ChatBot';
import HealthTracker from '../pages/HealthTracker';
import Appointments from '../pages/Appointments';
import EmergencyAlerts from '../pages/EmergencyAlerts';
import ReportTranslator from '../pages/ReportTranslator';
import Documents from '../pages/Documents.tsx';
import MyAppointments from '../pages/MyAppointments';
import PatientLayout from '../components/layout/PatientLayout';
import { Layout as DoctorLayout } from '../doctor/components/layout/Layout';
import { DoctorDashboard } from '../doctor/pages/Dashboard';
import { DoctorAppointments } from '../doctor/pages/Appointments';
import { DoctorPatients } from '../doctor/pages/Patients';
import { DoctorAvailability } from '../doctor/pages/Availability';
import { DoctorDocuments } from '../doctor/pages/Documents';
import { DoctorProfile } from '../doctor/pages/Profile';

const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DoctorAuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<AuthenticationPage />} />
          <Route path="/signup" element={<AuthenticationPage />} />
          {/* Doctor portal lives in its own app at http://localhost:5174 */}
          
          {/* Protected routes - patient layout wrapper ensures header/sidebar on every page */}
          <Route element={<PrivateRoute />}>
            <Route element={<PatientLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/report-scanner" element={<ReportScanner />} />
              <Route path="/medicine-verifier" element={<MedicineVerifier />} />
              <Route path="/medicine-analyzer" element={<MedicineAnalyzer />} />
              <Route path="/store" element={<Store />} />
              <Route path="/prescription-validator" element={<PrescriptionValidator />} />
              <Route path="/chat" element={<ChatBot />} />
              <Route path="/health-tracker" element={<HealthTracker />} />
              <Route path="/appointments" element={<Appointments />} />
              <Route path="/my-appointments" element={<MyAppointments />} />
              <Route path="/emergency" element={<EmergencyAlerts />} />
              <Route path="/translate" element={<ReportTranslator />} />
              <Route path="/documents" element={<Documents />} />
            </Route>
          </Route>

          {/* Doctor routes - protected by doctor session */}
          <Route element={<DoctorPrivateRoute />}>
            <Route path="/doctor" element={<DoctorLayout><DoctorDashboard /></DoctorLayout>} />
            <Route path="/doctor/appointments" element={<DoctorLayout><DoctorAppointments /></DoctorLayout>} />
            <Route path="/doctor/patients" element={<DoctorLayout><DoctorPatients /></DoctorLayout>} />
            <Route path="/doctor/availability" element={<DoctorLayout><DoctorAvailability /></DoctorLayout>} />
            <Route path="/doctor/documents" element={<DoctorLayout><DoctorDocuments /></DoctorLayout>} />
            <Route path="/doctor/profile" element={<DoctorLayout><DoctorProfile /></DoctorLayout>} />
          </Route>
          
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </DoctorAuthProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default AppRoutes;