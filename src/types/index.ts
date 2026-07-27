export type ProjectCategory = 
  | 'Kharghar New Projects'
  | 'Upper Kharghar'
  | 'Ulwe New Projects'
  | 'Pushpak Nagar New Projects'
  | 'Nerul & Seawoods New Projects'
  | 'Juinagar & Sanpada New Projects'
  | 'Panvel'
  | 'Khandeshwar / Kamothe'
  | 'Resale'
  | '1 BHK Nerul East'
  | '1 BHK Nerul West'
  | '1 BHK Seawoods East'
  | '1 BHK Seawoods West'
  | '1 BHK Juinagar'
  | '2 BHK Nerul East'
  | '2 BHK Nerul West'
  | '2 BHK Seawoods East'
  | '2 BHK Seawoods West'
  | '2 BHK Juinagar'
  | '3/4 BHK'
  | 'Row House';

export interface PropertyItem {
  id: string;
  title: string;
  category: ProjectCategory;
  location: string;
  type: 'New Launch' | 'Resale' | 'Commercial' | 'Township';
  configuration: string; // e.g. "1 BHK", "2 & 3 BHK", "3 & 4 BHK"
  price: string;
  area: string; // e.g. "650 - 1200 Sq.Ft."
  possession?: string; // e.g. "Ready to Move" or "Dec 2026"
  features: string[];
  image: string;
  isFeatured?: boolean;
  code?: string; // e.g. "1 BHK - 01", "2 BHK - 28N"
  highlights?: string;
  brokerage: string; // e.g. "0% Brokerage" or "Consultant Direct"
  brokerageFree?: boolean;
  published?: boolean;
}

export interface GoogleReviewItem {
  id: string;
  author: string;
  rating: number;
  timeAgo: string;
  content: string;
  avatarColor: string;
  verified?: boolean;
  reviewsCount?: string;
  isLocalGuide?: boolean;
}

export interface LeadSubmission {
  id: string;
  name: string;
  phone: string;
  email?: string;
  requirement?: string;
  budget?: string;
  preferredArea?: string;
  propertyType?: string;
  message?: string;
  lead_source: string;
  cta_source: string;
  page_name: string;
  timestamp: string;
  status: 'New' | 'Contacted' | 'Closed' | 'Follow-up';
}
