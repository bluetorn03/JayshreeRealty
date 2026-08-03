import { api } from './api';

function getVisitorId(): string {
  let vId = localStorage.getItem('jayshree_visitor_id');
  if (!vId) {
    vId = 'vis-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9);
    localStorage.setItem('jayshree_visitor_id', vId);
  }
  return vId;
}

function getSessionId(): string {
  let sId = sessionStorage.getItem('jayshree_session_id');
  if (!sId) {
    sId = 'sess-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9);
    sessionStorage.setItem('jayshree_session_id', sId);
  }
  return sId;
}

function getDeviceType(): string {
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'Tablet';
  }
  if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return 'Mobile';
  }
  return 'Desktop';
}

function getBrowser(): string {
  const ua = navigator.userAgent;
  if (ua.includes('Chrome') && !ua.includes('Edg')) return 'Chrome';
  if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
  if (ua.includes('Edg')) return 'Edge';
  if (ua.includes('Firefox')) return 'Firefox';
  return 'Browser';
}

function getOS(): string {
  const ua = navigator.userAgent;
  if (ua.includes('Win')) return 'Windows';
  if (ua.includes('Mac')) return 'macOS';
  if (ua.includes('Linux')) return 'Linux';
  if (ua.includes('Android')) return 'Android';
  if (ua.includes('iPhone') || ua.includes('iPad')) return 'iOS';
  return 'OS';
}

export const analyticsTracker = {
  trackPageView(pagePath: string, pageTitle: string) {
    const visitorId = getVisitorId();
    const sessionId = getSessionId();

    api.trackEvent({
      visitorId,
      sessionId,
      eventType: 'page_view',
      pagePath,
      pageTitle,
      referrer: document.referrer || 'Direct',
      deviceType: getDeviceType(),
      browser: getBrowser(),
      os: getOS()
    });
  },

  trackCTAClick(ctaName: string, pageName: string) {
    const visitorId = getVisitorId();
    const sessionId = getSessionId();

    api.trackEvent({
      visitorId,
      sessionId,
      eventType: ctaName.toLowerCase().includes('whatsapp') ? 'whatsapp_click' : 'call_click',
      pagePath: window.location.pathname,
      pageTitle: document.title,
      referrer: ctaName,
      deviceType: getDeviceType(),
      browser: getBrowser(),
      os: getOS()
    });
  },

  trackPropertyView(propertyId: string, propertyTitle: string) {
    const visitorId = getVisitorId();
    const sessionId = getSessionId();

    api.trackEvent({
      visitorId,
      sessionId,
      eventType: 'property_view',
      pagePath: `/property/${propertyId}`,
      pageTitle: propertyTitle,
      propertyId,
      referrer: document.referrer || 'Direct',
      deviceType: getDeviceType(),
      browser: getBrowser(),
      os: getOS()
    });
  }
};
