import express from 'express';
import { supabase } from '../db/supabase.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/cms/all (Public - loads initial CMS settings for website frontend)
router.get('/all', async (req, res) => {
  try {
    const { data: heroRows } = await supabase.from('hero_settings').select('*').eq('id', 1);
    const { data: popupRows } = await supabase.from('popup_settings').select('*').eq('id', 1);
    const { data: siteRows } = await supabase.from('site_settings').select('*').eq('id', 1);
    const { data: counterRows } = await supabase.from('counters').select('*').order('sort_order', { ascending: true });
    const { data: locationRows } = await supabase.from('location_nodes').select('*').order('sort_order', { ascending: true });
    const { data: categoryRows } = await supabase.from('categories').select('*').order('sort_order', { ascending: true });
    const { data: reviewRows } = await supabase.from('reviews').select('*').order('sort_order', { ascending: true });

    const heroRow = heroRows && heroRows.length > 0 ? heroRows[0] : null;
    const popupRow = popupRows && popupRows.length > 0 ? popupRows[0] : null;
    const siteRow = siteRows && siteRows.length > 0 ? siteRows[0] : null;

    return res.json({
      success: true,
      heroSettings: heroRow ? {
        headingPart1: heroRow.heading_part1,
        headingGold: heroRow.heading_gold,
        subtext: heroRow.subtext,
        keywords: heroRow.keywords_json ? (typeof heroRow.keywords_json === 'string' ? JSON.parse(heroRow.keywords_json) : heroRow.keywords_json) : [],
        backgroundImage: heroRow.background_image
      } : null,
      popupSettings: popupRow ? {
        title: popupRow.title,
        subtitle: popupRow.subtitle,
        badge: popupRow.badge,
        leftImage: popupRow.left_image,
        privacyText: popupRow.privacy_text,
        enabled: Boolean(popupRow.enabled),
        triggerDelay: popupRow.trigger_delay,
        scrollTriggerPercent: popupRow.scroll_trigger_percent,
        redirectUrl: popupRow.redirect_url,
        successMessage: popupRow.success_message
      } : null,
      siteSettings: siteRow ? {
        companyName: siteRow.company_name,
        phone: siteRow.phone,
        phoneRaw: siteRow.phone_raw,
        email: siteRow.email,
        whatsapp: siteRow.whatsapp,
        whatsappRaw: siteRow.whatsapp_raw,
        address: siteRow.address,
        googleMapsEmbedUrl: siteRow.google_maps_embed_url,
        logoUrl: siteRow.logo_url,
        faviconUrl: siteRow.favicon_url,
        facebookUrl: siteRow.facebook_url,
        instagramUrl: siteRow.instagram_url,
        linkedinUrl: siteRow.linkedin_url,
        youtubeUrl: siteRow.youtube_url,
        seoTitleDefault: siteRow.seo_title_default,
        seoDescriptionDefault: siteRow.seo_description_default,
        seoKeywordsDefault: siteRow.seo_keywords_default,
        gaMeasurementId: siteRow.ga_measurement_id,
        gtmContainerId: siteRow.gtm_container_id,
        gscVerificationMeta: siteRow.gsc_verification_meta,
        robotsTxtContent: siteRow.robots_txt_content,
        sitemapAutoGenerate: Boolean(siteRow.sitemap_auto_generate),
        smtpHost: siteRow.smtp_host,
        smtpPort: siteRow.smtp_port,
        smtpUser: siteRow.smtp_user,
        smtpFromEmail: siteRow.smtp_from_email,
        maintenanceMode: Boolean(siteRow.maintenance_mode),
        maintenanceMessage: siteRow.maintenance_message
      } : null,
      counters: (counterRows || []).map(c => ({
        id: c.id,
        label: c.label,
        value: c.value,
        suffix: c.suffix,
        iconName: c.icon_name
      })),
      locations: (locationRows || []).map(l => ({
        id: l.id,
        name: l.name,
        description: l.description,
        activeCount: l.active_count
      })),
      categories: (categoryRows || []).map(c => c.name),
      reviews: (reviewRows || []).map(r => ({
        id: r.id,
        author: r.author,
        rating: r.rating,
        timeAgo: r.time_ago,
        content: r.content,
        avatarColor: r.avatar_color,
        verified: Boolean(r.verified),
        reviewsCount: r.reviews_count,
        isLocalGuide: Boolean(r.is_local_guide),
        published: Boolean(r.published)
      }))
    });
  } catch (error) {
    console.error('Error fetching CMS data:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch CMS settings' });
  }
});

