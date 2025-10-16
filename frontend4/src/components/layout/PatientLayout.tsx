import React from 'react';
import { Outlet } from 'react-router-dom';
import DashboardHeader from '../dashboard/DashboardHeader';
import Sidebar from '../dashboard/Sidebar';

export const PatientLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader toggleSidebar={() => setSidebarOpen((s) => !s)} />
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} closeSidebar={() => setSidebarOpen(false)} />
        <main className="flex-1 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default PatientLayout;
