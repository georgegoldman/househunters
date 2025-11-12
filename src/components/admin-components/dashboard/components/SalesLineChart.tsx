  import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
  } from "recharts";

  type SalesPoint = {
    period: string;  // Changed from "month" to "period"
    primary: number;
    secondary: number;
  };

  interface SalesLineChartProps {
    data: SalesPoint[];
  }

  const SalesLineChart = ({ data }: SalesLineChartProps) => {
    const formatAxis = (value: number) =>
      value >= 1000000
        ? `${(value / 1000000).toFixed(value % 1000000 === 0 ? 0 : 1)}M`
        : `${Math.round(value / 1000)}K`;

    const formatValue = (value: number | null) => {
      if (value == null) return "-";
      if (value >= 1000000)
        return `${(value / 1000000).toFixed(value % 1000000 === 0 ? 0 : 1)}M`;
      return `${Math.round(value / 1000)}K`;
    };

    // Show "No data" if empty array
    if (!data || data.length === 0) {
      return (
        <div className="relative h-64 w-full p-0 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <p>No sales data available</p>
          </div>
        </div>
      );
    }

    // Calculate dynamic ticks based on actual data
    const allValues = data.flatMap(item => [item.primary, item.secondary]);
    const maxValue = Math.max(...allValues);
    const dynamicMax = Math.ceil(maxValue / 200000) * 200000; // Round up to nearest 200k
    const tickCount = 6;
    const tickInterval = dynamicMax / (tickCount - 1);
    const ticks = Array.from({ length: tickCount }, (_, i) => Math.round(i * tickInterval));

    return (
      <div className="relative h-64 w-full p-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 8, right: 0, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient
                id="primaryAreaGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="rgba(0, 0, 0, 0.25)" />
                <stop offset="83.8%" stopColor="rgba(0, 0, 0, 0)" />
              </linearGradient>
              <linearGradient
                id="secondaryAreaGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="rgba(0, 0, 0, 0.15)" />
                <stop offset="83.8%" stopColor="rgba(0, 0, 0, 0)" />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#333333"
              strokeOpacity={0.3}
              horizontal={true}
              vertical={false}
            />

            <XAxis
              dataKey="period"  // Changed from "month" to "period"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#000", fontSize: 12 }}
              stroke="#333333"
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#000", fontSize: 12 }}
              stroke="#333333"
              domain={[0, dynamicMax]}
              ticks={ticks}
              tickFormatter={formatAxis}
            />

            {/* Secondary area fill */}
            <Line
              type="monotone"
              dataKey="secondary"
              stroke="transparent"
              fill="url(#secondaryAreaGradient)"
              fillOpacity={1}
              dot={false}
              connectNulls={true}
            />

            {/* Primary area fill */}
            <Line
              type="monotone"
              dataKey="primary"
              stroke="transparent"
              fill="url(#primaryAreaGradient)"
              fillOpacity={1}
              dot={false}
              connectNulls={true}
            />

            {/* Secondary line */}
            <Line
              type="monotone"
              dataKey="secondary"
              stroke="#666"
              strokeWidth={2}
              dot={false}
              activeDot={{
                r: 4,
                fill: "transparent",
                stroke: "#666",
                strokeWidth: 2,
              }}
              connectNulls={true}
            />

            {/* Primary line */}
            <Line
              type="monotone"
              dataKey="primary"
              stroke="#000"
              strokeWidth={2}
              dot={false}
              activeDot={{
                r: 4,
                fill: "transparent",
                stroke: "#000",
                strokeWidth: 2,
              }}
              connectNulls={true}
            />

            <RechartsTooltip
              content={({ active, payload, label }) => {
                if (!active || !payload || payload.length === 0) return null;
                const primaryEntry = payload.find((e) => e.dataKey === "primary");
                const secondaryEntry = payload.find(
                  (e) => e.dataKey === "secondary"
                );
                return (
                  <div className="bg-black border border-white/20 rounded-lg p-3 shadow-lg min-w-[160px]">
                    <p className="text-white/60 text-sm font-medium mb-2">
                      {label}
                    </p>
                    <div className="flex items-center justify-between text-white text-sm gap-6">
                      <div className="flex items-center gap-2">
                        <div className="w-[7px] h-[7px] bg-[#009442] rounded-full"></div>
                        <span className="text-xs font-rubik font-normal text-white/60">
                          Total Sales
                        </span>
                      </div>
                      <span className="font-normal font-rubik text-white">
                        {formatValue(primaryEntry?.value as number)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-white text-sm gap-6 mt-1">
                      <div className="flex items-center gap-2">
                        <div className="w-[7px] h-[7px] bg-[#FE6700] rounded-full"></div>
                        <span className="text-xs font-rubik font-normal text-white/60">
                          Rental Revenue
                        </span>
                      </div>
                      <span className="font-normal font-rubik text-white">
                        {formatValue(secondaryEntry?.value as number)}
                      </span>
                    </div>
                  </div>
                );
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };

  export default SalesLineChart;
