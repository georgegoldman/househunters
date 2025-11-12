/* eslint-disable @typescript-eslint/no-explicit-any */
// src/lib/mappers.ts
// Maps your Prisma Property (backend shape) to the UI shape your <PropertyCard /> expects.

import SquareMeterIcon from "../assets/square-meter-icon"; // adjust path if needed
import type { Property as BackendProperty } from "../types/property";

// Back-compat: if other files still import ApiProperty from here, keep this alias.
export type ApiProperty = BackendProperty;

// UI shape used by <PropertyCard />
export type PropertyCardItem = {
  id: number;
  price: string; // formatted label (₦..., optionally with /mo)
  title: string;
  location: string;
  description: string,
  area: string,
  bedrooms: number,
  bathrooms: number,
  show: boolean;
  image: string;
  images: string[];
  rating: string,
  status: "For Rent" | "For Sale" | "Sold" | "Rented";
  agent: { name: string; phone: string; avatar?: string };
  features: Array<{
    icon?: React.ComponentType<any>;
    label: string;
    ariaLabel: string;
  }>;
};

const moneyNGN = (n: number) =>
  new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(n);

const statusOf = (p: BackendProperty): PropertyCardItem["status"] =>
  p.sold ? "Sold" : p.rented ? "Rented" : p.isForRent ? "For Rent" : "For Sale";

export const toPropertyCard = (p: BackendProperty): PropertyCardItem => {
  const img = p.main_image || p.images?.[0] || "/placeholder.jpg";

  return {
    id: p.id,
    // If it's for rent, show per-month suffix (tweak to your design)
    price: p.isForRent ? `${moneyNGN(p.price)}/mo` : moneyNGN(p.price),
    // No separate title field in backend; use description or a fallback
    title: p.description?.trim() || "Property",
    location: `${p.address}, ${p.city}`,
    image: img,
    bedrooms: 0,
    bathrooms: 0,
    area: "",
    rating: "3",
    description: p.description,
    images: p.images || [],
    status: statusOf(p),
    show: !!p.show,
    agent: { name: p.owner, phone: p.owner_phone, avatar: undefined },
    features: [
      {
        icon: SquareMeterIcon,
        label: `${p.area} m²`,
        ariaLabel: `${p.area} square meters`,
      },
    ],
  };
};

// Convenience for arrays
export const toPropertyCardList = (
  rows: BackendProperty[],
): PropertyCardItem[] => (rows ?? []).map(toPropertyCard);

// Also export status if other components reuse it
export { statusOf };
