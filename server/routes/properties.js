import express from 'express';
import { supabase } from '../db/supabase.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Helper to format property record for frontend
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
    features: row.features_json ? (typeof row.features_json === 'string' ? JSON.parse(row.features_json) : row.features_json) : [],
    image: row.image,
    galleryImages: row.gallery_images_json ? (typeof row.gallery_images_json === 'string' ? JSON.parse(row.gallery_images_json) : row.gallery_images_json) : [row.image],
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
    placements: row.placements_json ? (typeof row.placements_json === 'string' ? JSON.parse(row.placements_json) : row.placements_json) : ['buy'],
    brochureUrl: row.brochure_url || '',
    floorPlanUrl: row.floor_plan_url || '',
    builderName: row.builder_name || '',
    builderExperience: row.builder_experience || '',
    amenities: row.amenities_json ? (typeof row.amenities_json === 'string' ? JSON.parse(row.amenities_json) : row.amenities_json) : [],
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
    const { data: rows, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[Properties API] Error reading from Supabase:', error);
      return res.json({ success: true, properties: [] });
    }

    const properties = (rows || []).map(formatProperty);
    return res.json({ success: true, properties });
  } catch (error) {
    console.error('Error fetching properties:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch properties' });
  }
});

// GET /api/properties/:id (Public)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data: rows, error } = await supabase
      .from('properties')
      .select('*')
      .or(`id.eq.${id},slug.eq.${id}`)
      .limit(1);

    if (error || !rows || rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    return res.json({ success: true, property: formatProperty(rows[0]) });
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

    const newRecord = {
      id,
      slug,
      title: p.title,
      category: p.category || 'Kharghar New Projects',
      location: p.location || 'Navi Mumbai',
      type: p.type || 'New Launch',
      configuration: p.configuration || '',
      price: p.price || '',
      area: p.area || '',
      possession: p.possession || '',
      features_json: JSON.stringify(p.features || []),
      image: p.image || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1000',
      gallery_images_json: JSON.stringify(p.galleryImages && p.galleryImages.length > 0 ? p.galleryImages : [p.image || '']),
      is_featured: p.isFeatured ? 1 : 0,
      code: p.code || `JR-${Math.floor(1000 + Math.random() * 9000)}`,
      highlights: p.highlights || '',
      brokerage: p.brokerage || '0% Brokerage',
      brokerage_free: p.brokerageFree ? 1 : 0,
      published: p.published !== undefined ? (p.published ? 1 : 0) : 1,
      archived: p.archived ? 1 : 0,
      placements_json: JSON.stringify(p.placements || ['buy']),
      brochure_url: p.brochureUrl || '',
      floor_plan_url: p.floorPlanUrl || '',
      builder_name: p.builderName || 'Jayshree Realty',
      builder_experience: p.builderExperience || '12+ Years',
      amenities_json: JSON.stringify(p.amenities || []),
      seo_title: p.seoTitle || p.title,
      seo_description: p.seoDescription || p.highlights,
      seo_keywords: p.seoKeywords || '',
      youtube_url: formatYouTubeUrl(p.youtubeUrl),
      description: p.description || '',
      short_description: p.shortDescription || '',
      long_description: p.longDescription || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('properties')
      .insert([newRecord])
      .select();

    if (error) {
      console.error('[Properties API] Error creating property:', error);
      return res.status(500).json({ success: false, message: 'Database error creating property: ' + error.message });
    }

    const createdProperty = formatProperty(data ? data[0] : newRecord);
    return res.json({ success: true, property: createdProperty, message: 'Property created successfully' });
  } catch (error) {
    console.error('Error creating property:', error);
    return res.status(500).json({ success: false, message: 'Failed to create property' });
  }
});