// PUT /api/cms/hero (Protected Admin)
router.put('/hero', authenticateToken, async (req, res) => {
  try {
    const { headingPart1, headingGold, subtext, keywords, backgroundImage } = req.body;
    const heroRecord = {
      id: 1,
      heading_part1: headingPart1,
      heading_gold: headingGold,
      subtext: subtext,
      keywords_json: JSON.stringify(keywords || []),
      background_image: backgroundImage
    };

    const { error } = await supabase.from('hero_settings').upsert(heroRecord);
    if (error) throw error;

    return res.json({ success: true, message: 'Hero settings updated successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update hero settings' });
  }
});

// PUT /api/cms/popup (Protected Admin)
router.put('/popup', authenticateToken, async (req, res) => {
  try {
    const p = req.body;
    const popupRecord = {
      id: 1,
      title: p.title,
      subtitle: p.subtitle,
      badge: p.badge,
      left_image: p.leftImage,
      privacy_text: p.privacyText,
      enabled: p.enabled ? 1 : 0,
      trigger_delay: p.triggerDelay || 3,
      scroll_trigger_percent: p.scrollTriggerPercent || 25,
      redirect_url: p.redirectUrl || '',
      success_message: p.successMessage || 'Thank you! Our luxury real estate expert will contact you shortly.'
    };

    const { error } = await supabase.from('popup_settings').upsert(popupRecord);
    if (error) throw error;

    return res.json({ success: true, message: 'Popup settings updated successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update popup settings' });
  }
});

// PUT /api/cms/site-settings (Protected Admin)
router.put('/site-settings', authenticateToken, async (req, res) => {
  try {
    const s = req.body;
    const siteRecord = {
      id: 1,
      company_name: s.companyName,
      phone: s.phone,
      phone_raw: s.phoneRaw,
      email: s.email,
      whatsapp: s.whatsapp,
      whatsapp_raw: s.whatsappRaw,
      address: s.address,
      google_maps_embed_url: s.googleMapsEmbedUrl,
      logo_url: s.logoUrl,
      favicon_url: s.faviconUrl,
      facebook_url: s.facebookUrl,
      instagram_url: s.instagramUrl,
      linkedin_url: s.linkedinUrl,
      youtube_url: s.youtubeUrl,
      seo_title_default: s.seoTitleDefault,
      seo_description_default: s.seoDescriptionDefault,
      seo_keywords_default: s.seoKeywordsDefault,
      ga_measurement_id: s.gaMeasurementId,
      gtm_container_id: s.gtmContainerId,
      gsc_verification_meta: s.gscVerificationMeta,
      robots_txt_content: s.robotsTxtContent,
      sitemap_auto_generate: s.sitemapAutoGenerate ? 1 : 0,
      smtp_host: s.smtpHost,
      smtp_port: s.smtpPort,
      smtp_user: s.smtpUser,
      smtp_from_email: s.smtpFromEmail,
      maintenance_mode: s.maintenanceMode ? 1 : 0,
      maintenance_message: s.maintenanceMessage
    };

    const { error } = await supabase.from('site_settings').upsert(siteRecord);
    if (error) throw error;

    return res.json({ success: true, message: 'Site settings updated successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update site settings' });
  }
});

// PUT /api/cms/counters (Protected Admin)
router.put('/counters', authenticateToken, async (req, res) => {
  try {
    const { counters } = req.body;
    if (!Array.isArray(counters)) return res.status(400).json({ success: false, message: 'Counters array required' });

    for (let index = 0; index < counters.length; index++) {
      const c = counters[index];
      await supabase.from('counters').upsert({
        id: c.id,
        label: c.label,
        value: c.value,
        suffix: c.suffix || '',
        icon_name: c.iconName || 'Building2',
        sort_order: index
      });
    }

    return res.json({ success: true, message: 'Counters updated successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update counters' });
  }
});

// POST /api/cms/categories (Protected Admin)
router.post('/categories', authenticateToken, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Category name required' });

    const id = `cat-${Date.now()}`;
    await supabase.from('categories').insert([{ id, name: name.trim(), sort_order: 0 }]);
    return res.json({ success: true, message: 'Category added successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Category already exists or error' });
  }
});

