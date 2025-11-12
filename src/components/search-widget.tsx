// search-widget.tsx - SIMPLE VERSION WITH TEXT FIELDS
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import CancelIcon from "../assets/cancel-icon";
import SearchIcon from "../assets/search-icon";
import LocationIcon from "../assets/location-icon";
import MoneyIcon from "../assets/money-icon";

interface Filter {
  id: string;
  label: string;
  category: "property-type" | "amenities" | "features" | "custom";
}


const WIDGET_TABS = [
  { id: "all", label: "All" },
  { id: "buy", label: "Buy" },
  { id: "rent", label: "Rent" },
];

const SearchWidget = ({
  viewMode,
  setViewMode,
}: {
  viewMode: "grid" | "list";
  setViewMode: (viewMode: "grid" | "list") => void;
}) => {
  const navigate = useNavigate();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState("all");
  const [filters, setFilters] = useState<Filter[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState(""); // 🔧 Simple text input
  const [minPrice, setMinPrice] = useState(""); // 🔧 Simple text input
  const [maxPrice, setMaxPrice] = useState(""); // 🔧 Simple text input

  const [, setIsFilterDropdownOpen] = useState(false);

  const removeFilter = (filterId: string) => {
    setFilters((prev) => prev.filter((f) => f.id !== filterId));
  };

  const handleSearch = () => {
    const params: Record<string, string> = {};

    // Only include type if not "all"
    if (activeTab !== "all") params.type = activeTab;

    // Only include query if non-empty
    if (searchQuery.trim()) params.query = searchQuery.trim();

    // Only include location if non-empty
    if (locationQuery.trim()) params.location = locationQuery.trim();

    // Only include price if valid numbers
    const minNum = minPrice.trim() ? Number(minPrice.trim()) : undefined;
    const maxNum = maxPrice.trim() ? Number(maxPrice.trim()) : undefined;

    if (minNum && Number.isFinite(minNum) && minNum > 0) {
      params.minPrice = String(minNum);
    }
    if (maxNum && Number.isFinite(maxNum) && maxNum > 0) {
      params.maxPrice = String(maxNum);
    }

    // Include grouped filters if there are any
    if (filters.length) {
      const byCat = filters.reduce((acc: Record<string, string[]>, f) => {
        (acc[f.category] ||= []).push(f.id);
        return acc;
      }, {});
      Object.entries(byCat).forEach(([k, vals]) => {
        params[k] = vals.join(",");
      });
    }

    const searchParams = new URLSearchParams(params);
    console.log("🔍 Search params:", params);
    console.log(
      "🔍 Navigating to:",
      searchParams.toString() ? `/property?${searchParams}` : "/property"
    );

    navigate(
      searchParams.toString() ? `/property?${searchParams}` : "/property"
    );
  };

  // 🔧 NEW: Clear all function for easy reset
  const handleClearAll = () => {
    setActiveTab("all");
    setFilters([]);
    setSearchQuery("");
    setLocationQuery("");
    setMinPrice("");
    setMaxPrice("");
    navigate("/property");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const onDocClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target?.closest(".dropdown-content")) {
        setIsFilterDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  // Check if any filters are active
  const hasActiveFilters = !!(
    activeTab !== "all" ||
    searchQuery.trim() ||
    locationQuery.trim() ||
    minPrice.trim() ||
    maxPrice.trim() ||
    filters.length
  );

  return (
    <div className="main-container absolute bottom-[-5%] left-1/2 -translate-x-1/2 shadow-lg z-50 max-w-full">
      {/* Tabs */}
      <div className="flex">
        {WIDGET_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              rounded-tl-[clamp(0.5rem,1.5vw,0.75rem)]
              rounded-tr-[clamp(0.5rem,1.5vw,0.75rem)]
              p-[clamp(0.5rem,1.5vw,0.75rem)]
              font-medium min-w-[clamp(4rem,15vw,6.25rem)]
              flex items-center justify-center
              text-[clamp(0.875rem,1.2vw,1rem)]
              transition-colors duration-200
              ${
                activeTab === tab.id
                  ? "bg-white text-black"
                  : "bg-white/20 text-white hover:bg-white/30"
              }
            `}
            aria-pressed={activeTab === tab.id}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search Form */}
      <div className="flex flex-col gap-[clamp(0.75rem,2vw,1rem)] p-[clamp(0.75rem,2.5vw,1rem)] rounded-tr-[clamp(0.75rem,2vw,1rem)] rounded-br-[clamp(0.75rem,2vw,1rem)] rounded-bl-[clamp(0.75rem,2vw,1rem)] bg-white">
        {/* 🔧 Show active filters summary */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 p-3 bg-blue-50 rounded-lg">
            <span className="text-sm text-blue-800 font-medium">
              Active filters:
            </span>
            {activeTab !== "all" && (
              <span className="text-xs bg-blue-200 px-2 py-1 rounded">
                Type: {activeTab}
              </span>
            )}
            {locationQuery.trim() && (
              <span className="text-xs bg-blue-200 px-2 py-1 rounded">
                Location: {locationQuery}
              </span>
            )}
            {(minPrice.trim() || maxPrice.trim()) && (
              <span className="text-xs bg-blue-200 px-2 py-1 rounded">
                Price: {minPrice || "0"} - {maxPrice || "∞"}
              </span>
            )}
            {searchQuery.trim() && (
              <span className="text-xs bg-blue-200 px-2 py-1 rounded">
                Search: "{searchQuery}"
              </span>
            )}
            <button
              onClick={handleClearAll}
              className="text-xs text-blue-600 hover:text-blue-800 underline ml-2"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Filter Tags */}
        {filters.length > 0 && (
          <div className="flex flex-wrap gap-[clamp(0.5rem,1.5vw,0.75rem)]">
            {filters.map((f) => (
              <div
                key={f.id}
                className="flex gap-[clamp(0.25rem,1vw,0.5rem)] border border-black/20 items-center p-[clamp(0.5rem,1.5vw,0.75rem)] rounded-[clamp(0.5rem,1.5vw,0.75rem)] bg-gray-50"
              >
                <p className="text-[clamp(0.75rem,1.1vw,0.875rem)] font-medium text-black/60 whitespace-nowrap">
                  {f.label}
                </p>
                <button
                  onClick={() => removeFilter(f.id)}
                  className="cursor-pointer"
                  aria-label={`Remove ${f.label} filter`}
                >
                  <CancelIcon />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-[clamp(0.5rem,1.5vw,0.75rem)] overflow-x-auto scrollbar-hide lg:overflow-x-visible lg:flex lg:flex-nowrap">
          {/* Main Search Input */}
          <div className="relative bg-gray-50 py-[clamp(0.5rem,1.5vw,0.75rem)] px-[clamp(1rem,3vw,2rem)] rounded-[clamp(0.5rem,1.5vw,0.75rem)] min-w-[clamp(200px,25vw,250px)] flex-shrink-0 lg:min-w-0 lg:flex-1">
            <div className="absolute left-[clamp(0.5rem,1.5vw,0.75rem)] top-1/2 -translate-y-1/2 w-[clamp(1rem,2vw,1.25rem)] h-[clamp(1rem,2vw,1.25rem)]">
              <SearchIcon />
            </div>
            <input
              ref={searchInputRef}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSearch();
                }
              }}
              placeholder="Type your search"
              type="text"
              className="px-[clamp(1rem,2.5vw,1.5rem)] w-full bg-transparent placeholder:text-black/60 text-[clamp(0.875rem,1.2vw,1rem)] focus:outline-none"
              aria-label="Search properties"
            />
          </div>

          {/* Location Input */}
          <div className="relative bg-gray-50 py-[clamp(0.5rem,1.5vw,0.75rem)] px-[clamp(1rem,3vw,2rem)] rounded-[clamp(0.5rem,1.5vw,0.75rem)] min-w-[clamp(200px,25vw,250px)] flex-shrink-0 lg:min-w-0 lg:flex-1">
            <div className="absolute left-[clamp(0.5rem,1.5vw,0.75rem)] top-1/2 -translate-y-1/2 w-[clamp(1rem,2vw,1.25rem)] h-[clamp(1rem,2vw,1.25rem)]">
              <LocationIcon />
            </div>
            <input
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSearch();
                }
              }}
              placeholder="Location (e.g. Lagos, Abuja)"
              type="text"
              className="px-[clamp(1rem,2.5vw,1.5rem)] w-full bg-transparent placeholder:text-black/60 text-[clamp(0.875rem,1.2vw,1rem)] focus:outline-none"
              aria-label="Location"
            />
          </div>

          {/* Price Inputs */}
          <div className="flex gap-[clamp(0.25rem,1vw,0.5rem)] min-w-[clamp(200px,25vw,250px)] flex-shrink-0 lg:min-w-0 lg:flex-1">
            <div className="relative bg-gray-50 py-[clamp(0.5rem,1.5vw,0.75rem)] px-[clamp(0.5rem,1.5vw,0.75rem)] flex-1 rounded-[clamp(0.5rem,1.5vw,0.75rem)] min-w-0">
              <div className="absolute left-[clamp(0.25rem,1vw,0.5rem)] top-1/2 -translate-y-1/2 w-[clamp(0.75rem,1.5vw,1rem)] h-[clamp(0.75rem,1.5vw,1rem)]">
                <MoneyIcon />
              </div>
              <input
                value={minPrice}
                onChange={(e) =>
                  setMinPrice(e.target.value.replace(/[^\d]/g, ""))
                } // Only allow numbers
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSearch();
                  }
                }}
                placeholder="Min"
                type="text"
                className="px-[clamp(0.75rem,2vw,1rem)] w-full bg-transparent placeholder:text-black/60 text-[clamp(0.875rem,1.2vw,1rem)] focus:outline-none"
                aria-label="Minimum price"
              />
            </div>
            <div className="flex items-center text-black/40 text-[clamp(0.875rem,1.2vw,1rem)]">
              -
            </div>
            <div className="relative bg-gray-50 py-[clamp(0.5rem,1.5vw,0.75rem)] px-[clamp(0.5rem,1.5vw,0.75rem)] flex-1 rounded-[clamp(0.5rem,1.5vw,0.75rem)] min-w-0">
              <input
                value={maxPrice}
                onChange={(e) =>
                  setMaxPrice(e.target.value.replace(/[^\d]/g, ""))
                } // Only allow numbers
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSearch();
                  }
                }}
                placeholder="Max"
                type="text"
                className="w-full bg-transparent placeholder:text-black/60 text-[clamp(0.875rem,1.2vw,1rem)] focus:outline-none"
                aria-label="Maximum price"
              />
            </div>
          </div>

          {/* View switching buttons - hidden on mobile and tablet (always grid), visible on desktop only */}
          <div className="hidden lg:flex items-center gap-2 min-w-[clamp(150px,20vw,200px)] flex-shrink-0 lg:min-w-0 lg:flex-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`py-[clamp(0.5rem,1.5vw,0.75rem)] px-[clamp(0.75rem,2vw,1rem)] rounded-[clamp(0.5rem,1.5vw,0.75rem)] text-[clamp(0.875rem,1.2vw,1rem)] font-medium transition-colors duration-200 ${
                viewMode === "grid"
                  ? "bg-black text-white"
                  : "bg-gray-50 text-black/60 hover:bg-gray-100"
              }`}
              aria-pressed={viewMode === "grid"}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`py-[clamp(0.5rem,1.5vw,0.75rem)] px-[clamp(0.75rem,2vw,1rem)] rounded-[clamp(0.5rem,1.5vw,0.75rem)] text-[clamp(0.875rem,1.2vw,1rem)] font-medium transition-colors duration-200 ${
                viewMode === "list"
                  ? "bg-black text-white"
                  : "bg-gray-50 text-black/60 hover:bg-gray-100"
              }`}
              aria-pressed={viewMode === "list"}
            >
              List
            </button>
          </div>

          {/* Filters dropdown (optional) */}
          {/* <div className="relative">
            <button
              onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
              className="h-full bg-gray-50 px-4 rounded-[clamp(0.5rem,1.5vw,0.75rem)] flex items-center text-black/60 hover:bg-gray-100 whitespace-nowrap"
              aria-label="Add filters"
              aria-expanded={isFilterDropdownOpen}
            >
              Filters <ArrowDown />
            </button>

            {isFilterDropdownOpen && (
              <div className="dropdown-content absolute z-[9999] right-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg">
                <div className="p-2">
                  <div className="font-medium text-sm text-gray-500 mb-2">Property Type</div>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {AVAILABLE_FILTERS.filter((f) => f.category === "property-type").map((f) => (
                      <button
                        key={f.id}
                        onClick={() => { addFilter(f); setIsFilterDropdownOpen(false); }}
                        disabled={filters.some((x) => x.id === f.id)}
                        className={`text-left px-3 py-2 text-sm rounded-md ${
                          filters.some((x) => x.id === f.id) ? "bg-gray-100 text-gray-400" : "hover:bg-gray-50"
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>

                  <div className="font-medium text-sm text-gray-500 mb-2">Amenities</div>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {AVAILABLE_FILTERS.filter((f) => f.category === "amenities").map((f) => (
                      <button
                        key={f.id}
                        onClick={() => { addFilter(f); setIsFilterDropdownOpen(false); }}
                        disabled={filters.some((x) => x.id === f.id)}
                        className={`text-left px-3 py-2 text-sm rounded-md ${
                          filters.some((x) => x.id === f.id) ? "bg-gray-100 text-gray-400" : "hover:bg-gray-50"
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>

                  <div className="font-medium text-sm text-gray-500 mb-2">Features</div>
                  <div className="grid grid-cols-2 gap-2">
                    {AVAILABLE_FILTERS.filter((f) => f.category === "features").map((f) => (
                      <button
                        key={f.id}
                        onClick={() => { addFilter(f); setIsFilterDropdownOpen(false); }}
                        disabled={filters.some((x) => x.id === f.id)}
                        className={`text-left px-3 py-2 text-sm rounded-md ${
                          filters.some((x) => x.id === f.id) ? "bg-gray-100 text-gray-400" : "hover:bg-gray-50"
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div> */}

          {/* Search Button */}
          <button
            onClick={handleSearch}
            className="bg-black text-white rounded-[clamp(0.5rem,1.5vw,0.75rem)] py-[clamp(0.5rem,1.5vw,0.75rem)] px-[clamp(1rem,3vw,2rem)] font-medium text-[clamp(0.875rem,1.2vw,1rem)] hover:bg-gray-800 transition-colors duration-200 whitespace-nowrap flex-shrink-0"
            aria-label="Search properties"
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchWidget;
