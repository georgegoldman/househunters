import { useState, useEffect } from "react";
import type { AnalyticsPanelProps } from "./props";
import DropdownButton from "../../common/DropdownButton";
import SalesLineChart from "./SalesLineChart";
import { api } from "../../../../lib/api";

interface SalesData {
  period: string;
  primary: number;
  secondary: number;
}

const AnalyticsPanel = ({
  selectedMonth,
  onMonthSelect,
  months,
}: AnalyticsPanelProps) => {
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartTimeRange, setChartTimeRange] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');

  // Fetch sales data from backend
  const fetchSalesData = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await api.admin.analytics.salesPerformance(chartTimeRange);
      setSalesData(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch sales data');
      console.error('Error fetching sales data:', err);
      setSalesData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalesData();
  }, [chartTimeRange]);

  const handleTimeRangeChange = (timeRange: string) => {
    const rangeMap: Record<string, 'daily' | 'weekly' | 'monthly' | 'yearly'> = {
      'Daily': 'daily',
      'Weekly': 'weekly',
      'Monthly': 'monthly',
      'Yearly': 'yearly'
    };
    setChartTimeRange(rangeMap[timeRange] || 'monthly');
  };

  return (
    <div className="lg:col-span-2 bg-gray-50 p-5 rounded-xl flex flex-col gap-4 h-80 shadow-sm">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-xl font-bold text-gray-900">Analytics</h2>
        <div className="flex gap-2">
          <DropdownButton
            withBorder
            options={["Daily", "Weekly", "Monthly", "Yearly"]}
            selected={chartTimeRange.charAt(0).toUpperCase() + chartTimeRange.slice(1)}
            onSelect={handleTimeRangeChange}
            placeholder="Monthly"
          />
          <DropdownButton
            withBorder
            options={months}
            selected={selectedMonth}
            onSelect={onMonthSelect}
            placeholder="Month"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Loading chart...</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-sm text-red-500 mb-2">Error loading data</p>
            <button
              onClick={fetchSalesData}
              className="text-xs bg-gray-200 px-3 py-1 rounded"
            >
              Retry
            </button>
          </div>
        </div>
      ) : (
        <SalesLineChart data={salesData} />
      )}
    </div>
  );
};

export default AnalyticsPanel;
