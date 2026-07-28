import express from 'express';
import { query, getOne, run } from '../db/database.js';
import { authenticateToken } from '../middleware/auth.js';
import { sendLeadEmailNotification } from '../services/email.js';

const router = express.Router();

// Helper to format lead
function formatLead(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    email: row.email || '',
    requirement: row.requirement || '',
    budget: row.budget || '',
    preferredArea: row.preferred_area || '',
    propertyType: row.property_type || '',
    message: row.message || '',
    lead_source: row.lead_source || 'Website',
    cta_source: row.cta_source || 'Form',
    page_name: row.page_name || 'Home',
    timestamp: row.timestamp || row.created_at,
    status: row.status || 'New',
    notes: row.notes || '',
    assignedTo: row.assigned_to || 'Unassigned',
    followUpDate: row.follow_up_date || '',
    createdAt: row.created_at
  };
}

// POST /api/leads (Public Lead Submission from website forms)
router.post('/', async (req, res) => {
  try {
    const { name, phone, email, requirement, budget, preferredArea, propertyType, message, lead_source, cta_source, page_name } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ success: false, message: 'Name and Phone are required.' });
    }

    const id = `lead-${Date.now()}`;
    const timestampStr = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    await run(`INSERT INTO leads (
      id, name, phone, email, requirement, budget, preferred_area, property_type,
      message, lead_source, cta_source, page_name, timestamp, status, notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
      id,
      name.trim(),
      phone.trim(),
      email ? email.trim() : '',
      requirement || 'Buy',
      budget || 'Flexible',
      preferredArea || 'Navi Mumbai',
      propertyType || 'Residential',
      message || '',
      lead_source || 'Website Lead Modal',
      cta_source || 'Direct CTA',
      page_name || 'Home Page',
      timestampStr,
      'New',
      ''
    ]);

    await run(`INSERT INTO lead_history (id, lead_id, action, note, performed_by) VALUES (?, ?, ?, ?, ?)`, [
      `lh-${Date.now()}`,
      id,
      'Lead Created',
      `Submitted via ${cta_source || lead_source || 'Website Form'} on ${page_name || 'Site'}`,
      'Visitor System'
    ]);

    // Send email notification via Gmail SMTP
    const leadPayload = {
      id,
      name,
      phone,
      email,
      requirement,
      budget,
      preferred_area: preferredArea,
      property_type: propertyType,
      message,
      lead_source,
      cta_source,
      page_name,
      timestamp: timestampStr
    };

    // Trigger email asynchronously to avoid blocking user response
    sendLeadEmailNotification(leadPayload).catch(err => {
      console.error('Async lead email notification error:', err);
    });

    const newLeadRow = await getOne(`SELECT * FROM leads WHERE id = ?`, [id]);
    return res.status(201).json({
      success: true,
      message: 'Lead submitted successfully! Our expert will contact you shortly.',
      lead: formatLead(newLeadRow)
    });
  } catch (error) {
    console.error('Lead submission error:', error);
    return res.status(500).json({ success: false, message: 'Failed to submit lead inquiry.' });
  }
});

// GET /api/leads (Protected Admin)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const rows = await query(`SELECT * FROM leads ORDER BY created_at DESC`);
    const leads = rows.map(formatLead);
    return res.json({ success: true, leads });
  } catch (error) {
    console.error('Error fetching leads:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch leads' });
  }
});

// POST /api/leads/admin-create (Protected Admin manual lead creation)
router.post('/admin-create', authenticateToken, async (req, res) => {
  try {
    const { name, phone, email, requirement, budget, preferredArea, propertyType, message, status, notes, assignedTo, followUpDate } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ success: false, message: 'Name and Phone are required.' });
    }

    const id = `lead-${Date.now()}`;
    const timestampStr = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    await run(`INSERT INTO leads (
      id, name, phone, email, requirement, budget, preferred_area, property_type,
      message, lead_source, cta_source, page_name, timestamp, status, notes, assigned_to, follow_up_date
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
      id,
      name.trim(),
      phone.trim(),
      email ? email.trim() : '',
      requirement || 'Buy',
      budget || 'Flexible',
      preferredArea || 'Navi Mumbai',
      propertyType || 'Residential',
      message || '',
      'Manual Entry',
      'Admin Dashboard',
      'Admin Panel',
      timestampStr,
      status || 'New',
      notes || '',
      assignedTo || 'Unassigned',
      followUpDate || ''
    ]);

    await run(`INSERT INTO lead_history (id, lead_id, action, note, performed_by) VALUES (?, ?, ?, ?, ?)`, [
      `lh-${Date.now()}`,
      id,
      'Manual Creation',
      `Lead created manually by admin ${req.user.username}`,
      req.user.username
    ]);

    const created = await getOne(`SELECT * FROM leads WHERE id = ?`, [id]);
    return res.json({ success: true, lead: formatLead(created) });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to create lead' });
  }
});

