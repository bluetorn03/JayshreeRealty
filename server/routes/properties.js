import express from 'express';
import { query, getOne, run } from '../db/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Helper to format property row from DB
function formatProperty(row) {
  if (!row) return null;
  return {
    id: row.id,
    slug: row.slug || row.id,
    title: row.title,
    category: row.category,
    location: row.location,
    type: row.type,
    configuration: row.configuration || '',
    price: row.price || '',
    area: row.area || '',
    possession: row.possession || '',
    features: row.features_json ? JSON.parse(row.features_json) : [],
    image: row.image,
    galleryImages: row.gallery_images_json ? JSON.parse(row.gallery_images_json) : [row.image],
    youtubeUrl: row.youtube_url || '',
    description: row.description || '',
    shortDescription: row.short_description || '',
    longDescription: row.long_description || '',
    isFeatured: Boolean(row.is_featured),
    code: row.code || '',
    highlights: row.highlights || '',
    brokerage: row.brokerage || '',
    brokerageFree: Boolean(row.brokerage_free),
    published: Boolean(row.published),
    archived: Boolean(row.archived),
    placements: row.placements_json ? JSON.parse(row.placements_json) : ['buy'],
    brochureUrl: row.brochure_url || '',
    floorPlanUrl: row.floor_plan_url || '',
    builderName: row.builder_name || '',
    builderExperience: row.builder_experience || '',
    amenities: row.amenities_json ? JSON.parse(row.amenities_json) : [],
    seoTitle: row.seo_title || row.title,
    seoDescription: row.seo_description || row.highlights,
    seoKeywords: row.seo_keywords || '',
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

// GET /api/properties (Public)
router.get('/', async (req, res) => {
  try {
    const rows = await query(`SELECT * FROM properties ORDER BY created_at DESC`);
    const properties = rows.map(formatProperty);
    return res.json({ success: true, properties });
  } catch (error) {
    console.error('Error fetching properties:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch properties' });
  }
});

// GET /api/properties/:id (Public)
router.get('/:id', async (req, res) => {
  try {
    const row = await getOne(`SELECT * FROM properties WHERE id = ? OR slug = ?`, [req.params.id, req.params.id]);
    if (!row) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }
    return res.json({ success: true, property: formatProperty(row) });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error loading property' });
  }
});

