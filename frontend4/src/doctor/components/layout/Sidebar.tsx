import { NavLink } from 'react-router-dom';
import { useDoctorAuth } from '../../../context/useDoctorAuth';
import { Home, Calendar, Users, User, LogOut, Clock, FileText, Stethoscope } from 'lucide-react';

const items = [
  { name: 'Dashboard Home', href: '/doctor', icon: Home },
  { name: 'Appointments', href: '/doctor/appointments', icon: Calendar },
  { name: 'Patients', href: '/doctor/patients', icon: Users },
  { name: 'Availability', href: '/doctor/availability', icon: Clock },
  { name: 'Documents', href: '/doctor/documents', icon: FileText },
  { name: 'Profile', href: '/doctor/profile', icon: User },
];

const patientShortcuts = [
  { name: 'User Dashboard', href: '/dashboard', icon: Home },
  { name: 'Report Scanner', href: '/report-scanner', icon: FileText },
  { name: 'Appointments (User)', href: '/appointments', icon: Calendar },
];

export function Sidebar() {
  const { logout } = useDoctorAuth();
  const handleLogout = async () => {
    await logout();
    window.location.href = '/login';
  };

  return (
    <div className="flex flex-col w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="flex items-center px-6 py-6 border-b border-gray-200">
        <div className="flex items-center">
          <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-lg">
            <Stethoscope className="w-5 h-5 text-white" />
          </div>
          <span className="ml-3 text-lg font-semibold text-gray-900">MediPortal</span>
        </div>
      </div>
  <nav className="flex-1 px-4 py-6 space-y-1">
        {items.map((item) => (
          <NavLink key={item.name} to={item.href} className={({ isActive }) =>
            `flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${isActive ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`
          }>
            <item.icon className="w-5 h-5 mr-3" />
            {item.name}
          </NavLink>
        ))}
      </nav>
      <div className="px-4 py-2 text-xs uppercase tracking-wide text-gray-500">Patient App</div>
      <nav className="px-4 pb-4 space-y-1">
        {patientShortcuts.map((item) => (
          <NavLink key={item.name} to={item.href} className={({ isActive }) =>
            `flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${isActive ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`
          }>
            <item.icon className="w-5 h-5 mr-3" />
            {item.name}
          </NavLink>
        ))}
      </nav>
      <div className="px-4 py-4 border-t border-gray-200">
        <button onClick={handleLogout} className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900 transition-colors">
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
}
