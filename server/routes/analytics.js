import express from 'express';
import { query, getOne, run } from '../db/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// POST /api/analytics/event (Public analytics tracker endpoint)
router.post('/event', async (req, res) => {
  try {
    const { visitorId, sessionId, eventType, pagePath, pageTitle, propertyId, referrer, deviceType, browser, os } = req.body;

    if (!visitorId || !sessionId) {
      return res.status(400).json({ success: false, message: 'Visitor ID and Session ID required' });
    }

    const eventId = `evt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const ip = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';

    // 1. Check or insert session
    const existingSession = await getOne(`SELECT * FROM visitor_sessions WHERE session_id = ?`, [sessionId]);

    if (!existingSession) {
      // Check if visitor has prior sessions to mark returning
      const priorVisitor = await getOne(`SELECT id FROM visitor_sessions WHERE visitor_id = ? LIMIT 1`, [visitorId]);
      const isReturning = priorVisitor ? 1 : 0;

      await run(`INSERT INTO visitor_sessions (id, visitor_id, session_id, is_returning, page_views_count) VALUES (?, ?, ?, ?, 1)`, [
        `sess-${Date.now()}`, visitorId, sessionId, isReturning
      ]);
    } else {
      await run(`UPDATE visitor_sessions SET last_active = CURRENT_TIMESTAMP, page_views_count = page_views_count + 1 WHERE session_id = ?`, [sessionId]);
    }

    // 2. Insert event
    await run(`INSERT INTO analytics_events (
      id, visitor_id, session_id, event_type, page_path, page_title, property_id, referrer, device_type, browser, os, ip_address
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
      eventId, visitorId, sessionId, eventType || 'page_view', pagePath || '/', pageTitle || 'Jayshree Realty',
      propertyId || null, referrer || 'Direct', deviceType || 'Desktop', browser || 'Chrome', os || 'Windows', ip
    ]);

    return res.json({ success: true, eventId });
  } catch (error) {
    console.error('Analytics tracking error:', error);
    return res.status(500).json({ success: false, message: 'Tracking error' });
  }
});

// GET /api/analytics/dashboard (Protected Admin)
router.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    const timeframe = req.query.timeframe || '30d'; // 1d, 7d, 30d, 1y, all

    let dateClause = "timestamp >= datetime('now', '-30 days')";
    if (timeframe === '1d') dateClause = "timestamp >= datetime('now', '-1 days')";
    if (timeframe === '7d') dateClause = "timestamp >= datetime('now', '-7 days')";
    if (timeframe === '1y') dateClause = "timestamp >= datetime('now', '-365 days')";
    if (timeframe === 'all') dateClause = "1=1";

    // Totals
    const totalViewsRow = await getOne(`SELECT COUNT(*) as cnt FROM analytics_events WHERE ${dateClause}`);
    const totalSessionsRow = await getOne(`SELECT COUNT(DISTINCT session_id) as cnt FROM analytics_events WHERE ${dateClause}`);
    const uniqueVisitorsRow = await getOne(`SELECT COUNT(DISTINCT visitor_id) as cnt FROM analytics_events WHERE ${dateClause}`);
    const returningVisitorsRow = await getOne(`SELECT COUNT(DISTINCT visitor_id) as cnt FROM visitor_sessions WHERE is_returning = 1`);

    // Conversion metrics
    const totalLeadsRow = await getOne(`SELECT COUNT(*) as cnt FROM leads`);
    const whatsappClicksRow = await getOne(`SELECT COUNT(*) as cnt FROM analytics_events WHERE event_type = 'whatsapp_click' AND ${dateClause}`);
    const callClicksRow = await getOne(`SELECT COUNT(*) as cnt FROM analytics_events WHERE event_type = 'call_click' AND ${dateClause}`);
    const popupConversionsRow = await getOne(`SELECT COUNT(*) as cnt FROM leads WHERE cta_source LIKE '%popup%' OR lead_source LIKE '%popup%'`);

    // Top Pages
    const topPages = await query(`
      SELECT page_path, page_title, COUNT(*) as views 
      FROM analytics_events 
      WHERE ${dateClause} AND event_type = 'page_view'
      GROUP BY page_path 
      ORDER BY views DESC 
      LIMIT 8
    `);

    // Device breakdown
    const deviceBreakdown = await query(`
      SELECT device_type as device, COUNT(*) as count 
      FROM analytics_events 
      WHERE ${dateClause} 
      GROUP BY device_type
    `);

    // Browser breakdown
    const browserBreakdown = await query(`
      SELECT browser, COUNT(*) as count 
      FROM analytics_events 
      WHERE ${dateClause} 
      GROUP BY browser
    `);

    // OS breakdown
    const osBreakdown = await query(`
      SELECT os, COUNT(*) as count 
      FROM analytics_events 
      WHERE ${dateClause} 
      GROUP BY os
    `);

    // Traffic sources
    const trafficSources = await query(`
      SELECT referrer, COUNT(*) as count 
      FROM analytics_events 
      WHERE ${dateClause} 
      GROUP BY referrer 
      ORDER BY count DESC 
      LIMIT 6
    `);

    // Recent activity events
    const recentEvents = await query(`
      SELECT * FROM analytics_events ORDER BY timestamp DESC LIMIT 15
    `);

    const conversionRate = totalSessionsRow.cnt > 0 ? ((totalLeadsRow.cnt / totalSessionsRow.cnt) * 100).toFixed(1) : 0;

    return res.json({
      success: true,
      timeframe,
      metrics: {
        totalViews: totalViewsRow.cnt || 0,
        totalSessions: totalSessionsRow.cnt || 0,
        uniqueVisitors: uniqueVisitorsRow.cnt || 0,
        returningVisitors: returningVisitorsRow.cnt || 0,
        totalLeads: totalLeadsRow.cnt || 0,
        whatsappClicks: whatsappClicksRow.cnt || 0,
        callClicks: callClicksRow.cnt || 0,
        popupConversions: popupConversionsRow.cnt || 0,
        conversionRate: `${conversionRate}%`
      },
      topPages,
      deviceBreakdown,
      browserBreakdown,
      osBreakdown,
      trafficSources,
      recentEvents
    });
  } catch (error) {
    console.error('Analytics dashboard fetch error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch analytics' });
  }
});

export default router;
