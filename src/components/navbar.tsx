import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "../assets/logo.png";

const NAV_LINKS = [
  { id: "property", name: "Property", href: "/property" },
  { id: "sell-buy", name: "Sell or buy", href: "/sell-buy" },
  { id: "services", name: "Services", href: "/services" },
  { id: "contact", name: "Contact Us", href: "/contact" },
  { id: "about", name: "About Us", href: "/about" },
  // { id: "careers", name: "Careers", href: "/careers" },
];

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActiveLink = (href: string) => {
    return location.pathname === href;
  };

  return (
    <nav className="main-container py-[1rem] relative z-100">
      <div className="bg-white/20 border border-white/50 shadow-sm px-[clamp(0.5rem,2vw,0.875rem)] flex items-center justify-between rounded-[clamp(0.5rem,1.5vw,0.75rem)] gap-[clamp(0.5rem,2vw,1rem)]">
        <a href="/">
          <div className="w-[100px] h-[100px]">
            <img
              src={Logo}
              alt="House Hunters Logo"
              className="w-full h-full object-cover"
            />
          </div>
        </a>

        <div className="hidden md:flex items-center flex-1 justify-center gap-[clamp(0.5rem,1.5vw,0.875rem)]">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.id}
              to={link.href}
              className={`capitalize font-medium text-white hover:text-white/80 transition-all duration-200 whitespace-nowrap text-[clamp(0.875rem,1.2vw,1rem)] relative ${
                isActiveLink(link.href) ? "border-b-2 border-white pb-1" : ""
              }`}
              aria-label={`Navigate to ${link.name}`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* <button
          className="hidden md:block cursor-pointer rounded-[clamp(0.5rem,1.5vw,0.75rem)] px-[clamp(0.75rem,2vw,1.25rem)] py-[clamp(0.5rem,1.5vw,0.75rem)] bg-white font-medium text-[clamp(0.875rem,1.2vw,1rem)] hover:bg-gray-50 transition-colors duration-200 flex-shrink-0 min-w-fit"
          aria-label="Sign in to your account"
        >
          Sign In
        </button> */}

        <button
          className="md:hidden text-white p-2"
          aria-label="Toggle mobile menu"
          onClick={toggleMobileMenu}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute left-0 right-0 mt-2 bg-white rounded-lg shadow-lg p-4 z-100">
          <div className="flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.id}
                to={link.href}
                className={`text-black hover:text-black/80 transition-all duration-200 font-medium text-lg relative ${
                  isActiveLink(link.href) ? "border-b-2 border-black pb-1" : ""
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            {/* <button
              className="w-full mt-2 cursor-pointer rounded-lg px-4 py-2 bg-black text-white font-medium text-base transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Sign In
            </button> */}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