// POST /api/properties (Protected Admin)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const p = req.body;
    const id = p.id || `proj-${Date.now()}`;
    const slug = (p.slug || p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')) + '-' + Date.now().toString().slice(-4);

    await run(`INSERT INTO properties (
      id, slug, title, category, location, type, configuration, price, area, possession,
      features_json, image, gallery_images_json, youtube_url, description, short_description, long_description,
      is_featured, code, highlights, brokerage, brokerage_free, published, archived, placements_json, brochure_url, floor_plan_url,
      builder_name, builder_experience, amenities_json, seo_title, seo_description, seo_keywords
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
      id,
      slug,
      p.title || 'Untitled Property',
      p.category || 'Kharghar New Projects',
      p.location || 'Kharghar',
      p.type || 'New Launch',
      p.configuration || '2 BHK',
      p.price || 'Price on Call',
      p.area || '750 Sq.Ft.',
      p.possession || 'Ready Possession',
      JSON.stringify(p.features || []),
      p.image || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1000',
      JSON.stringify(p.galleryImages || [p.image]),
      p.youtubeUrl || '',
      p.description || '',
      p.shortDescription || '',
      p.longDescription || '',
      p.isFeatured ? 1 : 0,
      p.code || '',
      p.highlights || '',
      p.brokerage || '0% Brokerage',
      p.brokerageFree ? 1 : 0,
      p.published !== false ? 1 : 0,
      p.archived ? 1 : 0,
      JSON.stringify(p.placements || ['homepage', 'featured', 'buy']),
      p.brochureUrl || '',
      p.floorPlanUrl || '',
      p.builderName || 'Jayshree Developers',
      p.builderExperience || '12+ Years',
      JSON.stringify(p.amenities || []),
      p.seoTitle || p.title,
      p.seoDescription || p.highlights,
      p.seoKeywords || ''
    ]);

    await run(`INSERT INTO activity_logs (id, user, action, details, ip_address) VALUES (?, ?, ?, ?, ?)`, [
      `log-${Date.now()}`,
      req.user.username,
      'Create Property',
      `Created property "${p.title}" (ID: ${id})`,
      req.ip
    ]);

    const created = await getOne(`SELECT * FROM properties WHERE id = ?`, [id]);
    return res.json({ success: true, property: formatProperty(created) });
  } catch (error) {
    console.error('Error creating property:', error);
    return res.status(500).json({ success: false, message: 'Failed to create property' });
  }
});

// PUT /api/properties/:id (Protected Admin)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const id = req.params.id;
    const p = req.body;

    const existing = await getOne(`SELECT * FROM properties WHERE id = ?`, [id]);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    await run(`UPDATE properties SET
      title = ?, category = ?, location = ?, type = ?, configuration = ?, price = ?, area = ?, possession = ?,
      features_json = ?, image = ?, gallery_images_json = ?, youtube_url = ?, description = ?, short_description = ?, long_description = ?,
      is_featured = ?, code = ?, highlights = ?, brokerage = ?, brokerage_free = ?, published = ?, archived = ?, placements_json = ?, brochure_url = ?,
      floor_plan_url = ?, builder_name = ?, builder_experience = ?, amenities_json = ?, seo_title = ?,
      seo_description = ?, seo_keywords = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?`, [
      p.title !== undefined ? p.title : existing.title,
      p.category !== undefined ? p.category : existing.category,
      p.location !== undefined ? p.location : existing.location,
      p.type !== undefined ? p.type : existing.type,
      p.configuration !== undefined ? p.configuration : existing.configuration,
      p.price !== undefined ? p.price : existing.price,
      p.area !== undefined ? p.area : existing.area,
      p.possession !== undefined ? p.possession : existing.possession,
      p.features ? JSON.stringify(p.features) : existing.features_json,
      p.image !== undefined ? p.image : existing.image,
      p.galleryImages ? JSON.stringify(p.galleryImages) : existing.gallery_images_json,
      p.youtubeUrl !== undefined ? p.youtubeUrl : existing.youtube_url,
      p.description !== undefined ? p.description : existing.description,
      p.shortDescription !== undefined ? p.shortDescription : existing.short_description,
      p.longDescription !== undefined ? p.longDescription : existing.long_description,
      p.isFeatured !== undefined ? (p.isFeatured ? 1 : 0) : existing.is_featured,
      p.code !== undefined ? p.code : existing.code,
      p.highlights !== undefined ? p.highlights : existing.highlights,
      p.brokerage !== undefined ? p.brokerage : existing.brokerage,
      p.brokerageFree !== undefined ? (p.brokerageFree ? 1 : 0) : existing.brokerage_free,
      p.published !== undefined ? (p.published ? 1 : 0) : existing.published,
      p.archived !== undefined ? (p.archived ? 1 : 0) : existing.archived,
      p.placements ? JSON.stringify(p.placements) : existing.placements_json,
      p.brochureUrl !== undefined ? p.brochureUrl : existing.brochure_url,
      p.floorPlanUrl !== undefined ? p.floorPlanUrl : existing.floor_plan_url,
      p.builderName !== undefined ? p.builderName : existing.builder_name,
      p.builderExperience !== undefined ? p.builderExperience : existing.builder_experience,
      p.amenities ? JSON.stringify(p.amenities) : existing.amenities_json,
      p.seoTitle !== undefined ? p.seoTitle : existing.seo_title,
      p.seoDescription !== undefined ? p.seoDescription : existing.seo_description,
      p.seoKeywords !== undefined ? p.seoKeywords : existing.seo_keywords,
      id
    ]);

    await run(`INSERT INTO activity_logs (id, user, action, details, ip_address) VALUES (?, ?, ?, ?, ?)`, [
      `log-${Date.now()}`,
      req.user.username,
      'Update Property',
      `Updated property "${p.title || existing.title}"`,
      req.ip
    ]);

    const updated = await getOne(`SELECT * FROM properties WHERE id = ?`, [id]);
    return res.json({ success: true, property: formatProperty(updated) });
  } catch (error) {
    console.error('Error updating property:', error);
    return res.status(500).json({ success: false, message: 'Failed to update property' });
  }
});

// DELETE /api/properties/:id (Protected Admin)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const id = req.params.id;
    const existing = await getOne(`SELECT * FROM properties WHERE id = ?`, [id]);

    if (!existing) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    await run(`DELETE FROM properties WHERE id = ?`, [id]);

    await run(`INSERT INTO activity_logs (id, user, action, details, ip_address) VALUES (?, ?, ?, ?, ?)`, [
      `log-${Date.now()}`,
      req.user.username,
      'Delete Property',
      `Deleted property "${existing.title}"`,
      req.ip
    ]);

    return res.json({ success: true, message: 'Property deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete property' });
  }
});

export default router;
