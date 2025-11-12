import ArrowUpGreen from "../../../../assets/arrow-up-green";
import type { StatsPanelProps } from "./props";
import DropdownButton from "../../common/DropdownButton";

const StatsPanel = ({
  selectedMonth,
  onMonthSelect,
  months,
  totalProperties,
  growthRate,
  propertyBreakdown,
}: StatsPanelProps) => (
  <div className="bg-gray-50 p-5 rounded-xl flex flex-col gap-4 h-80 shadow-sm">
    <div className="flex items-center justify-between flex-wrap gap-4">
      <h2 className="text-xl font-bold text-gray-900">Stats</h2>
      <DropdownButton
        withBorder
        options={months}
        selected={selectedMonth}
        onSelect={onMonthSelect}
        placeholder="Month"
      />
    </div>

    <div className="flex flex-col gap-2">
      <h3 className="text-sm text-black/50 font-medium">Total Properties</h3>
      <div className="flex items-center gap-2">
        <p className="text-black/90 text-2xl font-bold">{totalProperties}</p>
        <div className="bg-green-500/10 flex justify-center items-center gap-1 rounded-lg px-2 py-1">
          <ArrowUpGreen />
          <p className="text-green-600 text-xs font-medium">{growthRate}%</p>
        </div>
      </div>
    </div>

    <div className="flex flex-col gap-3 mt-4">
      {Object.entries(propertyBreakdown).map(([key, value]) => {
        const BAR_WIDTH_PX = 196;
        const percent = Math.max(0, Math.min(100, Number(value)));
        const pixelWidth = Math.round((percent / 100) * BAR_WIDTH_PX);
        const gradientMap: Record<string, string> = {
          sold: "linear-gradient(90deg, #009442 0%, rgba(0,148,66,0.20) 100%)",
          requestedReview:
            "linear-gradient(90deg, #FFAB0FF0 0%, rgba(254,168,0,0.20) 100%)",
          rented:
            "linear-gradient(90deg, #E30EC6 0%, rgba(211,29,243,0.20) 100%)",
          forSale:
            "linear-gradient(90deg, #1B2BDE 0%, rgba(27,43,222,0.20) 100%)",
        };
        const label = key.replace(/([A-Z])/g, " $1").trim();
        const barBg =
          gradientMap[key] ??
          "linear-gradient(90deg, #000 0%, rgba(0,0,0,0.2) 100%)";
        return (
          <div
            key={key}
            className="flex items-center justify-between gap-[15px]"
          >
            <div className="flex items-center justify-between">
              <p className="text-black/70 text-xs font-normal capitalize">
                {label}
              </p>
            </div>
            <div className="h-3 w-[196px] rounded-full bg-gray-200/60 overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{ width: `${pixelWidth}px`, background: barBg }}
              />
            </div>
          </div>
        );
      })}
    </div>

    <div className="lg:flex hidden justify-between items-center text-[10px] w-[196px] ml-auto text-black/50 font-normal font-rubik">
      <span>0%</span>
      <span>25%</span>
      <span>50%</span>
      <span>75%</span>
      <span>100%</span>
    </div>
  </div>
);

export default StatsPanel;
