import { useState, useEffect, useMemo } from "react";
import ActionButtons from "./components/ActionButtons";
import AnalyticsPanel from "./components/AnalyticsPanel";
import StatsCards from "./components/StatsCards";
import StatsPanel from "./components/StatsPanel";
import RecentActivityTable from "./components/RecentActivityTable";
import type { Activity, DashboardStats } from "./types";
import AddPropertyModal from "../../add-property-modal";
import { api } from "../../../lib/api";

// Extended interfaces to match backend data
interface BackendAnalyticsData {
  totalProperties: number;
  soldProperties: number;
  rentedProperties: number;
  availableProperties: number;
}

interface BackendActivityData {
  id: number;
  title: string;
  inquiries: number;
  date: string;
  status: 'Available' | 'Rented' | 'Sold';
}

// Filter interface for API calls
interface DashboardFilters {
  propertyType?: string;
  location?: string;
  dateRange?: string;
}

const Dashboard = () => {
  const [selectedMonth, setSelectedMonth] = useState("August");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activityFilter, setActivityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [filteredTableData, setFilteredTableData] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Add filter states
  const [propertyType, setPropertyType] = useState("All");
  const [dateRange, setDateRange] = useState("Last 30 days");
  const [location, setLocation] = useState("All locations");

  // Real data from backend
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalProperties: 0,
    propertiesSold: 0,
    reviewsNeedingReply: 0,
    pendingCustomers: 0,
    growthRate: 0,
    propertyBreakdown: {
      sold: 0,
      requestedReview: 0,
      rented: 0,
      forSale: 0,
    },
  });

  const [backendActivities, setBackendActivities] = useState<BackendActivityData[]>([]);

  // Convert backend activities to table format
  const tableData = useMemo<Activity[]>(() => {
    return backendActivities.map(activity => ({
      id: activity.id,
      activityType: activity.status === 'Sold' ? 'Property Sold' :
                   activity.status === 'Rented' ? 'Property Rented' : 'Property Listed',
      propertyName: activity.title,
      description: `Property ${activity.status.toLowerCase()} with ${activity.inquiries} inquiries`,
      adminName: "System", // You can enhance this with real admin data if available
      timestamp: new Date(activity.date).toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }),
      status: activity.status === 'Available' ? 'Pending' : 'Success',
    }));
  }, [backendActivities]);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  // Filter options
  const propertyTypeOptions = [
    "All", "Apartment", "House", "Condo", "Townhouse", "Villa", "Studio"
  ];

  const dateOptions = [
    "Last 7 days", "Last 30 days", "Last 3 months", "Last 6 months", "Last year", "All time"
  ];

  const locationOptions = [
    "All locations", "Abuja", "Lagos", "Kaduna", "Port Harcourt", "Ibadan", "Kano"
  ];

  const activityTypes = [
    "All", "Property Listed", "Property Sold", "Property Rented",
    "Review Request", "Review Response",
  ];
  const statusTypes = ["All", "Success", "Pending"];

  // Build filter parameters for API calls
  const buildFilterParams = (): DashboardFilters => {
    const filters: DashboardFilters = {};

    if (propertyType !== "All") {
      filters.propertyType = propertyType;
    }

    if (location !== "All locations") {
      filters.location = location;
    }

    if (dateRange !== "Last 30 days") {
      filters.dateRange = dateRange;
    }

    return filters;
  };

  // Fetch dashboard data from backend with filters
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get filter parameters
      const filterParams = buildFilterParams();

      const [analyticsData, activitiesData, reviewsData] = await Promise.all([
        api.admin.analytics.overview(filterParams),
        api.admin.analytics.recentActivity(20, filterParams),
        api.admin.propertyReviews.list({
          status: 'PENDING',
          ...filterParams
        }),
      ]);

      // Update dashboard stats with real data
      setDashboardStats(prev => ({
        ...prev,
        totalProperties: analyticsData.totalProperties || 0,
        propertiesSold: analyticsData.soldProperties || 0,
        reviewsNeedingReply: Array.isArray(reviewsData) ?
          reviewsData.filter((review: any) => review.status === 'PENDING').length : 0,
        pendingCustomers: analyticsData.availableProperties || 0,
        growthRate: calculateGrowthRate(analyticsData),
        propertyBreakdown: {
          sold: analyticsData.soldProperties || 0,
          requestedReview: Array.isArray(reviewsData) ?
            reviewsData.filter((review: any) => review.status === 'PENDING').length : 0,
          rented: analyticsData.rentedProperties || 0,
          forSale: analyticsData.availableProperties || 0,
        },
      }));

      setBackendActivities(activitiesData || []);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Simple growth rate calculation - you can make this more sophisticated
  const calculateGrowthRate = (data: BackendAnalyticsData): number => {
    const total = data.totalProperties;
    const sold = data.soldProperties;
    if (total === 0) return 0;
    return Number(((sold / total) * 100).toFixed(2));
  };

  // Filter table data based on selected filters
  useEffect(() => {
    let filtered = tableData;

    if (activityFilter !== "All") {
      filtered = filtered.filter(
        (item) => item.activityType === activityFilter
      );
    }

    if (statusFilter !== "All") {
      filtered = filtered.filter((item) => item.status === statusFilter);
    }

    setFilteredTableData(filtered);
  }, [activityFilter, statusFilter, tableData]);

  // Fetch data on component mount and when filters change
  useEffect(() => {
    fetchDashboardData();
  }, [propertyType, dateRange, location]); // Refetch when filters change

  const handleAddProperty = () => {
    setIsAddModalOpen(true);
  };

  const handleRefreshData = () => {
    fetchDashboardData();
  };

  // Loading state
  if (loading) {
    return (
      <div className="admin-dashboard-content flex flex-col gap-6 min-h-screen bg-gray-100/50">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
            <p>Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="admin-dashboard-content flex flex-col gap-6 min-h-screen bg-gray-100/50">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-500 mb-4">Error: {error}</p>
            <button
              onClick={handleRefreshData}
              className="bg-black text-white px-4 py-2 rounded-lg"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-content flex flex-col gap-6 min-h-screen bg-gray-100/50">
      {/* <ActionButtons onAddProperty={handleAddProperty} />
      <AddPropertyModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onPropertyAdded={handleRefreshData}
      /> */}

      {/* Add Filter Section */}
      <div className="p-5 ">
        <div className="flex flex-col lg:flex-row lg:items-center justify-end gap-4">
          {/* <h3 className="text-lg font-semibold text-gray-900">Dashboard Filters</h3> */}
          <div className="flex flex-wrap gap-3">
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm"
            >
              {propertyTypeOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>

            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm"
            >
              {locationOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>

            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm"
            >
              {dateOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>

            <button
              onClick={() => {
                setPropertyType("All");
                setLocation("All locations");
                setDateRange("Last 30 days");
              }}
              className="px-3 py-2 bg-black text-white rounded-lg text-sm transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      <StatsCards stats={dashboardStats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <AnalyticsPanel
          selectedMonth={selectedMonth}
          onMonthSelect={setSelectedMonth}
          months={months}
        />
        <StatsPanel
          selectedMonth={selectedMonth}
          onMonthSelect={setSelectedMonth}
          months={months}
          totalProperties={dashboardStats.totalProperties}
          growthRate={dashboardStats.growthRate}
          propertyBreakdown={dashboardStats.propertyBreakdown}
        />
      </div>

      <RecentActivityTable
        activityFilter={activityFilter}
        statusFilter={statusFilter}
        onActivityFilterChange={setActivityFilter}
        onStatusFilterChange={setStatusFilter}
        activityTypes={activityTypes}
        statusTypes={statusTypes}
        filteredTableData={filteredTableData}
      />

      {/* Add refresh button */}
      <div className="flex justify-end">
        <button
          onClick={handleRefreshData}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Refresh Data
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
