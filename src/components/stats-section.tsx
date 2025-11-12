import Bg from "../assets/bg-image.jpg";
import Avatar1 from "../assets/card-avatar-1.svg";
import Avatar2 from "../assets/card-avatar-2.svg";
import Avatar3 from "../assets/card-avatar-3.svg";

const statsData = [
  {
    value: "10 M+",
    label: "Happy Customers",
    bgImage: Bg,
    textColor: "text-white",
    bgColor: "",
    borderColor: "border-gray-200",
    avatar1: Avatar1,
    avatar2: Avatar2,
    avatar3: Avatar3,
  },
  {
    value: "12 k+",
    label: "Elegant Properties",
    bgImage: null,
    textColor: "text-gray-900",
    bgColor: "bg-gray-100",
    borderColor: "border-gray-200",
  },
  {
    value: "8 +",
    label: "Years of Services",
    bgImage: null,
    textColor: "text-gray-100",
    bgColor: "bg-black",
    borderColor: "border-black",
  },
];

export default function StatsSection() {
  return (
    <section className="main-container py-[2rem] flex flex-col lg:flex-row gap-[clamp(1rem,4vw,2rem)]">
      {statsData.map((stat, index) => (
        <div
          key={index}
          style={
            stat.bgImage
              ? {
                  backgroundImage: `url(${stat.bgImage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "top",
                }
              : {}
          }
          className={`
            border ${stat.borderColor} ${stat.bgColor}
            rounded-[clamp(0.75rem,2vw,1.25rem)]
            py-[clamp(1rem,3vw,1.5rem)] 
            px-[clamp(1rem,3vw,1.5rem)]
            flex items-center 
            flex-1
            ${stat.textColor}
            w-full min-h-[clamp(150px,25vw,193px)] relative
          `}
        >
          <div className="flex items-center justify-between w-full h-full">
            <div className="flex flex-col gap-[clamp(0.5rem,2vw,1.5rem)]">
              <h4 className="text-[clamp(1.5rem,4vw,2.25rem)] font-bold leading-tight">
                {stat.value}
              </h4>
              <p className="text-[clamp(0.875rem,2.5vw,1rem)] opacity-90">
                {stat.label}
              </p>
            </div>

            {stat?.avatar1 && stat?.avatar2 && stat?.avatar3 && (
              <div className="flex-1 relative w-full h-full hidden xl:block">
                <div className="absolute top-[20%] left-[65%]">
                  <img src={stat?.avatar1} alt="avatar" />
                </div>
                <div className="absolute bottom-[5%] left-[50%]">
                  <img src={stat?.avatar2} alt="avatar" />
                </div>
                <div className="absolute bottom-[5%] right-0">
                  <img src={stat?.avatar3} alt="avatar" />
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </section>
  );
}
