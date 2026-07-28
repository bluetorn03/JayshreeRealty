import React, { createContext, useContext, useState, useEffect } from 'react';
import { PropertyItem, GoogleReviewItem, SiteSettings, CounterItem, LocationNode, ProjectCategory } from '../types';
import { PROJECTS_DATA as INITIAL_PROJECTS } from '../data/projectsData';
import { GOOGLE_REVIEWS_DATA as INITIAL_REVIEWS } from '../data/reviewsData';
import { api } from '../services/api';

interface AdminCredentials {
  username: string;
  passwordHash: string;
}

interface HeroSettings {
  headingPart1: string;
  headingGold: string;
  subtext: string;
  keywords: string[];
  backgroundImage: string;
}

interface PopupSettings {
  title: string;
  subtitle: string;
  badge: string;
  leftImage: string;
  privacyText: string;
  enabled?: boolean;
  triggerDelay?: number;
  scrollTriggerPercent?: number;
  redirectUrl?: string;
  successMessage?: string;
}

interface DataContextType {
  projects: PropertyItem[];
  reviews: GoogleReviewItem[];
  heroSettings: HeroSettings;
  popupSettings: PopupSettings;
  adminCredentials: AdminCredentials;
  siteSettings: SiteSettings;
  categories: ProjectCategory[];
  counters: CounterItem[];
  locations: LocationNode[];
  mediaLibrary: string[];
  isAdminAuthenticated: boolean;
  
  // Actions
  loginAdmin: (username: string, pass: string) => Promise<boolean>;
  logoutAdmin: () => void;
  updateAdminCredentials: (username: string, password: string) => Promise<boolean>;
  
