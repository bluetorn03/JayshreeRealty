export type ProjectCategory = string;

export type PlacementTarget = 'homepage' | 'featured' | 'buy' | 'commercial' | 'resale';

export interface PropertyItem {
  id: string;
  slug?: string;
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
  galleryImages?: string[];
  youtubeUrl?: string;
  description?: string;
  shortDescription?: string;
  longDescription?: string;
  isFeatured?: boolean;
  code?: string; // e.g. "1 BHK - 01", "2 BHK - 28N"
  highlights?: string;
  brokerage?: string; // e.g. "0% Brokerage" or ""
  brokerageFree?: boolean;
  published?: boolean;
  archived?: boolean;
  placements?: PlacementTarget[];
  brochureUrl?: string;
  floorPlanUrl?: string;
  builderName?: string;
  builderExperience?: string;
  amenities?: string[];
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
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
  published?: boolean;
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
  notes?: string;
  assignedTo?: string;
  followUpDate?: string;
}

export interface SiteSettings {
  companyName: string;
  phone: string;
  phoneRaw: string;
  email: string;
  whatsapp: string;
  whatsappRaw: string;
  address: string;
  googleMapsEmbedUrl: string;
  logoUrl: string;
  faviconUrl: string;
  facebookUrl: string;
  instagramUrl: string;
  linkedinUrl: string;
  youtubeUrl: string;
  seoTitleDefault: string;
  seoDescriptionDefault: string;
  seoKeywordsDefault: string;
  gaMeasurementId: string;
  gtmContainerId: string;
  gscVerificationMeta: string;
  robotsTxtContent: string;
  sitemapAutoGenerate: boolean;
  smtpHost: string;
  smtpPort: string;
  smtpUser: string;
  smtpFromEmail: string;
  maintenanceMode: boolean;
  maintenanceMessage: string;
}

export interface CounterItem {
  id: string;
  label: string;
  value: number;
  suffix: string;
  iconName?: string;
}

export interface LocationNode {
  id: string;
  name: string;
  description: string;
  activeCount: number;
}
