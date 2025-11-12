import BillIconWhite from "../../../../assets/bill-icon-white";
import PlusIcon from "../../../../assets/plus-icon";

interface ActionButtonsProps {
  onAddProperty: (type: string) => void;
}

const ActionButtons = ({ onAddProperty }: ActionButtonsProps) => {
  return (
    <div className="flex items-center lg:justify-end mt-4 gap-4 w-full flex-wrap">
      <button
        onClick={() => onAddProperty("bill")}
        className="
          bg-gray-900 
          flex 
          items-center 
          gap-2
          py-2
          px-4
          rounded-lg
          hover:bg-gray-800
          focus:bg-gray-800
          focus:outline-none
          focus:ring-2
          focus:ring-gray-700
          transition-all
          duration-200
          shadow-sm
          hover:shadow-md
        "
        aria-label="Add new property with bill"
      >
        <BillIconWhite />
        <span className="text-white/90 text-sm font-medium whitespace-nowrap">
          Add New Property
        </span>
      </button>

      <button
        onClick={() => onAddProperty("plus")}
        className="
          bg-gray-50 
          border
          border-gray-200
          flex 
          items-center 
          gap-2
          py-2
          px-4
          rounded-lg
          hover:bg-white
          hover:border-gray-300
          transition-all
          duration-200
          shadow-sm
          hover:shadow-md
        "
        aria-label="Add new property"
      >
        <PlusIcon />
        <span className="text-black/70 text-sm font-medium whitespace-nowrap">
          Add New Property
        </span>
      </button>
    </div>
  );
};

export default ActionButtons;
