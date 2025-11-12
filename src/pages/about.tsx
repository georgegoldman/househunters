import React from "react";
import ArrowLeft from "../assets/arrow-left";
import Navbar from "../components/navbar";
import Bg from "../assets/vitaly-gariev-VbQJfoArSHc-unsplash.jpg";
import { useNavigate } from "react-router-dom";
import Banner from "../assets/vitaly-gariev-DOXaUBo59Y8-unsplash.jpg";
import Mission from "../assets/emmanuel-gido-zTs2M5283D4-unsplash.jpg";
import StarIconAbout from "../assets/star-icon-about";
import Bulb from "../assets/bulb";
import UserGroup from "../assets/user-group";
import UserGroupCircle from "../assets/user-group-circle";
import Team1 from "../assets/team-1.jpg";
import Team2 from "../assets/team-2.jpg";
import Team3 from "../assets/team-3.jpg";
import Footer from "../components/footer";

// -----------------------------------------------------------------------------
// About page — ultra‑minimal "lab" layout
// Keeps your original imports, names, and export so you can copy/paste safely.
// Mobile‑responsive. Navbar kept. Uses your images & copy.
// -----------------------------------------------------------------------------

const About: React.FC = () => {
  const navigate = useNavigate();
  const brandColor = "#ff4d2d"; // change to your brand color

  const wantToSell = [
    { icon: StarIconAbout, title: "Integrity", description: "We believe in honest and transparent transactions." },
    { icon: Bulb, title: "Innovation", description: "We use technology to simplify real estate." },
    { icon: UserGroup, title: "Customer First", description: "Our users’ needs drive everything we do." },
    { icon: UserGroupCircle, title: "Community", description: "Comprehensive support for you and your family." },
  ];

  // const teamData = [
  //   { image: Team1, name: "Joan James", role: "CEO & Co‑Founder", description: "Sarah brings over 10 years of experience in real estate and technology." },
  //   { image: Team2, name: "John Deo", role: "Executive Manager", description: "John brings over 9 years of experience in real estate and technology." },
  //   { image: Team3, name: "James Authur", role: "Creative Director", description: "James Authur has been the creative director for househunter for over 8 years now." },
  // ];

  return (
    <div className="bg-blend-color text-neutral-900 min-h-screen flex flex-col">
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

      {/* HERO: wordmark + banded image (reference style) */}
      <section className="flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-6xl rounded-2xl bg-white ring-1 ring-black/10 overflow-hidden relative">
          <div className="grid grid-cols-12 gap-0">
            {/* LEFT: About content */}
            <div className="col-span-12 md:col-span-4 p-6 sm:p-10 flex flex-col justify-between">
              <div>
                <div className="text-xs tracking-widest text-neutral-400 uppercase">ABOUT</div>
                <h1 className="mt-2 text-4xl md:text-[56px] leading-none font-extrabold tracking-tight">about.</h1>
                <div className="mt-4 md:mt-6 h-[3px] w-10 md:w-12" style={{ backgroundColor: brandColor }} />

                <p className="mt-4 md:mt-6 text-sm text-neutral-700 max-w-xs">
                  Building the bridge between people and their dream homes, anytime, anywhere.
                </p>

                {/* Who We Are (compact) */}
                <div className="mt-5 md:mt-6">
                  <h3 className="text-xs font-semibold tracking-wider text-neutral-500 uppercase">Who We Are</h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-neutral-600">
                    At House Hunters, we are passionate about simplifying the way people rent, buy, and manage
                    properties. Our mission is to connect property owners with tenants and buyers through a
                    seamless, secure, and accessible platform.
                  </p>
                </div>

                {/* Mission & Vision chips */}
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-xl ring-1 ring-black/10 p-3">
                    <div className="text-[10px] tracking-widest text-neutral-500 uppercase">Mission</div>
                    <p className="mt-1 text-[12px] text-neutral-700">
                      Make renting & buying simple, transparent, and accessible for everyone.
                    </p>
                  </div>
                  <div className="rounded-xl ring-1 ring-black/10 p-3">
                    <div className="text-[10px] tracking-widest text-neutral-500 uppercase">Vision</div>
                    <p className="mt-1 text-[12px] text-neutral-700">
                      Be the most trusted real‑estate platform—homes & investments with ease.
                    </p>
                  </div>
                </div>
              </div>

              {/*<div className="mt-6 md:mt-8 flex items-center gap-3">
                <button
                  onClick={() => navigate(-1)}
                  className="inline-flex items-center gap-2 rounded-lg bg-neutral-900 text-white px-3 py-2 text-xs font-semibold"
                >
                  <ArrowLeft /> Back
                </button>
                <a href="#values" className="text-xs font-semibold text-neutral-700 hover:underline">
                  Our values ↓
                </a>
              </div>*/}
            </div>

            {/* RIGHT: image with strong horizontal band */}
            <div className="col-span-12 md:col-span-8 relative">
              <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[28%] md:h-[34%]" style={{ backgroundColor: brandColor }} />
              <img
                src={Banner || Mission}
                alt="About hero"
                className="relative z-[1] w-full h-[52vh] md:h-full object-cover object-center"
              />
              {/* Rotated meta label (hidden on mobile) */}
              <div className="hidden md:block absolute right-4 top-4 z-[2] text-[10px] tracking-widest text-neutral-800/70 uppercase origin-top-right rotate-90 select-none">
                Househunters · {new Date().getFullYear()}
              </div>
              {/* Badge */}
              <div className="absolute left-4 bottom-4 z-[2]">
                <div className="inline-flex items-center gap-2 rounded-md bg-white/90 px-3 py-1 text-[11px] font-semibold ring-1 ring-black/10">
                  <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: brandColor }} />
                  NEW LISTINGS
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VALUES (slim strip) */}
      <section id="values" className="px-4 sm:px-8 pb-10">
        <div className="mx-auto w-full max-w-6xl">
          <h3 className="sr-only">Our Values</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {wantToSell.map((item, i) => (
              <article key={i} className="group rounded-2xl bg-white ring-1 ring-black/10 p-5 flex items-start gap-3 hover:shadow-sm">
                <div className="h-12 w-12 rounded-full bg-[#eef3f9] flex items-center justify-center shrink-0">
                  <item.icon />
                </div>
                <div>
                  <h4 className="text-sm font-semibold">{item.title}</h4>
                  <p className="text-[12px] text-neutral-600 mt-1">{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* (Optional) Team — keep for compatibility but easy to remove */}
      {/*<section className="px-4 sm:px-8 pb-14">
        <div className="mx-auto w-full max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {teamData.map((t, i) => (
              <article key={i} className="relative rounded-[20px] overflow-hidden shadow-sm ring-1 ring-black/5">
                <img src={t.image} alt={t.name} className="h-[280px] md:h-[320px] w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h4 className="font-bold">{t.name}</h4>
                  <p className="text-sm opacity-90">{t.role}</p>
                  <p className="text-xs opacity-80 mt-1 max-w-xs">{t.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>*/}

      <Footer />
    </div>
  );
};

export default About;