// PUT /api/properties/:id (Protected Admin)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const p = req.body;

    const updates = {};
    if (p.title !== undefined) updates.title = p.title;
    if (p.category !== undefined) updates.category = p.category;
    if (p.location !== undefined) updates.location = p.location;
    if (p.type !== undefined) updates.type = p.type;
    if (p.configuration !== undefined) updates.configuration = p.configuration;
    if (p.price !== undefined) updates.price = p.price;
    if (p.area !== undefined) updates.area = p.area;
    if (p.possession !== undefined) updates.possession = p.possession;
    if (p.features !== undefined) updates.features_json = JSON.stringify(p.features);
    if (p.image !== undefined) updates.image = p.image;
    if (p.galleryImages !== undefined) updates.gallery_images_json = JSON.stringify(p.galleryImages);
    if (p.isFeatured !== undefined) updates.is_featured = p.isFeatured ? 1 : 0;
    if (p.code !== undefined) updates.code = p.code;
    if (p.highlights !== undefined) updates.highlights = p.highlights;
    if (p.brokerage !== undefined) updates.brokerage = p.brokerage;
    if (p.brokerageFree !== undefined) updates.brokerage_free = p.brokerageFree ? 1 : 0;
    if (p.published !== undefined) updates.published = p.published ? 1 : 0;
    if (p.archived !== undefined) updates.archived = p.archived ? 1 : 0;
    if (p.placements !== undefined) updates.placements_json = JSON.stringify(p.placements);
    if (p.brochureUrl !== undefined) updates.brochure_url = p.brochureUrl;
    if (p.floorPlanUrl !== undefined) updates.floor_plan_url = p.floorPlanUrl;
    if (p.builderName !== undefined) updates.builder_name = p.builderName;
    if (p.builderExperience !== undefined) updates.builder_experience = p.builderExperience;
    if (p.amenities !== undefined) updates.amenities_json = JSON.stringify(p.amenities);
    if (p.seoTitle !== undefined) updates.seo_title = p.seoTitle;
    if (p.seoDescription !== undefined) updates.seo_description = p.seoDescription;
    if (p.seoKeywords !== undefined) updates.seo_keywords = p.seoKeywords;
    if (p.youtubeUrl !== undefined) updates.youtube_url = formatYouTubeUrl(p.youtubeUrl);
    if (p.description !== undefined) updates.description = p.description;
    if (p.shortDescription !== undefined) updates.short_description = p.shortDescription;
    if (p.longDescription !== undefined) updates.long_description = p.longDescription;
    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('properties')
      .update(updates)
      .eq('id', id)
      .select();

    if (error) {
      console.error('[Properties API] Error updating property:', error);
      return res.status(500).json({ success: false, message: 'Failed to update property' });
    }

    const updatedProperty = data && data.length > 0 ? formatProperty(data[0]) : null;
    return res.json({ success: true, property: updatedProperty, message: 'Property updated successfully' });
  } catch (error) {
    console.error('Error updating property:', error);
    return res.status(500).json({ success: false, message: 'Failed to update property' });
  }
});

// DELETE /api/properties/:id (Protected Admin)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id);

    if (error) {
      return res.status(500).json({ success: false, message: 'Failed to delete property' });
    }

    return res.json({ success: true, message: 'Property deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error deleting property' });
  }
});

// PATCH /api/properties/:id/toggle-featured (Protected Admin)
router.patch('/:id/toggle-featured', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { data: current } = await supabase.from('properties').select('is_featured').eq('id', id).single();
    const newStatus = current ? (current.is_featured ? 0 : 1) : 1;

    await supabase.from('properties').update({ is_featured: newStatus }).eq('id', id);
    return res.json({ success: true, isFeatured: Boolean(newStatus) });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error toggling featured' });
  }
});

// PATCH /api/properties/:id/toggle-published (Protected Admin)
router.patch('/:id/toggle-published', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { data: current } = await supabase.from('properties').select('published').eq('id', id).single();
    const newStatus = current ? (current.published ? 0 : 1) : 1;

    await supabase.from('properties').update({ published: newStatus }).eq('id', id);
    return res.json({ success: true, published: Boolean(newStatus) });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error toggling published' });
  }
});

// PATCH /api/properties/:id/toggle-archive (Protected Admin)
router.patch('/:id/toggle-archive', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { data: current } = await supabase.from('properties').select('archived').eq('id', id).single();
    const newStatus = current ? (current.archived ? 0 : 1) : 1;

    await supabase.from('properties').update({ archived: newStatus }).eq('id', id);
    return res.json({ success: true, archived: Boolean(newStatus) });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error toggling archive' });
  }
});

export default router;
