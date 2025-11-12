import { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
} from "recharts";
import SalesLineChart from "./components/SalesLineChart";
import DropdownButton from "../common/DropdownButton";
import DownloadIcon from "../../../assets/download-icon";
import { api, type SalesData } from "../../../lib/api";


interface LocationPerformance {
  city: string;
  properties: number;
  inquiries: number;
  sales: number;
  rentals: number;
}

interface ActivityData {
  id: number;
  title: string;
  inquiries: number;
  date: string;
  status: 'Available' | 'Rented' | 'Sold';
}

interface ResponseMetrics {
  avgResponseTime: number;
  fastestResponse: number;
  slowestResponse: number;
}

const Analytics = () => {
  const [propertyType, setPropertyType] = useState("All");
  const [date, setDate] = useState("Last 30 days");
  const [location, setLocation] = useState("All locations");
  const [chartTimeRange, setChartTimeRange] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');

  // Real data state
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [locationData, setLocationData] = useState<LocationPerformance[]>([]);
  const [activities, setActivities] = useState<ActivityData[]>([]);
  const [responseMetrics, setResponseMetrics] = useState<ResponseMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    text: string;
  }>({ visible: false, x: 0, y: 0, text: "" });

  const propertyTypeOptions = [
    "All",
    "Apartment",
    "House",
    "Condo",
    "Townhouse",
  ];
  const dateOptions = [
    "Last 7 days",
    "Last 30 days",
    "Last 3 months",
    "Last 6 months",
    "Last year",
  ];
  const locationOptions = [
    "All locations",
    "Downtown",
    "Suburbs",
    "City Center",
    "Rural",
  ];

  // Fetch analytics data
  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [salesData, locationsData, activitiesData, responseData] = await Promise.all([
        api.admin.analytics.salesPerformance(chartTimeRange),
        api.admin.analytics.locationPerformance(),
        api.admin.analytics.recentActivity(10),
        api.admin.analytics.responseMetrics()
      ]);

      setSalesData(salesData || []);
      setLocationData(locationsData || []);
      setActivities(activitiesData || []);
      setResponseMetrics(responseData || { avgResponseTime: 0, fastestResponse: 0, slowestResponse: 0 });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics data');
      console.error('Error fetching analytics data:', err);
    } finally {
      setLoading(false);
    }
  };

  // CSV download function
  const downloadCSV = (csvContent: string, filename: string) => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const handleDownloadAnalytics = () => {
    const timestamp = new Date().toISOString().split('T')[0];

    // Combine all data into one CSV
    let combinedCSV = '';

    // Sales Data Section
    combinedCSV += 'SALES PERFORMANCE\n';
    combinedCSV += 'Period,Sales Revenue,Rental Revenue\n';
    salesData.forEach(item => {
      combinedCSV += `${item.month || 'N/A'},${item.primary},${item.secondary}\n`;
    });

    combinedCSV += '\n'; // Empty line separator

    // Location Data Section
    combinedCSV += 'LOCATION PERFORMANCE\n';
    combinedCSV += 'City,Properties,Inquiries,Sales,Rentals\n';
    locationData.forEach(item => {
      combinedCSV += `${item.city},${item.properties},${item.inquiries},${item.sales},${item.rentals}\n`;
    });

    combinedCSV += '\n'; // Empty line separator

    // Activities Data Section
    combinedCSV += 'RECENT ACTIVITIES\n';
    combinedCSV += 'Title,Inquiries,Date,Status\n';
    activities.forEach(item => {
      combinedCSV += `"${item.title}",${item.inquiries},${item.date},${item.status}\n`;
    });

    combinedCSV += '\n'; // Empty line separator

    // Response Metrics Section
    if (responseMetrics) {
      combinedCSV += 'RESPONSE METRICS\n';
      combinedCSV += 'Metric,Value (minutes)\n';
      combinedCSV += `Average Response Time,${responseMetrics.avgResponseTime}\n`;
      combinedCSV += `Fastest Response Time,${responseMetrics.fastestResponse}\n`;
      combinedCSV += `Slowest Response Time,${responseMetrics.slowestResponse}\n`;
    }

    downloadCSV(combinedCSV, `complete-analytics-${timestamp}.csv`);
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, [chartTimeRange]);

  // Create performance tiers and location mapping for heatmap
  const getPerformanceHeatmapData = () => {
    if (locationData.length === 0) return { locations: [], performanceTiers: [], locationDataMap: {} };

    const maxInquiries = Math.max(...locationData.map(l => l.inquiries));
    const maxSales = Math.max(...locationData.map(l => l.sales));
    const maxRentals = Math.max(...locationData.map(l => l.rentals));

    const performanceTiers = [
      Math.round(maxInquiries).toString(),
      Math.round(maxInquiries * 0.8).toString(),
      Math.round(maxInquiries * 0.6).toString(),
      Math.round(maxInquiries * 0.4).toString(),
      Math.round(maxInquiries * 0.2).toString(),
      Math.round(maxInquiries * 0.1).toString(),
    ];

    const locations = locationData.slice(0, 9).map(l => l.city.substring(0, 3));

    const locationDataMap: Record<string, Record<string, string>> = {};

    locationData.slice(0, 9).forEach(location => {
      const cityCode = location.city.substring(0, 3);
      locationDataMap[cityCode] = {};

      performanceTiers.forEach(tier => {
        const tierValue = parseInt(tier);
        if (location.inquiries >= tierValue) {
          locationDataMap[cityCode][tier] = "inquiries";
        } else if (location.sales >= tierValue * 0.5) {
          locationDataMap[cityCode][tier] = "sales";
        } else {
          locationDataMap[cityCode][tier] = "rentals";
        }
      });
    });

    return { locations, performanceTiers, locationDataMap };
  };

  const { locations, performanceTiers, locationDataMap } = getPerformanceHeatmapData();

  const getColorForMetric = (metric: string) => {
    switch (metric) {
      case "inquiries":
        return "bg-black";
      case "sales":
        return "bg-black/50";
      case "rentals":
        return "bg-black/20";
      default:
        return "bg-black/10";
    }
  };

  const statusColor: Record<"Available" | "Rented" | "Sold", string> = {
    Available: "text-[#009442]",
    Rented: "text-[#BA23ED]",
    Sold: "text-[#1B2BDE]",
  };

  // Response time donut data
  const responseChartData = responseMetrics ? [
    { name: "Avg Response Time", value: responseMetrics.avgResponseTime, color: "#4285F4" },
    { name: "Fastest Response", value: responseMetrics.fastestResponse, color: "#009442" },
    { name: "Slowest Response", value: responseMetrics.slowestResponse, color: "#EA4335" },
  ] : [];

  const handleChartTimeRangeChange = (range: string) => {
    const rangeMap: Record<string, 'daily' | 'weekly' | 'monthly' | 'yearly'> = {
      'Daily': 'daily',
      'Weekly': 'weekly',
      'Monthly': 'monthly',
      'Yearly': 'yearly'
    };
    setChartTimeRange(rangeMap[range] || 'monthly');
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
          <p>Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error: {error}</p>
          <button
            onClick={fetchAnalyticsData}
            className="bg-black text-white px-4 py-2 rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Filter Section */}
      <div className="mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-end gap-[22px] mb-4">
          <span className="text-sm font-normal font-rubik text-gray-800">
            Filter By:
          </span>
          <div className="flex gap-[22px]">
            <DropdownButton
              options={propertyTypeOptions}
              selected={propertyType}
              onSelect={setPropertyType}
              placeholder="Property Type"
            />
            <DropdownButton
              options={dateOptions}
              selected={date}
              onSelect={setDate}
              placeholder="Date"
            />
            <DropdownButton
              options={locationOptions}
              selected={location}
              onSelect={setLocation}
              placeholder="Location"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="lg:text-2xl text-lg text-black">Sales Analytics</h2>
        <div className="flex gap-2">
          <button
            onClick={fetchAnalyticsData}
            className="bg-[#FAFAFA] px-4 py-2 rounded-[20px] text-sm font-medium text-gray-700"
          >
            Refresh
          </button>
          <button
            onClick={handleDownloadAnalytics}
            className="flex items-center gap-2 bg-[#FAFAFA] px-4 py-2 rounded-[20px] hover:bg-gray-200 transition-colors"
          >
            <DownloadIcon />
            <span className="text-sm font-medium text-gray-700">Download</span>
          </button>
        </div>
      </div>

      {/* Data Visualization Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Performance Chart */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="lg:text-lg text-sm font-semibold text-gray-900">
              Sales Performance
            </h3>
            <DropdownButton
              options={["Daily", "Weekly", "Monthly", "Yearly"]}
              selected={chartTimeRange.charAt(0).toUpperCase() + chartTimeRange.slice(1)}
              onSelect={handleChartTimeRangeChange}
              placeholder="Monthly"
            />
          </div>

          {salesData.length > 0 ? (
            <SalesLineChart data={salesData} />
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              No sales data available
            </div>
          )}
        </div>

        {/* Top Performing Locations */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-[20px] font-bold text-black mb-4">
            Top Performing Locations
          </h3>

          {/* Legend */}
          <div className="flex gap-4 mb-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-[7px] h-[7px] bg-black rounded-full"></div>
              <span className="text-[8px] text-black/50 font-rubik">
                Inquiries
              </span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-[7px] h-[7px] bg-black/50 rounded-full"></div>
              <span className="text-[8px] text-black/50 font-rubik">Sales</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-[7px] h-[7px] bg-black/20 rounded-full"></div>
              <span className="text-[8px] text-black/50 font-rubik">
                Rentals
              </span>
            </div>
          </div>

          {/* Grid (horizontally scrollable on small screens) */}
          {locations.length > 0 ? (
            <div className="overflow-x-auto w-full">
              <div
                className="grid gap-1 justify-items-center min-w-[360px]"
                style={{
                  gridTemplateColumns: `48px repeat(${locations.length}, 25px)`,
                  gridAutoRows: "25px",
                }}
              >
                {/* Matrix rows: each tier renders y-axis label + cells */}
                {performanceTiers.map((tier) => (
                  <div key={`row-${tier}`} className="contents">
                    <div className="flex items-center justify-end pr-2 text-xs font-normal text-black/70 h-[25px]">
                      {tier}
                    </div>
                    {locations.map((location) => (
                      <div
                        key={`${location}-${tier}`}
                        className={`h-[25px] w-[25px] rounded-[8px] ${getColorForMetric(
                          locationDataMap[location]?.[tier] || "rentals"
                        )}`}
                        onMouseEnter={(e) => {
                          setTooltip({
                            visible: true,
                            x: (e as React.MouseEvent<HTMLDivElement>).clientX,
                            y: (e as React.MouseEvent<HTMLDivElement>).clientY,
                            text: `${location} • ${tier} • ${locationDataMap[location]?.[tier] || "rentals"}`,
                          });
                        }}
                        onMouseMove={(e) => {
                          setTooltip((prev) => ({
                            ...prev,
                            x: e.clientX,
                            y: e.clientY,
                          }));
                        }}
                        onMouseLeave={() =>
                          setTooltip((prev) => ({ ...prev, visible: false }))
                        }
                        aria-label={`${location} • ${tier} • ${locationDataMap[location]?.[tier] || "rentals"}`}
                      ></div>
                    ))}
                  </div>
                ))}

                {/* Bottom x-axis: location labels */}
                <div className="h-6"></div>
                {locations.map((location) => (
                  <div
                    key={`bottom-${location}`}
                    className="h-6 w-[25px] flex items-center justify-center text-[10px] leading-[10px] font-normal text-black/70 text-center truncate"
                  >
                    {location}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No location data available
            </div>
          )}

          {tooltip.visible && (
            <div
              className="fixed z-50 px-2 py-1 rounded-md bg-black text-white text-[10px] leading-tight pointer-events-none shadow-lg"
              style={{ top: tooltip.y + 10, left: tooltip.x + 10 }}
            >
              {tooltip.text}
            </div>
          )}
        </div>
      </div>

      {/* Activity + Response Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Activity Table */}
        <div className="bg-white rounded-lg p-0 shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr className="text-xs text-black/50 bg-[#EAEAEA] rounded-tl-[10px] rounded-tr-[10px]">
                  <th className="px-6 py-3 font-normal">
                    Properties Rented/Bought
                  </th>
                  <th className="px-6 py-3 font-normal">Inquiries</th>
                  <th className="px-6 py-3 font-normal">Date</th>
                  <th className="px-6 py-3 font-normal">Status</th>
                </tr>
              </thead>
              <tbody>
                {activities.length > 0 ? (
                  activities.map((item, idx) => (
                    <tr key={idx} className="border-t border-gray-100 text-sm">
                      <td className="px-6 py-4 text-sm text-black/90">
                        {item.title}
                      </td>
                      <td className="px-6 py-4 text-sm text-black/90">
                        {item.inquiries}
                      </td>
                      <td className="px-6 py-4 text-sm text-black/90">
                        {item.date}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`font-medium ${
                            statusColor[item.status]
                          } text-sm`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                      No recent activity
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Response Time Metrics - Donut */}
        <div className="bg-white rounded-lg p-6 shadow-sm flex flex-col items-center gap-[20px] border border-gray-200">
          <h3 className="text-[20px] font-bold text-black">
            Response Time Metrics
          </h3>
          <div className="grid grid-cols-1 w-full gap-[10px] items-center">
            <div className="col-span-3 h-64">
              {responseChartData.length > 0 && responseChartData.some(d => d.value > 0) ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={responseChartData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={70}
                      outerRadius={100}
                      stroke="none"
                    >
                      {responseChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      contentStyle={{ fontSize: 12, borderRadius: "10px" }}
                      formatter={(value: number) => [`${value} mins`, ""]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  No response data available
                </div>
              )}
            </div>
            <div className="col-span-2 flex flex-col gap-3">
              {responseChartData.map((m) => (
                <div
                  key={m.name}
                  className="flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-block w-2 h-2 rounded-full"
                      style={{ background: m.color }}
                    ></span>
                    <span className="text-black/50 text-[8px] font-rubik">
                      {m.name}
                    </span>
                  </div>
                  <span className="text-black text-[8px] font-rubik">
                    {m.value} mins
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
