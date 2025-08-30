'use client';

import DashboardOverviewSkeleton from '@/app/components/DashboardOverviewSkeleton';
import ChartSkeleton from '@/app/components/ChartSkeleton';
import TableSkeleton from '@/app/components/TableSkeleton';
import EmptyState from '@/app/components/EmptyState';

import React, { useEffect, Suspense, lazy } from 'react';
import {
  ChartBarIcon,
  UsersIcon,
  BuildingStorefrontIcon,
} from '@heroicons/react/24/outline';
import { useDashboardStore } from '@/store/dashboardStore';

// Lazy load components that are not critical for the initial render
const DashboardOverview = lazy(
  () => import('@/app/components/DashboardOverview')
);
const SalesChart = lazy(() => import('@/app/components/SalesChart'));
const EmployeeActivity = lazy(
  () => import('@/app/components/EmployeeActivity')
);
const RecentStations = lazy(() => import('@/app/components/RecentStations'));

export default function DashboardPage() {
  const { data: dashboardData, isLoading, error, fetchDashboardData } = useDashboardStore();

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // 1. Estado de Carga con Esqueletos
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <DashboardOverviewSkeleton />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <ChartSkeleton />
          <ChartSkeleton />
        </div>
        <TableSkeleton />
      </div>
    );
  }

  // 2. Estado de Error
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-red-600">{error}</p>
      </div>
    );
  }

  // 3. Estado Vacío (Sin datos)
  if (!dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <EmptyState
          title="No hay datos disponibles"
          description="Parece que aún no hay información para mostrar en tu dashboard. Vuelve a intentarlo más tarde o verifica tus configuraciones."
        />
      </div>
    );
  }

  // 4. Estado con Datos (Renderizado Exitoso)
  const overviewMetrics = [
    {
      name: 'Ventas Totales',
      value: `$${dashboardData.totalSales.toFixed(2)}`,
      icon: ChartBarIcon,
    },
    {
      name: 'Empleados Activos',
      value: dashboardData.activeEmployees,
      icon: UsersIcon,
    },
    {
      name: 'Estaciones Operativas',
      value: dashboardData.totalStations,
      icon: BuildingStorefrontIcon,
    },
  ];

  return (
    <Suspense fallback={<div>Cargando componentes...</div>}>
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard del Propietario
          </h1>
          <p className="text-gray-600 mt-1">
            Un resumen de la actividad reciente de tu negocio.
          </p>
        </header>

        <main>
          <DashboardOverview metrics={overviewMetrics} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 my-8">
            <SalesChart salesData={dashboardData.salesOverTime} />
            <EmployeeActivity employees={dashboardData.topEmployees} />
          </div>

          <RecentStations stations={dashboardData.recentStations} />
        </main>
      </div>
    </Suspense>
  );
}