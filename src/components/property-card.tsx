import LocationIcon from "../assets/location-icon";
import CallIcon from "../assets/call-icon";
import StarIcon from "../assets/star-icon";
import UserIcon from "../assets/user-icon";
// import type { Property } from "../types/property";
import { useNavigate } from "react-router-dom";
import type { PropertyCardItem } from "../lib/mappers";

interface PropertyProps {
  property: PropertyCardItem;
}

export default function PropertyCard({ property }: PropertyProps) {
  const navigate = useNavigate();

  return (
    <article
      className="pb-[clamp(0.75rem,2vw,1rem)] flex flex-col gap-[clamp(1rem,3vw,1.25rem)] max-w-[clamp(20rem,40vw,25rem)] mx-auto"
      aria-labelledby={`property-title-${property.id}`}
    >
      <div
        onClick={() => navigate(`/property/${property.id}`)}
        className="w-full h-[clamp(12rem,25vw,18.5rem)] relative"
      >
        <img
          src={property.image}
          className="w-full h-full cursor-pointer rounded-[clamp(0.75rem,2vw,1.25rem)] object-cover"
          alt={`${property.title} property exterior view`}
        />

        {/* Status Badge */}
        <div
          className={`
            p-[clamp(0.5rem,1.5vw,0.625rem)] 
            ${
              property.status === "Sold"
                ? "bg-red-500 text-white"
                : "bg-white text-gray-900"
            } 
            rounded-[clamp(0.75rem,2vw,1.25rem)] 
            absolute top-[clamp(0.5rem,1.5vw,0.625rem)] left-[clamp(0.5rem,1.5vw,0.625rem)] 
            text-[clamp(0.75rem,2vw,0.875rem)] 
            
            flex items-center justify-center
            font-medium shadow-sm
          `}
          role="status"
          aria-label={`Property status: ${property.status}`}
        >
          {property.status}
        </div>

        {/* Popular Badge */}
        {property.show && (
          <div
            className="
              bg-black text-white 
              px-[clamp(0.75rem,2vw,1rem)] py-[clamp(0.5rem,1.5vw,0.625rem)] 
              rounded-tl-[clamp(0.25rem,1vw,0.5rem)] 
              rounded-tr-[clamp(0.25rem,1vw,0.5rem)] 
              rounded-br-[clamp(0.25rem,1vw,0.5rem)] 
              flex items-center gap-[clamp(0.125rem,0.5vw,0.25rem)] 
              absolute bottom-[-5%] left-[-2%]
              shadow-lg
            "
            role="status"
            aria-label="Popular property"
          >
            <StarIcon />
            <p className="font-bold text-[clamp(0.625rem,1.5vw,0.75rem)]">
              POPULAR
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-[clamp(1rem,3vw,1.25rem)] py-[clamp(0.5rem,1.5vw,0.625rem)] px-[clamp(1rem,3vw,1.25rem)]">
        <div className="space-y-[clamp(0.75rem,2vw,1.25rem)]">
          <p
            className="font-bold text-[clamp(1.25rem,3vw,1.5rem)] text-black/90"
            aria-label={`Price: ${property.price}`}
          >
            {property.price}
          </p>

          <h4
            id={`property-title-${property.id}`}
            className="font-bold text-[clamp(1.25rem,3vw,1.5rem)] text-black leading-tight cursor-pointer"
            onClick={() => navigate(`/property/${property.title}`)}
          >
            {property.title}
          </h4>

          <div className="flex items-center gap-[clamp(0.25rem,1vw,0.3125rem)]">
            <LocationIcon />
            <address className="text-black/70 text-[clamp(0.875rem,2vw,1rem)] not-italic leading-relaxed">
              {property.location}
            </address>
          </div>
        </div>

        {/* Agent Info */}
        <div
          className="flex items-center justify-between border-b border-black/10 pb-[clamp(0.375rem,1vw,0.5rem)]"
          role="region"
          aria-label="Agent contact information"
        >
          <div className="flex items-center gap-[clamp(0.25rem,1vw,0.3125rem)]">
            {property.agent.avatar ? (
              <img
                src={property.agent.avatar}
                className="w-[clamp(1rem,2.5vw,1.25rem)] h-[clamp(1rem,2.5vw,1.25rem)] rounded-full object-cover"
                alt={`${property.agent.name} profile picture`}
              />
            ) : (
              <div className="w-[clamp(1rem,2.5vw,1.25rem)] h-[clamp(1rem,2.5vw,1.25rem)] rounded-full bg-gray-200 flex items-center justify-center">
                <UserIcon isActive={true} />
              </div>
            )}
            <p className="text-[clamp(0.75rem,2vw,0.875rem)] text-black/90">
              {property.agent.name}
            </p>
          </div>

          <a
            href={`tel:${property.agent.phone}`}
            className="flex items-center gap-[clamp(0.25rem,1vw,0.3125rem)]"
            aria-label={`Call agent ${property.agent.name} at ${property.agent.phone}`}
          >
            <CallIcon />
            <span className="text-[clamp(0.75rem,2vw,0.875rem)] text-black/90">
              {property.agent.phone}
            </span>
          </a>
        </div>

        {/* Property Features */}
        <div
          className="flex flex-wrap gap-[clamp(0.75rem,3vw,1.25rem)]"
          role="list"
          aria-label="Property features and amenities"
        >
          {property.features?.map((feature, i) => {
            const Icon = feature.icon; // ElementType | undefined
            return (
              <li key={i} className="flex items-center gap-2">
                {Icon ? (
                  <Icon aria-hidden="true" className="w-4 h-4 flex-shrink-0" />
                ) : null}
                <span aria-label={feature.ariaLabel}>{feature.label}</span>
              </li>
            );
          })}
        </div>
      </div>
    </article>
  );
}
