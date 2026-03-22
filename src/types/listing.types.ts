export interface ListingMedia {
  id: string;
  originalUrl: string;
  isPrimary: boolean;
}

export interface Listing {
  id: string;
  title: string;
  addressDisplay: string;
  price: number;
  status: string;
  media: ListingMedia[];
  views?: number;
}

export interface PropertyType {
  id: number;
  name: string;
}
