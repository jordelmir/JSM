export interface OverviewData {
  totalStations: number;
  totalEmployees: number;
  totalTicketsToday: number;
  totalRevenue: number;
  weeklyGrowth: number;
  monthlyGrowth: number;
}

export interface WeeklyDataItem {
  day: string;
  tickets: number;
  revenue: number;
}

export interface TopStation {
  name: string;
  tickets: number;
  revenue: number;
  growth: number;
}

export interface EmployeePerformance {
  name: string;
  station: string;
  tickets: number;
  conversion: number;
}

export interface DashboardData {
  overview: OverviewData;
  weeklyData: WeeklyDataItem[];
  topStations: TopStation[];
  employeePerformance: EmployeePerformance[];
}
