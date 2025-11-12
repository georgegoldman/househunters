import { useState, useRef } from "react";
import Avatar from "../assets/avatar-2.jpg";
import ArrowLeft from "../assets/arrow-left";
import ArrowRight from "../assets/arrow-right";
import Frame from "../assets/Frame 896.png";
import Frame1 from "../assets/Frame 897.png";
import TestimonialCard from "./testimonial-card";

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

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const sectionRef = useRef(null);

  const currentTestimonial = testimonialsData[currentIndex];

  const handlePrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex(
      (prev) => (prev - 1 + testimonialsData.length) % testimonialsData.length
    );
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % testimonialsData.length);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    switch (event.key) {
      case "ArrowLeft":
        event.preventDefault();
        handlePrevious();
        break;
      case "ArrowRight":
        event.preventDefault();
        handleNext();
        break;
      case " ":
      case "Enter":
        event.preventDefault();
        setIsAutoPlaying(!isAutoPlaying);
        break;
    }
  };

  return (
    <section
      ref={sectionRef}
      className="flex flex-col gap-[clamp(1.5rem,4vw,2rem)] main-container py-[8rem]"
      aria-labelledby="testimonials-heading"
      role="region"
    >
      {/* Section Header */}
      <header className="flex flex-col gap-[clamp(0.5rem,1.5vw,0.625rem)] items-center text-center">
        <h3
          id="testimonials-heading"
          className="font-bold text-[clamp(1.75rem,4vw,2.5rem)] leading-tight text-gray-900"
        >
          What Our Clients Are Saying
        </h3>
        <p className="text-[clamp(0.875rem,2.5vw,1rem)] text-black/70">
          Real experiences from our valued customers
        </p>
      </header>

      {/* Testimonials Container */}
      <div
        className="
          flex flex-col lg:flex-row justify-between items-center 
          bg-gray-100 rounded-[clamp(0.75rem,3vw,1.25rem)]
          p-[clamp(1rem,3vw,2rem)]
          gap-[clamp(1.5rem,4vw,2rem)]
          min-h-[clamp(20rem,40vh,30rem)]
        "
        role="region"
        aria-label="Customer testimonials carousel"
        aria-live="polite"
        aria-atomic="true"
      >
        {/* Testimonial Content */}
        <div className="flex flex-col items-center flex-1 relative">
          <div className="relative w-full min-h-[clamp(15rem,30vh,20rem)]">
            {testimonialsData.map((testimonial, index) => (
              <TestimonialCard
                key={testimonial.id}
                testimonial={testimonial}
                isActive={index === currentIndex}
              />
            ))}
          </div>

          {/* Navigation Controls */}
          <div
            className="flex items-center gap-[clamp(0.75rem,2vw,1.125rem)] mt-[clamp(1rem,3vw,1.5rem)]"
            role="group"
            aria-label="Testimonials navigation"
          >
            <button
              onClick={handlePrevious}
              onKeyDown={handleKeyDown}
              className="
                border border-gray-900 rounded-full 
                w-[clamp(2.5rem,6vw,3.125rem)] h-[clamp(2.5rem,6vw,3.125rem)]
                bg-transparent
                flex items-center justify-center cursor-pointer
              "
              aria-label={`Previous testimonial. Currently showing ${
                currentIndex + 1
              } of ${testimonialsData.length}`}
            >
              <ArrowLeft />
            </button>

            <button
              onClick={handleNext}
              onKeyDown={handleKeyDown}
              className="
                rounded-full w-[clamp(2.5rem,6vw,3.125rem)] h-[clamp(2.5rem,6vw,3.125rem)]
                bg-black/70
                flex items-center justify-center cursor-pointer
              "
              aria-label={`Next testimonial. Currently showing ${
                currentIndex + 1
              } of ${testimonialsData.length}`}
            >
              <ArrowRight />
            </button>
          </div>
        </div>

        {/* Property Images */}
        <div
          className="flex gap-[clamp(1rem,3vw,1.25rem)]"
          role="img"
          aria-label="testimonial showcase images"
        >
          <div className="hidden md:block">
            <img
              src={currentTestimonial.images[0]}
              alt="Featured property exterior view"
              className="
                w-[clamp(8rem,20vw,12rem)] h-[clamp(10rem,25vw,100%)]
                object-cover
              "
            />
          </div>
          <div className="hidden md:block">
            <img
              src={currentTestimonial.images[1]}
              alt="Featured property interior view"
              className="
                w-[clamp(8rem,20vw,12rem)] h-[clamp(10rem,25vw,100%)]
                object-cover
              "
            />
          </div>
        </div>
      </div>

      {/* Screen reader announcements */}
      <div
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
        id="testimonial-status"
      >
        Showing testimonial {currentIndex + 1} of {testimonialsData.length}.
      </div>
    </section>
  );
}
