import React from 'react';
import { UsersIcon } from '@heroicons/react/24/outline';

interface EmployeeActivityProps {
  employees: {
    name: string;
    station: string;
    tickets: number;
    conversion: number;
  }[];
}

export default function EmployeeActivity({ employees }: EmployeeActivityProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Actividad de Empleados</h3>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {employees.map((employee, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
                <div>
                  <p className="font-medium text-gray-900">{employee.name}</p>
                  <p className="text-sm text-gray-500">{employee.station}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">{employee.tickets} tickets</p>
                <p className="text-sm text-gray-500">{employee.conversion}% conversión</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
