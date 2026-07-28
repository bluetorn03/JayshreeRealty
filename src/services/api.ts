// API Service for Jayshree Realty Enterprise Backend

const API_BASE = '/api';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('jayshree_admin_token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export const api = {
  // Auth API
  async login(username: string, password: string) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    return res.json();
  },

  async verifyAuth() {
    const token = localStorage.getItem('jayshree_admin_token');
    if (!token) return { success: false };
    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: getAuthHeaders(),
      });
      return res.json();
    } catch (e) {
      return { success: false };
    }
  },

  // Properties API
  async getProperties() {
    const res = await fetch(`${API_BASE}/properties`);
    return res.json();
  },

  async createProperty(propertyData: any) {
    const res = await fetch(`${API_BASE}/properties`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(propertyData),
    });
    return res.json();
  },

  async updateProperty(id: string, propertyData: any) {
    const res = await fetch(`${API_BASE}/properties/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(propertyData),
    });
    return res.json();
  },

  async deleteProperty(id: string) {
    const res = await fetch(`${API_BASE}/properties/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  // Leads API
  async getLeads() {
    const res = await fetch(`${API_BASE}/leads`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  async submitLead(leadData: any) {
    const res = await fetch(`${API_BASE}/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(leadData),
    });
    return res.json();
  },

  async createLeadManual(leadData: any) {
    const res = await fetch(`${API_BASE}/leads/admin-create`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(leadData),
    });
    return res.json();
  },

  async updateLead(id: string, leadData: any) {
    const res = await fetch(`${API_BASE}/leads/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(leadData),
    });
    return res.json();
  },

  async deleteLead(id: string) {
    const res = await fetch(`${API_BASE}/leads/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  async bulkDeleteLeads(ids: string[]) {
    const res = await fetch(`${API_BASE}/leads/bulk-delete`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ ids }),
    });
    return res.json();
  },

  async bulkStatusLeads(ids: string[], status: string) {
    const res = await fetch(`${API_BASE}/leads/bulk-status`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ ids, status }),
    });
    return res.json();
  },

  async getLeadHistory(id: string) {
    const res = await fetch(`${API_BASE}/leads/${id}/history`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  // CMS API
  async getAllCMS() {
    const res = await fetch(`${API_BASE}/cms/all`);
    return res.json();
  },

  async updateHeroSettings(heroData: any) {
    const res = await fetch(`${API_BASE}/cms/hero`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(heroData),
    });
    return res.json();
  },

  async updatePopupSettings(popupData: any) {
    const res = await fetch(`${API_BASE}/cms/popup`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(popupData),
    });
    return res.json();
  },

  async updateCounters(counters: any[]) {
    const res = await fetch(`${API_BASE}/cms/counters`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ counters }),
    });
    return res.json();
  },

  async addCategory(name: string) {
    const res = await fetch(`${API_BASE}/cms/categories`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ name }),
    });
    return res.json();
  },

  async updateCategory(oldName: string, newName: string) {
    const res = await fetch(`${API_BASE}/cms/categories/edit`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ oldName, newName }),
    });
    return res.json();
  },

  async deleteCategory(name: string) {
    const res = await fetch(`${API_BASE}/cms/categories/${encodeURIComponent(name)}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  async addReview(reviewData: any) {
    const res = await fetch(`${API_BASE}/cms/reviews`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(reviewData),
    });
    return res.json();
  },

  async updateReview(id: string, reviewData: any) {
    const res = await fetch(`${API_BASE}/cms/reviews/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(reviewData),
    });
    return res.json();
  },

  async deleteReview(id: string) {
    const res = await fetch(`${API_BASE}/cms/reviews/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  async addLocation(locationData: any) {
    const res = await fetch(`${API_BASE}/cms/locations`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(locationData),
    });
    return res.json();
  },

  async updateLocation(id: string, locationData: any) {
    const res = await fetch(`${API_BASE}/cms/locations/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(locationData),
    });
    return res.json();
  },

  async deleteLocation(id: string) {
    const res = await fetch(`${API_BASE}/cms/locations/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return res.json();
  },

  // File Upload API
  async uploadFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('jayshree_admin_token');
    const res = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });
    return res.json();
  },

  // Analytics API
  async trackEvent(eventData: any) {
    try {
      const res = await fetch(`${API_BASE}/analytics/event`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData),
      });
      return res.json();
    } catch (e) {
      return { success: false };
    }
  },

  async getAnalyticsDashboard(timeframe: string = '30d') {
    const res = await fetch(`${API_BASE}/analytics/dashboard?timeframe=${timeframe}`, {
      headers: getAuthHeaders(),
    });
    return res.json();
  }
};
