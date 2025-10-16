// React import not required for current JSX transform
import { Bell, Settings } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { useDoctorAuth } from '../../../context/useDoctorAuth';
import { useTheme } from '../../../context/useTheme';
import { LogOut, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  doctorName?: string;
  doctorAvatar?: string;
}

export function Header({ doctorName, doctorAvatar }: HeaderProps) {
  const { doctor, logout } = useDoctorAuth();
  const name = doctorName || doctor?.name || 'Doctor';
  const { theme, toggle } = useTheme();
  const onLogout = async () => {
    await logout();
    window.location.href = '/login';
  };
  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Medical Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Welcome back, {name}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={toggle}>
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </Button>
          <Button variant="ghost" size="sm">
            <Settings className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onLogout} title="Logout">
            <LogOut className="w-5 h-5" />
          </Button>
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Provider</p>
            </div>
            <Avatar src={doctorAvatar} fallback={name.split(' ').map(n => n[0]).join('')} size="md" />
          </div>
        </div>
      </div>
    </header>
  );
}
