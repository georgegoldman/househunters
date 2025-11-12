import LetsIconsStarFill from "../assets/lets-icons_star-fill";

type StarRatingProps = {
  rating: number;
  maxRating?: number;
};

const StarRating = ({ rating, maxRating = 5 }: StarRatingProps) => {
  return (
    <div
      className="flex items-center gap-[clamp(0.25rem,1vw,0.375rem)]"
      role="img"
      aria-label={`${rating} out of ${maxRating} stars`}
    >
      {Array.from({ length: maxRating }, (_, index) => (
        <LetsIconsStarFill
          key={index}
          index={index}
          rating={rating}
          aria-hidden="true"
        />
      ))}
      <span className="sr-only">
        {rating} stars out of {maxRating}
      </span>
    </div>
  );
};

export default StarRating;
