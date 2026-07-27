import React, { useEffect } from 'react';

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  canonicalPath?: string;
  image?: string;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  keywords,
  canonicalPath = '/',
  image = 'https://jayshreerealty.com/assets/jayshree-realty-logo.png'
}) => {
  useEffect(() => {
    // Set Page Title
    const pageTitle = title.includes('Jayshree Realty') ? title : `${title} | Jayshree Realty`;
    document.title = pageTitle;

    // Helper function to update or create meta tags
    const updateMetaTag = (selector: string, attrName: string, attrVal: string, content: string) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrVal);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Helper function to update link tags
    const updateLinkTag = (rel: string, href: string) => {
      let link = document.querySelector(`link[rel="${rel}"]`);
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', rel);
        document.head.appendChild(link);
      }
      link.setAttribute('href', href);
    };

    // Standard Meta
    updateMetaTag('meta[name="description"]', 'name', 'description', description);
    if (keywords) {
      updateMetaTag('meta[name="keywords"]', 'name', 'keywords', keywords);
    }

    const fullCanonicalUrl = `https://jayshreerealty.com${canonicalPath === '/' ? '' : canonicalPath}`;
    updateLinkTag('canonical', fullCanonicalUrl);

    // OpenGraph Meta Tags
    updateMetaTag('meta[property="og:title"]', 'property', 'og:title', pageTitle);
    updateMetaTag('meta[property="og:description"]', 'property', 'og:description', description);
    updateMetaTag('meta[property="og:url"]', 'property', 'og:url', fullCanonicalUrl);
    updateMetaTag('meta[property="og:image"]', 'property', 'og:image', image);
    updateMetaTag('meta[property="og:type"]', 'property', 'og:type', 'website');
    updateMetaTag('meta[property="og:site_name"]', 'property', 'og:site_name', 'Jayshree Realty');

    // Twitter Card Tags
    updateMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    updateMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', pageTitle);
    updateMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    updateMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', image);

    // Schema.org JSON-LD Insertion
    const schemaData = {
      "@context": "https://schema.org",
      "@type": "RealEstateAgent",
      "name": "Jayshree Realty",
      "image": image,
      "@id": "https://jayshreerealty.com",
      "url": "https://jayshreerealty.com",
      "telephone": "+918169005579",
      "priceRange": "₹40 Lakhs - ₹5 Cr+",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Sector 19, Nerul West",
        "addressLocality": "Navi Mumbai",
        "addressRegion": "MH",
        "postalCode": "400706",
        "addressCountry": "IN"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 19.0416,
        "longitude": 73.0125
      },
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
        ],
        "opens": "09:00",
        "closes": "21:00"
      },
      "sameAs": [
        "https://facebook.com/jayshreerealty",
        "https://instagram.com/jayshreerealty"
      ]
    };

    let scriptTag = document.getElementById('jsonld-schema') as HTMLScriptElement;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'jsonld-schema';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.text = JSON.stringify(schemaData);

    window.scrollTo(0, 0);
  }, [title, description, keywords, canonicalPath, image]);

  return null;
};
