import React from 'react';
import { BuildingStorefrontIcon } from '@heroicons/react/24/outline';

interface RecentStationsProps {
  stations: {
    name: string;
    address: string;
    lastActivity: string;
  }[];
}

export default function RecentStations({ stations }: RecentStationsProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Estaciones Recientes</h3>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {stations.map((station, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center">
                <BuildingStorefrontIcon className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">{station.name}</p>
                  <p className="text-sm text-gray-500">{station.address}</p>
                </div>
              </div>
              <p className="text-sm text-gray-500">{station.lastActivity}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
