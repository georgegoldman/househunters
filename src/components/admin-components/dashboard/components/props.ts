import type { Activity, DashboardStats } from "../types";

export interface StatsCardsProps {
  stats: DashboardStats;
}

export interface AnalyticsPanelProps {
  selectedMonth: string;
  onMonthSelect: (month: string) => void;
  months: string[];
}

export interface StatsPanelProps {
  selectedMonth: string;
  onMonthSelect: (month: string) => void;
  months: string[];
  totalProperties: number;
  growthRate: number;
  propertyBreakdown: {
    sold: number;
    requestedReview: number;
    rented: number;
    forSale: number;
  };
}

export interface RecentActivityTableProps {
  activityFilter: string;
  statusFilter: string;
  onActivityFilterChange: (filter: string) => void;
  onStatusFilterChange: (filter: string) => void;
  activityTypes: string[];
  statusTypes: string[];
  filteredTableData: Activity[];
}

export interface ActionButtonsProps {
  onAddProperty: (type: string) => void;
}
