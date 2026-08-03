import express from 'express';
import { supabase } from '../db/supabase.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// POST /api/analytics/event (Public tracking endpoint)
router.post('/event', async (req, res) => {
  try {
    const { visitorId, sessionId, eventType, pagePath, pageTitle, propertyId, referrer, deviceType, browser, os } = req.body;

    if (!visitorId || !sessionId || !eventType) {
      return res.status(400).json({ success: false, message: 'Missing required analytics fields' });
    }

    const eventId = `evt-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const eventRecord = {
      id: eventId,
      visitor_id: visitorId,
      session_id: sessionId,
      event_type: eventType,
      page_path: pagePath || '/',
      page_title: pageTitle || 'Website',
      property_id: propertyId || null,
      referrer: referrer || 'Direct',
      device_type: deviceType || 'Desktop',
      browser: browser || 'Chrome',
      os: os || 'Windows',
      ip_address: req.ip,
      timestamp: new Date().toISOString()
    };

    await supabase.from('analytics_events').insert([eventRecord]);

    // Upsert Visitor Session
    const { data: existingSessions } = await supabase
      .from('visitor_sessions')
      .select('*')
      .eq('session_id', sessionId)
      .limit(1);

    if (existingSessions && existingSessions.length > 0) {
      await supabase
        .from('visitor_sessions')
        .update({
          last_active: new Date().toISOString(),
          page_views_count: (existingSessions[0].page_views_count || 1) + 1
        })
        .eq('session_id', sessionId);
    } else {
      await supabase.from('visitor_sessions').insert([{
        id: `sess-${Date.now()}`,
        visitor_id: visitorId,
        session_id: sessionId,
        start_time: new Date().toISOString(),
        last_active: new Date().toISOString(),
        page_views_count: 1
      }]);
    }

    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Analytics tracking failed' });
  }
});

// GET /api/analytics/dashboard (Protected Admin)
router.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    const timeframe = req.query.timeframe || '30d';
    let dateCutoff = null;

    const now = new Date();
    if (timeframe === 'today') {
      dateCutoff = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    } else if (timeframe === '7d') {
      dateCutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    } else if (timeframe === '30d') {
      dateCutoff = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
    }

    let query = supabase.from('analytics_events').select('*').order('timestamp', { ascending: false });
    if (dateCutoff) {
      query = query.gte('timestamp', dateCutoff);
    }

    const { data: events } = await query.limit(5000);
    const { data: leads } = await supabase.from('leads').select('id, timestamp');

    const totalEvents = events || [];
    const totalPageviews = totalEvents.filter(e => e.event_type === 'page_view').length;
    const whatsappClicks = totalEvents.filter(e => e.event_type === 'whatsapp_click').length;
    const callClicks = totalEvents.filter(e => e.event_type === 'call_click').length;
    const formSubmissions = totalEvents.filter(e => e.event_type === 'form_submit').length;
    const ctaClicks = whatsappClicks + callClicks + totalEvents.filter(e => e.event_type === 'button_click').length;

    const allVisitorIds = totalEvents.map(e => e.visitor_id);
    const uniqueVisitors = new Set(allVisitorIds).size;
    
    // Count returning visitors (appeared more than once)
    const visitorFrequency = {};
    allVisitorIds.forEach(id => {
      visitorFrequency[id] = (visitorFrequency[id] || 0) + 1;
    });
    const returningVisitors = Object.values(visitorFrequency).filter(count => count > 1).length;

    // Total unique sessions
    const allSessionIds = totalEvents.map(e => e.session_id);
    const totalSessions = new Set(allSessionIds).size;

    const filteredLeads = (leads || []).filter(l => !dateCutoff || (l.timestamp && l.timestamp >= dateCutoff));
    const totalLeads = filteredLeads.length;
    const conversionRate = totalPageviews > 0 ? ((totalLeads / totalPageviews) * 100).toFixed(1) + '%' : '0.0%';

    // Group Top Pages
    const pageCounts = {};
    totalEvents.filter(e => e.event_type === 'page_view').forEach(e => {
      const p = e.page_path || '/';
      pageCounts[p] = (pageCounts[p] || 0) + 1;
    });
    const topPages = Object.keys(pageCounts)
      .map(path => ({ path, views: pageCounts[path] }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 8);

    // Group Traffic Sources
    const refCounts = {};
    totalEvents.forEach(e => {
      const ref = e.referrer || 'Direct';
      refCounts[ref] = (refCounts[ref] || 0) + 1;
    });
    const trafficSources = Object.keys(refCounts)
      .map(referrer => ({ referrer, count: refCounts[referrer] }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    // Group Device Distribution
    const deviceCounts = {};
    totalEvents.forEach(e => {
      const d = e.device_type || 'Desktop';
      deviceCounts[d] = (deviceCounts[d] || 0) + 1;
    });
    const totalCountForDevices = totalEvents.length || 1;
    const devices = Object.keys(deviceCounts).map(device => ({
      device,
      count: deviceCounts[device],
      percentage: Math.round((deviceCounts[device] / totalCountForDevices) * 100)
    }));

    // Group Browser Distribution
    const browserCounts = {};
    totalEvents.forEach(e => {
      const b = e.browser || 'Unknown';
      browserCounts[b] = (browserCounts[b] || 0) + 1;
    });
    const browserBreakdown = Object.keys(browserCounts)
      .map(browser => ({ browser, count: browserCounts[browser] }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    // Group OS Distribution
    const osCounts = {};
    totalEvents.forEach(e => {
      const o = e.os || 'Unknown';
      osCounts[o] = (osCounts[o] || 0) + 1;
    });
    const osBreakdown = Object.keys(osCounts)
      .map(os => ({ os, count: osCounts[os] }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    return res.json({
      success: true,
      metrics: {
        totalViews: totalPageviews,
        uniqueVisitors,
        returningVisitors,
        totalLeads,
        totalSessions,
        ctaClicks,
        whatsappClicks,
        callClicks,
        formSubmissions,
        conversionRate
      },
      topPages,
      trafficSources,
      devices,
      browserBreakdown,
      osBreakdown,
      recentEvents: totalEvents.slice(0, 15)
    });
  } catch (error) {
    console.error('Analytics dashboard error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch analytics' });
  }
});

export default router;
