import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Activity, Heart, Weight, Moon } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const HealthTracker: React.FC = () => {
  const healthMetrics = [
    { icon: <Heart className="h-6 w-6" />, name: 'Heart Rate', value: '72 bpm', trend: '+2%' },
    { icon: <Activity className="h-6 w-6" />, name: 'Blood Pressure', value: '120/80', trend: '-1%' },
    { icon: <Weight className="h-6 w-6" />, name: 'Weight', value: '70 kg', trend: '0%' },
    { icon: <Moon className="h-6 w-6" />, name: 'Sleep', value: '7.5 hrs', trend: '+5%' }
  ];

  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Heart Rate',
        data: [65, 70, 68, 72, 69, 71, 70],
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1
      },
      {
        label: 'Sleep Hours',
        data: [7, 6.5, 8, 7.5, 7, 8, 7.5],
        borderColor: 'rgb(53, 162, 235)',
        tension: 0.1
      }
    ]
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Health Tracker</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {healthMetrics.map((metric, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                {metric.icon}
              </div>
              <div>
                <p className="text-sm text-gray-500">{metric.name}</p>
                <p className="text-lg font-semibold">{metric.value}</p>
                <p className="text-xs text-gray-500">
                  {metric.trend.startsWith('+') ? (
                    <span className="text-green-600">{metric.trend}</span>
                  ) : (
                    <span className="text-red-600">{metric.trend}</span>
                  )}
                  {' from last week'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Health Trends</h2>
        <div className="h-80">
          <Line data={chartData} options={{ maintainAspectRatio: false }} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Activity Log</h2>
          <div className="space-y-4">
            {['Morning Walk', 'Gym Session', 'Evening Yoga'].map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b">
                <div className="flex items-center space-x-3">
                  <Activity className="h-5 w-5 text-blue-600" />
                  <span>{activity}</span>
                </div>
                <span className="text-sm text-gray-500">2 hours ago</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Upcoming Goals</h2>
          <div className="space-y-4">
            {[
              'Complete 10,000 steps',
              'Sleep 8 hours',
              'Drink 8 glasses of water'
            ].map((goal, index) => (
              <div key={index} className="flex items-center space-x-3 py-2 border-b">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 rounded border-gray-300"
                />
                <span>{goal}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthTracker;