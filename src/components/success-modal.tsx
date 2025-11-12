import React from "react";
import CloseIcon from "../assets/close-icon";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
  title = "Thank you for sending a review Request, We can't wait to see what you choose!",
  description,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-[clamp(1rem,2.5vw,1.5rem)] p-[clamp(1.5rem,4vw,2rem)] w-[90%] max-w-[clamp(20rem,40vw,30rem)] flex flex-col items-center gap-[clamp(1rem,2.5vw,1.5rem)]">
        <button
          onClick={onClose}
          className="absolute right-[clamp(0.75rem,2vw,1rem)] top-[clamp(0.75rem,2vw,1rem)]"
          aria-label="Close modal"
        >
          <CloseIcon />
        </button>

        {/* Success Icon */}
        <div className="w-[clamp(3rem,8vw,5rem)] h-[clamp(3rem,8vw,5rem)] rounded-full bg-green-100 flex items-center justify-center">
          <svg
            className="w-[60%] h-[60%] text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        {/* Title */}
        <h3 className="text-[clamp(1rem,2.5vw,1.25rem)] font-bold text-gray-900 text-center">
          {title}
        </h3>

        {/* Description */}
        {description && (
          <p className="text-[clamp(0.75rem,2vw,0.75rem)] text-black/70 text-center leading-relaxed">
            {description}
          </p>
        )}

        <button
          onClick={onClose}
          className="bg-black text-white py-[clamp(0.75rem,2vw,1rem)] px-[clamp(1.5rem,4vw,2rem)] rounded-[clamp(0.75rem,2vw,1rem)] font-medium text-[clamp(0.875rem,2vw,1rem)] hover:bg-gray-800 w-full cursor-pointer"
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;
