export interface PropertyFeature {
  icon: React.ElementType;
  label: string;
  ariaLabel: string;
}

export interface PropertyAgent {
  name: string;
  phone: string;
  avatar: string;
}

// src/types/property.ts
export interface Property {
  id: number;
  main_image: string;
  images: string[];
  description: string;
  area: number;
  price: number;
  owner: string;
  owner_phone: string;
  address: string;
  city: string;
  state: string,
  location: string,
  bathrooms: number
  sold: boolean;
  rented: boolean;
  show: boolean;
  isForRent: boolean;
}
