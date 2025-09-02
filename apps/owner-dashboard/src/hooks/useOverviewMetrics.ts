import {
  ChartBarIcon,
  UsersIcon,
  BuildingStorefrontIcon,
} from '@heroicons/react/24/outline';
import { useMemo } from 'react';

// Se asume un tipo para los datos del dashboard basado en el uso en page.tsx
type DashboardData = {
  totalSales: number;
  activeEmployees: number;
  totalStations: number;
  salesOverTime: any[];
  employeeActivityOverTime: any[];
  stationActivityOverTime: any[];
};

type OverviewMetric = {
  name: string;
  value: string | number;
  icon: React.ForwardRefExoticComponent<React.PropsWithoutRef<React.SVGProps<SVGSVGElement>> & { title?: string, titleId?: string } & React.RefAttributes<SVGSVGElement>>;
  sparklineData: any[];
  sparklineDataKey: string;
  sparklineColor: string;
};

export const useOverviewMetrics = (dashboardData: DashboardData | null): OverviewMetric[] => {
  const metrics = useMemo(() => {
    if (!dashboardData) {
      return [];
    }

    return [
      {
        name: 'Ventas Totales',
        value: `$${dashboardData.totalSales.toFixed(2)}`,
        icon: ChartBarIcon,
        sparklineData: dashboardData.salesOverTime,
        sparklineDataKey: 'sales',
        sparklineColor: '#8884d8',
      },
      {
        name: 'Empleados Activos',
        value: dashboardData.activeEmployees,
        icon: UsersIcon,
        sparklineData: dashboardData.employeeActivityOverTime,
        sparklineDataKey: 'activity',
        sparklineColor: '#82ca9d',
      },
      {
        name: 'Estaciones Operativas',
        value: dashboardData.totalStations,
        icon: BuildingStorefrontIcon,
        sparklineData: dashboardData.stationActivityOverTime,
        sparklineDataKey: 'activity',
        sparklineColor: '#ffc658',
      },
    ];
  }, [dashboardData]);

  return metrics;
};
