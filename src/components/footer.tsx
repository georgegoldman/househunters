import Logo from "../assets/Logo.svg";
import FbIcon from "../assets/fb-icon";
import IgIcon from "../assets/ig-icon";
import { FooterNavData } from "../data/footer-data";

type FooterLink = {
  text: string;
  href: string;
  ariaLabel: string;
};

type FooterSection = {
  id: string;
  title: string;
  ariaLabel: string;
  links: FooterLink[];
};

type FooterNavColumnProps = {
  section: FooterSection;
};

const socialMediaLinks = [
  {
    id: "facebook",
    icon: FbIcon,
    href: "#",
    ariaLabel: "Follow us on Facebook",
    name: "Facebook",
  },
  {
    id: "instagram",
    icon: IgIcon,
    href: "#",
    ariaLabel: "Follow us on Instagram",
    name: "Instagram",
  },
];

function FooterNavColumn({ section }: FooterNavColumnProps) {
  return (
    <nav className="flex flex-col gap-[clamp(1rem,3vw,1.25rem)]">
      <h4
        id={`nav-heading-${section.id}`}
        className="
            text-gray-900 font-bold text-[clamp(0.75rem,2vw,1rem)]
            tracking-wide
          "
      >
        {section.title}
      </h4>

      <ul
        className="flex flex-col gap-[clamp(0.5rem,1.5vw,0.625rem)]"
        role="list"
        aria-label={section.ariaLabel}
      >
        {section.links.map((link, index) => (
          <li key={index} role="listitem">
            <a
              href={link.href}
              className="
                  text-gray-900 font-normal 
                  text-[clamp(0.75rem,2vw,0.875rem)]
                  hover:underline
                "
              aria-label={link.ariaLabel}
            >
              {link.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="
        flex flex-col justify-between 
        pt-[clamp(2rem,6vw,3rem)] pb-[clamp(1rem,3vw,1.5rem)]
        min-h-[clamp(30rem,80vh,50rem)]
        font-jakarta bg-white
      "
      role="contentinfo"
      aria-label="Site footer with navigation and company information"
    >
      {/* Main Footer Content */}
      <div className="flex flex-col lg:flex-row items-start justify-between gap-[clamp(2rem,6vw,4rem)] p-[clamp(1rem,4vw,2rem)] max-w-7xl mx-auto w-full">
        {/* Logo and Brand */}
        <div>
          <a href="/" aria-label="House hunters homepage">
            <img
              src={Logo}
              alt="House hunter logo"
              className="h-[clamp(2rem,5vw,3rem)] w-auto"
            />
          </a>
        </div>

        {/* Navigation Links */}
        <div
          className="
          grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
          gap-[clamp(2rem,5vw,5.5rem)]
        "
        >
          {FooterNavData.map((section) => (
            <FooterNavColumn key={section.id} section={section} />
          ))}
        </div>
      </div>

      {/* Footer Bottom */}
      <div
        className="
        flex flex-col sm:flex-row items-center justify-between 
        pt-[clamp(1rem,3vw,1.5rem)] px-[clamp(1rem,4vw,2rem)] 
        w-full max-w-7xl mx-auto
        border-t border-gray-200
        gap-[clamp(1rem,2vw,1.5rem)]
      "
      >
        {/* Copyright */}
        <p
          className="
            text-gray-900 font-medium opacity-60
            text-[clamp(0.75rem,2vw,0.875rem)]
            text-center sm:text-left
          "
          role="contentinfo"
        >
          ©{currentYear} House Hunters. All rights reserved
        </p>

        {/* Social Media Links */}
        <div
          className="flex gap-[clamp(1.5rem,4vw,2.5rem)] items-center"
          role="list"
          aria-label="Social media links"
        >
          {socialMediaLinks.map((social) => (
            <div key={social.id} role="listitem">
              <a
                href={social.href}
                aria-label={social.ariaLabel}
                target="_blank"
                rel="noopener noreferrer"
              >
                <social.icon />
                <span className="sr-only">{social.name}</span>
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Screen reader site structure summary */}
      <div className="sr-only" aria-label="Footer site map summary">
        Footer contains navigation for selling homes, buying homes, property
        services, company information, legal terms, and helpful resources.
        Social media links and copyright information are also available.
      </div>
    </footer>
  );
}
