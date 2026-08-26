export interface StayProperty {
  id: string;
  slug: string;
  title: string;
  location: string;
  city: string;
  category: string;
  pricePerNight: number;
  rating: number;
  reviewsCount: number;
  image: string;
  tag: string;
  guests: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  description: string;
}

export interface RentalProperty {
  id: string;
  slug: string;
  title: string;
  locality: string;
  city: string;
  propertyType: string;
  monthlyRent: number;
  securityDeposit: number;
  carpetAreaSqFt: number;
  bedrooms: number;
  bathrooms: number;
  furnishing: string;
  image: string;
  amenities: string[];
  description: string;
}
