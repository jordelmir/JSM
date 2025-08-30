import React from 'react';
import {
  ChartBarIcon,
  UsersIcon,
  BuildingStorefrontIcon,
} from '@heroicons/react/24/outline';

interface DashboardOverviewProps {
  metrics: {
    name: string;
    value: string | number;
    icon: React.ElementType;
  }[];
}

export default function DashboardOverview({ metrics }: DashboardOverviewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {metrics.map((metric, index) => (
        <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{metric.name}</p>
              <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <metric.icon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
