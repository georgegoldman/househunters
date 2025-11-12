import TagIconWhite from "../assets/tag-icon-white";
import BoxIconWhite from "../assets/box-icon-white";
import UsersIconWhite from "../assets/users-icon-white";
import HomeIconWhite from "../assets/home-icon-white";

export default function ExpertGuideSection() {
  const expertGuidesData = [
    {
      id: 1,
      icon: TagIconWhite,
      title: "Homeowners",
      description:
        "Make confident decision with guidance from our leasehold, compensation and planning expert.",
      ariaLabel:
        "Expert guidance for homeowners including leasehold, compensation and planning services",
    },
    {
      id: 2,
      icon: BoxIconWhite,
      title: "Sellers",
      description:
        "Smooth selling with our data-led approach and deep understanding of local and global markets.",
      ariaLabel:
        "Professional selling services with data-driven market analysis and local expertise",
    },
    {
      id: 3,
      icon: UsersIconWhite,
      title: "Tenants",
      description:
        "We take the time to understand your needs and find the best property to suit your lifestyle.",
      ariaLabel:
        "Personalized tenant services to match properties with your lifestyle requirements",
    },
    {
      id: 4,
      icon: HomeIconWhite,
      title: "Landlords",
      description:
        "We offer area knowledge, experience finding top tenants, and excellent digital marketing reach.",
      ariaLabel:
        "Comprehensive landlord services including tenant sourcing and digital marketing",
    },
  ];

  return (
    <section
      className="flex flex-col items-center gap-[clamp(2rem,6vw,3.125rem)] main-container"
      aria-labelledby="guides-heading"
      role="region"
    >
      {/* Section Header */}
      <header className="flex flex-col items-center gap-[clamp(0.5rem,1.5vw,0.625rem)] text-center max-w-4xl">
        <h3
          id="guides-heading"
          className="
            text-[clamp(1.75rem,4vw,2.5rem)] font-bold leading-tight
            text-gray-900 max-w-3xl
          "
        >
          Expert Guides to Finding Your Perfect Fit
        </h3>

        <p
          className="text-[clamp(0.875rem,2.5vw,1rem)] text-black/70"
          aria-describedby="guides-heading"
        >
          Find your perfect fit with our specialized services.
        </p>
      </header>

      {/* Guides Grid */}
      <div
        className="
          grid grid-cols-1 
          sm:grid-cols-2 
          lg:grid-cols-3 
          xl:grid-cols-4
          gap-[clamp(1.5rem,3vw,2rem)]
          w-full max-w-7xl
          justify-items-center
        "
        role="list"
        aria-label={`${expertGuidesData.length} expert service categories`}
      >
        {expertGuidesData.map((guide) => (
          <div key={guide.id} role="listitem" className="w-full max-w-sm">
            <div
              className="
        bg-gray-100 hover:bg-gray-50 
        rounded-[clamp(0.75rem,2vw,1rem)] 
        p-[clamp(1rem,3vw,1.25rem)] 
        gap-[clamp(0.5rem,1.5vw,0.625rem)] 
        flex flex-col items-center text-center
        transition-all duration-300 ease-in-out
        hover:shadow-lg hover:scale-[1.02]
        focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2
      "
              aria-labelledby={`guide-title-${guide.id}`}
              aria-describedby={`guide-description-${guide.id}`}
              role="article"
            >
              <div
                className="flex items-center justify-center mb-[clamp(0.25rem,1vw,0.5rem)]"
                aria-hidden="true"
              >
                <guide.icon />
              </div>

              <div className="flex flex-col items-center gap-[clamp(0.75rem,2vw,1.25rem)]">
                <h4
                  id={`guide-title-${guide.id}`}
                  className="font-bold text-[clamp(1.25rem,3vw,1.5rem)] leading-tight text-gray-900"
                >
                  {guide.title}
                </h4>

                <p
                  id={`guide-description-${guide.id}`}
                  className="
            text-[clamp(0.75rem,2vw,0.875rem)] 
            text-black/60 leading-relaxed
            max-w-[30ch]
          "
                  aria-label={guide.ariaLabel}
                >
                  {guide.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Screen reader summary */}
      <div className="sr-only" aria-live="polite">
        Expert services available for homeowners, sellers, tenants, and
        landlords with specialized guidance for each category.
      </div>
    </section>
  );
}
