import Navbar from "../components/navbar";
import Bg from "../../public/getty-images-sb9nfWeSuxA-unsplash.jpg";
// import SearchWidget from "./search-widget";
import StatsSection from "../components/stats-section";
import PropertiesSection from "../components/properties-section";
import ExpertGuideSection from "../components/expert-guide-section";
import TestimonialsSection from "../components/testimonial-section";
import LandlordSignupSection from "../components/landlord-signup-section";

import Footer from "../components/footer";

const HomePage = () => {
  return (
    <div>
      <header
        style={{
          backgroundImage: `url(${Bg})`,
          backgroundSize: "cover",
          backgroundPosition: "top",
        }}
        className="w-full lg:min-h-[80vh] min-h-[65vh] h-full relative"
      >
        <Navbar />

        <div className="flex flex-col items-center gap-[clamp(1rem,3vw,1.5rem)] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 main-container">
          <h1 className="font-bold text-[clamp(2rem,8vw,4.375rem)] text-white text-center leading-tight max-w-[20ch]">
            Smart Living Starts Here
          </h1>
          <p className="text-white font-medium text-[clamp(1rem,2.5vw,1.5rem)] text-center max-w-[55ch] leading-relaxed bg-black/50 px-4 py-2 rounded-lg">
            Browse verified properties and make smarter real estate decisions
            with ease and confidence.
          </p>

        </div>

        {/* <SearchWidget /> */}
      </header>

      <StatsSection />

      <PropertiesSection />

      <ExpertGuideSection />

      <TestimonialsSection />

      <LandlordSignupSection />

      <Footer />
    </div>
  );
};

export default HomePage;
