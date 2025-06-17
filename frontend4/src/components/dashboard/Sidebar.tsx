import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  FileText, 
  ShoppingBag,
  MessageSquare,
  Activity,
  Calendar,
  AlertTriangle,
  Languages,
  Pill,
  ScanLine,
  Stethoscope,
  Heart,
  X 
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
}

interface NavItem {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, closeSidebar }) => {
  const navItems: NavItem[] = [
    { to: '/dashboard', icon: <Home size={20} />, label: 'Dashboard' },
    { to: '/report-scanner', icon: <ScanLine size={20} />, label: 'Report Scanner' },
    { to: '/medicine-verifier', icon: <Pill size={20} />, label: 'Medicine Verify' },
    { to: '/medicine-analyzer', icon: <Stethoscope size={20} />, label: 'Medicine Analysis' },
    { to: '/store', icon: <ShoppingBag size={20} />, label: 'Store' },
    { to: '/prescription-validator', icon: <FileText size={20} />, label: 'Prescription Check' },
    { to: '/chat', icon: <MessageSquare size={20} />, label: 'Chat Assistant' },
    { to: '/health-tracker', icon: <Activity size={20} />, label: 'Health Tracker' },
    { to: '/appointments', icon: <Calendar size={20} />, label: 'Appointments' },
    { to: '/emergency', icon: <AlertTriangle size={20} />, label: 'Emergency' },
    { to: '/translate', icon: <Languages size={20} />, label: 'Translate Reports' },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden"
          onClick={closeSidebar}
        ></div>
      )}
      
      {/* Sidebar */}
      <aside 
        className={`fixed top-0 left-0 bottom-0 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-30 
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:z-auto`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b">
          <div className="flex items-center space-x-2">
            <Heart className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">MedKit</span>
          </div>
          <button 
            className="p-1 rounded-md text-gray-500 hover:text-gray-900 lg:hidden"
            onClick={closeSidebar}
          >
            <X size={20} />
          </button>
        </div>
        
        <nav className="mt-6">
          <ul className="space-y-1 px-2">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) => 
                    `flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                      isActive 
                        ? 'bg-blue-50 text-blue-700' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                  onClick={() => {
                    if (window.innerWidth < 1024) {
                      closeSidebar();
                    }
                  }}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;