// PUT /api/cms/categories/edit (Protected Admin)
router.put('/categories/edit', authenticateToken, async (req, res) => {
  try {
    const { oldName, newName } = req.body;
    await supabase.from('categories').update({ name: newName.trim() }).eq('name', oldName);
    return res.json({ success: true, message: 'Category updated successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update category' });
  }
});

// DELETE /api/cms/categories/:name (Protected Admin)
router.delete('/categories/:name', authenticateToken, async (req, res) => {
  try {
    const name = decodeURIComponent(req.params.name);
    await supabase.from('categories').delete().eq('name', name);
    return res.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete category' });
  }
});

// POST /api/cms/reviews (Protected Admin)
router.post('/reviews', authenticateToken, async (req, res) => {
  try {
    const r = req.body;
    const id = `rev-${Date.now()}`;
    const newReview = {
      id,
      author: r.author,
      rating: r.rating || 5,
      time_ago: r.timeAgo || 'Recently',
      content: r.content,
      avatar_color: r.avatarColor || 'bg-amber-500',
      verified: r.verified ? 1 : 0,
      reviews_count: r.reviewsCount || '1 review',
      is_local_guide: r.isLocalGuide ? 1 : 0,
      published: r.published !== undefined ? (r.published ? 1 : 0) : 1,
      sort_order: 0
    };

    await supabase.from('reviews').insert([newReview]);
    return res.json({ success: true, review: { ...r, id }, message: 'Review created successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to add review' });
  }
});

// PUT /api/cms/reviews/:id (Protected Admin)
router.put('/reviews/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const r = req.body;
    const updates = {};

    if (r.author !== undefined) updates.author = r.author;
    if (r.rating !== undefined) updates.rating = r.rating;
    if (r.timeAgo !== undefined) updates.time_ago = r.timeAgo;
    if (r.content !== undefined) updates.content = r.content;
    if (r.avatarColor !== undefined) updates.avatar_color = r.avatarColor;
    if (r.verified !== undefined) updates.verified = r.verified ? 1 : 0;
    if (r.reviewsCount !== undefined) updates.reviews_count = r.reviewsCount;
    if (r.isLocalGuide !== undefined) updates.is_local_guide = r.isLocalGuide ? 1 : 0;
    if (r.published !== undefined) updates.published = r.published ? 1 : 0;

    await supabase.from('reviews').update(updates).eq('id', id);
    return res.json({ success: true, message: 'Review updated successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update review' });
  }
});

// DELETE /api/cms/reviews/:id (Protected Admin)
router.delete('/reviews/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await supabase.from('reviews').delete().eq('id', id);
    return res.json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete review' });
  }
});

// POST /api/cms/locations (Protected Admin)
router.post('/locations', authenticateToken, async (req, res) => {
  try {
    const l = req.body;
    const id = `loc-${Date.now()}`;
    await supabase.from('location_nodes').insert([{
      id,
      name: l.name,
      description: l.description || '',
      active_count: l.activeCount || 0,
      sort_order: 0
    }]);
    return res.json({ success: true, location: { ...l, id }, message: 'Location added successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to add location' });
  }
});

// PUT /api/cms/locations/:id (Protected Admin)
router.put('/locations/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const l = req.body;
    const updates = {};
    if (l.name !== undefined) updates.name = l.name;
    if (l.description !== undefined) updates.description = l.description;
    if (l.activeCount !== undefined) updates.active_count = l.activeCount;

    await supabase.from('location_nodes').update(updates).eq('id', id);
    return res.json({ success: true, message: 'Location updated successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update location' });
  }
});

// DELETE /api/cms/locations/:id (Protected Admin)
router.delete('/locations/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await supabase.from('location_nodes').delete().eq('id', id);
    return res.json({ success: true, message: 'Location deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete location' });
  }
});

// GET /api/cms/leadership (Public)
router.get('/leadership', async (req, res) => {
  try {
    const { data } = await supabase.from('leadership_profiles').select('*');
    const mapped = (data || []).map(p => ({
      id: p.id,
      role: p.role,
      name: p.name,
      designation: p.designation,
      image: p.image,
      description: p.description,
      achievements: p.achievements,
      officeLocation: p.office_location,
      experience: p.experience,
      badges: p.badges_json ? (typeof p.badges_json === 'string' ? JSON.parse(p.badges_json) : p.badges_json) : []
    }));
    return res.json({ success: true, leadership: mapped });
  } catch (error) {
    return res.json({ success: true, leadership: [] });
  }
});

