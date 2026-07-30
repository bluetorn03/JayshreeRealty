/**
 * Lead Attribution Utility for tracking form sources, device info,
 * traffic sources, and UTM parameters across all lead entry points.
 */

export interface LeadAttribution {
  page_source: string;
  device_info: string;
  traffic_source: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_term: string;
  utm_content: string;
  timestamp: string;
}

export function getDeviceInfo(): string {
  if (typeof window === 'undefined' || !navigator) return 'Unknown Device';
  
  const ua = navigator.userAgent;
  let deviceType = 'Desktop';
  
  if (/mobile/i.test(ua)) {
    deviceType = 'Mobile';
  } else if (/tablet|ipad|playbook|silk/i.test(ua)) {
    deviceType = 'Tablet';
  }

  let os = 'Unknown OS';
  if (/windows/i.test(ua)) os = 'Windows';
  else if (/macintosh|mac os x/i.test(ua)) os = 'macOS';
  else if (/android/i.test(ua)) os = 'Android';
  else if (/iphone|ipad|ipod/i.test(ua)) os = 'iOS';
  else if (/linux/i.test(ua)) os = 'Linux';

  return `${deviceType} (${os})`;
}

export function getLeadAttribution(): LeadAttribution {
  let page_source = '/';
  let traffic_source = 'Direct';
  let utm_source = '';
  let utm_medium = '';
  let utm_campaign = '';
  let utm_term = '';
  let utm_content = '';

  if (typeof window !== 'undefined') {
    page_source = window.location.pathname + window.location.search;
    
    // Traffic Source / Referrer
    if (document.referrer) {
      try {
        const refUrl = new URL(document.referrer);
        if (refUrl.hostname !== window.location.hostname) {
          traffic_source = refUrl.hostname;
        } else {
          traffic_source = 'Internal Navigation';
        }
      } catch (e) {
        traffic_source = document.referrer;
      }
    }

    // UTM parameters parsing
    const urlParams = new URLSearchParams(window.location.search);
    utm_source = urlParams.get('utm_source') || '';
    utm_medium = urlParams.get('utm_medium') || '';
    utm_campaign = urlParams.get('utm_campaign') || '';
    utm_term = urlParams.get('utm_term') || '';
    utm_content = urlParams.get('utm_content') || '';
  }

  const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

  return {
    page_source,
    device_info: getDeviceInfo(),
    traffic_source,
    utm_source,
    utm_medium,
    utm_campaign,
    utm_term,
    utm_content,
    timestamp
  };
}
