import express from 'express';
import { supabase } from '../db/supabase.js';
import { authenticateToken } from '../middleware/auth.js';
import { sendLeadEmailNotification } from '../services/email.js';

const router = express.Router();
const recentSubmissionsCache = new Map();

// GET /api/leads (Protected Admin)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { data: rows, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const leads = (rows || []).map(row => ({
      id: row.id,
      name: row.name,
      phone: row.phone,
      email: row.email || '',
      requirement: row.requirement || '',
      budget: row.budget || '',
      preferredArea: row.preferred_area || '',
      propertyType: row.property_type || '',
      message: row.message || '',
      leadSource: row.lead_source || 'Website Form',
      ctaSource: row.cta_source || 'General Inquiry',
      pageName: row.page_name || row.page_source || 'Home',
      buttonSource: row.button_source || '',
      formSource: row.form_source || '',
      propertySource: row.property_source || '',
      deviceInfo: row.device_info || '',
      trafficSource: row.traffic_source || '',
      utmSource: row.utm_source || '',
      utmMedium: row.utm_medium || '',
      utmCampaign: row.utm_campaign || '',
      timestamp: row.timestamp || row.created_at,
      status: row.status || 'New',
      notes: row.notes || '',
      assignedTo: row.assigned_to || 'Unassigned',
      followUpDate: row.follow_up_date || '',
      createdAt: row.created_at
    }));

    return res.json({ success: true, leads });
  } catch (error) {
    console.error('Error fetching leads:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch leads' });
  }
});

// POST /api/leads (Public - Website Form Submissions)
router.post('/', async (req, res) => {
  try {
    const body = req.body;

    const name = body.name;
    const phone = body.phone;
    const email = body.email || '';
    const requirement = body.requirement || '';
    const budget = body.budget || '';
    const preferredArea = body.preferredArea || body.preferred_area || '';
    const propertyType = body.propertyType || body.property_type || '';
    const message = body.message || '';
    const leadSource = body.leadSource || body.lead_source || 'Website Form';
    const ctaSource = body.ctaSource || body.cta_source || 'Inquiry Form';
    const pageName = body.pageName || body.page_name || body.page_source || 'Website';
    
    // Attribution fields
    const buttonSource = body.button_source || body.buttonSource || ctaSource;
    const formSource = body.form_source || body.formSource || leadSource;
    const propertySource = body.property_source || body.propertySource || '';
    const deviceInfo = body.device_info || body.deviceInfo || '';
    const trafficSource = body.traffic_source || body.trafficSource || '';
    const utmSource = body.utm_source || body.utmSource || '';
    const utmMedium = body.utm_medium || body.utmMedium || '';
    const utmCampaign = body.utm_campaign || body.utmCampaign || '';
    const utmTerm = body.utm_term || body.utmTerm || '';
    const utmContent = body.utm_content || body.utmContent || '';

    if (!name || !phone) {
      return res.status(400).json({ success: false, message: 'Name and phone number are required.' });
    }

    const id = `lead-${Date.now()}`;
    const timestampStr = body.timestamp || new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    const newLeadRecord = {
      id,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      requirement,
      budget,
      preferred_area: preferredArea,
      property_type: propertyType,
      message,
      lead_source: leadSource,
      cta_source: ctaSource,
      page_name: pageName,
      button_source: buttonSource,
      form_source: formSource,
      property_source: propertySource,
      device_info: deviceInfo,
      traffic_source: trafficSource,
      utm_source: utmSource,
      utm_medium: utmMedium,
      utm_campaign: utmCampaign,
      utm_term: utmTerm,
      utm_content: utmContent,
      timestamp: timestampStr,
      status: 'New',
      notes: '',
      assigned_to: 'Unassigned',
      created_at: new Date().toISOString()
    };

    // 0. Duplicate submission check (In-memory cache + DB query)
    const dedupKey = `${phone.trim()}:${requirement.trim() || 'general'}`;
    const now = Date.now();
    const lastSeen = recentSubmissionsCache.get(dedupKey);

    if (lastSeen && (now - lastSeen) < 120000) { // 2 minutes window
      console.warn(`[Leads API] In-memory duplicate submission prevented for phone: ${phone.trim()}`);
      return res.json({
        success: true,
        duplicatePrevented: true,
        message: 'Thank you! Your inquiry was already received and is being processed.',
        emailSent: true
      });
    }

    try {
      const twoMinsAgo = new Date(Date.now() - 2 * 60 * 1000).toISOString();
      const { data: recentDuplicates } = await supabase
        .from('leads')
        .select('id, name, phone, created_at')
        .eq('phone', phone.trim())
        .gt('created_at', twoMinsAgo)
        .limit(1);

      if (recentDuplicates && recentDuplicates.length > 0) {
        console.warn(`[Leads API] DB duplicate submission prevented for phone: ${phone.trim()} (Recent ID: ${recentDuplicates[0].id})`);
        recentSubmissionsCache.set(dedupKey, now);
        return res.json({
          success: true,
          duplicatePrevented: true,
          leadId: recentDuplicates[0].id,
          message: 'Thank you! Your inquiry was already received and is being processed.',
          emailSent: true
        });
      }
    } catch (dupErr) {
      console.warn('[Leads API] Non-fatal error during duplicate check:', dupErr.message);
    }

    recentSubmissionsCache.set(dedupKey, now);

    // 1. Save Lead to Supabase Database
    const { error: dbErr } = await supabase.from('leads').insert([newLeadRecord]);

    if (dbErr) {
      console.error('[Leads API] Database save error:', dbErr.message);
    }

    // 2. Send Hostinger Email Notification
    const emailResult = await sendLeadEmailNotification(newLeadRecord);

    // 3. Return full lead object so frontend state updates immediately
    const responseLead = {
      id,
      name: newLeadRecord.name,
      phone: newLeadRecord.phone,
      email: newLeadRecord.email,
      requirement,
      budget,
      preferredArea,
      propertyType,
      message,
      lead_source: leadSource,
      cta_source: ctaSource,
      page_name: pageName,
      button_source: buttonSource,
      form_source: formSource,
      property_source: propertySource,
      device_info: deviceInfo,
      traffic_source: trafficSource,
      utm_source: utmSource,
      utm_medium: utmMedium,
      utm_campaign: utmCampaign,
      timestamp: timestampStr,
      status: 'New',
      notes: '',
      assignedTo: 'Unassigned'
    };

    return res.json({
      success: true,
      lead: responseLead,
      leadId: id,
      message: 'Thank you! Our luxury real estate expert will contact you shortly.',
      emailSent: emailResult.emailSent
    });
  } catch (error) {
    console.error('Error handling lead submission:', error);
    return res.status(500).json({ success: false, message: 'Failed to submit inquiry. Please try again.' });
  }
});

