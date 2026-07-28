import express from 'express';
import { query, getOne, run } from '../db/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/cms/all (Public - loads initial CMS settings for website frontend)
router.get('/all', async (req, res) => {
  try {
    const heroRow = await getOne(`SELECT * FROM hero_settings WHERE id = 1`);
    const popupRow = await getOne(`SELECT * FROM popup_settings WHERE id = 1`);
    const siteRow = await getOne(`SELECT * FROM site_settings WHERE id = 1`);
    const counterRows = await query(`SELECT * FROM counters ORDER BY sort_order ASC`);
    const locationRows = await query(`SELECT * FROM location_nodes ORDER BY sort_order ASC`);
    const categoryRows = await query(`SELECT * FROM categories ORDER BY sort_order ASC`);
    const reviewRows = await query(`SELECT * FROM reviews ORDER BY sort_order ASC`);

    return res.json({
      success: true,
      heroSettings: heroRow ? {
        headingPart1: heroRow.heading_part1,
        headingGold: heroRow.heading_gold,
        subtext: heroRow.subtext,
        keywords: heroRow.keywords_json ? JSON.parse(heroRow.keywords_json) : [],
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
      counters: counterRows.map(c => ({
        id: c.id,
        label: c.label,
        value: c.value,
        suffix: c.suffix,
        iconName: c.icon_name
      })),
      locations: locationRows.map(l => ({
        id: l.id,
        name: l.name,
        description: l.description,
        activeCount: l.active_count
      })),
      categories: categoryRows.map(c => c.name),
      reviews: reviewRows.map(r => ({
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
    await run(`UPDATE hero_settings SET
      heading_part1 = ?, heading_gold = ?, subtext = ?, keywords_json = ?, background_image = ?
      WHERE id = 1`, [
      headingPart1,
      headingGold,
      subtext,
      JSON.stringify(keywords || []),
      backgroundImage
    ]);
    return res.json({ success: true, message: 'Hero settings updated successfully.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update hero settings' });
  }
});

// PUT /api/cms/popup (Protected Admin)
router.put('/popup', authenticateToken, async (req, res) => {
  try {
    const { title, subtitle, badge, leftImage, privacyText, enabled, triggerDelay, scrollTriggerPercent, redirectUrl, successMessage } = req.body;
    await run(`UPDATE popup_settings SET
      title = ?, subtitle = ?, badge = ?, left_image = ?, privacy_text = ?,
      enabled = ?, trigger_delay = ?, scroll_trigger_percent = ?, redirect_url = ?, success_message = ?
      WHERE id = 1`, [
      title, subtitle, badge, leftImage, privacyText,
      enabled ? 1 : 0, triggerDelay || 3, scrollTriggerPercent || 25,
      redirectUrl || '', successMessage || ''
    ]);
    return res.json({ success: true, message: 'Popup settings updated successfully.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update popup settings' });
  }
});

// PUT /api/cms/counters (Protected Admin - connected save/reset)
router.put('/counters', authenticateToken, async (req, res) => {
  try {
    const { counters } = req.body;
    if (!Array.isArray(counters)) {
      return res.status(400).json({ success: false, message: 'Array of counters required.' });
    }
    await run(`DELETE FROM counters`);
    for (let i = 0; i < counters.length; i++) {
      const c = counters[i];
      await run(`INSERT INTO counters (id, label, value, suffix, icon_name, sort_order) VALUES (?, ?, ?, ?, ?, ?)`, [
        c.id || `cnt-${i + 1}`,
        c.label,
        c.value,
        c.suffix || '',
        c.iconName || 'TrendingUp',
        i + 1
      ]);
    }
    return res.json({ success: true, message: 'Counters updated successfully.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update counters' });
  }
});

// Category endpoints
router.post('/categories', authenticateToken, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Category name required' });
    const id = `cat-${Date.now()}`;
    await run(`INSERT INTO categories (id, name, sort_order) VALUES (?, ?, (SELECT COALESCE(MAX(sort_order), 0) + 1 FROM categories))`, [id, name.trim()]);
    return res.json({ success: true, message: 'Category added' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to add category' });
  }
});

router.put('/categories/edit', authenticateToken, async (req, res) => {
  try {
    const { oldName, newName } = req.body;
    if (!oldName || !newName) return res.status(400).json({ success: false, message: 'oldName and newName required' });
    await run(`UPDATE categories SET name = ? WHERE name = ?`, [newName.trim(), oldName.trim()]);
    await run(`UPDATE properties SET category = ? WHERE category = ?`, [newName.trim(), oldName.trim()]);
    return res.json({ success: true, message: 'Category updated successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to edit category' });
  }
});

router.delete('/categories/:name', authenticateToken, async (req, res) => {
  try {
    await run(`DELETE FROM categories WHERE name = ?`, [decodeURIComponent(req.params.name)]);
    return res.json({ success: true, message: 'Category deleted' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete category' });
  }
});

// Reviews endpoints
router.post('/reviews', authenticateToken, async (req, res) => {
  try {
    const r = req.body;
    const id = `rev-${Date.now()}`;
    await run(`INSERT INTO reviews (id, author, rating, time_ago, content, avatar_color, verified, reviews_count, is_local_guide, published) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
      id, r.author, r.rating || 5, r.timeAgo || 'Recently', r.content, r.avatarColor || 'bg-amber-600',
      r.verified ? 1 : 0, r.reviewsCount || '1 review', r.isLocalGuide ? 1 : 0, r.published !== false ? 1 : 0
    ]);
    return res.json({ success: true, message: 'Review created successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to add review' });
  }
});

router.put('/reviews/:id', authenticateToken, async (req, res) => {
  try {
    const id = req.params.id;
    const r = req.body;
    await run(`UPDATE reviews SET author = ?, rating = ?, content = ?, published = ? WHERE id = ?`, [
      r.author, r.rating, r.content, r.published ? 1 : 0, id
    ]);
    return res.json({ success: true, message: 'Review updated' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update review' });
  }
});

router.delete('/reviews/:id', authenticateToken, async (req, res) => {
  try {
    await run(`DELETE FROM reviews WHERE id = ?`, [req.params.id]);
    return res.json({ success: true, message: 'Review deleted' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete review' });
  }
});

// Location Nodes Endpoints
router.post('/locations', authenticateToken, async (req, res) => {
  try {
    const { name, description, activeCount } = req.body;
    const id = `loc-${Date.now()}`;
    await run(`INSERT INTO location_nodes (id, name, description, active_count) VALUES (?, ?, ?, ?)`, [
      id, name, description || '', activeCount || 0
    ]);
    return res.json({ success: true, message: 'Location added' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to add location' });
  }
});

router.put('/locations/:id', authenticateToken, async (req, res) => {
  try {
    const { name, description, activeCount } = req.body;
    await run(`UPDATE location_nodes SET name = ?, description = ?, active_count = ? WHERE id = ?`, [
      name, description, activeCount, req.params.id
    ]);
    return res.json({ success: true, message: 'Location updated' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update location' });
  }
});

router.delete('/locations/:id', authenticateToken, async (req, res) => {
  try {
    await run(`DELETE FROM location_nodes WHERE id = ?`, [req.params.id]);
    return res.json({ success: true, message: 'Location deleted' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete location' });
  }
});

export default router;
