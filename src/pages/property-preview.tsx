/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef, useMemo } from "react";
import ArrowLeft from "../assets/arrow-left";
import StarIcon from "../assets/star-icon";
import LocationIcon from "../assets/location-icon";
import CallIcon from "../assets/call-icon";
import BedIcon from "../assets/bed-icon";
import BathtubIcon from "../assets/bathtub-icon";
import SofaIcon from "../assets/sofa-icon";
import SquareMeterIcon from "../assets/square-meter-icon";
import ShareIcon from "../assets/share-icon";
import UserIcon from "../assets/user-icon";
import {
  toPropertyCard,
  type ApiProperty,
  type PropertyCardItem,
} from "../lib/mappers";
import { api, type CreatePropertyRequestPayload } from "../lib/api";
import RequestReviewModal from "../components/request-review-modal";
import ShareModal from "../components/share-modal";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import Bg from "../assets/bg-image.jpg";
import SuccessModal from "../components/success-modal";

/* ----------------------------- shimmer helper ----------------------------- */

const SkeletonBlock = ({ className = "" }: { className?: string }) => (
  <div className={`bg-gray-200/80 animate-pulse rounded-md ${className}`} />
);

/* ----------------------------- helpers ----------------------------- */
function normalizeUrl(u: string) {
  const trimmed = u.trim();
  try {
    return trimmed.includes(" ") ? encodeURI(trimmed) : trimmed;
  } catch {
    return trimmed;
  }
}

async function validateImage(
  url: string,
  timeoutMs = 6000
): Promise<string | null> {
  return new Promise((resolve) => {
    const img = new Image();
    let done = false;
    const finish = (ok: boolean) => {
      if (done) return;
      done = true;
      resolve(ok ? url : null);
    };
    const t = setTimeout(() => finish(false), timeoutMs);
    img.onload = () => {
      clearTimeout(t);
      finish(true);
    };
    img.onerror = () => {
      clearTimeout(t);
      finish(false);
    };
    img.src = url;
  });
}

/** Enhanced: Map form data to API payload */
function toViewingRequestPayload(
  formValues: any
): CreatePropertyRequestPayload {
  const firstName =
    formValues.firstName ||
    formValues.first_name ||
    formValues.name?.split(" ")?.[0] ||
    "";
  const lastName =
    formValues.lastName ||
    formValues.last_name ||
    formValues.name?.split(" ")?.slice(1)?.join(" ") ||
    "";

  if (!firstName && !lastName && formValues.fullName) {
    const nameParts = formValues.fullName.trim().split(/\s+/);
    const first = nameParts[0] || "";
    const last = nameParts.slice(1).join(" ") || "";
    return {
      title: formValues.title,
      firstName: first,
      lastName: last,
      email: formValues.email || formValues.reviewerEmail || "",
      phoneNumber:
        formValues.phoneNumber || formValues.phone || formValues.phoneNo || "",
      preferredDate:
        formValues.preferredDate ||
        formValues.date ||
        formValues.viewingDate ||
        "",
      preferredTime:
        formValues.preferredTime ||
        formValues.time ||
        formValues.viewingTime ||
        "",
      additionalInfo:
        formValues.additionalInfo ||
        formValues.message ||
        formValues.notes ||
        formValues.comment ||
        "",
      specialRequirements:
        formValues.specialRequirements || formValues.requirements || "",
    };
  }

  return {
    title: formValues.title,
    firstName,
    lastName,
    email: formValues.email || formValues.reviewerEmail || "",
    phoneNumber:
      formValues.phoneNumber || formValues.phone || formValues.phoneNo || "",
    preferredDate:
      formValues.preferredDate ||
      formValues.date ||
      formValues.viewingDate ||
      "",
    preferredTime:
      formValues.preferredTime ||
      formValues.time ||
      formValues.viewingTime ||
      "",
    additionalInfo:
      formValues.additionalInfo ||
      formValues.message ||
      formValues.notes ||
      formValues.comment ||
      "",
    specialRequirements:
      formValues.specialRequirements || formValues.requirements || "",
  };
}

