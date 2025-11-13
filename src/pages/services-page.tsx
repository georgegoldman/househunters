import Navbar from "../components/navbar";
import Bg from "../../public/jakub-zerdzicki-UlDvTJ4zc-g-unsplash.jpg";
import ArrowLeft from "../assets/arrow-left";
import { useNavigate } from "react-router-dom";
import ListIcon from "../assets/list-icon";
import UserIconBg from "../assets/user-icon-bg";
import CheckTx from "../assets/check-tx";
import CustomerSupportIcon from "../assets/customer-support-icon";
import TagIcon from "../assets/tag-icon";
import AnalyticsSolid from "../assets/analytics-solid";
import BluePinIcon from "../assets/blue-pin-icon";
import YellowPin from "../assets/yellow-pin";
import Purpleicon from "../assets/purple-icon";
import GreenPin from "../assets/green-pin";
import Footer from "../components/footer";
import React from "react";

type Step = {
  id: string;
  num: string;
  title: string;
  desc: string;
  tone: "blue" | "amber" | "purple" | "green";
  Pin: React.FC<any>;
};

const toneClasses = {
  blue: {
    chip: "bg-[rgba(66,133,244,0.2)]",
    ring: "ring-[rgba(66,133,244,0.25)]",
    badge: "bg-[rgba(66,133,244,0.15)] text-[#1e4bb3]",
  },
  amber: {
    chip: "bg-[rgba(255,171,15,0.2)]",
    ring: "ring-[rgba(255,171,15,0.25)]",
    badge: "bg-[rgba(255,171,15,0.15)] text-[#8a5a00]",
  },
  purple: {
    chip: "bg-[rgba(186,35,237,0.18)]",
    ring: "ring-[rgba(186,35,237,0.25)]",
    badge: "bg-[rgba(186,35,237,0.12)] text-[#6e1a89]",
  },
  green: {
    chip: "bg-[rgba(0,148,66,0.18)]",
    ring: "ring-[rgba(0,148,66,0.25)]",
    badge: "bg-[rgba(0,148,66,0.12)] text-[#0b6e3a]",
  },
} as const;

const steps: Step[] = [
  {
    id: "search",
    num: "01",
    title: "Search & Browse",
    desc: "Explore properties by location, type, or price.",
    tone: "blue",
    Pin: BluePinIcon,
  },
  {
    id: "connect",
    num: "02",
    title: "Connect",
    desc: "Send an inquiry or request to the property owner/admin.",
    tone: "amber",
    Pin: YellowPin,
  },
  {
    id: "secure",
    num: "03",
    title: "Buy & Rent Securely",
    desc: "Complete the process with verified and secure payments.",
    tone: "purple",
    Pin: Purpleicon,
  },
  {
    id: "movein",
    num: "04",
    title: "Move In",
    desc: "Enjoy your new home or workspace hassle-free.",
    tone: "green",
    Pin: GreenPin,
  },
];

function StepCard({ step, index }: { step: Step; index: number }) {
  const t = toneClasses[step.tone];
  return (
    <li
      key={step.id}
      className={[
        "relative rounded-2xl border border-black/10 bg-[#F7F7F7]",
        "p-5 sm:p-6 lg:p-7",
        "shadow-sm hover:shadow-md transition-shadow",
        "ring-1", t.ring,
      ].join(" ")}
      aria-label={`${step.num} ${step.title}`}
    >
      {/* Pin floating above */}
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 select-none pointer-events-none">
        <step.Pin />
      </div>

      <div className="flex items-center justify-between gap-4">
        <span
          className={[
            "inline-flex items-center justify-center rounded-xl px-3 py-1 text-xs sm:text-sm font-semibold",
            t.badge,
          ].join(" ")}
        >
          {step.num}
        </span>
        {/* light connector for large screens */}
        {index % 2 === 0 ? (
          <span className="hidden lg:block h-[2px] w-12 rounded-full bg-black/10" />
        ) : (
          <span className="hidden lg:block" />
        )}
      </div>

      <div
        className="mt-4 rounded-xl border border-black/5 p-4 sm:p-5 lg:p-6"
        role="group"
        aria-labelledby={`${step.id}-title`}
      >
        <h4
          id={`${step.id}-title`}
          className="text-[clamp(1rem,2vw,1.25rem)] font-semibold leading-tight"
        >
          {step.title}
        </h4>
        <p className="mt-2 text-sm sm:text-[0.95rem] text-black/70">{step.desc}</p>
      </div>

      {/* soft tone glow */}
      <div className={["absolute inset-0 -z-10 blur-xl opacity-80", t.chip].join(" ")} />
    </li>
  );
}

