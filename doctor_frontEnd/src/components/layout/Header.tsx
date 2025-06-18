import React from 'react';
import { Bell, Settings } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';

interface HeaderProps {
  doctorName?: string;
  doctorAvatar?: string;
}

export function Header({ doctorName = 'Dr. Sarah Johnson', doctorAvatar }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Page Title - This could be dynamic based on current route */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Medical Dashboard</h1>
          <p className="text-sm text-gray-500">Welcome back, {doctorName}</p>
        </div>

        {/* Right side - Notifications and Profile */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </Button>

          {/* Settings */}
          <Button variant="ghost" size="sm">
            <Settings className="w-5 h-5" />
          </Button>

          {/* Profile */}
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{doctorName}</p>
              <p className="text-xs text-gray-500">Cardiologist</p>
            </div>
            <Avatar 
              src={doctorAvatar} 
              fallback={doctorName.split(' ').map(n => n[0]).join('')}
              size="md"
            />
          </div>
        </div>
      </div>
    </header>
  );
}