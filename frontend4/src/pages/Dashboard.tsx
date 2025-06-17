import React, { useState } from 'react';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import Sidebar from '../components/dashboard/Sidebar';
import HealthMetricsCard from '../components/dashboard/HealthMetricsCard';
import AppointmentsCard from '../components/dashboard/AppointmentsCard';
import MedicationsCard from '../components/dashboard/MedicationsCard';
import { useAuth } from '../context/AuthContext';

const Dashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader toggleSidebar={toggleSidebar} />
      
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} closeSidebar={closeSidebar} />
        
        <main className="flex-1 p-4 lg:p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name || 'User'}</h1>
            <p className="text-gray-600">Here's your health overview for today</p>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            <HealthMetricsCard />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AppointmentsCard />
              <MedicationsCard />
            </div>
            
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Health Recommendations</h2>
              </div>
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
                <h3 className="font-medium text-blue-800 mb-2">Stay hydrated</h3>
                <p className="text-sm text-blue-700">
                  Remember to drink at least 8 glasses of water today. Staying hydrated helps maintain energy levels and supports overall health.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;