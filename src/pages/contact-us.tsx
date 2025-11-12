import FbIconBlack from "../assets/fb-icon-black";
import XIcon from "../assets/x-icon";
import YtIcon from "../assets/yt-icon";
import Footer from "../components/footer";
import Navbar from "../components/navbar";
import Bg from "../assets/getty-images-65hpgg9V49A-unsplash.jpg";
import ArrowLeft from "../assets/arrow-left";
import { useNavigate } from "react-router-dom";

const ContactUs = () => {
  const navigate = useNavigate();

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
              Contact Us
            </h1>
            <p className="text-white/60 font-medium text-[clamp(0.875rem,2vw,1rem)] z-10">
              We're here to answer your questions and address any concerns.
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

      <section className="flex flex-col-reverse lg:flex-row lg:items-start lg:justify-between gap-[clamp(3rem,6vw,4rem)] py-[clamp(3rem,8vw,6rem)] main-container">
        {/* Contact Information */}
        <div className="flex flex-col gap-[clamp(3rem,6vw,4.3125rem)] w-full lg:w-[clamp(20rem,30vw,23.125rem)]">
          <div className="flex flex-col gap-[clamp(0.75rem,2vw,0.9375rem)]">
            <h2 className="text-[clamp(1.5rem,4vw,2rem)] font-bold leading-tight">
              We are always ready to help you and answer your questions
            </h2>
            <p className="text-black/50 font-rubik font-normal text-[clamp(0.875rem,2vw,1rem)]">
              Have a question? Send us a message and our team will get back to
              you.
            </p>
          </div>

          <div className="flex flex-col gap-[clamp(1.5rem,4vw,1.875rem)]">
            {/* Contact Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[clamp(1.5rem,4vw,2.1875rem)]">
              <div className="flex flex-col gap-[clamp(0.5rem,1.5vw,0.625rem)]">
                <h3 className="font-bold text-[clamp(0.875rem,2vw,1rem)]">
                  Call Center
                </h3>
                <div className="flex flex-col gap-[clamp(0.25rem,0.5vw,0.25rem)]">
                  <a
                    href="tel:+2349123456787"
                    className="text-black/60 text-[clamp(0.75rem,1.5vw,0.875rem)] hover:text-black transition-colors"
                  >
                    +234 912 3456 78
                  </a>
                  <a
                    href="tel:+2349123456787"
                    className="text-black/60 text-[clamp(0.75rem,1.5vw,0.875rem)] hover:text-black transition-colors"
                  >
                    +234 912 3456 78
                  </a>
                </div>
              </div>

              <div className="flex flex-col gap-[clamp(0.5rem,1.5vw,0.625rem)]">
                <h3 className="font-bold text-[clamp(0.875rem,2vw,1rem)]">
                  Our Location
                </h3>
                <div className="flex flex-col gap-[clamp(0.25rem,0.5vw,0.25rem)]">
                  <p className="text-black/60 text-[clamp(0.75rem,1.5vw,0.875rem)]">
                    USA, New York - 1003
                  </p>
                  <p className="text-black/60 text-[clamp(0.75rem,1.5vw,0.875rem)]">
                    Str, First Avenue
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[clamp(1.5rem,4vw,2.1875rem)]">
              <div className="flex flex-col gap-[clamp(0.5rem,1.5vw,0.625rem)]">
                <h3 className="font-bold text-[clamp(0.875rem,2vw,1rem)]">
                  Email
                </h3>
                <div className="flex flex-col gap-[clamp(0.25rem,0.5vw,0.25rem)]">
                  <a
                    href="mailto:teary@gmail.com"
                    className="text-black/60 text-[clamp(0.75rem,1.5vw,0.875rem)] hover:text-black transition-colors"
                  >
                    teary@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex flex-col gap-[clamp(0.5rem,1.5vw,0.625rem)]">
                <h3 className="font-bold text-[clamp(0.875rem,2vw,1rem)]">
                  Social Network
                </h3>
                <div className="flex items-center gap-[clamp(0.25rem,0.5vw,0.25rem)]">
                  <a
                    href="#"
                    className="hover:scale-110 transition-transform"
                    aria-label="Facebook"
                  >
                    <FbIconBlack />
                  </a>
                  <a
                    href="#"
                    className="hover:scale-110 transition-transform"
                    aria-label="YouTube"
                  >
                    <YtIcon />
                  </a>
                  <a
                    href="#"
                    className="hover:scale-110 transition-transform"
                    aria-label="Twitter/X"
                  >
                    <XIcon />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="flex flex-col gap-[clamp(2rem,5vw,3.125rem)] p-[clamp(0.5rem,2vw,0.625rem)] w-full lg:w-[clamp(25rem,50vw,40.125rem)]">
          <div className="flex flex-col items-center gap-[clamp(0.5rem,1.5vw,0.625rem)]">
            <h2 className="font-rubik font-medium text-[clamp(1.75rem,4vw,2.5rem)] text-center">
              Get In Touch
            </h2>
            <p className="text-black/50 font-rubik text-[clamp(0.875rem,2vw,1rem)] max-w-[22.1875rem] text-center font-normal">
              Please fill out the form below with your details and message and
              our team will get back to you as soon as possible.
            </p>
          </div>

          <form
            className="flex flex-col gap-[clamp(1rem,2vw,1.125rem)]"
            noValidate
          >
            <div className="flex flex-col gap-[clamp(0.75rem,1.5vw,1.125rem)]">
              <input
                className="bg-gray-50 p-[clamp(0.5rem,2vw,0.625rem)] rounded-[clamp(0.5rem,1.5vw,0.625rem)] h-[clamp(2.75rem,4vw,3.25rem)] font-rubik placeholder:font-rubik placeholder:text-[clamp(0.75rem,1.5vw,0.75rem)] placeholder:font-normal font-normal placeholder:text-black/50 text-[clamp(0.75rem,1.5vw,0.75rem)] border border-transparent focus:border-gray-300 focus:outline-none focus:ring-2 focus:ring-black/10 transition-all"
                placeholder="Full name"
                type="text"
                name="fullName"
                required
                aria-label="Full name"
              />
              <input
                className="bg-gray-50 p-[clamp(0.5rem,2vw,0.625rem)] rounded-[clamp(0.5rem,1.5vw,0.625rem)] h-[clamp(2.75rem,4vw,3.25rem)] font-rubik placeholder:font-rubik placeholder:text-[clamp(0.75rem,1.5vw,0.75rem)] placeholder:font-normal font-normal placeholder:text-black/50 text-[clamp(0.75rem,1.5vw,0.75rem)] border border-transparent focus:border-gray-300 focus:outline-none focus:ring-2 focus:ring-black/10 transition-all"
                placeholder="Enter Email Address"
                type="email"
                name="email"
                required
                aria-label="Email address"
              />
              <input
                className="bg-gray-50 p-[clamp(0.5rem,2vw,0.625rem)] rounded-[clamp(0.5rem,1.5vw,0.625rem)] h-[clamp(2.75rem,4vw,3.25rem)] font-rubik placeholder:font-rubik placeholder:text-[clamp(0.75rem,1.5vw,0.75rem)] placeholder:font-normal font-normal placeholder:text-black/50 text-[clamp(0.75rem,1.5vw,0.75rem)] border border-transparent focus:border-gray-300 focus:outline-none focus:ring-2 focus:ring-black/10 transition-all"
                placeholder="Subject"
                type="text"
                name="subject"
                required
                aria-label="Subject"
              />
              <textarea
                className="bg-gray-50 p-[clamp(0.5rem,2vw,0.625rem)] rounded-[clamp(0.5rem,1.5vw,0.625rem)] h-[clamp(5rem,10vw,6.4375rem)] font-rubik placeholder:font-rubik placeholder:text-[clamp(0.75rem,1.5vw,0.75rem)] placeholder:font-normal font-normal placeholder:text-black/50 text-[clamp(0.75rem,1.5vw,0.75rem)] border border-transparent focus:border-gray-300 focus:outline-none focus:ring-2 focus:ring-black/10 transition-all resize-none"
                name="message"
                placeholder="Your message..."
                required
                aria-label="Message"
              />
            </div>

            <button
              type="submit"
              className="bg-black text-white py-[clamp(0.75rem,2vw,1rem)] px-[clamp(1rem,3vw,1.5rem)] w-full rounded-[clamp(1rem,3vw,1.875rem)] font-medium text-[clamp(0.875rem,2vw,1rem)] hover:bg-gray-800 focus:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black/20 transition-all active:scale-98"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactUs;
