import React, { createContext, useContext, useState, useEffect } from 'react';
import { PropertyItem, GoogleReviewItem } from '../types';
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
  isAdminAuthenticated: boolean;
  
  // Actions
  loginAdmin: (username: string, password: string) => boolean;
  logoutAdmin: () => void;
  updateAdminCredentials: (username: string, password: string) => void;
  
  addProject: (project: Omit<PropertyItem, 'id'>) => void;
  updateProject: (id: string, updated: Partial<PropertyItem>) => void;
  deleteProject: (id: string) => void;
  toggleProjectFeatured: (id: string) => void;
  
  addReview: (review: Omit<GoogleReviewItem, 'id'>) => void;
  updateReview: (id: string, updated: Partial<GoogleReviewItem>) => void;
  deleteReview: (id: string) => void;
  
  updateHeroSettings: (settings: Partial<HeroSettings>) => void;
  updatePopupSettings: (settings: Partial<PopupSettings>) => void;
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

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<PropertyItem[]>(() => {
    const saved = localStorage.getItem('jayshree_projects');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_PROJECTS;
  });

  const [reviews, setReviews] = useState<GoogleReviewItem[]>(() => {
    const saved = localStorage.getItem('jayshree_reviews');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_REVIEWS;
  });

  const [heroSettings, setHeroSettings] = useState<HeroSettings>(() => {
    const saved = localStorage.getItem('jayshree_hero');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_HERO_SETTINGS;
  });

  const [popupSettings, setPopupSettings] = useState<PopupSettings>(() => {
    const saved = localStorage.getItem('jayshree_popup');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_POPUP_SETTINGS;
  });

  const [adminCredentials, setAdminCredentials] = useState<AdminCredentials>(() => {
    const saved = localStorage.getItem('jayshree_admin_creds');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_ADMIN_CREDENTIALS;
  });

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('jayshree_admin_auth') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('jayshree_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('jayshree_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('jayshree_hero', JSON.stringify(heroSettings));
  }, [heroSettings]);

  useEffect(() => {
    localStorage.setItem('jayshree_popup', JSON.stringify(popupSettings));
  }, [popupSettings]);

  useEffect(() => {
    localStorage.setItem('jayshree_admin_creds', JSON.stringify(adminCredentials));
  }, [adminCredentials]);

  useEffect(() => {
    localStorage.setItem('jayshree_admin_auth', isAdminAuthenticated ? 'true' : 'false');
  }, [isAdminAuthenticated]);

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
      id: 'proj-' + Date.now()
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

  return (
    <DataContext.Provider
      value={{
        projects,
        reviews,
        heroSettings,
        popupSettings,
        adminCredentials,
        isAdminAuthenticated,
        loginAdmin,
        logoutAdmin,
        updateAdminCredentials,
        addProject,
        updateProject,
        deleteProject,
        toggleProjectFeatured,
        addReview,
        updateReview,
        deleteReview,
        updateHeroSettings,
        updatePopupSettings
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