// POST /api/leads/admin-create (Protected Admin)
router.post('/admin-create', authenticateToken, async (req, res) => {
  try {
    const { name, phone, email, requirement, budget, preferredArea, propertyType, message, leadSource, status, notes } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ success: false, message: 'Name and phone number are required.' });
    }

    const id = `lead-${Date.now()}`;
    const timestampStr = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    const newLead = {
      id,
      name: name.trim(),
      phone: phone.trim(),
      email: email ? email.trim() : '',
      requirement: requirement || '',
      budget: budget || '',
      preferred_area: preferredArea || '',
      property_type: propertyType || 'Residential',
      message: message || '',
      lead_source: leadSource || 'Admin Manual Entry',
      cta_source: 'Admin Dashboard',
      page_name: 'Admin CMS',
      timestamp: timestampStr,
      status: status || 'New',
      notes: notes || '',
      assigned_to: 'Admin',
      created_at: new Date().toISOString()
    };

    await supabase.from('leads').insert([newLead]);

    await supabase.from('lead_history').insert([{
      id: `hist-${Date.now()}`,
      lead_id: id,
      action: 'Created Manually',
      note: `Lead created by admin (${req.user.username})`,
      performed_by: req.user.username,
      timestamp: new Date().toISOString()
    }]);

    return res.json({ success: true, lead: newLead, message: 'Lead created successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to create lead' });
  }
});

// PUT /api/leads/:id (Protected Admin)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes, assignedTo, followUpDate } = req.body;

    const updates = {};
    if (status !== undefined) updates.status = status;
    if (notes !== undefined) updates.notes = notes;
    if (assignedTo !== undefined) updates.assigned_to = assignedTo;
    if (followUpDate !== undefined) updates.follow_up_date = followUpDate;

    await supabase.from('leads').update(updates).eq('id', id);

    await supabase.from('lead_history').insert([{
      id: `hist-${Date.now()}`,
      lead_id: id,
      action: 'Updated Status/Notes',
      note: `Status updated to "${status || 'unchanged'}"`,
      performed_by: req.user.username,
      timestamp: new Date().toISOString()
    }]);

    return res.json({ success: true, message: 'Lead updated successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update lead' });
  }
});

// DELETE /api/leads/:id (Protected Admin)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await supabase.from('leads').delete().eq('id', id);
    return res.json({ success: true, message: 'Lead deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete lead' });
  }
});

// POST /api/leads/bulk-delete (Protected Admin)
router.post('/bulk-delete', authenticateToken, async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, message: 'Lead IDs array required' });
    }

    await supabase.from('leads').delete().in('id', ids);
    return res.json({ success: true, count: ids.length, message: `${ids.length} leads deleted successfully` });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Bulk delete failed' });
  }
});

// POST /api/leads/bulk-status (Protected Admin)
router.post('/bulk-status', authenticateToken, async (req, res) => {
  try {
    const { ids, status } = req.body;
    if (!Array.isArray(ids) || ids.length === 0 || !status) {
      return res.status(400).json({ success: false, message: 'IDs array and status required' });
    }

    await supabase.from('leads').update({ status }).in('id', ids);
    return res.json({ success: true, count: ids.length, message: `Status updated for ${ids.length} leads` });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Bulk status update failed' });
  }
});

// GET /api/leads/:id/history (Protected Admin)
router.get('/:id/history', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { data: rows } = await supabase
      .from('lead_history')
      .select('*')
      .eq('lead_id', id)
      .order('timestamp', { ascending: false });

    return res.json({ success: true, history: rows || [] });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch lead history' });
  }
});

export default router;
