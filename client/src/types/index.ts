export type Category = 'trek' | 'nature' | 'culture' | 'hidden-gem';
export type Difficulty = 'easy' | 'moderate' | 'hard';
export type InquiryStatus = 'new' | 'contacted' | 'closed';

export interface Province {
  _id: string;
  name: string;
  nameNepali: string;
  slug: string;
  number: number;
  capital: string;
  areaKm2: number;
  population: number;
  districts: number;
  description: string;
  highlights: string[];
  imageUrl: string;
}

export interface Destination {
  _id: string;
  name: string;
  slug: string;
  provinceId: Province | string;
  provinceSlug: string;
  district: string;
  category: Category;
  subtitle: string;
  description: string;
  bestSeason: string;
  difficulty?: Difficulty;
  costEstimate?: string;
  elevationM?: number;
  lat: number;
  lng: number;
  imageUrl: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface TripDestination {
  _id: string;
  name: string;
  slug: string;
  provinceId: string;
  imageUrl: string;
}

export interface Trip {
  _id: string;
  title: string;
  startDate?: string;
  endDate?: string;
  destinationIds: TripDestination[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InquiryInterest {
  _id: string;
  name: string;
  slug: string;
  provinceSlug: string;
  imageUrl: string;
}

export interface Inquiry {
  _id: string;
  name: string;
  email: string;
  message: string;
  destinationInterest: InquiryInterest | null;
  status: InquiryStatus;
  createdAt: string;
  updatedAt: string;
}

export interface AdminStats {
  destinations: number;
  provinces: number;
  users: number;
  inquiries: number;
  inquiriesNew: number;
}