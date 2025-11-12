import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import ArrowLeftWhite from "../assets/arrow-left-white";

import PropertyCard from "../components/property-card";
import SearchWidget from "../components/search-widget";
import {
  toPropertyCard,
  type PropertyCardItem,
  type ApiProperty,
} from "../lib/mappers";
import { api } from "../lib/api";
import Footer from "../components/footer";
import Navbar from "../components/navbar";
import Bg from "../assets/gustavo-zambelli-nEvzSXBIhiU-unsplash.jpg";
import ArrowLeft from "../assets/arrow-left";
import { extractPrice } from "../utils/currency";

const LOCATION_KEYWORDS: Record<string, string[]> = {
  "lekki-lagos": ["lekki", "lagos"],
  "mall-enugu": ["mall", "enugu"],
  "wuse-abuja": ["wuse", "abuja"],
  "gra-ph": ["gra", "port harcourt", "ph"],
};

const SORT_OPTIONS = [
  { value: "recommended", label: "Our top picks" },
  { value: "price_low", label: "Price (lowest first)" },
  { value: "price_high", label: "Price (highest first)" },
  { value: "newest", label: "Newest first" },
  { value: "distance", label: "Distance from city center" },
];

const PropertyPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [raw, setRaw] = useState<ApiProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("recommended");
  const [showFilters, setShowFilters] = useState(false);
  // Client-side pagination
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 9;

  // View mode toggle (grid/list) - mobile always uses grid
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Hook to detect screen size
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Force grid view on mobile devices, allow switching on tablet/desktop
  const effectiveViewMode = isMobile ? "grid" : viewMode;

  // Build detail path once
  const getPropertyPath = (p: PropertyCardItem | ApiProperty) =>
    `/property/${encodeURIComponent(String((p as any).slug ?? (p as any).id))}`;

  // Keyboard-accessible open helper
  const handleOpenKey = (e: React.KeyboardEvent, p: PropertyCardItem) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      navigate(getPropertyPath(p));
    }
  };

  // Parse the type filter early to determine API call
  const typeFromUrl = useMemo(() => {
    const qs = new URLSearchParams(location.search);
    return (qs.get("type") || "").toLowerCase();
  }, [location.search]);

  // Fetch properties based on type filter
  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        let apiResult;
        if (typeFromUrl === "buy") {
          apiResult = await api.properties.list({
            all: false,
            forsale: true,
            page: 0,
          });
        } else if (typeFromUrl === "rent") {
          apiResult = await api.properties.list({
            all: false,
            forsale: false,
            page: 0,
          });
        } else {
          apiResult = await api.properties.list({
            all: false,
            forsale: "both",
            page: 0,
          });
        }
        const rows: ApiProperty[] = apiResult?.data ?? [];
        if (alive) setRaw(rows);
      } catch (e: any) {
        if (alive) setErr(e?.message || "Failed to load properties");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [typeFromUrl]);

  // Parse all other filters
  const urlFilters = useMemo(() => {
    const qs = new URLSearchParams(location.search);
    const getNonEmpty = (key: string): string => {
      const value = qs.get(key);
      return value && value.trim() ? value.trim() : "";
    };
    const getNonEmptyArray = (key: string): string[] => {
      const value = qs.get(key);
      return value ? value.split(",").filter(Boolean) : [];
    };
    const getValidNumber = (key: string): number | undefined => {
      const value = qs.get(key);
      if (!value || value === "" || value === "0") return undefined;
      const n = Number(value);
      return Number.isFinite(n) && n > 0 ? n : undefined;
    };
    return {
      typeParam: typeFromUrl,
      queryParam: getNonEmpty("query"),
      locParam: getNonEmpty("location"),
      minPrice: getValidNumber("minPrice"),
      maxPrice: getValidNumber("maxPrice"),
      propertyTypeParam: getNonEmptyArray("property-type"),
      amenitiesParam: getNonEmptyArray("amenities"),
      featuresParam: getNonEmptyArray("features"),
    };
  }, [location.search, typeFromUrl]);

  const {
    typeParam,
    queryParam,
    locParam,
    minPrice,
    maxPrice,
    propertyTypeParam,
    amenitiesParam,
    featuresParam,
  } = urlFilters;

  const hasActiveFilters = !!(
    queryParam ||
    locParam ||
    minPrice ||
    maxPrice ||
    propertyTypeParam.length ||
    amenitiesParam.length ||
    featuresParam.length
  );

  // Match helpers
  const textIncludes = (hay: string, needle: string) =>
    hay.toLowerCase().includes(needle.toLowerCase());

  const matchesLocation = (row: ApiProperty) => {
    if (!locParam) return true;
    const kw = LOCATION_KEYWORDS[locParam] || locParam.split("-");
    const locationStr = [
      row.address || "",
      row.city || "",
      row.state || "",
      row.location || "",
      (row as any).area || "",
    ]
      .join(" ")
      .toLowerCase();
    return kw.some((k) => locationStr.includes(k.toLowerCase()));
  };

  const matchesQuery = (row: ApiProperty) => {
    if (!queryParam) return true;
    // Only search in the property description per requirements
    return textIncludes(row.description || "", queryParam);
  };

  const matchesPrice = (row: ApiProperty) => {
    const price =
      typeof row.price === "string" ? parseFloat(row.price) : row.price ?? 0;
    if (isNaN(price)) return true;
    if (minPrice !== undefined && price < minPrice) return false;
    if (maxPrice !== undefined && price > maxPrice) return false;
    return true;
  };

  const matchesPropertyType = (row: ApiProperty) => {
    if (!propertyTypeParam.length) return true;
    const propertyType = (row as any).type || (row as any).property_type || "";
    return propertyTypeParam.some((type) =>
      propertyType.toLowerCase().includes(type.toLowerCase())
    );
  };

  const matchesAmenities = (row: ApiProperty) => {
    if (!amenitiesParam.length) return true;
    const amenities = (row as any).amenities || [];
    const amenitiesStr = Array.isArray(amenities)
      ? amenities.join(" ").toLowerCase()
      : String(amenities).toLowerCase();
    return amenitiesParam.some((amenity) =>
      amenitiesStr.includes(amenity.toLowerCase())
    );
  };

  const matchesFeatures = (row: ApiProperty) => {
    if (!featuresParam.length) return true;
    const features = (row as any).features || [];
    const featuresStr = Array.isArray(features)
      ? features.join(" ").toLowerCase()
      : String(features).toLowerCase();
    return featuresParam.some((feature) =>
      featuresStr.includes(feature.toLowerCase())
    );
  };

  // Sorting function
  const getSortedProperties = (properties: ApiProperty[]) => {
    const sorted = [...properties];
    switch (sortBy) {
      case "price_low":
        return sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
      case "price_high":
        return sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
      case "newest":
        return sorted.sort((a: any, b: any) => {
          const ta = new Date(a.createdAt ?? a.created_at ?? 0).getTime();
          const tb = new Date(b.createdAt ?? b.created_at ?? 0).getTime();
          return tb - ta;
        });
      case "distance":
        return sorted;
      case "recommended":
      default:
        return sorted.sort((a: any, b: any) => {
          if (a.show !== b.show) return b.show ? 1 : -1;
          const ta = new Date(a.createdAt ?? a.created_at ?? 0).getTime();
          const tb = new Date(b.createdAt ?? b.created_at ?? 0).getTime();
          if (tb !== ta) return tb - ta;
          return (b.id ?? 0) - (a.id ?? 0);
        });
    }
  };

  // Apply filters and sorting
  const items: PropertyCardItem[] = useMemo(() => {
    let filtered = raw.filter((r) => r.show);
    if (hasActiveFilters) {
      filtered = filtered
        .filter(matchesLocation)
        .filter(matchesQuery)
        .filter(matchesPrice)
        .filter(matchesPropertyType)
        .filter(matchesAmenities)
        .filter(matchesFeatures);
    }
    const sorted = getSortedProperties(filtered);
    return sorted.map(toPropertyCard);
  }, [
    raw,
    hasActiveFilters,
    locParam,
    queryParam,
    minPrice,
    maxPrice,
    propertyTypeParam,
    amenitiesParam,
    featuresParam,
    sortBy,
  ]);

  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = Math.min(startIndex + PAGE_SIZE, totalItems);
  const pagedItems = items.slice(startIndex, endIndex);

  // Build compact page list with ellipsis
  const pageList = useMemo(() => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }
    const add = (v: number | string) => pages.push(v);
    add(1);
    const left = Math.max(2, currentPage - 1);
    const right = Math.min(totalPages - 1, currentPage + 1);
    if (left > 2) add("...");
    for (let i = left; i <= right; i++) add(i);
    if (right < totalPages - 1) add("...");
    add(totalPages);
    return pages;
  }, [currentPage, totalPages]);

  const goToPage = (p: number) => {
    if (p < 1 || p > totalPages || p === currentPage) return;
    setPage(p);
    // scroll back to top of results
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Reset to first page when filters/sorting change
  useEffect(() => {
    setPage(1);
  }, [
    typeParam,
    queryParam,
    locParam,
    minPrice,
    maxPrice,
    propertyTypeParam,
    amenitiesParam,
    featuresParam,
    sortBy,
  ]);

  // Display-friendly active filters
  const activeFilters = useMemo(() => {
    const filters: string[] = [];
    if (typeParam === "buy") filters.push("Type: For Sale");
    else if (typeParam === "rent") filters.push("Type: For Rent");
    if (queryParam) filters.push(`Search: "${queryParam}"`);
    if (locParam) filters.push(`Location: ${locParam}`);
    if (minPrice !== undefined || maxPrice !== undefined) {
      const minStr = minPrice ? minPrice.toLocaleString() : "0";
      const maxStr = maxPrice ? maxPrice.toLocaleString() : "∞";
      filters.push(`Price: ₦${minStr} - ₦${maxStr}`);
    }
    if (propertyTypeParam.length)
      filters.push(`Property Type: ${propertyTypeParam.join(", ")}`);
    if (amenitiesParam.length)
      filters.push(`Amenities: ${amenitiesParam.join(", ")}`);
    if (featuresParam.length)
      filters.push(`Features: ${featuresParam.join(", ")}`);
    return filters;
  }, [
    typeParam,
    queryParam,
    locParam,
    minPrice,
    maxPrice,
    propertyTypeParam,
    amenitiesParam,
    featuresParam,
  ]);

  const visiblePropertiesCount = raw.filter((r) => r.show).length;

  return (
    <div>
      {/* Header */}
      <header
        className="w-full min-h-[50vh] sm:min-h-[60vh] bg-black/70 z-40 overflow-visible relative"
        style={{
          backgroundImage: `url(${Bg})`,
          backgroundSize: "cover",
          backgroundPosition: "top 10%",
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <Navbar />

        <div className="flex flex-col gap-5 main-container">
          <div className="flex flex-col gap-[clamp(0.5rem,2vw,0.75rem)] mt-[clamp(4rem,8vw,2.25rem)] z-10">
            <h3 className="font-bold text-[clamp(1.5rem,4vw,2.25rem)] leading-tight text-white z-100">
              Property Search Results
            </h3>
            <p className="text-white/60 font-medium text-[clamp(0.875rem,2vw,1rem)] z-10">
              Find available property to get started
              {/* {items.length} properties found {locParam && `in ${locParam}`} */}
            </p>
          </div>

          <button
            onClick={() => navigate(-1)}
            className="bg-white py-[clamp(0.5rem,1.5vw,0.75rem)] px-[clamp(1rem,3vw,1.5rem)] z-10 rounded-[clamp(0.5rem,1vw,0.75rem)] w-fit h-fit font-bold text-[clamp(1rem,2.5vw,1.25rem)] flex items-center gap-[clamp(0.5rem,1.5vw,0.75rem)] text-black hover:bg-gray-100"
          >
            <ArrowLeft />
            Back
          </button>
        </div>

        <div className="">
          <SearchWidget viewMode={viewMode} setViewMode={setViewMode} />
        </div>
      </header>

      {loading && (
        <p
          role="status"
          aria-live="polite"
          className="text-gray-600 main-container px-4 sm:px-6 py-6"
        >
          Loading properties…
        </p>
      )}

      {err && (
        <p
          role="alert"
          className="text-red-600 main-container px-4 sm:px-6 py-6"
        >
          {err}
        </p>
      )}

      {/* MOBILE Filters Bottom Sheet */}
      {showFilters && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowFilters(false)}
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] rounded-t-2xl bg-white p-4 sm:p-5 overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900 text-base">
                Filter by
              </h3>
              <button
                onClick={() => setShowFilters(false)}
                className="p-2 rounded hover:bg-gray-100"
                aria-label="Close filters"
              >
                <svg
                  className="w-5 h-5 text-gray-700"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M6 6l12 12M6 18L18 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            {/* (filter controls omitted for brevity – unchanged from your last snippet) */}
            {/* ... keep your Budget / Property type / Popular filters / Area / Rating ... */}

            <button
              onClick={() => setShowFilters(false)}
              className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded text-sm font-medium"
            >
              Apply filters
            </button>
          </div>
        </div>
      )}

      {/* Main content */}
      {!loading && !err && (
        <section className="main-container px-4 sm:px-6 pb-12 mt-[6rem] flex flex-col gap-[52px]">
          <h3 className="text-[clamp(1.5rem,4vw,2.25rem)] font-bold leading-tight">
            Properties List
          </h3>
          <div className="">
            {/* Property listings */}
            <div className="">
              {pagedItems.length > 0 ? (
                <div
                  className={
                    effectiveViewMode === "grid"
                      ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6"
                      : "space-y-4 sm:space-y-5"
                  }
                >
                  {pagedItems.map((property) => {
                    const path = getPropertyPath(property);
                    const open = () => navigate(path);

                    return (
                      <div
                        key={property.id}
                        {...(effectiveViewMode === "list"
                          ? {
                              onClick: open,
                              role: "button",
                              tabIndex: 0,
                              onKeyDown: (e) => handleOpenKey(e, property),
                              className:
                                "bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer",
                            }
                          : {})}
                      >
                        {effectiveViewMode === "grid" ? (
                          <PropertyCard property={property} />
                        ) : (
                          <div className="flex flex-col md:flex-row gap-0 relative group">
                            {/* Image (clickable) */}
                            <div className="relative w-full md:w-80 h-56 md:h-48 flex-shrink-0">
                              <Link
                                to={path}
                                aria-label={`View ${property.title}`}
                              >
                                <img
                                  loading="lazy"
                                  src={
                                    property.image ||
                                    "/placeholder-property.jpg"
                                  }
                                  alt={property.title}
                                  className="w-full h-full object-cover rounded-t-lg md:rounded-l-lg md:rounded-tr-none"
                                />
                              </Link>

                              {/* Heart/Save button (no navigation) */}
                              <button
                                className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                                onClick={(e) => e.stopPropagation()}
                                aria-label="Save property"
                              >
                                <svg
                                  className="w-4 h-4 text-gray-600"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                  />
                                </svg>
                              </button>
                            </div>

                            {/* Content */}
                            <div className="flex-1 p-4 sm:p-5 flex">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start gap-2 mb-2">
                                  <Link
                                    to={path}
                                    className="text-base sm:text-lg font-semibold text-blue-600 hover:text-blue-800 cursor-pointer line-clamp-2 sm:line-clamp-1 flex-1"
                                  >
                                    {property.title}
                                  </Link>
                                  <div className="hidden sm:flex items-center gap-1">
                                    <span className="bg-orange-500 text-white text-xs px-1.5 py-0.5 rounded font-bold">
                                      {property.rating || "9.0"}
                                    </span>
                                    <span className="bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded font-bold">
                                      Genius
                                    </span>
                                  </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-2 text-sm text-blue-600 mb-2">
                                  <span className="hover:underline cursor-pointer">
                                    {property.location}
                                  </span>
                                  <button
                                    className="hover:underline"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    Show on map
                                  </button>
                                  <span className="hidden sm:inline text-gray-600">
                                    • 50 m from centre
                                  </span>
                                </div>

                                <p className="text-sm text-gray-700 mb-3 line-clamp-3 sm:line-clamp-2">
                                  {property.description ||
                                    "This property offers modern amenities, comfortable rooms, and excellent service."}
                                </p>

                                <div className="mb-2">
                                  <div className="font-medium text-sm text-gray-900 mb-1">
                                    {property.bedrooms
                                      ? `${property.bedrooms}-Bedroom`
                                      : "One-Bedroom"}{" "}
                                    {(property.status === "For Rent") ? "Apartment" : "Villa"}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    Entire{" "}
                                    {(property.status === "For Rent") ? "apartment" : "villa"}{" "}
                                    • {property.bedrooms || 1} bedroom • 1
                                    living room • {property.bathrooms || 1}{" "}
                                    bathroom • {property.area || 55} m²
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    1 double bed
                                  </div>
                                </div>

                                <div className="flex items-center gap-3 text-sm">
                                  <div className="flex items-center gap-1 text-green-600">
                                    <svg
                                      className="w-3 h-3"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                    <span>Free cancellation</span>
                                  </div>
                                </div>

                                <div className="text-red-600 text-sm font-medium mt-2">
                                  Only 1 left at this price on our site
                                </div>
                              </div>

                              {/* Right section */}
                              <div className="flex flex-col items-end justify-between md:ml-4 w-full md:w-48 mt-3 md:mt-0">
                                <div className="text-right mb-3">
                                  <div className="text-sm font-medium text-gray-900 mb-1">
                                    Fabulous
                                  </div>
                                  <div className="text-xs text-gray-600 mb-2">
                                    226 reviews
                                  </div>
                                  <div className="inline-block bg-blue-600 text-white text-base sm:text-lg font-bold px-2 py-1 rounded">
                                    {property.rating || "8.7"}
                                  </div>
                                  <div className="text-xs text-blue-600 mt-1">
                                    Comfort 8.7
                                  </div>
                                </div>

                                <div className="text-right w-full md:w-auto">
                                  <div className="text-xs text-gray-600 mb-1">
                                    1 week, 2 adults
                                  </div>
                                  <div className="flex items-center justify-end gap-2 mb-1">
                                    <span className="text-sm text-gray-500 line-through">
                                      US$
                                      {(
                                        extractPrice(property.price || 803) * 1.4
                                      ).toLocaleString()}
                                    </span>
                                    <span className="text-xl font-bold text-gray-900">
                                      ₦
                                      {property.price?.toLocaleString() ||
                                        "803,000"}
                                    </span>
                                    <button
                                      className="w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center text-xs text-gray-600"
                                      onClick={(e) => e.stopPropagation()}
                                      aria-label="Price info"
                                    >
                                      i
                                    </button>
                                  </div>
                                  <div className="text-xs text-gray-600 mb-3">
                                    Includes taxes and charges
                                  </div>

                                  <button
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded text-sm font-medium transition-colors"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      open();
                                    }}
                                  >
                                    See availability
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-10 sm:py-12 bg-white rounded-lg border border-gray-200">
                  {activeFilters.length > 0 ? (
                    <div className="px-4">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400 mb-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.002-5.5-2.5"
                        />
                      </svg>
                      <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                        No properties match your filters
                      </h3>
                      <p className="text-gray-600 mb-4 text-sm">
                        Try adjusting your search criteria or removing some
                        filters
                      </p>
                      <button
                        onClick={() => navigate("/property")}
                        className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Clear all filters
                      </button>
                    </div>
                  ) : (
                    <div className="px-4">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400 mb-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                        />
                      </svg>
                      <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                        No properties available
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Check back later for new listings
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Pagination + Summary */}
              {totalItems > 0 && (
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-xs sm:text-sm text-gray-600">
                    Showing {startIndex + 1}-{endIndex} of {totalItems}{" "}
                    properties
                    {typeParam === "buy" && " for sale"}
                    {typeParam === "rent" && " for rent"}
                    {activeFilters.length > 0 && " matching your criteria"}
                  </div>

                  <nav
                    className="flex items-center gap-2 flex-1 justify-center"
                    aria-label="Pagination"
                  >
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`h-8 w-8 rounded-xl border text-sm flex items-center justify-center ${
                        currentPage === 1
                          ? "text-gray-400 border-gray-200"
                          : "text-gray-700 border-gray-300 hover:bg-gray-50"
                      }`}
                      aria-label="Previous page"
                    >
                      {"<"}
                    </button>
                    {pageList.map((p, idx) =>
                      typeof p === "number" ? (
                        <button
                          key={`${p}-${idx}`}
                          onClick={() => goToPage(p)}
                          aria-current={p === currentPage ? "page" : undefined}
                          className={`min-w-8 h-8 px-3 rounded-xl border text-sm flex items-center justify-center ${
                            p === currentPage
                              ? "bg-black text-white border-black"
                              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {p}
                        </button>
                      ) : (
                        <span
                          key={`ellipsis-${idx}`}
                          className="h-8 px-3 rounded-xl border border-gray-200 bg-white text-gray-500 text-sm inline-flex items-center justify-center"
                        >
                          ...
                        </span>
                      )
                    )}
                    <button
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`h-8 w-8 rounded-xl border text-sm flex items-center justify-center ${
                        currentPage === totalPages
                          ? "text-gray-400 border-gray-200"
                          : "text-gray-700 border-gray-300 hover:bg-gray-50"
                      }`}
                      aria-label="Next page"
                    >
                      {">"}
                    </button>
                  </nav>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-black py-[clamp(1rem,3vw,1.25rem)] px-4 sm:px-[clamp(1rem,8vw,6.25rem)] min-h-[clamp(8rem,15vw,12.9rem)] flex flex-col lg:flex-row items-center justify-between text-white gap-[clamp(1rem,3vw,2rem)]">
        <div className="flex items-center gap-[clamp(0.5rem,1.5vw,0.75rem)] mb-3 lg:mb-0">
          <p className="text-[clamp(0.75rem,1.5vw,0.875rem)]">Next Step</p>
          <ArrowLeftWhite />
        </div>

        <div className="w-full lg:w-auto grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-[clamp(1rem,4vw,2.5rem)]">
          <button className="w-full border border-white py-[clamp(0.75rem,2vw,1.25rem)] px-[clamp(1rem,3vw,1.5rem)] rounded-[clamp(0.5rem,1vw,0.75rem)] text-[clamp(0.875rem,1.5vw,1rem)] hover:bg-white hover:text-black transition-colors">
            Book a Reservation
          </button>
          <button className="w-full border border-white py-[clamp(0.75rem,2vw,1.25rem)] px-[clamp(1rem,3vw,1.5rem)] rounded-[clamp(0.5rem,1vw,0.75rem)] text-[clamp(0.875rem,1.5vw,1rem)] hover:bg-white hover:text-black transition-colors">
            Find an Agent
          </button>
          <button className="w-full border border-white py-[clamp(0.75rem,2vw,1.25rem)] px-[clamp(1rem,3vw,1.5rem)] rounded-[clamp(0.5rem,1vw,0.75rem)] text-[clamp(0.875rem,1.5vw,1rem)] hover:bg-white hover:text-black transition-colors">
            <span className="whitespace-nowrap">Call 09012345678</span>
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PropertyPage;
