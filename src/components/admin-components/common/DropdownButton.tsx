import { useState } from "react";
import CaretDown from "../../../assets/caret-down";

interface DropdownButtonProps {
  options: string[];
  selected: string;
  onSelect: (option: string) => void;
  placeholder: string;
  withBorder?: boolean;
}

const DropdownButton = ({
  options,
  selected,
  onSelect,
  placeholder,
  withBorder = false,
}: DropdownButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          p-2
          flex 
          items-center 
          gap-2
          transition-all
          duration-200
          ${
            withBorder
              ? "border border-black/20 rounded-[10px] bg-transparent"
              : "rounded-[20px] bg-[#FAFAFA]"
          }
        `}
        aria-label={`Select ${placeholder}`}
        aria-expanded={isOpen}
      >
        <p className="font-rubik text-sm text-black font-normal whitespace-nowrap">
          {selected ? selected : placeholder}
        </p>
        <div
          className={`transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          <CaretDown />
        </div>
      </button>

      {isOpen && (
        <div
          className="
          absolute 
          top-full 
          left-0 
          mt-2 
          w-full 
          min-w-48
          bg-white 
          border 
          border-gray-200 
          rounded-lg
          shadow-lg 
          z-10
          max-h-60
          overflow-y-auto
        "
        >
          {options.map((option) => (
            <button
              key={option}
              onClick={() => {
                onSelect(option);
                setIsOpen(false);
              }}
              className="
                w-full 
                text-left 
                px-3
                py-2
                text-sm
                text-black/70
                hover:bg-gray-50
                hover:text-black/90
                transition-colors
                duration-150
                first:rounded-t-lg
                last:rounded-b-lg
              "
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownButton;
