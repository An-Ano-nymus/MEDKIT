import React from 'react';
import { Activity, Heart, BarChart4 } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit: string;
  icon: React.ReactNode;
  color: string;
  change?: {
    value: number;
    isPositive: boolean;
  };
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, value, unit, icon, color, change 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <div className={`p-2 rounded-full ${color}`}>
          {icon}
        </div>
      </div>
      <div className="flex items-baseline">
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <span className="ml-1 text-sm text-gray-500">{unit}</span>
      </div>
      {change && (
        <div className="mt-2 flex items-center">
          <span 
            className={`text-xs font-medium ${
              change.isPositive ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {change.isPositive ? '+' : ''}{change.value}%
          </span>
          <span className="ml-1 text-xs text-gray-500">vs last week</span>
        </div>
      )}
    </div>
  );
};

const HealthMetricsCard: React.FC = () => {
  const metrics = [
    {
      title: 'Heart Rate',
      value: 72,
      unit: 'bpm',
      icon: <Heart size={18} className="text-white" />,
      color: 'bg-red-500',
      change: { value: -2, isPositive: true }
    },
    {
      title: 'Blood Pressure',
      value: '120/80',
      unit: 'mmHg',
      icon: <Activity size={18} className="text-white" />,
      color: 'bg-blue-500',
      change: { value: 0, isPositive: true }
    },
    {
      title: 'Sleep',
      value: 7.5,
      unit: 'hours',
      icon: <BarChart4 size={18} className="text-white" />,
      color: 'bg-purple-500',
      change: { value: 12, isPositive: true }
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Health Metrics</h2>
        <button className="text-sm text-blue-600 hover:text-blue-800">
          View all
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.title} {...metric} />
        ))}
      </div>
    </div>
  );
};

export default HealthMetricsCard;