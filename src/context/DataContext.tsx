import React, { createContext, useContext, useState, useEffect } from 'react';
import { PropertyItem, GoogleReviewItem, SiteSettings, CounterItem, LocationNode, ProjectCategory } from '../types';
import { PROJECTS_DATA as INITIAL_PROJECTS } from '../data/projectsData';
import { GOOGLE_REVIEWS_DATA as INITIAL_REVIEWS } from '../data/reviewsData';

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
  loginAdmin: (username: string, password: string) => boolean;
  logoutAdmin: () => void;
  updateAdminCredentials: (username: string, password: string) => void;
  
  addProject: (project: Omit<PropertyItem, 'id'>) => void;
  updateProject: (id: string, updated: Partial<PropertyItem>) => void;
  deleteProject: (id: string) => void;
  toggleProjectFeatured: (id: string) => void;
  toggleProjectPublished: (id: string) => void;
  toggleProjectArchive: (id: string) => void;
  
  addReview: (review: Omit<GoogleReviewItem, 'id'>) => void;
  updateReview: (id: string, updated: Partial<GoogleReviewItem>) => void;
  deleteReview: (id: string) => void;
  
  updateHeroSettings: (settings: Partial<HeroSettings>) => void;
  updatePopupSettings: (settings: Partial<PopupSettings>) => void;
  updateSiteSettings: (settings: Partial<SiteSettings>) => void;
  
  addMediaItem: (url: string) => void;
  deleteMediaItem: (url: string) => void;
  
  updateCounter: (id: string, updated: Partial<CounterItem>) => void;
  addCategory: (category: ProjectCategory) => void;

  exportBackup: () => void;
  importBackup: (jsonData: string) => boolean;
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
  privacyText: "We respect your privacy. No spam, ever."
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
  { id: 'cnt-1', label: 'Happy Families', value: 450, suffix: '+' },
  { id: 'cnt-2', label: 'Projects Delivered', value: 85, suffix: '+' },
  { id: 'cnt-3', label: 'Years Experience', value: 12, suffix: '+' },
  { id: 'cnt-4', label: 'Sq.Ft. Managed', value: 2, suffix: 'M+' },
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
  const [projects, setProjects] = useState<PropertyItem[]>(() => {
    const saved = localStorage.getItem('jayshree_projects');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    // Set default published and placements for initial projects
    return INITIAL_PROJECTS.map(p => ({
      ...p,
      published: p.published !== undefined ? p.published : true,
      brokerageFree: p.brokerageFree || false,
      placements: p.placements || (p.isFeatured ? ['homepage', 'featured', 'buy'] : ['buy'])
    }));
  });

  const [reviews, setReviews] = useState<GoogleReviewItem[]>(() => {
    const saved = localStorage.getItem('jayshree_reviews');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_REVIEWS;
  });

  const [heroSettings, setHeroSettings] = useState<HeroSettings>(() => {
    const saved = localStorage.getItem('jayshree_hero');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return DEFAULT_HERO_SETTINGS;
  });

  const [popupSettings, setPopupSettings] = useState<PopupSettings>(() => {
    const saved = localStorage.getItem('jayshree_popup');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return DEFAULT_POPUP_SETTINGS;
  });

  const [adminCredentials, setAdminCredentials] = useState<AdminCredentials>(() => {
    const saved = localStorage.getItem('jayshree_admin_creds');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return DEFAULT_ADMIN_CREDENTIALS;
  });

  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    const saved = localStorage.getItem('jayshree_site_settings');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return DEFAULT_SITE_SETTINGS;
  });

  const [categories, setCategories] = useState<ProjectCategory[]>(() => {
    const saved = localStorage.getItem('jayshree_categories');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_CATEGORIES;
  });

  const [counters, setCounters] = useState<CounterItem[]>(() => {
    const saved = localStorage.getItem('jayshree_counters');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return DEFAULT_COUNTERS;
  });

  const [locations, setLocations] = useState<LocationNode[]>(() => {
    const saved = localStorage.getItem('jayshree_locations');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return DEFAULT_LOCATIONS;
  });

  const [mediaLibrary, setMediaLibrary] = useState<string[]>(() => {
    const saved = localStorage.getItem('jayshree_media_library');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&q=80&w=1000"
    ];
  });

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('jayshree_admin_auth') === 'true';
  });

  useEffect(() => { localStorage.setItem('jayshree_projects', JSON.stringify(projects)); }, [projects]);
  useEffect(() => { localStorage.setItem('jayshree_reviews', JSON.stringify(reviews)); }, [reviews]);
  useEffect(() => { localStorage.setItem('jayshree_hero', JSON.stringify(heroSettings)); }, [heroSettings]);
  useEffect(() => { localStorage.setItem('jayshree_popup', JSON.stringify(popupSettings)); }, [popupSettings]);
  useEffect(() => { localStorage.setItem('jayshree_admin_creds', JSON.stringify(adminCredentials)); }, [adminCredentials]);
  useEffect(() => { localStorage.setItem('jayshree_site_settings', JSON.stringify(siteSettings)); }, [siteSettings]);
  useEffect(() => { localStorage.setItem('jayshree_categories', JSON.stringify(categories)); }, [categories]);
  useEffect(() => { localStorage.setItem('jayshree_counters', JSON.stringify(counters)); }, [counters]);
  useEffect(() => { localStorage.setItem('jayshree_locations', JSON.stringify(locations)); }, [locations]);
  useEffect(() => { localStorage.setItem('jayshree_media_library', JSON.stringify(mediaLibrary)); }, [mediaLibrary]);
  useEffect(() => { localStorage.setItem('jayshree_admin_auth', isAdminAuthenticated ? 'true' : 'false'); }, [isAdminAuthenticated]);

  const loginAdmin = (username: string, pass: string): boolean => {
    if (
      username.trim().toLowerCase() === adminCredentials.username.toLowerCase() &&
      pass.trim() === adminCredentials.passwordHash
    ) {
      setIsAdminAuthenticated(true);
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
  };

  const updateAdminCredentials = (newUsername: string, newPass: string) => {
    setAdminCredentials({
      username: newUsername.trim(),
      passwordHash: newPass.trim()
    });
  };

  const addProject = (projectData: Omit<PropertyItem, 'id'>) => {
    const newProject: PropertyItem = {
      ...projectData,
      id: 'proj-' + Date.now(),
      published: projectData.published !== undefined ? projectData.published : true,
      placements: projectData.placements || ['homepage', 'featured', 'buy']
    };
    setProjects(prev => [newProject, ...prev]);
  };

  const updateProject = (id: string, updated: Partial<PropertyItem>) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updated } : p));
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  const toggleProjectFeatured = (id: string) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, isFeatured: !p.isFeatured } : p));
  };

  const toggleProjectPublished = (id: string) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, published: !p.published } : p));
  };

  const toggleProjectArchive = (id: string) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, archived: !p.archived } : p));
  };

  const addReview = (reviewData: Omit<GoogleReviewItem, 'id'>) => {
    const newReview: GoogleReviewItem = {
      ...reviewData,
      id: 'rev-' + Date.now()
    };
    setReviews(prev => [newReview, ...prev]);
  };

  const updateReview = (id: string, updated: Partial<GoogleReviewItem>) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, ...updated } : r));
  };

  const deleteReview = (id: string) => {
    setReviews(prev => prev.filter(r => r.id !== id));
  };

  const updateHeroSettings = (settings: Partial<HeroSettings>) => {
    setHeroSettings(prev => ({ ...prev, ...settings }));
  };

  const updatePopupSettings = (settings: Partial<PopupSettings>) => {
    setPopupSettings(prev => ({ ...prev, ...settings }));
  };

  const updateSiteSettings = (settings: Partial<SiteSettings>) => {
    setSiteSettings(prev => ({ ...prev, ...settings }));
  };

  const addMediaItem = (url: string) => {
    if (!mediaLibrary.includes(url)) {
      setMediaLibrary(prev => [url, ...prev]);
    }
  };

  const deleteMediaItem = (url: string) => {
    setMediaLibrary(prev => prev.filter(item => item !== url));
  };

  const updateCounter = (id: string, updated: Partial<CounterItem>) => {
    setCounters(prev => prev.map(c => c.id === id ? { ...c, ...updated } : c));
  };

  const addCategory = (category: ProjectCategory) => {
    if (!categories.includes(category)) {
      setCategories(prev => [...prev, category]);
    }
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
        addCategory,
        exportBackup,
        importBackup
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
