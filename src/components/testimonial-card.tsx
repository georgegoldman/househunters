import StarRating from "./star-rating";

type Testimonial = {
  id: number;
  name: string;
  location: string;
  rating: number;
  avatar: string;
  testimonial: string;
  images: string[];
};

type TestimonialCardProps = {
  testimonial: Testimonial;
  isActive: boolean;
};

const TestimonialCard = ({ testimonial, isActive }: TestimonialCardProps) => {
  return (
    <div
      className={`
          transition-opacity duration-500 ease-in-out
          ${isActive ? "opacity-100" : "opacity-0 absolute inset-0"}
        `}
      aria-hidden={!isActive}
    >
      <div className="flex flex-col items-start gap-[clamp(1.5rem,4vw,2.5rem)]">
        <div className="flex flex-col gap-[clamp(1.5rem,3vw,2.5rem)]">
          <div className="flex flex-col gap-[clamp(0.5rem,1.5vw,0.625rem)]">
            <div className="flex items-center gap-[clamp(0.5rem,2vw,0.625rem)]">
              <img
                className="
                    w-[clamp(3rem,8vw,5rem)] h-[clamp(3rem,8vw,5rem)] 
                    rounded-full object-cover object-top
                    ring-2 ring-white shadow-sm
                  "
                src={testimonial.avatar}
                alt={`${testimonial.name} profile picture`}
              />
              <div className="flex flex-col gap-[clamp(0.125rem,0.5vw,0.1875rem)]">
                <h4 className="text-[clamp(1.25rem,3vw,1.5rem)] font-semibold text-gray-900 leading-tight">
                  {testimonial.name}
                </h4>
                <p className="text-[clamp(0.625rem,1.5vw,0.75rem)] text-gray-600">
                  {testimonial.location}
                </p>
              </div>
            </div>
            <StarRating rating={testimonial.rating} />
          </div>

          <blockquote
            className="
                text-[clamp(0.875rem,2.5vw,1.25rem)] text-black/60 leading-relaxed
                max-w-[clamp(20rem,50vw,32rem)]
                relative
              "
          >
            <span className="sr-only">Customer testimonial:</span>"
            {testimonial.testimonial}"
          </blockquote>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
