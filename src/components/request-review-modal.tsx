import React, { useState } from "react";
import CloseIcon from "../assets/close-icon";
import SuccessModal from "./success-modal";

interface RequestReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<void>;
}

interface FormData {
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  additionalInfo: string;
  preferences: string;
  submit?: string;
}

const RequestReviewModal: React.FC<RequestReviewModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    additionalInfo: "",
    preferences: "",
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!isOpen) return null;

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.date) newErrors.date = "Date is required";
    if (!formData.time.trim()) newErrors.time = "Time preference is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      try {
        // Simulate API call with setTimeout
        // await new Promise((resolve) => setTimeout(resolve, 1500));
        await onSubmit(formData);

        // Handle form submission here
        // console.log("Form submitted:", formData);

        // Reset form
        setFormData({
          title: "",
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          date: "",
          time: "",
          additionalInfo: "",
          preferences: "",
        });
        setErrors({});

        // Show success modal
        // setShowSuccess(true);
      } catch (error) {
        console.error("Error submitting form:", error);
        // Handle error here if needed
        setErrors({
          submit: "Failed to submit request. Please try again.",
        } as any);
      } finally {
        setIsLoading(false);
      }
    }
  };

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
      aria-labelledby="modal-title"
    >
      {/* Blur overlay */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={handleBackdropClick}
      />

      {/* Modal */}
      <div className="absolute right-0 top-0 h-full w-full p-[clamp(0.5rem,2vw,1rem)] max-w-[clamp(25rem,50vw,50rem)] bg-white shadow-lg overflow-auto">
        <div className="">
          <button
            onClick={onClose}
            className="w-full flex justify-end p-[clamp(0.5rem,1vw,1rem)]"
            aria-label="Close modal"
          >
            <CloseIcon />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-[clamp(1rem,3vw,1.5rem)] flex flex-col gap-[clamp(2rem,4vw,3.125rem)]"
        >
          {/* Header Section */}
          <header className="flex flex-col items-center gap-[clamp(0.75rem,2vw,1rem)] text-center">
            <h2
              id="modal-title"
              className="text-[clamp(1.25rem,3vw,2rem)] font-bold text-gray-900"
            >
              Request Review
            </h2>
            <p className="text-[clamp(0.875rem,2vw,1rem)] leading-relaxed text-black/60 max-w-[clamp(20rem,40vw,35rem)]">
              Use this form to let us know roughly when you're free and we'll
              handle the rest. One of the team will accompany you to the
              appointment, so you can ask any other questions you may have then.
            </p>
          </header>

          {/* Personal Details Section */}
          <section className="flex flex-col gap-[clamp(1rem,2.5vw,1.5rem)]">
            <h3 className="font-bold text-[clamp(1rem,2.5vw,1.25rem)] text-center text-gray-900">
              Enter Your Details
            </h3>

            <div className="flex flex-col gap-[clamp(0.75rem,2vw,1rem)]">
              {/* Title Field */}
              <div className="flex flex-col gap-[clamp(0.375rem,1vw,0.5rem)]">
                <div className="flex justify-between items-center">
                  <label
                    className="text-[clamp(0.875rem,2vw,1rem)] font-semibold text-gray-700"
                    htmlFor="title"
                  >
                    Title
                  </label>
                  <span className="font-medium text-black/50 text-[clamp(0.75rem,1.5vw,0.875rem)]">
                    (Optional)
                  </span>
                </div>
                <select
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="border border-gray-300 py-[clamp(0.75rem,2vw,1rem)] px-[clamp(1rem,2.5vw,1.25rem)] rounded-[clamp(0.75rem,2vw,1rem)] text-black/90 text-[clamp(0.875rem,2vw,1rem)] bg-white"
                >
                  <option value="">Select title</option>
                  <option value="MR">Mr</option>
                  <option value="MRS">Mrs</option>
                  <option value="MS">Ms</option>
                  <option value="DR">Dr</option>
                </select>
              </div>

              {/* First Name Field */}
              <div className="flex flex-col gap-[clamp(0.375rem,1vw,0.5rem)]">
                <label
                  className="text-[clamp(0.875rem,2vw,1rem)] font-semibold text-gray-700"
                  htmlFor="firstName"
                >
                  First Name *
                </label>
                <input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) =>
                    handleInputChange("firstName", e.target.value)
                  }
                  placeholder="First Name"
                  className={`border py-[clamp(0.75rem,2vw,1rem)] px-[clamp(1rem,2.5vw,1.25rem)] rounded-[clamp(0.75rem,2vw,1rem)] text-black/90 text-[clamp(0.875rem,2vw,1rem)] placeholder:text-[clamp(0.75rem,1.5vw,0.875rem)] placeholder:text-black/50 ${
                    errors.firstName ? "border-red-500" : "border-gray-300"
                  }`}
                  type="text"
                  required
                />
                {errors.firstName && (
                  <span className="text-red-500 text-[clamp(0.75rem,1.5vw,0.875rem)]">
                    {errors.firstName}
                  </span>
                )}
              </div>

              {/* Last Name Field */}
              <div className="flex flex-col gap-[clamp(0.375rem,1vw,0.5rem)]">
                <label
                  className="text-[clamp(0.875rem,2vw,1rem)] font-semibold text-gray-700"
                  htmlFor="lastName"
                >
                  Last Name *
                </label>
                <input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) =>
                    handleInputChange("lastName", e.target.value)
                  }
                  placeholder="Last Name"
                  className={`border py-[clamp(0.75rem,2vw,1rem)] px-[clamp(1rem,2.5vw,1.25rem)] rounded-[clamp(0.75rem,2vw,1rem)] text-black/90 text-[clamp(0.875rem,2vw,1rem)] placeholder:text-[clamp(0.75rem,1.5vw,0.875rem)] placeholder:text-black/50 ${
                    errors.lastName ? "border-red-500" : "border-gray-300"
                  }`}
                  type="text"
                  required
                />
                {errors.lastName && (
                  <span className="text-red-500 text-[clamp(0.75rem,1.5vw,0.875rem)]">
                    {errors.lastName}
                  </span>
                )}
              </div>

              {/* Email Field */}
              <div className="flex flex-col gap-[clamp(0.375rem,1vw,0.5rem)]">
                <label
                  className="text-[clamp(0.875rem,2vw,1rem)] font-semibold text-gray-700"
                  htmlFor="email"
                >
                  Email *
                </label>
                <input
                  id="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter Email Address"
                  className={`border py-[clamp(0.75rem,2vw,1rem)] px-[clamp(1rem,2.5vw,1.25rem)] rounded-[clamp(0.75rem,2vw,1rem)] text-black/90 text-[clamp(0.875rem,2vw,1rem)] placeholder:text-[clamp(0.75rem,1.5vw,0.875rem)] placeholder:text-black/50 ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  type="email"
                  required
                />
                {errors.email && (
                  <span className="text-red-500 text-[clamp(0.75rem,1.5vw,0.875rem)]">
                    {errors.email}
                  </span>
                )}
              </div>

              {/* Phone Number Field */}
              <div className="flex flex-col gap-[clamp(0.375rem,1vw,0.5rem)]">
                <label
                  className="text-[clamp(0.875rem,2vw,1rem)] font-semibold text-gray-700"
                  htmlFor="phone"
                >
                  Phone Number *
                </label>
                <input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="Enter phone number"
                  className={`border py-[clamp(0.75rem,2vw,1rem)] px-[clamp(1rem,2.5vw,1.25rem)] rounded-[clamp(0.75rem,2vw,1rem)] text-black/90 text-[clamp(0.875rem,2vw,1rem)] placeholder:text-[clamp(0.75rem,1.5vw,0.875rem)] placeholder:text-black/50 ${
                    errors.phone ? "border-red-500" : "border-gray-300"
                  }`}
                  type="tel"
                  required
                />
                {errors.phone && (
                  <span className="text-red-500 text-[clamp(0.75rem,1.5vw,0.875rem)]">
                    {errors.phone}
                  </span>
                )}
              </div>
            </div>
          </section>

          {/* Scheduling Section */}
          <section className="flex flex-col gap-[clamp(1rem,2.5vw,1.5rem)]">
            <h3 className="font-bold text-[clamp(1rem,2.5vw,1.25rem)] text-center text-gray-900">
              Preferred Review Time
            </h3>

            <div className="flex flex-col gap-[clamp(0.75rem,2vw,1rem)]">
              {/* Date Field */}
              <div className="flex flex-col gap-[clamp(0.375rem,1vw,0.5rem)]">
                <label
                  className="text-[clamp(0.875rem,2vw,1rem)] font-semibold text-gray-700"
                  htmlFor="date"
                >
                  Date *
                </label>
                <input
                  id="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange("date", e.target.value)}
                  className={`border py-[clamp(0.75rem,2vw,1rem)] px-[clamp(1rem,2.5vw,1.25rem)] rounded-[clamp(0.75rem,2vw,1rem)] text-black/90 text-[clamp(0.875rem,2vw,1rem)] ${
                    errors.date ? "border-red-500" : "border-gray-300"
                  }`}
                  type="date"
                  min={new Date().toISOString().split("T")[0]} // Prevent past dates
                  required
                />
                {errors.date && (
                  <span className="text-red-500 text-[clamp(0.75rem,1.5vw,0.875rem)]">
                    {errors.date}
                  </span>
                )}
              </div>

              {/* Time Field */}
              <div className="flex flex-col gap-[clamp(0.375rem,1vw,0.5rem)]">
                <label
                  className="text-[clamp(0.875rem,2vw,1rem)] font-semibold text-gray-700"
                  htmlFor="time"
                >
                  Preferred Time *
                </label>
                <select
                  id="time"
                  value={formData.time}
                  onChange={(e) => handleInputChange("time", e.target.value)}
                  className={`border py-[clamp(0.75rem,2vw,1rem)] px-[clamp(1rem,2.5vw,1.25rem)] rounded-[clamp(0.75rem,2vw,1rem)] text-black/90 text-[clamp(0.875rem,2vw,1rem)] bg-white ${
                    errors.time ? "border-red-500" : "border-gray-300"
                  }`}
                  required
                >
                  <option value="">Select preferred time</option>
                  <option value="morning">Morning (9:00 AM - 12:00 PM)</option>
                  <option value="afternoon">
                    Afternoon (12:00 PM - 5:00 PM)
                  </option>
                  <option value="evening">Evening (5:00 PM - 8:00 PM)</option>
                </select>
                {errors.time && (
                  <span className="text-red-500 text-[clamp(0.75rem,1.5vw,0.875rem)]">
                    {errors.time}
                  </span>
                )}
              </div>
            </div>
          </section>

          {/* Additional Information Section */}
          <section className="flex flex-col gap-[clamp(1rem,2.5vw,1.5rem)]">
            <h3 className="font-bold text-[clamp(1rem,2.5vw,1.25rem)] text-center text-gray-900">
              Additional Information
            </h3>

            <div className="flex flex-col gap-[clamp(0.75rem,2vw,1rem)]">
              {/* Additional Info Field */}
              <div className="flex flex-col gap-[clamp(0.375rem,1vw,0.5rem)]">
                <div className="flex justify-between items-center">
                  <label
                    className="text-[clamp(0.875rem,2vw,1rem)] font-semibold text-gray-700"
                    htmlFor="additionalInfo"
                  >
                    Anything else we should know?
                  </label>
                  <span className="font-medium text-black/50 text-[clamp(0.75rem,1.5vw,0.875rem)]">
                    (Optional)
                  </span>
                </div>
                <textarea
                  id="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={(e) =>
                    handleInputChange("additionalInfo", e.target.value)
                  }
                  placeholder="Enter message here..."
                  rows={4}
                  className="border border-gray-300 py-[clamp(0.75rem,2vw,1rem)] px-[clamp(1rem,2.5vw,1.25rem)] rounded-[clamp(0.75rem,2vw,1rem)] text-black/90 text-[clamp(0.875rem,2vw,1rem)] placeholder:text-[clamp(0.75rem,1.5vw,0.875rem)] placeholder:text-black/50 resize-vertical min-h-[clamp(4rem,8vw,6rem)]"
                />
              </div>

              {/* Special Preferences Field */}
              <div className="flex flex-col gap-[clamp(0.375rem,1vw,0.5rem)]">
                <div className="flex justify-between items-center">
                  <label
                    className="text-[clamp(0.875rem,2vw,1rem)] font-semibold text-gray-700"
                    htmlFor="preferences"
                  >
                    Special preferences or requirements?
                  </label>
                  <span className="font-medium text-black/50 text-[clamp(0.75rem,1.5vw,0.875rem)]">
                    (Optional)
                  </span>
                </div>
                <input
                  id="preferences"
                  value={formData.preferences}
                  onChange={(e) =>
                    handleInputChange("preferences", e.target.value)
                  }
                  placeholder="e.g., wheelchair access, quiet environment"
                  className="border border-gray-300 py-[clamp(0.75rem,2vw,1rem)] px-[clamp(1rem,2.5vw,1.25rem)] rounded-[clamp(0.75rem,2vw,1rem)] text-black/90 text-[clamp(0.875rem,2vw,1rem)] placeholder:text-[clamp(0.75rem,1.5vw,0.875rem)] placeholder:text-black/50"
                  type="text"
                />
              </div>
            </div>
          </section>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`bg-black text-white py-[clamp(0.875rem,2.5vw,1.125rem)] px-[clamp(1rem,3vw,1.5rem)] w-full rounded-[clamp(0.75rem,2vw,1rem)] font-medium text-[clamp(0.875rem,2vw,1rem)] relative ${
              isLoading ? "opacity-70 cursor-not-allowed" : "hover:bg-gray-800"
            }`}
          >
            <span className={isLoading ? "opacity-0" : ""}>Submit Request</span>
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </button>
        </form>
      </div>

      {/* <SuccessModal
        isOpen={showSuccess}
        onClose={() => {
          setShowSuccess(false);
          onClose();
        }}
      /> */}
    </div>
  );
};

export default RequestReviewModal;