// POST /api/cms/leadership (Protected Admin - Create New Profile)
router.post('/leadership', authenticateToken, async (req, res) => {
  try {
    const p = req.body;
    const id = p.id || `lead-${Date.now()}`;
    const record = {
      id,
      role: p.role || 'Founder',
      name: p.name,
      designation: p.designation,
      image: p.image || '',
      description: p.description || '',
      achievements: p.achievements || '',
      office_location: p.officeLocation || '',
      experience: p.experience || '',
      badges_json: JSON.stringify(p.badges || [])
    };
    await supabase.from('leadership_profiles').insert([record]);
    return res.json({ success: true, profile: { ...p, id }, message: 'Leadership profile created' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to create leadership profile' });
  }
});

// PUT /api/cms/leadership/:id (Protected Admin)
router.put('/leadership/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const p = req.body;
    const record = {
      id,
      role: p.role,
      name: p.name,
      designation: p.designation,
      image: p.image,
      description: p.description,
      achievements: p.achievements,
      office_location: p.officeLocation,
      experience: p.experience,
      badges_json: JSON.stringify(p.badges || [])
    };
    await supabase.from('leadership_profiles').upsert([record]);
    return res.json({ success: true, message: 'Leadership profile updated successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update leadership profile' });
  }
});

// DELETE /api/cms/leadership/:id (Protected Admin)
router.delete('/leadership/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await supabase.from('leadership_profiles').delete().eq('id', id);
    return res.json({ success: true, message: 'Leadership profile deleted' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete leadership profile' });
  }
});

function formatYouTubeUrl(url) {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (!trimmed) return '';

  if (trimmed.includes('/shorts/')) {
    const videoId = trimmed.split('/shorts/')[1]?.split(/[?&#]/)[0];
    if (videoId) return `https://www.youtube.com/embed/${videoId}`;
  }
  if (trimmed.includes('/embed/')) {
    const videoId = trimmed.split('/embed/')[1]?.split(/[?&#]/)[0];
    if (videoId) return `https://www.youtube.com/embed/${videoId}`;
  }
  if (trimmed.includes('watch?v=')) {
    const videoId = trimmed.split('watch?v=')[1]?.split(/[?&#]/)[0];
    if (videoId) return `https://www.youtube.com/embed/${videoId}`;
  }
  if (trimmed.includes('youtu.be/')) {
    const videoId = trimmed.split('youtu.be/')[1]?.split(/[?&#]/)[0];
    if (videoId) return `https://www.youtube.com/embed/${videoId}`;
  }
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return `https://www.youtube.com/embed/${trimmed}`;
  }
  return trimmed;
}

// GET /api/cms/video-testimonials (Public)
router.get('/video-testimonials', async (req, res) => {
  try {
    const { data } = await supabase.from('video_testimonials').select('*').order('sort_order', { ascending: true });
    const formatted = (data || []).map(v => ({
      ...v,
      youtube_url: formatYouTubeUrl(v.youtube_url)
    }));
    return res.json({ success: true, videos: formatted });
  } catch (error) {
    return res.json({ success: true, videos: [] });
  }
});

// POST /api/cms/video-testimonials (Protected Admin)
router.post('/video-testimonials', authenticateToken, async (req, res) => {
  try {
    const v = req.body;
    const id = v.id || `vvid-${Date.now()}`;
    const record = {
      id,
      client_name: v.clientName,
      location: v.location,
      title: v.title,
      youtube_url: formatYouTubeUrl(v.youtubeUrl),
      thumbnail: v.thumbnail,
      sort_order: v.sortOrder || 0
    };
    await supabase.from('video_testimonials').upsert([record]);
    return res.json({ success: true, video: { ...v, id, youtubeUrl: record.youtube_url }, message: 'Video testimonial saved' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to save video testimonial' });
  }
});

// DELETE /api/cms/video-testimonials/:id (Protected Admin)
router.delete('/video-testimonials/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await supabase.from('video_testimonials').delete().eq('id', id);
    return res.json({ success: true, message: 'Video testimonial deleted' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete video testimonial' });
  }
});

export default router;
