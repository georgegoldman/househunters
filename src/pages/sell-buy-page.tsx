import ArrowLeft from "../assets/arrow-left";
import Navbar from "../components/navbar";
import Bg from "../assets/kelly-sikkema-zcAgxLryKe4-unsplash.jpg";
import { useNavigate } from "react-router-dom";
import SellBuyImage from "../../public/igor-lolatto-TdwYsTmA2Bc-unsplash.jpg";
import SmartSearchIcon from "../assets/smart-search-icon";
import ListIcon from "../assets/list-icon";
import ChatIcon from "../assets/chat-icon";
import ArrowRight from "../assets/arrow-right";
import Frame from "../assets/Frame 896.png";
import Frame1 from "../assets/Frame 897.png";
import Avatar from "../assets/avatar-2.jpg";
import { useRef, useState, useEffect } from "react";
import TestimonialCard from "../components/testimonial-card";
import AgentFaceIcon from "../assets/agent-face-icon";
import PerformanceIcon from "../assets/performance-icon";
import CustomOne from "../assets/custom-one.svg";
import CustomTwo from "../assets/custom-two.svg";
import CustomThree from "../assets/custom-three.svg";
import CustomFour from "../assets/custom-four.svg";
import Footer from "../components/footer";

const SellBuyPage = () => {
  const navigate = useNavigate();

  const lookingToBuy = [
    { icon: SmartSearchIcon, title: "Smart Search", description: "Filter by price, location, or property type" },
    { icon: ListIcon, title: "Verified Listing", description: "Only genuine properties" },
    { icon: ChatIcon, title: "Direct Contact", description: "Chat with owners/agents instantly." },
  ];

  const wantToSell = [
    { icon: ListIcon, title: "Quick Listings", description: "Upload photos & details in minutes." },
    { icon: AgentFaceIcon, title: "Agent Friendly", description: "Tools designed for property managers and " },
    { icon: PerformanceIcon, title: "Track Performance", description: "See views and inquiries in real-time." },
  ];

  const testimonialsData = [
    {
      id: 1,
      name: "Ubrain Grace",
      location: "Berlin USA",
      rating: 4,
      avatar: Avatar,
      testimonial:
        "Taery is the platform I go to on almost a daily basis for 2nd home and vacation condo shopping, or to just look at dream homes in new areas. Thanks for fun home shopping and comparative analyzing, Estatery!",
      images: [Frame, Frame1],
    },
    {
      id: 2,
      name: "Sarah Johnson",
      location: "New York, USA",
      rating: 5,
      avatar: Avatar,
      testimonial:
        "Outstanding service! The team helped us find our dream home within our budget. Their expertise in the local market made all the difference in our home buying journey.",
      images: [Frame, Frame1],
    },
    {
      id: 3,
      name: "Michael Chen",
      location: "San Francisco, USA",
      rating: 5,
      avatar: Avatar,
      testimonial:
        "Professional, knowledgeable, and incredibly patient. They guided us through every step of selling our property and made the entire process seamless.",
      images: [Frame, Frame1],
    },
  ];

  const sectionRef = useRef<HTMLDivElement | null>(null);

  // floating marquee controls
  const [paused, setPaused] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  // speed & sizing
  const MARQUEE_SPEED_SECONDS = 24;   // faster so movement is obvious
  const CARD_MIN_WIDTH_PX = 380;      // a touch wider to avoid cramped text

  return (
    <div className="bg-white">
      {/* Local keyframes (no Tailwind config needed) */}
      <style>{`
        @keyframes marqueeX {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.3333%); } /* because we render 3 identical groups */
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-anim {
            animation: none !important;
            transform: translateX(0) !important;
          }
        }
      `}</style>

      <header
        className="w-full min-h-[60vh] sm:min-h-[60vh] bg-black/70 z-40 overflow-visible relative"
        style={{ backgroundImage: `url(${Bg})`, backgroundSize: "cover", backgroundPosition: "top 10%" }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <Navbar />

        <div className="flex flex-col gap-5 main-container px-4">
          <div className="flex flex-col gap-[clamp(0.5rem,2vw,0.75rem)] mt-[clamp(4rem,8vw,2.5rem)] z-10">
            <h3 className="font-bold text-[clamp(1.5rem,4vw,2.25rem)] leading-tight text-white z-10">
              Sell or Buy Property
            </h3>
            <p className="text-white/60 font-medium text-[clamp(0.875rem,2vw,1rem)] max-w-[497px] w-full z-10">
              Find your dream home or list your property in minutes trusted, secure, and seamless.
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

      <section className="py-[clamp(2rem,8vw,4rem)] main-container px-4">
        <div className="flex flex-col items-center gap-8">
          <div className="flex flex-col gap-8 items-center">
            <div className="flex flex-col gap-[10px] items-center">
              <h4 className="text-[clamp(1.5rem,4vw,2.5rem)] font-bold leading-tight">Buy or Sell Properties With Ease</h4>
              <p className="text-[clamp(0.875rem,2vw,1rem)] text-black/50">
                Find your dream home or list your property in minutes trusted, secure, and seamless.
              </p>
            </div>
          </div>
          <div className="w-full h-[220px] sm:h-[360px] md:h-[480px] lg:h-[558px]">
            <img src={SellBuyImage} className="w-full h-full object-cover rounded-[20px]" alt="Sell or Buy Properties" />
          </div>
        </div>

        <div className="flex flex-col gap-[40px] items-center py-[clamp(2rem,8vw,4rem)]">
          <div className="flex flex-col gap-[10px] items-center px-4">
            <h3 className="text-[clamp(1.5rem,4vw,2.5rem)] font-bold leading-tight">Looking To Buy?</h3>
            <p className="text-[clamp(0.875rem,2vw,1rem)] max-w-[614px] w-full text-center text-black/70">
              Discover thousands of verified listings from apartments and family homes to lands and commercial spaces. Easily search, filter, and connect directly with property owners or agents.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-[50px] w-full px-4">
            {lookingToBuy.map((item, idx) => (
              <div key={idx} className="bg-[#F4F4F4] p-[30px] w-full border border-black/10 rounded-[20px] flex flex-col gap-5">
                <div className="w-[100px] h-[100px] bg-[#FFFFFF] rounded-full flex items-center justify-center">
                  <item.icon />
                </div>
                <div className="flex flex-col gap-[10px]">
                  <h4 className="text-[clamp(1.25rem,2vw,1.25rem)] font-medium leading-tight">{item.title}</h4>
                  <p className="text-sm font-medium text-black/70">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          <button
            className="bg-black flex items-center gap-[10px] justify-center text-white py-[clamp(0.75rem,2vw,1rem)] px-[clamp(1rem,3vw,1.5rem)] rounded-[clamp(0.5rem,1vw,0.75rem)] font-medium text-[clamp(0.875rem,1.2vw,1rem)] hover:bg-gray-800"
            onClick={() => navigate("/property")}
          >
            Start Searching
            <ArrowRight />
          </button>
        </div>

        <div className="flex flex-col gap-[40px] items-center py-[clamp(2rem,8vw,4rem)]">
          <div className="flex flex-col gap-[10px] items-center px-4">
            <h3 className="text-[clamp(1.5rem,4vw,2.5rem)] font-bold leading-tight text-center">Want to Sell Your Property?</h3>
            <p className="text-[clamp(0.875rem,2vw,1rem)] max-w-[614px] w-full text-center text-black/70">
              Showcase your property to thousands of serious buyers and close deals faster. Our platform makes listing, promoting, and managing your property effortless.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-[50px] w-full px-4">
            {wantToSell.map((item, idx) => (
              <div key={idx} className="bg-[#F4F4F4] p-[30px] w-full border border-black/10 rounded-[20px] flex flex-col gap-5">
                <div className="w-[100px] h-[100px] bg-[#FFFFFF] rounded-full flex items-center justify-center">
                  <item.icon />
                </div>
                <div className="flex flex-col gap-[10px]">
                  <h4 className="text-[clamp(1.25rem,2vw,1.25rem)] font-medium leading-tight">{item.title}</h4>
                  <p className="text-sm font-medium text-black/70">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ===================== Testimonials (FLOATING) ===================== */}
        <div ref={sectionRef} className="flex flex-col gap-[40px] items-center py-[clamp(2rem,8vw,4rem)]">
          <div className="flex flex-col gap-[10px] items-center px-4">
            <h3 className="text-[clamp(1.5rem,4vw,2.5rem)] font-bold leading-tight">Testimonials</h3>
            <p className="text-[clamp(0.875rem,2vw,1rem)] max-w-[614px] w-full text-center text-black/70">
              What buyers and sellers say about their experience.
            </p>
          </div>

          <div
            className="
              w-full bg-gray-100 rounded-[clamp(0.75rem,3vw,1.25rem)]
              p-[clamp(1rem,3vw,2rem)]
            "
            role="region"
            aria-label="Customer testimonials marquee"
            aria-live="polite"
            aria-atomic="true"
          >
            {/* Viewport with soft-edge mask so cards don't look clipped */}
            <div
              className="relative overflow-hidden"
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
              style={{
                WebkitMaskImage:
                  "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
                maskImage:
                  "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
              }}
            >
              {/* Track: render THREE identical groups; animate -33.333% for a perfect loop */}
              <div
                className="flex flex-nowrap marquee-anim"
                style={{
                  width: "max-content",
                  animation: mounted ? `marqueeX ${MARQUEE_SPEED_SECONDS}s linear infinite` : "none",
                  animationPlayState: paused ? "paused" : "running",
                  willChange: "transform",
                  transform: "translateZ(0)",
                  gap: "1.25rem", // ~gap-5; keeps spacing even across groups
                }}
              >
                {/* Group A */}
                <div className="flex flex-nowrap items-stretch" style={{ gap: "1.25rem" }}>
                  {testimonialsData.map((t) => (
                    <div key={`A-${t.id}`} className="flex-none" style={{ minWidth: CARD_MIN_WIDTH_PX, maxWidth: 440 }}>
                      <TestimonialCard testimonial={{ ...t, testimonial: (t.testimonial || "").trim() } as any} isActive={true} />
                    </div>
                  ))}
                </div>
                {/* Group B */}
                <div className="flex flex-nowrap items-stretch" style={{ gap: "1.25rem" }}>
                  {testimonialsData.map((t) => (
                    <div key={`B-${t.id}`} className="flex-none" style={{ minWidth: CARD_MIN_WIDTH_PX, maxWidth: 440 }}>
                      <TestimonialCard testimonial={{ ...t, testimonial: (t.testimonial || "").trim() } as any} isActive={true} />
                    </div>
                  ))}
                </div>
                {/* Group C */}
                <div className="flex flex-nowrap items-stretch" style={{ gap: "1.25rem" }}>
                  {testimonialsData.map((t) => (
                    <div key={`C-${t.id}`} className="flex-none" style={{ minWidth: CARD_MIN_WIDTH_PX, maxWidth: 440 }}>
                      <TestimonialCard testimonial={{ ...t, testimonial: (t.testimonial || "").trim() } as any} isActive={true} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <p className="sr-only">Testimonials scroll continuously from right to left. Hover to pause.</p>
          </div>
        </div>
        {/* =================== /Testimonials (FLOATING) ===================== */}

        <div className="main-container py-[clamp(2rem,8vw,4rem)] flex flex-col gap-[40px] items-center justify-center">
          <h3 className="text-[clamp(1.5rem,4vw,2.5rem)] font-bold leading-tight">How It Works</h3>
          <div className="flex flex-col lg:flex-row lg:justify-between gap-8  w-full max-w-[980px]">
            <div className="flex items-center gap-6 sm:gap-[74px]">
              <img src={CustomOne} alt="" />
              <p className="text-[clamp(1rem,2vw,1.25rem)] font-bold leading-tight">Sign up for free.</p>
            </div>
            <div className="flex items-center justify-end gap-6 sm:gap-[74px]">
              <p className="text-[clamp(1rem,2vw,1.25rem)] max-w-[204px] w-full font-bold leading-tight text-center sm:text-left">
                Choose whether you want to buy or sell.
              </p>
              <img src={CustomTwo} alt="" />
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:justify-between gap-8  w-full max-w-[980px]">
            <div className="flex items-center gap-6 sm:gap-[74px]">
              <img src={CustomThree} alt="" />
              <p className="text-[clamp(1rem,2vw,1.25rem)] max-w-[204px] w-full font-bold leading-tight text-center sm:text-left">
                Browse listings or upload your property details.
              </p>
            </div>
            <div className="flex items-center justify-end gap-6 sm:gap-[74px]">
              <p className="text-[clamp(1rem,2vw,1.25rem)] max-w-[204px] w-full font-bold leading-tight text-center sm:text-left">
                Connect, negotiate, and seal the deal.
              </p>
              <img src={CustomFour} alt="" />
            </div>
          </div>
        </div>
      </section>

      <div
        className="
          bg-black flex flex-col items-center py-[clamp(2rem,6vw,5rem)] px-4
          gap-[clamp(2rem,6vw,5rem)] text-white
          min-h-[clamp(25rem,50vh,35rem)]
        "
        aria-labelledby="landlord-signup-heading"
        role="region"
      >
        <div className="flex flex-col gap-[10px] items-center">
          <h3 className="text-[clamp(1.5rem,4vw,2rem)] font-bold leading-tight">Ready to Buy or Sell?</h3>
          <p className="text-[clamp(0.875rem,2vw,1rem)] text-[#D3D5DA] text-center">
            Join thousands of satisfied users who trust [Company Name] to simplify property transactions.
          </p>
        </div>

        <div className="flex justify-center gap-4 w-full max-w-[500px] px-4 mx-auto">
          <button className="bg-white text-black py-[clamp(0.75rem,2vw,0.65rem)] w-full sm:w-[232px] rounded-[clamp(0.5rem,1vw,0.75rem)] font-medium text-[clamp(0.875rem,1.2vw,1rem)] hover:bg-gray-100"
            onClick={() => navigate("/property")}
          >
            Dive In
          </button>
        </div>

      </div>

      <Footer />
    </div>
  );
};

export default SellBuyPage;
