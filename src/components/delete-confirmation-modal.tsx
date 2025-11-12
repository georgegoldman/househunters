import React from "react";
import CloseIcon from "../assets/close-icon";
import DeleteIcon from "../assets/delete-icon";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  propertyTitle: string;
  isDeleting: boolean;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  propertyTitle,
  isDeleting,
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
    >
      {/* Blur overlay */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={handleBackdropClick}
      />

      {/* Modal */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-sm sm:max-w-md bg-white rounded-lg shadow-lg overflow-hidden mx-4">
        <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-200">
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <CloseIcon width={20} height={20} />
          </button>
        </div>

        <div className="p-4 sm:p-6">
          {/* Icon and Title */}
          <div className="flex flex-col items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center">
              <DeleteIcon
                width={24}
                height={24}
                className="sm:w-8 sm:h-8 text-red-600"
              />
            </div>
            <div className="text-center">
              <h3
                id="delete-modal-title"
                className="text-lg sm:text-xl font-bold text-gray-900 mb-2"
              >
                Delete Property
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-gray-900">
                  "{propertyTitle}"
                </span>
                ? This action cannot be undone.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center">
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className="px-6 py-2 sm:py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed relative text-sm sm:text-base"
            >
              <span className={isDeleting ? "opacity-0" : ""}>
                Delete Property
              </span>
              {isDeleting && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
