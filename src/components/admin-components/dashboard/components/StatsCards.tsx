import ArrowRightNormal from "../../../../assets/arrow-right-normal";
import ArrowRightNormalBlack from "../../../../assets/arrow-right-normal-black";
import type { StatsCardsProps } from "./props";

const StatCard = ({
  title,
  value,
  theme,
}: {
  title: string;
  value: number;
  theme?: "dark" | "light";
}) => (
  <div
    className={`
    ${theme === "dark" ? "bg-[#1A1A1A]" : "bg-[#FAFAFA]"}
    p-5 flex flex-col gap-5 rounded-[15px] w-full h-[126px] min-w-0
  `}
  >
    <div className="flex flex-col gap-2.5">
      <h5
        className={`${
          theme === "dark" ? "text-white/70" : "text-black/50"
        } text-xs`}
      >
        {title}
      </h5>
      <p
        className={`${
          theme === "dark" ? "text-white" : "text-black/90"
        } text-xl`}
      >
        {value}
      </p>
    </div>
    <button
      className={`flex items-center justify-between border-t ${
        theme === "dark" ? "border-white/20" : "border-black/10"
      } py-1 w-full`}
    >
      <span
        className={`text-[8px] ${
          theme === "dark" ? "text-white/70" : "text-black/50"
        }`}
      >
        View details
      </span>
      {theme === "dark" ? <ArrowRightNormal /> : <ArrowRightNormalBlack />}
    </button>
  </div>
);

const StatsCards = ({ stats }: StatsCardsProps) => (
  <div className="admin-stats-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 xl:gap-6">
    <StatCard
      title="Total Properties"
      value={stats.totalProperties}
      theme="dark"
    />
    <StatCard title="Properties Sold" value={stats.propertiesSold} />
    <StatCard title="Requests Need Reply" value={stats.reviewsNeedingReply} />
    <StatCard title="Pending Customers" value={stats.pendingCustomers} />
  </div>
);

export default StatsCards;
