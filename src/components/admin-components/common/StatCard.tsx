import ArrowRightNormal from "../../../assets/arrow-right-normal";
import ArrowRightNormalBlack from "../../../assets/arrow-right-normal-black";

interface StatCardProps {
  title: string;
  value: number;
  type: string;
  theme?: "light" | "dark";
}

const StatCard = ({ title, value, type, theme = "light" }: StatCardProps) => {
  const handleViewDetails = (cardType: string) => {
    console.log(`Viewing details for: ${cardType}`);
    // Handle view details navigation
  };

  return (
    <div
      className={`
      ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }
      p-[clamp(1rem,2.5vw,1.25rem)] 
      flex 
      flex-col 
      gap-[clamp(1rem,2.5vw,1.25rem)] 
      rounded-[clamp(0.75rem,2vw,0.9375rem)] 
      w-full
      min-w-[clamp(12rem,25vw,15.375rem)]
      h-[clamp(6rem,12vw,7.875rem)]
      shadow-sm
      hover:shadow-md
      transition-all
      duration-200
    `}
    >
      <div className="flex flex-col gap-[clamp(0.5rem,1.5vw,0.625rem)]">
        <h3
          className={`
          ${theme === "dark" ? "text-white/70" : "text-black/50"} 
          text-[clamp(0.75rem,1.5vw,0.75rem)] 
          font-medium
        `}
        >
          {title}
        </h3>
        <p
          className={`
          ${theme === "dark" ? "text-white" : "text-black/90"} 
          text-[clamp(1.25rem,3vw,1.25rem)] 
          font-bold
        `}
        >
          {value}
        </p>
      </div>
      <button
        onClick={() => handleViewDetails(type)}
        className={`
          flex 
          items-center 
          justify-between 
          ${
            theme === "dark"
              ? "border-white/20 hover:border-white/40"
              : "border-black/10 hover:border-black/20"
          }
          border-t 
          pt-[clamp(0.25rem,0.75vw,0.1875rem)]
          group
          transition-all
          duration-200
        `}
        aria-label={`View details for ${title}`}
      >
        <span
          className={`
          text-[clamp(0.625rem,1.25vw,0.5rem)] 
          ${theme === "dark" ? "text-white/70" : "text-black/50"}
          group-hover:${theme === "dark" ? "text-white" : "text-black/70"}
          transition-colors
        `}
        >
          View details
        </span>
        <div className="group-hover:scale-110 transition-transform">
          {theme === "dark" ? <ArrowRightNormal /> : <ArrowRightNormalBlack />}
        </div>
      </button>
    </div>
  );
};

export default StatCard;
