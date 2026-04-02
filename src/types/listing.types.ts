export interface ListingMedia {
  id: string;
  originalUrl: string;
  thumbnailUrl?: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface PropertyType {
  id: number;
  name: string;
}

export interface ListingUser {
  id: string;
  email: string;
  profile?: {
    displayName: string;
    avatarUrl?: string;
  };
}

export interface Listing {
  id: string;
  title: string;
  slug: string;
  listingType: 'SALE' | 'RENT';
  addressDisplay: string;
  price: number;
  priceUnit: 'VND' | 'USD' | 'GOLD_TAEL';
  areaGross: number;
  areaNet?: number;
  status: string;
  media: ListingMedia[];
  propertyType?: PropertyType;
  user?: ListingUser;
  attributes?: Record<string, any>;
  views?: number;
  provinceName?: string;
  districtName?: string;
  wardName?: string;
  direction?: string;
  publishedAt?: string;
}
