import ArrowLeft from "../assets/arrow-left";
import Navbar from "../components/navbar";
import Bg from "../assets/bg-image.jpg";
import { useNavigate } from "react-router-dom";
import Banner from "../assets/about-us-banner.jpg";
import GrowthIcon from "../assets/growth-icon";
import TimeIcon from "../assets/time-icon";
import SystemIcon from "../assets/system-icon";
import MoneyIconNew from "../assets/money-icon-new";
import { ArrowRight } from "lucide-react";
import Footer from "../components/footer";
import LocationIcon from "../assets/location-icon";
import Heartblob from "../assets/heart-blob";
import LikeIcon from "../assets/like-icon";

const CareersPage = () => {
  const navigate = useNavigate();
  const wantToSell = [
    {
      icon: GrowthIcon,
      title: "Growth Opportunity",
      description: "Learn, grow, and move your career forward",
    },
    {
      icon: TimeIcon,
      title: "Flexible Work Hours",
      description: "Work when you’re most productive.",
    },
    {
      icon: SystemIcon,
      title: "Remote-Friendly",
      description: "Collaborate with us from anywhere.",
    },
    {
      icon: LikeIcon,
      title: "Inclusive Culture",
      description: "We value diversity and teamwork",
    },
    {
      icon: Heartblob,
      title: "Health & Wellness",
      description: "Comprehensive support for you and your family.",
    },
  ];

  const currentOpeningRole = [
    {
      role: "Full Time",
      title: "Product Designer",
      description:
        "Easily list, manage, and track your properties with our intuitive tools",
      salary: "$50",
      location: "Lekki, Lagos State",
      bgColor: "#F931311A",
      accent: "#F931311A",
      text: "#F93131",
    },
    {
      role: "Full Time",
      title: "Product Designer",
      description:
        "Easily list, manage, and track your properties with our intuitive tools",
      salary: "$50",
      location: "Lekki, Lagos State",
      bgColor: "#1B2BDE1A",
      accent: "#1B2BDE1A",
      text: "#1B2BDE",
    },
    {
      role: "Full Time",
      title: "Product Designer",
      description:
        "Easily list, manage, and track your properties with our intuitive tools",
      salary: "$50",
      location: "Lekki, Lagos State",
      bgColor: "#0094421A",
      accent: "#0094421A",
      text: "#009442",
    },
    {
      role: "Full Time",
      title: "Product Designer",
      description:
        "Easily list, manage, and track your properties with our intuitive tools",
      salary: "$50",
      location: "Lekki, Lagos State",
      bgColor: "#FFAB0F1A",
      accent: "#FFAB0F1A",
      text: "#FFAB0FF0",
    },
    {
      role: "Full Time",
      title: "Product Designer",
      description:
        "Easily list, manage, and track your properties with our intuitive tools",
      salary: "$50",
      location: "Lekki, Lagos State",
      bgColor: "#F931311A",
      accent: "#F931311A",
      text: "#F93131",
    },
    {
      role: "Full Time",
      title: "Product Designer",
      description:
        "Easily list, manage, and track your properties with our intuitive tools",
      salary: "$50",
      location: "Lekki, Lagos State",
      bgColor: "#1B2BDE1A",
      accent: "#1B2BDE1A",
      text: "#1B2BDE",
    },
  ];
  return (
    <div className="bg-white">
      <header
        className="w-full min-h-[60vh] sm:min-h-[60vh] bg-black/70 z-40 overflow-visible relative"
        style={{
          backgroundImage: `url(${Bg})`,
          backgroundSize: "cover",
          backgroundPosition: "top 10%",
        }}
      >
        <Navbar />
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="flex flex-col gap-5 main-container px-4">
          <div className="flex flex-col gap-[clamp(0.5rem,2vw,0.75rem)] main-container mt-[clamp(4rem,8vw,6.25rem)]">
            <h1 className="font-bold text-[clamp(1.75rem,4vw,2.25rem)] text-white z-10">
              Careers
            </h1>
            <p className="text-white/60 font-medium text-[clamp(0.875rem,2vw,1rem)] z-10">
              We’re building the future of real estate, and we want you to be a
              part of it.
            </p>
          </div>

          <button
            onClick={() => navigate(-1)}
            className="bg-white py-[clamp(0.5rem,1.5vw,0.75rem)] px-[clamp(1rem,3vw,1.5rem)] z-10 rounded-[clamp(0.5rem,1vw,0.75rem)] w-fit h-fit font-bold text-[clamp(1rem,2.5vw,1.25rem)] flex items-center gap-[clamp(0.5rem,1.5vw,0.75rem)] text-black hover:bg-gray-100"
          >
            <ArrowLeft />
            Back
          </button>
        </div>
      </header>

      <section className="main-container py-[clamp(2rem,8vw,4rem)]">
        <div className="flex flex-col gap-8 items-center">
          <div className="w-full h-[558px]">
            <img
              src={Banner}
              alt="Careers Banner"
              className="w-full h-full object-cover rounded-[20px]"
            />
          </div>

          <div className="flex flex-col gap-8 items-center">
            <div className="flex flex-col items-center gap-2.5">
              <h4 className="text-[clamp(1.25rem,2vw,2.5rem)] font-bold leading-tight">
                Why Join Househunters?
              </h4>
              <p className="text-[clamp(0.875rem,2vw,1rem)] text-black/50 text-center max-w-[714px] w-full">
                At Househunters, we believe in empowering people to find their
                dream homes while building a supportive and innovative workplace
                for our team.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-[50px] px-4">
              {wantToSell.map((item) => (
                <div className="bg-[#F4F4F4] p-[30px] w-full border border-black/10 rounded-[20px] flex flex-col gap-5 h-full">
                  <div className="w-[100px] h-[100px] bg-[#FFFFFF] rounded-full flex items-center justify-center">
                    <item.icon />
                  </div>

                  <div className="flex flex-col gap-[10px]">
                    <h4 className="text-[clamp(1.25rem,2vw,1.25rem)] font-medium leading-tight">
                      {item.title}
                    </h4>
                    <p className="text-sm font-medium text-black/70">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-8 py-[4rem]">
          <div className="flex flex-col items-center gap-2.5">
            <h3 className="text-[clamp(1.25rem,2vw,2.5rem)] font-bold leading-tight">
              Current Openings
            </h3>
            <p className="text-base text-black/50 font-normal text-center">
              We’re building the future of real estate — and we want you to be a
              part of it.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 xl:grid-cols-3 grid-cols-1 gap-[50px]">
            {currentOpeningRole.map((item, i) => (
              <div
                key={i}
                className={`p-[30px] lg:w-[380px] border border-black/10 rounded-[20px] flex flex-col gap-[20px] bg-[${item.bgColor}]`}
              >
                <div
                  className={`bg-[${item.accent}] p-[10px] w-fit rounded-[8px] flex items-center justify-center text-[${item.text}] text-xs font-medium`}
                >
                  {item.role}
                </div>

                <div className="flex flex-col gap-[10px]">
                  <h4 className="text-[1.25rem] font-medium ">{item.title}</h4>
                  <p className="text-sm text-black/70 lg:w-[309px]">
                    {item.description}
                  </p>
                </div>

                <div className="flex items-center gap-5">
                  <div className="flex items-center gap-1">
                    <MoneyIconNew />
                    <p className="text-black/60 text-sm">{item.salary}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <LocationIcon />
                    <p className="text-black/60 text-sm">{item.location}</p>
                  </div>
                </div>

                <button className="bg-black text-white p-[10px] rounded-[8px] flex items-center w-fit gap-2.5 text-xs ">
                  Apply Now <ArrowRight size={15} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CareersPage;