const ServicesPage = () => {
  const navigate = useNavigate();

  const wantToSell = [
    {
      icon: ListIcon,
      title: "Property Listings",
      description:
        "Find your dream home or office space from our verified property database.",
      link: "/",
    },
    {
      icon: UserIconBg,
      title: "Property Management for Owners",
      description:
        "Easily list, manage, and track your properties with our intuitive tools",
      link: "/",
    },
    {
      icon: CheckTx,
      title: "Rent & Sales Transaction",
      description:
        "Seamless rental and buying process with secure payment options",
      link: "/",
    },
    {
      icon: CustomerSupportIcon,
      title: "Customer Support & Enquiries",
      description:
        "Connect directly with potential tenants and buyers, reply to requests, and manage reviews",
      link: "/",
    },
    {
      icon: TagIcon,
      title: "Featured Listings & Promotions",
      description:
        "Highlight your property on the homepage to reach more customers faster.",
      link: "/",
    },
    {
      icon: AnalyticsSolid,
      title: "Analytics & Reporting (for Admin)",
      description:
        "Track inquiries, sales trends, and customer engagement with real-time reports.",
      link: "/",
    },
  ];

  return (
    <div className="bg-white">
      {/* HERO */}
      <header
        className="w-full min-h-[60vh] sm:min-h-[60vh] bg-black/70 z-40 overflow-visible relative"
        style={{
          backgroundImage: `url(${Bg})`,
          backgroundSize: "cover",
          backgroundPosition: "top 10%",
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <Navbar />

        <div className="flex flex-col gap-5 main-container px-4">
          <div className="flex flex-col gap-[clamp(0.5rem,2vw,0.75rem)] mt-[clamp(4rem,8vw,2.5rem)] z-10">
            <h3 className="font-bold text-[clamp(1.5rem,4vw,2.25rem)] leading-tight text-white z-10">
              Our Services
            </h3>
            <p className="text-white/60 font-medium text-[clamp(0.875rem,2vw,1rem)] max-w-[497px] w-full z-10">
              Discover how we make renting, buying, and managing properties simple and seamless.
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

      {/* CONTENT */}
      <section className="flex flex-col gap-[6rem] main-container py-[clamp(2rem,8vw,4rem)]">
        {/* Property Listing grid */}
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-[10px] items-center">
            <h3 className="text-[clamp(1.5rem,4vw,2.5rem)] font-bold leading-tight">
              Property Listing
            </h3>
            <p className="text-[clamp(0.875rem,2vw,1rem)] text-black/50 lg:w-[714px] w-full text-center">
              Browse verified houses, apartments, and commercial spaces available for rent or purchase
              anytime, anywhere.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-[50px] px-4">
            {wantToSell.map((item, idx) => (
              <div
                key={`${item.title}-${idx}`}
                className="bg-[#F4F4F4] p-[30px] w-full border border-black/10 rounded-[20px] flex flex-col gap-5 h-full hover:shadow-md transition-shadow"
              >
                <div className="w-[100px] h-[100px] bg-[#FFFFFF] rounded-full flex items-center justify-center">
                  <item.icon />
                </div>

                <div className="flex flex-col justify-between h-full">
                  <div className="flex flex-col gap-[10px]">
                    <h4 className="text-[clamp(1.25rem,2vw,1.25rem)] font-medium leading-tight">
                      {item.title}
                    </h4>
                    <p className="text-sm font-medium text-black/70">{item.description}</p>
                  </div>
                  <p className="text-sm font-medium text-black/50">Learn More</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works (refined) */}
        <section className="flex flex-col items-center gap-6">
          <h3 className="text-[clamp(1.5rem,4vw,2.5rem)] font-bold leading-tight text-center">
            How It Works (Step-by-Step)
          </h3>

          <ul
            className={[
              "grid w-full",
              "grid-cols-1 gap-4 sm:gap-6",
              "lg:grid-cols-2 lg:gap-8",
            ].join(" ")}
          >
            {steps.map((s, i) => (
              <StepCard step={s} index={i} key={s.id} />
            ))}
          </ul>
        </section>
      </section>

      <Footer />
    </div>
  );
};

export default ServicesPage;