  addProject: (project: Omit<PropertyItem, 'id'>) => Promise<void>;
  updateProject: (id: string, updated: Partial<PropertyItem>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  toggleProjectFeatured: (id: string) => Promise<void>;
  toggleProjectPublished: (id: string) => Promise<void>;
  toggleProjectArchive: (id: string) => Promise<void>;
  
  addReview: (review: Omit<GoogleReviewItem, 'id'>) => Promise<void>;
  updateReview: (id: string, updated: Partial<GoogleReviewItem>) => Promise<void>;
  deleteReview: (id: string) => Promise<void>;
  
  updateHeroSettings: (settings: Partial<HeroSettings>) => Promise<void>;
  updatePopupSettings: (settings: Partial<PopupSettings>) => Promise<void>;
  updateSiteSettings: (settings: Partial<SiteSettings>) => Promise<void>;
  
  addMediaItem: (url: string) => void;
  deleteMediaItem: (url: string) => void;
  
  updateCounter: (id: string, updated: Partial<CounterItem>) => Promise<void>;
  saveAllCounters: (updatedCounters: CounterItem[]) => Promise<void>;
  addCategory: (category: ProjectCategory) => Promise<void>;
  updateCategory: (oldName: string, newName: string) => Promise<void>;
  deleteCategory: (category: ProjectCategory) => Promise<void>;

  addLocation: (location: Omit<LocationNode, 'id'>) => Promise<void>;
  updateLocation: (id: string, updated: Partial<LocationNode>) => Promise<void>;
  deleteLocation: (id: string) => Promise<void>;

  exportBackup: () => void;
  importBackup: (jsonData: string) => boolean;
  refreshData: () => Promise<void>;
}

const DEFAULT_HERO_SETTINGS: HeroSettings = {
  headingPart1: "Navi Mumbai’s Most",
  headingGold: "Trusted Luxury Real Estate",
  subtext: "Experience transparent property buying with verified CIDCO plots, direct developer launches, and prime resale homes across Nerul, Seawoods, Kharghar, Ulwe, Pushpak Nagar & Panvel.",
  keywords: [
    "Premium Projects",
    "Buy Property",
    "Sell Property",
    "Verified Properties",
    "Navi Mumbai",
    "Luxury Homes"
  ],
  backgroundImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2000"
};

const DEFAULT_POPUP_SETTINGS: PopupSettings = {
  title: "Get Best Offer & Instant Details",
  subtitle: "Register now for exclusive launch pricing, priority site visits & floor plans.",
  badge: "Exclusive Launch Pricing",
  leftImage: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1000",
  privacyText: "We respect your privacy. No spam, ever.",
  enabled: true,
  triggerDelay: 3,
  scrollTriggerPercent: 25,
  redirectUrl: "",
  successMessage: "Thank you! Our luxury real estate expert will contact you shortly."
};

const DEFAULT_ADMIN_CREDENTIALS: AdminCredentials = {
  username: 'admin@jayshreerealty',
  passwordHash: 'jayshreerealty@8989'
};

const DEFAULT_SITE_SETTINGS: SiteSettings = {
  companyName: 'Jayshree Realty',
  phone: '+91 81690 05579',
  phoneRaw: '+918169005579',
  email: 'jayshreerealty03@gmail.com',
  whatsapp: '+91 81690 05579',
  whatsappRaw: '918169005579',
  address: 'Shop No. 12, Prime Plaza, Sector 19, Nerul West, Navi Mumbai, Maharashtra 400706',
  googleMapsEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.492582845625!2d73.0125!3d19.0416!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m3!2sNerul%2C%20Navi%20Mumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1700000000000',
  logoUrl: '/assets/jayshree-realty-logo.png',
  faviconUrl: '/favicon.ico',
  facebookUrl: 'https://facebook.com/jayshreerealty',
  instagramUrl: 'https://instagram.com/jayshreerealty',
  linkedinUrl: 'https://linkedin.com/company/jayshreerealty',
  youtubeUrl: 'https://youtube.com/@jayshreerealty',
  seoTitleDefault: 'Jayshree Realty | Premium Luxury Real Estate Consultancy Navi Mumbai',
  seoDescriptionDefault: 'Navi Mumbai premier luxury real estate consultancy. Verified CIDCO plot projects, luxury residential towers & commercial spaces in Nerul, Seawoods, Kharghar & Ulwe.',
  seoKeywordsDefault: 'Navi Mumbai Real Estate, Nerul Flat Sale, Kharghar New Launch, Seawoods Luxury Flat, Pushpak Nagar CIDCO Plot, Jayshree Realty',
  gaMeasurementId: 'G-MEASUREMENT_ID',
  gtmContainerId: 'GTM-CONTAINER_ID',
  gscVerificationMeta: 'gsc-verification-token',
  robotsTxtContent: "User-agent: *\nAllow: /\nDisallow: /admin\nSitemap: https://jayshreerealty.com/sitemap.xml",
  sitemapAutoGenerate: true,
  smtpHost: 'smtp.gmail.com',
  smtpPort: '587',
  smtpUser: 'jayshreerealty03@gmail.com',
  smtpFromEmail: 'noreply@jayshreerealty.com',
  maintenanceMode: false,
  maintenanceMessage: 'System undergoes scheduled maintenance. We will be back shortly.'
};

const DEFAULT_COUNTERS: CounterItem[] = [
  { id: 'cnt-1', label: 'Happy Families', value: 450, suffix: '+', iconName: 'Users' },
  { id: 'cnt-2', label: 'Projects Delivered', value: 85, suffix: '+', iconName: 'Building2' },
  { id: 'cnt-3', label: 'Years Experience', value: 12, suffix: '+', iconName: 'Award' },
  { id: 'cnt-4', label: 'Sq.Ft. Managed', value: 2, suffix: 'M+', iconName: 'TrendingUp' },
];

const DEFAULT_LOCATIONS: LocationNode[] = [
  { id: 'loc-1', name: 'Kharghar', description: 'Central Park, Golf Course, & Metro Hub', activeCount: 12 },
  { id: 'loc-2', name: 'Nerul & Seawoods', description: 'Grand Central Mall & Palm Beach Road', activeCount: 14 },
  { id: 'loc-3', name: 'Ulwe', description: 'Near Atal Setu MTHL & Coastal Highway', activeCount: 8 },
  { id: 'loc-4', name: 'Pushpak Nagar', description: 'Navi Mumbai International Airport Node', activeCount: 6 },
  { id: 'loc-5', name: 'Panvel', description: 'Mega Township & Railway Junction', activeCount: 4 },
];

const INITIAL_CATEGORIES: ProjectCategory[] = [
  'Kharghar New Projects',
  'Upper Kharghar',
  'Ulwe New Projects',
  'Pushpak Nagar New Projects',
  'Nerul & Seawoods New Projects',
  'Juinagar & Sanpada New Projects',
  'Panvel',
  'Khandeshwar / Kamothe',
  'Resale',
  'Commercial Workspaces',
  '1 BHK Nerul East',
  '1 BHK Nerul West',
  '1 BHK Seawoods East',
  '1 BHK Seawoods West',
  '2 BHK Nerul East',
  '2 BHK Nerul West',
  '2 BHK Seawoods East',
  '2 BHK Seawoods West',
  '3/4 BHK',
  'Row House'
];

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<PropertyItem[]>(INITIAL_PROJECTS as PropertyItem[]);
  const [reviews, setReviews] = useState<GoogleReviewItem[]>(INITIAL_REVIEWS);
  const [heroSettings, setHeroSettings] = useState<HeroSettings>(DEFAULT_HERO_SETTINGS);
  const [popupSettings, setPopupSettings] = useState<PopupSettings>(DEFAULT_POPUP_SETTINGS);
  const [adminCredentials, setAdminCredentials] = useState<AdminCredentials>(DEFAULT_ADMIN_CREDENTIALS);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [categories, setCategories] = useState<ProjectCategory[]>(INITIAL_CATEGORIES);
  const [counters, setCounters] = useState<CounterItem[]>(DEFAULT_COUNTERS);
  const [locations, setLocations] = useState<LocationNode[]>(DEFAULT_LOCATIONS);
  const [mediaLibrary, setMediaLibrary] = useState<string[]>([
    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&q=80&w=1000"
  ]);

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return Boolean(localStorage.getItem('jayshree_admin_token'));
  });

  const refreshData = async () => {
    try {
      // 1. Fetch properties from DB
      const propRes = await api.getProperties();
      if (propRes.success && Array.isArray(propRes.properties) && propRes.properties.length > 0) {
        setProjects(propRes.properties);
      }

      // 2. Fetch CMS settings from DB
      const cmsRes = await api.getAllCMS();
      if (cmsRes.success) {
        if (cmsRes.heroSettings) setHeroSettings(cmsRes.heroSettings);
        if (cmsRes.popupSettings) setPopupSettings(cmsRes.popupSettings);
        if (cmsRes.siteSettings) setSiteSettings(cmsRes.siteSettings);
        if (Array.isArray(cmsRes.counters) && cmsRes.counters.length > 0) setCounters(cmsRes.counters);
        if (Array.isArray(cmsRes.locations) && cmsRes.locations.length > 0) setLocations(cmsRes.locations);
        if (Array.isArray(cmsRes.categories) && cmsRes.categories.length > 0) setCategories(cmsRes.categories);
        if (Array.isArray(cmsRes.reviews) && cmsRes.reviews.length > 0) setReviews(cmsRes.reviews);
      }
    } catch (e) {
      console.warn('Backend API connection check fallback:', e);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Verify auth on mount
  useEffect(() => {
    const token = localStorage.getItem('jayshree_admin_token');
    if (token) {
      api.verifyAuth().then(res => {
        if (!res.success) {
          localStorage.removeItem('jayshree_admin_token');
          setIsAdminAuthenticated(false);
        } else {
          setIsAdminAuthenticated(true);
        }
      });
    }
  }, []);

  const loginAdmin = async (username: string, pass: string): Promise<boolean> => {
    try {
      const res = await api.login(username, pass);
      if (res.success && res.token) {
        localStorage.setItem('jayshree_admin_token', res.token);
        setIsAdminAuthenticated(true);
        refreshData();
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  };

  const logoutAdmin = () => {
    localStorage.removeItem('jayshree_admin_token');
    setIsAdminAuthenticated(false);
  };

  const updateAdminCredentials = async (newUsername: string, newPass: string): Promise<boolean> => {
    try {
      const token = localStorage.getItem('jayshree_admin_token');
      if (!token) return false;
      const res = await fetch('/api/auth/update-credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ newUsername, newPassword: newPass }),
      });
      const data = await res.json();
      if (data.success) {
        setAdminCredentials({ username: newUsername, passwordHash: '***' });
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  };

  const addProject = async (projectData: Omit<PropertyItem, 'id'>) => {
    const res = await api.createProperty(projectData);
    if (res.success && res.property) {
      setProjects(prev => [res.property, ...prev]);
    }
  };

  const updateProject = async (id: string, updated: Partial<PropertyItem>) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updated } : p));
    await api.updateProperty(id, updated);
  };

  const deleteProject = async (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    await api.deleteProperty(id);
  };

  const toggleProjectFeatured = async (id: string) => {
    const p = projects.find(item => item.id === id);
    if (p) {
      const updated = { isFeatured: !p.isFeatured };
      setProjects(prev => prev.map(item => item.id === id ? { ...item, ...updated } : item));
      await api.updateProperty(id, updated);
    }
  };

  const toggleProjectPublished = async (id: string) => {
    const p = projects.find(item => item.id === id);
    if (p) {
      const updated = { published: !p.published };
      setProjects(prev => prev.map(item => item.id === id ? { ...item, ...updated } : item));
      await api.updateProperty(id, updated);
    }
  };

  const toggleProjectArchive = async (id: string) => {
    const p = projects.find(item => item.id === id);
    if (p) {
      const updated = { archived: !p.archived };
      setProjects(prev => prev.map(item => item.id === id ? { ...item, ...updated } : item));
      await api.updateProperty(id, updated);
    }
  };

  const addReview = async (reviewData: Omit<GoogleReviewItem, 'id'>) => {
    const res = await api.addReview(reviewData);
    if (res.success) {
      refreshData();
    }
  };

  const updateReview = async (id: string, updated: Partial<GoogleReviewItem>) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, ...updated } : r));
    await api.updateReview(id, updated);
  };

  const deleteReview = async (id: string) => {
    setReviews(prev => prev.filter(r => r.id !== id));
    await api.deleteReview(id);
  };

  const updateHeroSettings = async (settings: Partial<HeroSettings>) => {
    const newHero = { ...heroSettings, ...settings };
    setHeroSettings(newHero);
    await api.updateHeroSettings(newHero);
  };

  const updatePopupSettings = async (settings: Partial<PopupSettings>) => {
    const newPopup = { ...popupSettings, ...settings };
    setPopupSettings(newPopup);
    await api.updatePopupSettings(newPopup);
  };

  const updateSiteSettings = async (settings: Partial<SiteSettings>) => {
    const newSettings = { ...siteSettings, ...settings };
    setSiteSettings(newSettings);
    await api.updateSiteSettings(newSettings);
  };

  const addMediaItem = (url: string) => {
    if (!mediaLibrary.includes(url)) {
      setMediaLibrary(prev => [url, ...prev]);
    }
  };

  const deleteMediaItem = (url: string) => {
    setMediaLibrary(prev => prev.filter(item => item !== url));
  };

  const updateCounter = async (id: string, updated: Partial<CounterItem>) => {
    const newCounters = counters.map(c => c.id === id ? { ...c, ...updated } : c);
    setCounters(newCounters);
  };

  const saveAllCounters = async (updatedCounters: CounterItem[]) => {
    setCounters(updatedCounters);
    await api.updateCounters(updatedCounters);
  };

  const addCategory = async (category: ProjectCategory) => {
    if (!categories.includes(category)) {
      setCategories(prev => [...prev, category]);
      await api.addCategory(category);
    }
  };

  const updateCategory = async (oldName: string, newName: string) => {
    setCategories(prev => prev.map(c => c === oldName ? newName : c));
    setProjects(prev => prev.map(p => p.category === oldName ? { ...p, category: newName } : p));
    await api.updateCategory(oldName, newName);
  };

  const deleteCategory = async (category: ProjectCategory) => {
    setCategories(prev => prev.filter(c => c !== category));
    await api.deleteCategory(category);
  };

  const addLocation = async (loc: Omit<LocationNode, 'id'>) => {
    const res = await api.addLocation(loc);
    if (res.success) refreshData();
  };

  const updateLocation = async (id: string, updated: Partial<LocationNode>) => {
    setLocations(prev => prev.map(l => l.id === id ? { ...l, ...updated } : l));
    await api.updateLocation(id, updated);
  };

  const deleteLocation = async (id: string) => {
    setLocations(prev => prev.filter(l => l.id !== id));
    await api.deleteLocation(id);
  };

  const exportBackup = () => {
    const backupData = {
      projects,
      reviews,
      heroSettings,
      popupSettings,
      siteSettings,
      categories,
      counters,
      locations,
      mediaLibrary,
      timestamp: new Date().toISOString()
    };
    const jsonStr = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Jayshree_Realty_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importBackup = (jsonData: string): boolean => {
    try {
      const data = JSON.parse(jsonData);
      if (data.projects) setProjects(data.projects);
      if (data.reviews) setReviews(data.reviews);
      if (data.heroSettings) setHeroSettings(data.heroSettings);
      if (data.popupSettings) setPopupSettings(data.popupSettings);
      if (data.siteSettings) setSiteSettings(data.siteSettings);
      if (data.categories) setCategories(data.categories);
      if (data.counters) setCounters(data.counters);
      if (data.locations) setLocations(data.locations);
      if (data.mediaLibrary) setMediaLibrary(data.mediaLibrary);
      return true;
    } catch (e) {
      console.error("Backup import error", e);
      return false;
    }
  };

  return (
    <DataContext.Provider
      value={{
        projects,
        reviews,
        heroSettings,
        popupSettings,
        adminCredentials,
        siteSettings,
        categories,
        counters,
        locations,
        mediaLibrary,
        isAdminAuthenticated,
        loginAdmin,
        logoutAdmin,
        updateAdminCredentials,
        addProject,
        updateProject,
        deleteProject,
        toggleProjectFeatured,
        toggleProjectPublished,
        toggleProjectArchive,
        addReview,
        updateReview,
        deleteReview,
        updateHeroSettings,
        updatePopupSettings,
        updateSiteSettings,
        addMediaItem,
        deleteMediaItem,
        updateCounter,
        saveAllCounters,
        addCategory,
        updateCategory,
        deleteCategory,
        addLocation,
        updateLocation,
        deleteLocation,
        exportBackup,
        importBackup,
        refreshData
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
