import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
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

const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login\" replace />} />
          <Route path="/login" element={<AuthenticationPage />} />
          <Route path="/signup" element={<AuthenticationPage />} />
          
          {/* Protected routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/report-scanner" element={<ReportScanner />} />
            <Route path="/medicine-verifier" element={<MedicineVerifier />} />
            <Route path="/medicine-analyzer" element={<MedicineAnalyzer />} />
            <Route path="/store" element={<Store />} />
            <Route path="/prescription-validator" element={<PrescriptionValidator />} />
            <Route path="/chat" element={<ChatBot />} />
            <Route path="/health-tracker" element={<HealthTracker />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/emergency" element={<EmergencyAlerts />} />
            <Route path="/translate" element={<ReportTranslator />} />
          </Route>
          
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/\" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default AppRoutes;