/* ----------------------------- component ----------------------------- */
const PropertyPreview = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isPopular = true;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const autoPlayRef = useRef<number | null>(null);
  const longPressRef = useRef<number | null>(null);

  const [item, setItem] = useState<PropertyCardItem>();
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // ----- Lightbox state -----
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // ----- Submit state for viewing request -----
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ ok: boolean; msg: string } | null>(null);
  const [liking, setLiking] = useState(false);
  const [liked, setLiked] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Shimmer states
  const [galleryLoaded, setGalleryLoaded] = useState(false);
  const [agentLoaded, setAgentLoaded] = useState(false);

  // Raw list from API
  const rawImages = useMemo(
    () => (item?.images ?? []).filter(Boolean),
    [item?.images]
  );

  // Normalize + dedupe
  const normalizedImages = useMemo(() => {
    const out = rawImages.map((u) => normalizeUrl(u));
    return Array.from(new Set(out));
  }, [rawImages]);

  // Validate images (async)
  const [validatedImages, setValidatedImages] = useState<string[]>([]);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (normalizedImages.length === 0) {
        if (!cancelled) setValidatedImages([]);
        return;
      }
      const results = await Promise.all(
        normalizedImages.map((u) => validateImage(u))
      );
      const good = results.filter((u): u is string => !!u);
      if (!cancelled) {
        setValidatedImages(good);
        setCurrentImageIndex(0);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [normalizedImages, id]);

  // Reset shimmers when id changes
  useEffect(() => {
    setGalleryLoaded(false);
    setAgentLoaded(false);
  }, [id]);

  // Keep index in bounds
  useEffect(() => {
    setCurrentImageIndex((i) =>
      validatedImages.length === 0 ? 0 : Math.min(i, validatedImages.length - 1)
    );
    setLightboxIndex((i) =>
      validatedImages.length === 0 ? 0 : Math.min(i, validatedImages.length - 1)
    );
  }, [validatedImages.length]);

  // Auto-rotate for mobile slider
  useEffect(() => {
    if (!isPaused && validatedImages.length > 0) {
      autoPlayRef.current = window.setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % validatedImages.length);
      }, 5000);
    }
    return () => {
      if (autoPlayRef.current !== null) {
        clearInterval(autoPlayRef.current);
        autoPlayRef.current = null;
      }
    };
  }, [isPaused, validatedImages.length]);

  // Long press pause/resume
  const scheduleTogglePause = () => {
    longPressRef.current = window.setTimeout(() => {
      setIsPaused((p) => !p);
    }, 500) as unknown as number;
  };
  const clearLongPress = () => {
    if (longPressRef.current !== null) {
      clearTimeout(longPressRef.current);
      longPressRef.current = null;
    }
  };
  const handleMouseDown = () => scheduleTogglePause();
  const handleMouseUp = () => clearLongPress();
  const handleMouseLeave = () => clearLongPress();
  const handleTouchStart = () => scheduleTogglePause();
  const handleTouchEnd = () => clearLongPress();

  // Open share modal
  const handleShare = () => {
    setIsShareModalOpen(true);
  };

  // Fetch property
  useEffect(() => {
    if (!id) {
      setErr("Missing property id");
      setLoading(false);
      return;
    }

    const propertyId = Number(id);
    if (!Number.isFinite(propertyId)) {
      setErr("Invalid property id");
      setLoading(false);
      return;
    }

    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const res = await api.properties.getById({ id: propertyId }); // { data: ApiProperty }
        if (!alive) return;
        const raw: ApiProperty = res.data;
        setItem(toPropertyCard(raw));
      } catch (e: any) {
        if (!alive) return;
        setErr(e?.message ?? "Failed to load property");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [id]);

  const currentSrc =
    validatedImages.length > 0
      ? validatedImages[currentImageIndex]
      : item?.image || "/placeholder.jpg";

  // --- Desktop gallery helpers (hero + 4 thumbs) ---
  const heroSrc = validatedImages[0] ?? currentSrc;
  const thumbSrcs = validatedImages.slice(1, 5);
  const remainingCount = Math.max(0, validatedImages.length - 5);

  // ===== Lightbox logic =====
  const openLightbox = (startIndex: number) => {
    if (!validatedImages.length) return;
    setLightboxIndex(startIndex);
    setIsLightboxOpen(true);
  };
  const closeLightbox = () => setIsLightboxOpen(false);
  const nextLightbox = () =>
    setLightboxIndex((i) => (i + 1) % Math.max(1, validatedImages.length));
  const prevLightbox = () =>
    setLightboxIndex(
      (i) =>
        (i - 1 + Math.max(1, validatedImages.length)) %
        Math.max(1, validatedImages.length)
    );

  // Lock background scroll when open + keyboard nav
  useEffect(() => {
    if (!isLightboxOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      else if (e.key === "ArrowRight") nextLightbox();
      else if (e.key === "ArrowLeft") prevLightbox();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [isLightboxOpen]);

  const handleGalleryLoaded = () => {
    setGalleryLoaded(true);
  };

  const handleModalSubmit = async (formData: any) => {
    await handleCreateViewingRequest(formData);
  };

  /* ------------------- API: create viewing request (UPDATED) ------------------- */
  const handleCreateViewingRequest = async (formValues: any) => {
    if (!item?.id) {
      setToast({ ok: false, msg: "Missing property id." });
      return;
    }

    const payload: CreatePropertyRequestPayload =
      toViewingRequestPayload(formValues);

    if (!payload.firstName.trim() || !payload.lastName.trim()) {
      setToast({ ok: false, msg: "Please provide both first and last name." });
      return;
    }

    if (!payload.email.trim()) {
      setToast({ ok: false, msg: "Email address is required." });
      return;
    }

    if (!payload.phoneNumber.trim()) {
      setToast({ ok: false, msg: "Phone number is required." });
      return;
    }

    if (!payload.preferredDate.trim()) {
      setToast({ ok: false, msg: "Please select a preferred date." });
      return;
    }

    if (!payload.preferredTime.trim()) {
      setToast({ ok: false, msg: "Please select a preferred time." });
      return;
    }

    try {
      setSubmitting(true);
      console.log("Submitting viewing request:", {
        propertyId: item.id,
        payload,
      });

      const result = await api.propertyRequests.create(
        Number(item.id),
        payload
      );

      console.log("Viewing request response:", result);

      setIsModalOpen(false);
      setShowSuccess(true);
    } catch (e: any) {
      console.error("Error submitting viewing request:", e);
      const msg =
        e?.response?.data?.message ||
        e?.message ||
        "Failed to submit request. Please try again.";
      setToast({ ok: false, msg });
    } finally {
      setSubmitting(false);
      setTimeout(() => setToast(null), 4500);
    }
  };

  // Loading / error guards
  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="main-container py-16">Loading…</div>
        <Footer />
      </div>
    );
  }
  if (err) {
    return (
      <div>
        <Navbar />
        <div className="main-container py-16 text-red-600">{err}</div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <header
        style={{
          backgroundImage: `url(${item?.image || Bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className="w-full lg:h-[65vh] h-[50vh] bg-black/70 relative"
      >
        <Navbar />

        <div className="flex flex-col gap-[clamp(0.5rem,2vw,0.75rem)] main-container mt-[clamp(4rem,8vw,6.25rem)]">
          <h3 className="font-bold text-[clamp(1.75rem,4vw,2.25rem)] text-white">
            Product Preview
          </h3>
          <button
            onClick={() => navigate(-1)}
            className="bg-white py-[clamp(0.5rem,1.5vw,0.75rem)] px-[clamp(0.75rem,2vw,1rem)] rounded-[clamp(0.5rem,1vw,0.75rem)] w-fit h-fit font-bold text-[clamp(1rem,2.5vw,1.25rem)] flex items-center gap-[clamp(0.5rem,1.5vw,0.75rem)] text-black hover:bg-gray-100"
          >
            <ArrowLeft />
            Back
          </button>
        </div>
      </header>

      <main className="flex flex-col lg:flex-row  lg:items-start gap-[clamp(1rem,4vw,2rem)] main-container py-[clamp(2rem,5vw,3rem)]">
        {/* ====== Property Image Section ====== */}
        <section className="w-full lg:w-[clamp(25rem,45vw,41.75rem)] relative">
          {/* Shimmer overlay while gallery is not loaded */}
          {!galleryLoaded && (
            <div className="absolute inset-0 z-10 pointer-events-none">
              <div className="hidden lg:block h-[clamp(22rem,55vh,34rem)]">
                <SkeletonBlock className="w-full h-full rounded-[0.75rem]" />
              </div>
              <div className="lg:hidden h-[clamp(10rem,100vh,18rem)]">
                <SkeletonBlock className="w-full h-full rounded-[0.75rem]" />
              </div>
            </div>
          )}

          {/* Real gallery */}
          <div
            className={`transition-opacity duration-500 ${
              galleryLoaded ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* --- Mobile slider --- */}
            <div
              className="lg:hidden w-full h-[clamp(10rem,100vh,18rem)] rounded-[clamp(0.75rem,2vw,1.25rem)] overflow-hidden relative cursor-pointer"
              onClick={() => openLightbox(currentImageIndex)}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <img
                key={currentSrc}
                src={currentSrc}
                onLoad={handleGalleryLoaded}
                onError={handleGalleryLoaded}
                loading="eager"
                decoding="async"
                className="w-full h-full object-cover transition-opacity duration-500"
                alt={`${id ?? "property"} view ${
                  validatedImages.length ? currentImageIndex + 1 : 1
                }`}
              />

              {/* Dots */}
              {validatedImages.length > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                  {validatedImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentImageIndex(index);
                      }}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentImageIndex
                          ? "bg-white"
                          : "bg-white/50"
                      }`}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              )}

              {/* Pause/Play */}
              {validatedImages.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsPaused((p) => !p);
                  }}
                  className="absolute top-3 right-3 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors z-10"
                  aria-label={isPaused ? "Resume slideshow" : "Pause slideshow"}
                >
                  {isPaused ? (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path d="M8 5V19L19 12L8 5Z" fill="currentColor" />
                    </svg>
                  ) : (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M6 4H10V20H6V4ZM14 4H18V20H14V4Z"
                        fill="currentColor"
                      />
                    </svg>
                  )}
                </button>
              )}

              {/* Manual Navigation Controls */}
              {validatedImages.length > 1 && (
                <>
                  {/* Previous Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex((prev) =>
                        prev === 0 ? validatedImages.length - 1 : prev - 1
                      );
                    }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors z-10"
                    aria-label="Previous image"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M15 19l-7-7 7-7"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>

                  {/* Next Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex(
                        (prev) => (prev + 1) % validatedImages.length
                      );
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors z-10"
                    aria-label="Next image"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M9 5l7 7-7 7"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </>
              )}
            </div>

            {/* --- Desktop: Booking-style gallery (1 big + up to 4 thumbs) --- */}
            <div className="hidden lg:grid grid-cols-3 grid-rows-2 gap-2 h-[clamp(22rem,55vh,34rem)]">
              {/* Hero (spans 2x2) */}
              <button
                type="button"
                onClick={() => openLightbox(0)}
                className="relative col-span-2 row-span-2 rounded-[0.75rem] overflow-hidden group"
                aria-label="Open main photo"
              >
                <img
                  src={heroSrc}
                  alt="Main property photo"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  loading="eager"
                  decoding="async"
                  onLoad={handleGalleryLoaded}
                  onError={handleGalleryLoaded}
                />
              </button>

              {/* Thumbnails */}
              {thumbSrcs.map((src, i) => {
                const isLastThumb = i === thumbSrcs.length - 1;
                const idx = i + 1;
                return (
                  <button
                    type="button"
                    key={src + i}
                    onClick={() => openLightbox(idx)}
                    className="relative rounded-[0.5rem] overflow-hidden group"
                    aria-label={`Open photo ${idx + 1}`}
                  >
                    <img
                      src={src}
                      alt={`Property photo ${idx + 1}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      loading="lazy"
                      decoding="async"
                    />
                    {/* "+N photos" overlay */}
                    {isLastThumb && remainingCount > 0 && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <span className="text-white text-sm font-semibold px-3 py-1 rounded-full border border-white/60">
                          +{remainingCount} photos
                        </span>
                      </div>
                    )}
                  </button>
                );
              })}

              {/* Fillers if fewer than 4 thumbs */}
              {thumbSrcs.length < 4 &&
                Array.from({ length: 4 - thumbSrcs.length }).map((_, idx) => (
                  <div
                    key={`ph-${idx}`}
                    className="rounded-[0.5rem] bg-gray-100 border border-gray-200"
                    aria-hidden
                  />
                ))}
            </div>
          </div>

          {/* Status Badge */}
          <div
            className={`
              p-[clamp(0.5rem,1.5vw,0.625rem)]
              ${
                item?.status === "Sold"
                  ? "bg-red-500 text-white"
                  : "bg-white text-gray-900"
              }
              rounded-[clamp(0.75rem,2vw,1.25rem)]
              absolute top-[clamp(0.5rem,1.5vw,0.625rem)] left-[clamp(0.5rem,1.5vw,0.625rem)]
              text-[clamp(0.75rem,2vw,0.875rem)]
              flex items-center justify-center
              font-medium shadow-sm z-20
            `}
            role="status"
            aria-label={`Property status: ${item?.status}`}
          >
            {item?.status}
          </div>

          {/* Popular Badge */}
          {isPopular && (
            <div
              className="
                bg-black text-white
                px-[clamp(0.75rem,2vw,1rem)] py-[clamp(0.5rem,1.5vw,0.625rem)]
                rounded-tl-[clamp(0.25rem,1vw,0.5rem)]
                rounded-tr-[clamp(0.25rem,1vw,0.5rem)]
                rounded-br-[clamp(0.25rem,1vw,0.5rem)]
                flex items-center gap-[clamp(0.125rem,0.5vw,0.25rem)]
                absolute bottom-[0%] left-[-2%]
                shadow-lg z-20
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
        </section>

        {/* ====== Property Details Section ====== */}
        <section className="flex flex-col justify-between gap-[clamp(2rem,5vw,2.5rem)] p-[clamp(1rem,3vw,1.25rem)] flex-1">
          <div className="flex flex-col gap-[clamp(1.5rem,4vw,1.5rem)]">
            {/* Price */}
            <p className="font-bold text-[clamp(1.5rem,4vw,2.5rem)]">
              {item?.price}
            </p>

            {/* Property Name */}
            <h2 className="font-bold text-[clamp(1.5rem,4vw,2.5rem)] text-gray-900">
              {item?.title || "Property"}
            </h2>

            {/* Location */}
            <div className="flex items-center gap-[clamp(0.25rem,1vw,0.5rem)]">
              <LocationIcon />
              <p className="text-black/70 text-[clamp(0.875rem,2vw,1.4rem)] leading-relaxed">
                {item?.location}
              </p>
            </div>

            {/* Short description */}
            <p className="text-[clamp(0.875rem,2vw,1rem)] text-black/60 leading-relaxed">
              {item?.title}
            </p>

            {/* Agent Info */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-[clamp(0.75rem,2vw,1rem)] pb-[clamp(0.5rem,1.5vw,0.75rem)] border-b border-black/10">
              <div className="flex items-center gap-[clamp(0.5rem,1.5vw,0.75rem)]">
                <div className="relative">
                  {!agentLoaded && (
                    <SkeletonBlock className="w-[clamp(2rem,4vw,3rem)] h-[clamp(2rem,4vw,3rem)] rounded-full" />
                  )}
                  {item?.agent?.avatar ? (
                    <img
                      src={item.agent.avatar}
                      onLoad={() => setAgentLoaded(true)}
                      onError={() => setAgentLoaded(true)}
                      className={`w-[clamp(2rem,4vw,3rem)] h-[clamp(2rem,4vw,3rem)] rounded-full object-cover transition-opacity duration-500 ${
                        agentLoaded ? "opacity-100" : "opacity-0"
                      }`}
                      alt={`${item.agent.name ?? "Agent"} profile picture`}
                    />
                  ) : (
                    <div className="w-[clamp(2rem,4vw,3rem)] h-[clamp(2rem,4vw,3rem)] rounded-full bg-gray-200 flex items-center justify-center">
                      <UserIcon isActive={true} />
                    </div>
                  )}
                </div>
                <p className="text-[clamp(1rem,2.5vw,1.25rem)] text-black/70">
                  {item?.agent?.name || "Agent"}
                </p>
              </div>

              <a
                href={`tel:${item?.agent?.phone ?? ""}`}
                className="flex items-center gap-[clamp(0.5rem,1.5vw,0.75rem)]"
                aria-label={`Call agent ${item?.agent?.name ?? ""} at ${
                  item?.agent?.phone ?? ""
                }`}
              >
                <CallIcon />
                <span className="text-[clamp(0.875rem,2vw,1rem)] text-black/90">
                  {item?.agent?.phone || ""}
                </span>
              </a>
            </div>

            {/* Property Features */}
            <div
              className="grid grid-cols-2 sm:grid-cols-4 gap-[clamp(0.75rem,3vw,1.25rem)]"
              role="list"
              aria-label="Property features and amenities"
            >
              <div
                className="flex items-center gap-[clamp(0.25rem,1vw,0.5rem)]"
                role="listitem"
              >
                <BedIcon />
                <p className="text-[clamp(0.875rem,2vw,1rem)]">— Bed</p>
              </div>
              <div
                className="flex items-center gap-[clamp(0.25rem,1vw,0.5rem)]"
                role="listitem"
              >
                <BathtubIcon />
                <p className="text-[clamp(0.875rem,2vw,1rem)]">— Bath</p>
              </div>
              <div
                className="flex items-center gap-[clamp(0.25rem,1vw,0.5rem)]"
                role="listitem"
              >
                <SofaIcon />
                <p className="text-[clamp(0.875rem,2vw,1rem)]">2 Living</p>
              </div>
              <div
                className="flex items-center gap-[clamp(0.25rem,1vw,0.5rem)]"
                role="listitem"
              >
                <SquareMeterIcon />
                <p className="text-[clamp(0.875rem,2vw,1rem)]">
                  {item?.features?.[0]?.label ?? "—"}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-[clamp(1rem,3vw,1.25rem)]">
            <button
              className="bg-black text-white py-[clamp(0.75rem,2vw,1rem)] px-[clamp(1rem,3vw,1.5rem)] w-full rounded-[clamp(1rem,3vw,1.875rem)] font-medium text-[clamp(0.875rem,2vw,1rem)] hover:bg-gray-800"
              onClick={() => setIsModalOpen(true)}
            >
              Request Viewing
            </button>

            <div className="flex gap-[clamp(0.75rem,2vw,1.25rem)]">
              <button
                onClick={handleShare}
                className="border border-black/20 rounded-[clamp(0.5rem,1vw,0.75rem)] flex justify-center items-center gap-[clamp(0.5rem,1vw,0.75rem)] py-[clamp(0.5rem,1.5vw,0.75rem)] px-[clamp(0.75rem,2vw,1rem)] flex-1 hover:bg-gray-50"
              >
                <p className="text-black/70 text-[clamp(0.75rem,1.5vw,0.875rem)]">
                  Share
                </p>
                <ShareIcon />
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* ====== LIGHTBOX MODAL ====== */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-[1px] flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-label="Image gallery"
        >
          {/* Top bar */}
          <div className="flex items-center justify-between px-3 sm:px-6 py-3">
            <div className="text-white text-sm sm:text-base">
              {lightboxIndex + 1} / {Math.max(1, validatedImages.length)}
            </div>
            <button
              onClick={closeLightbox}
              className="text-white/90 hover:text-white p-2 rounded"
              aria-label="Close gallery"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                  d="M6 6l12 12M6 18L18 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          {/* Big image */}
          <div className="relative flex-1 flex items-center justify-center px-2 sm:px-6">
            <button
              onClick={prevLightbox}
              className="hidden sm:flex absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/15 hover:bg-white/25 text-white items-center justify-center"
              aria-label="Previous image"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M15 19l-7-7 7-7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <img
              src={validatedImages[lightboxIndex] ?? currentSrc}
              alt={`Photo ${lightboxIndex + 1}`}
              className="max-h-[70vh] sm:max-h-[78vh] w-auto object-contain rounded-md shadow-2xl"
            />

            <button
              onClick={nextLightbox}
              className="hidden sm:flex absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/15 hover:bg-white/25 text-white items-center justify-center"
              aria-label="Next image"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 5l7 7-7 7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          {/* Thumbnails strip */}
          {validatedImages.length > 1 && (
            <div className="px-3 sm:px-6 pb-4">
              <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {validatedImages.map((src, i) => (
                  <button
                    key={src + i}
                    onClick={() => setLightboxIndex(i)}
                    className={`relative flex-none w-20 h-16 sm:w-24 sm:h-20 rounded-md overflow-hidden border ${
                      i === lightboxIndex ? "border-white" : "border-white/30"
                    }`}
                    aria-label={`Show photo ${i + 1}`}
                  >
                    <img
                      src={src}
                      alt={`Thumbnail ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {i === lightboxIndex && (
                      <span className="absolute inset-0 ring-2 ring-white/80 rounded-md pointer-events-none" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <RequestReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
      />

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        propertyTitle={item?.title || "Property"}
        propertyUrl={`${window.location.origin}/property/${encodeURIComponent(
          String(id ?? item?.id ?? "")
        )}`}
      />

      <SuccessModal
        isOpen={showSuccess}
        onClose={() => {
          setShowSuccess(false);
          setIsModalOpen(false);
        }}
      />

      <Footer />
    </div>
  );
};

export default PropertyPreview;
