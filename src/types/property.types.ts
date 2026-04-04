/**
 * Real Estate Property Types & DTOs.
 */

export const PropertyType = {
  APARTMENT: 'APARTMENT',
  HOUSE: 'HOUSE',
  LAND: 'LAND',
  OFFICE: 'OFFICE',
  SHOP: 'SHOP',
} as const;

export type PropertyType = typeof PropertyType[keyof typeof PropertyType];

export const PropertyStatus = {
  AVAILABLE: 'AVAILABLE',
  SOLD: 'SOLD',
  RENTED: 'RENTED',
  PENDING: 'PENDING',
  DELETED: 'DELETED',
} as const;

export type PropertyStatus = typeof PropertyStatus[keyof typeof PropertyStatus];

export interface Location {
  address: string;
  ward: string;
  district: string;
  city: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  area: number; // in m2
  location: Location;
  images: string[];
  type: PropertyType;
  status: PropertyStatus;
  bedRooms?: number;
  bathRooms?: number;
  createdAt: string;
  updatedAt: string;
}

export interface PropertyCreateDTO {
  title: string;
  description: string;
  price: number;
  area: number;
  location: Location;
  images: string[];
  type: PropertyType;
  status: PropertyStatus;
  bedRooms?: number;
  bathRooms?: number;
}

export interface PropertyUpdateDTO extends Partial<PropertyCreateDTO> {}

export interface PropertyFilter {
  query?: string;
  type?: PropertyType;
  status?: PropertyStatus;
  minPrice?: number;
  maxPrice?: number;
  city?: string;
}

export interface PropertyPaginationResponse {
  data: Property[];
  total: number;
  page: number;
  limit: number;
}
