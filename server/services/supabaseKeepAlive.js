import { supabase } from '../db/supabase.js';

/**
 * Supabase Keep-Alive Heartbeat Service
 * 
 * Free-tier Supabase projects automatically pause after 7 days of inactivity.
 * This service runs once every 24 hours to:
 * 1. Send an active ping / heartbeat event into Supabase.
 * 2. Auto-prune heartbeat logs older than 7 days so database storage stays clean.
 * 3. Keeps the project active 24/7/365 without touching any real website data or properties.
 */

export const triggerKeepAlivePing = async () => {
  try {
    const now = new Date();
    const timestampStr = now.toISOString();

    // 1. Record an isolated system heartbeat event
    const heartbeatRecord = {
      id: `ping-${Date.now()}`,
      visitor_id: 'system_heartbeat',
      session_id: 'system_keepalive',
      event_type: 'keepalive',
      page_path: '/system/keepalive',
      page_title: 'Database Keep-Alive Heartbeat',
      device_type: 'Server Auto-Heartbeat',
      timestamp: timestampStr
    };

    const { error: insertErr } = await supabase
      .from('analytics_events')
      .insert([heartbeatRecord]);

    if (insertErr) {
      // Fallback: If insert fails, execute a lightweight query to register activity
      await supabase.from('counters').select('id').limit(1);
      console.log('[Supabase KeepAlive] Read query fallback ping registered at:', timestampStr);
    } else {
      console.log('[Supabase KeepAlive] Active heartbeat write registered successfully at:', timestampStr);
    }

    // 2. Auto-delete heartbeats older than 7 days to keep database storage completely clean
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    await supabase
      .from('analytics_events')
      .delete()
      .eq('event_type', 'keepalive')
      .lt('timestamp', sevenDaysAgo);

  } catch (err) {
    console.warn('[Supabase KeepAlive Warning] Heartbeat error:', err.message);
  }
};

export const startSupabaseKeepAliveJob = () => {
  // Trigger initial heartbeat 10 seconds after server boot
  setTimeout(() => {
    triggerKeepAlivePing();
  }, 10000);

  // Trigger heartbeat every 24 hours (86,400,000 ms)
  const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
  setInterval(() => {
    triggerKeepAlivePing();
  }, TWENTY_FOUR_HOURS);

  console.log('[Supabase KeepAlive] Scheduled 24-hour database inactivity prevention job.');
};
