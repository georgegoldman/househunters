/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PropertyCard from "./property-card";
import { toPropertyCard, type PropertyCardItem, type ApiProperty } from "../lib/mappers";
import { api } from "../lib/api";

export default function PropertiesSection() {
  const navigate = useNavigate();
  const location = useLocation();

  const [raw, setRaw] = useState<ApiProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // read possible filters from URL
  const { queryParam, locParam, minPriceParam, maxPriceParam } = useMemo(() => {
    const qs = new URLSearchParams(location.search);
    return {
      queryParam: (qs.get("query") || "").trim(),
      locParam: qs.get("location") || "",
      minPriceParam: qs.get("minPrice"),
      maxPriceParam: qs.get("maxPrice"),
    };
  }, [location.search]);

  // fetch ALL kinds
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const res = await api.properties.list({ all: true, forsale: "both", page: 0 });
        if (alive) setRaw(res?.data ?? []);
      } catch (e: any) {
        if (alive) setErr(e?.message || "Failed to load properties");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  // optional filtering
  const minPrice = useMemo(() => {
    const n = Number(minPriceParam);
    return Number.isFinite(n) ? n : undefined;
  }, [minPriceParam]);

  const maxPrice = useMemo(() => {
    const n = Number(maxPriceParam);
    return Number.isFinite(n) ? n : undefined;
  }, [maxPriceParam]);

  const LOCATION_KEYWORDS: Record<string, string[]> = {
    "lekki-lagos": ["lekki", "lagos"],
    "mall-enugu": ["mall", "enugu"],
    "wuse-abuja": ["wuse", "abuja"],
    "gra-ph": ["gra", "port harcourt", "ph"],
  };

  const textIncludes = (hay: string, needle: string) =>
    hay.toLowerCase().includes(needle.toLowerCase());

  const matchesLocation = (row: ApiProperty) => {
    if (!locParam) return true;
    const kw = LOCATION_KEYWORDS[locParam] || locParam.split("-");
    const blob = `${row.address ?? ""} ${row.city ?? ""}`.toLowerCase();
    return kw.some((k) => blob.includes(k.toLowerCase()));
  };

  const matchesQuery = (row: ApiProperty) => {
    if (!queryParam) return true;
    return (
      textIncludes(row.address ?? "", queryParam) ||
      textIncludes(row.city ?? "", queryParam) ||
      textIncludes(row.description ?? "", queryParam) ||
      textIncludes(String(row.price ?? ""), queryParam)
    );
  };

  const matchesPrice = (row: ApiProperty) => {
    if (typeof row.price !== "number") return true;
    if (minPrice !== undefined && row.price < minPrice) return false;
    if (maxPrice !== undefined && row.price > maxPrice) return false;
    return true;
  };

  const filtered = useMemo(
    () => raw.filter((r) => matchesLocation(r) && matchesQuery(r) && matchesPrice(r)),
    [raw, locParam, queryParam, minPrice, maxPrice]
  );

  // 👇 fallback: if filters yield 0, show all
  const rowsToShow = filtered.length > 0 ? filtered : raw;

  // stable sort: newest first, then by id desc
  const sorted = useMemo(() => {
    const getTime = (r: any) =>
      new Date(r.createdAt ?? r.created_at ?? 0).getTime();
    return [...rowsToShow].sort((a, b) => {
      const tb = getTime(b);
      const ta = getTime(a);
      if (tb !== ta) return tb - ta;
      return (b.id ?? 0) - (a.id ?? 0);
    });
  }, [rowsToShow]);

  // map to cards — don’t drop hidden items
  const items: PropertyCardItem[] = useMemo(
    () => sorted.map(toPropertyCard).slice(0,6),
    [sorted]
  );

  const clearFilters = () => navigate("/property", { replace: true });

  return (
    <section className="flex flex-col items-center gap-[clamp(2rem,6vw,3.125rem)] main-container py-[8rem]" aria-labelledby="properties-heading">
      <header className="flex flex-col items-center gap-[clamp(1.5rem,4vw,2rem)] text-center">
        <div className="flex flex-col items-center gap-[clamp(0.5rem,1.5vw,0.625rem)] max-w-4xl">
          <h3 id="properties-heading" className="text-[clamp(1.75rem,4vw,2.5rem)] font-bold leading-tight">
            All Properties
          </h3>
          <p className="text-[clamp(1rem,2.5vw,1.25rem)] text-black/70 max-w-2xl">
            Showing sale & rent, visible & hidden. Filters applied only if they return results.
          </p>
        </div>

        <button
          className="bg-black hover:bg-gray-800 active:bg-gray-900 py-[clamp(0.5rem,1.5vw,0.625rem)] px-[clamp(1rem,3vw,1.5rem)] rounded-[clamp(0.5rem,1.5vw,0.625rem)] text-white font-bold transition-colors shadow-sm hover:shadow-md"
          onClick={() => navigate("/property")}
        >
          Browse more properties
        </button>
      </header>

      {loading && <p role="status" aria-live="polite" className="text-gray-600">Loading properties…</p>}
      {err && <p role="alert" className="text-red-600">{err}</p>}

      {!loading && !err && items.length === 0 && (
        <div className="flex flex-col items-center gap-3 text-gray-700">
          <p>No properties available.</p>
          <button className="mt-1 rounded border px-3 py-1 text-sm hover:bg-gray-50" onClick={clearFilters}>
            Clear filters
          </button>
        </div>
      )}

      {!loading && !err && items.length > 0 && (
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-[clamp(1.5rem,4vw,2rem)] justify-items-center w-full max-w-7xl"
          role="list"
          aria-label={`${items.length} properties`}
        >
          {items.map((property) => (
            <div key={property.id} role="listitem" className="w-full">
              <PropertyCard property={property} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
