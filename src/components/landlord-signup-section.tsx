import { useState} from "react";

export default function LandlordSignupSection() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(""); // 'success', 'error', or ''

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsSubmitting(true);
    setSubmitStatus("");

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSubmitStatus("success");
      setEmail("");
    } catch (error: unknown) {
      setSubmitStatus("error");
      console.log(error);
      
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (submitStatus === "error") {
      setSubmitStatus("");
    }
  };

  return (
    <section
      className="
        bg-black flex flex-col items-center justify-center 
        gap-[clamp(1rem,3vw,1.5rem)] text-white 
        py-[clamp(3rem,8vw,5rem)] px-[clamp(1rem,4vw,2rem)]
        min-h-[clamp(25rem,50vh,35rem)]
      "
      aria-labelledby="landlord-signup-heading"
      role="region"
    >

      {/* Content Container */}
      <div
        className="
        flex flex-col items-center gap-[clamp(0.5rem,2vw,1rem)] 
        w-full max-w-[clamp(20rem,50vw,34rem)] mx-auto"
      >
        <div role="status" aria-label="Security promise">
          <span className="text-[clamp(0.75rem,2vw,1.125rem)]">
            No Spam Promise
          </span>
        </div>

        {/* Main Content */}
        <header className="flex flex-col gap-[clamp(0.75rem,2vw,1rem)] items-center text-center">
          <h2
            id="landlord-signup-heading"
            className="
              text-[clamp(1.5rem,4vw,2rem)] font-bold leading-tight
              max-w-[clamp(15rem,40vw,25rem)]"
          >
            Are you a landlord?
          </h2>
          <p
            className="
            text-[clamp(0.875rem,2.5vw,1.125rem)] text-gray-300 leading-relaxed
            max-w-[clamp(18rem,45vw,30rem)]
          "
          >
            Discover ways to increase your home's value and get listed. No Spam.
          </p>
        </header>
      </div>

      {/* Email Signup Form */}
      <form
        onSubmit={handleSubmit}
        className="
          bg-white rounded-[clamp(0.5rem,2vw,0.75rem)] shadow-lg
          w-full max-w-[clamp(20rem,50vw,34rem)]
          h-[clamp(3.5rem,8vw,5rem)]
          flex items-center justify-between
          pr-[clamp(0.5rem,1.5vw,0.75rem)] pl-[clamp(1rem,3vw,1.25rem)]
        "
        role="search"
        aria-label="Landlord email signup form"
        noValidate
      >
        <div className="flex-1 relative">
          <label htmlFor="landlord-email" className="sr-only">
            Email address for landlord services
          </label>
          <input
            id="landlord-email"
            type="email"
            value={email}
            onChange={handleInputChange}
            className="
              w-full pr-[clamp(0.5rem,2vw,0.75rem)]
              text-[clamp(0.875rem,2.5vw,1.125rem)] text-gray-900
              placeholder:text-gray-600 placeholder:text-[clamp(0.875rem,2.5vw,1.125rem)]
              bg-transparent border-none outline-none
              disabled:opacity-50 disabled:cursor-not-allowed
            "
            placeholder="Enter your email address"
            disabled={isSubmitting}
            aria-invalid={submitStatus === "error"}
            aria-describedby="email-error email-success form-description"
            autoComplete="email"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !email.trim()}
          className="
            bg-black hover:bg-gray-900 active:bg-gray-800
            text-white font-semibold
            px-[clamp(1.5rem,4vw,2.5rem)] py-[clamp(0.625rem,2vw,0.875rem)]
            rounded-[clamp(0.25rem,1vw,0.5rem)]
            flex items-center gap-[clamp(0.25rem,1vw,0.5rem)]
            text-[clamp(0.75rem,2vw,1rem)]
          "
          aria-describedby="submit-description"
        >
          {isSubmitting ? (
            <>
              <div
                className="w-[clamp(0.75rem,2vw,1rem)] h-[clamp(0.75rem,2vw,1rem)] border-2 border-white/30 border-t-white rounded-full animate-spin"
                aria-hidden="true"
              ></div>
            </>
          ) : (
            "Submit"
          )}
        </button>
      </form>

      {submitStatus === "success" && (
        <div
          className="
            bg-green-900/20 border border-green-500/30 text-green-300
            px-[clamp(1rem,3vw,1.5rem)] py-[clamp(0.75rem,2vw,1rem)]
            rounded-[clamp(0.5rem,2vw,0.75rem)]
            flex items-center gap-[clamp(0.5rem,2vw,0.75rem)]
            max-w-[clamp(18rem,45vw,30rem)] w-full
          "
          role="status"
          aria-live="polite"
          id="email-success"
        >
          <div
            className="w-[clamp(1rem,2.5vw,1.25rem)] h-[clamp(1rem,2.5vw,1.25rem)] bg-green-500 rounded-full flex items-center justify-center"
            aria-hidden="true"
          >
            <svg
              className="w-[clamp(0.5rem,1.5vw,0.75rem)] h-[clamp(0.5rem,1.5vw,0.75rem)] text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <span className="text-[clamp(0.75rem,2vw,0.875rem)] font-medium">
            Thank you! We'll be in touch with valuable landlord insights.
          </span>
        </div>
      )}

      {/* Screen Reader Announcements */}
      <div
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
        id="form-status"
      >
        {isSubmitting && "Form is being submitted, please wait."}
        {submitStatus === "success" &&
          "Email successfully submitted. Thank you for your interest in landlord services."}
        {submitStatus === "error" &&
          "There was an error with your submission. Please check your email and try again."}
      </div>
    </section>
  );
}