// PUT /api/leads/:id (Protected Admin)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const id = req.params.id;
    const { status, notes, assignedTo, followUpDate, name, phone, email, budget, preferredArea, requirement } = req.body;

    const existing = await getOne(`SELECT * FROM leads WHERE id = ?`, [id]);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    await run(`UPDATE leads SET
      name = ?, phone = ?, email = ?, requirement = ?, budget = ?, preferred_area = ?,
      status = ?, notes = ?, assigned_to = ?, follow_up_date = ?
      WHERE id = ?`, [
      name !== undefined ? name : existing.name,
      phone !== undefined ? phone : existing.phone,
      email !== undefined ? email : existing.email,
      requirement !== undefined ? requirement : existing.requirement,
      budget !== undefined ? budget : existing.budget,
      preferredArea !== undefined ? preferredArea : existing.preferred_area,
      status !== undefined ? status : existing.status,
      notes !== undefined ? notes : existing.notes,
      assignedTo !== undefined ? assignedTo : existing.assigned_to,
      followUpDate !== undefined ? followUpDate : existing.follow_up_date,
      id
    ]);

    // Record Lead History Log
    const changesLog = [];
    if (status && status !== existing.status) changesLog.push(`Status changed from ${existing.status} to ${status}`);
    if (assignedTo && assignedTo !== existing.assigned_to) changesLog.push(`Assigned to ${assignedTo}`);
    if (notes && notes !== existing.notes) changesLog.push(`Updated notes`);
    if (followUpDate && followUpDate !== existing.follow_up_date) changesLog.push(`Follow-up scheduled for ${followUpDate}`);

    if (changesLog.length > 0) {
      await run(`INSERT INTO lead_history (id, lead_id, action, note, performed_by) VALUES (?, ?, ?, ?, ?)`, [
        `lh-${Date.now()}`,
        id,
        'Lead Updated',
        changesLog.join('; '),
        req.user.username
      ]);
    }

    const updated = await getOne(`SELECT * FROM leads WHERE id = ?`, [id]);
    return res.json({ success: true, lead: formatLead(updated) });
  } catch (error) {
    console.error('Error updating lead:', error);
    return res.status(500).json({ success: false, message: 'Failed to update lead' });
  }
});

// GET /api/leads/:id/history (Protected Admin)
router.get('/:id/history', authenticateToken, async (req, res) => {
  try {
    const history = await query(`SELECT * FROM lead_history WHERE lead_id = ? ORDER BY timestamp DESC`, [req.params.id]);
    return res.json({ success: true, history });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch lead history' });
  }
});

// DELETE /api/leads/:id (Protected Admin)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const id = req.params.id;
    await run(`DELETE FROM leads WHERE id = ?`, [id]);
    await run(`DELETE FROM lead_history WHERE lead_id = ?`, [id]);
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
      return res.status(400).json({ success: false, message: 'Array of IDs required' });
    }
    const placeholders = ids.map(() => '?').join(',');
    await run(`DELETE FROM leads WHERE id IN (${placeholders})`, ids);
    await run(`DELETE FROM lead_history WHERE lead_id IN (${placeholders})`, ids);
    return res.json({ success: true, message: `${ids.length} leads deleted successfully.` });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Bulk delete failed' });
  }
});

// POST /api/leads/bulk-status (Protected Admin)
router.post('/bulk-status', authenticateToken, async (req, res) => {
  try {
    const { ids, status } = req.body;
    if (!Array.isArray(ids) || ids.length === 0 || !status) {
      return res.status(400).json({ success: false, message: 'IDs and status required' });
    }
    const placeholders = ids.map(() => '?').join(',');
    await run(`UPDATE leads SET status = ? WHERE id IN (${placeholders})`, [status, ...ids]);
    return res.json({ success: true, message: `${ids.length} leads updated to status: ${status}.` });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Bulk status update failed' });
  }
});

export default router;
