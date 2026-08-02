import express from 'express';
import bcrypt from 'bcryptjs';
import { supabase } from '../db/supabase.js';
import { generateToken, authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Generic error message - NEVER reveal if user exists or not
const INVALID_CREDENTIALS_MSG = 'Invalid username or password.';

// ================================================================
// POST /api/auth/login
// ================================================================
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(401).json({ success: false, message: INVALID_CREDENTIALS_MSG });
    }

    const cleanUsername = String(username).trim().toLowerCase();
    const cleanPassword = String(password).trim();

    // 1. Look up admin in Supabase DB
    let adminUser = null;
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('username', cleanUsername)
        .limit(1);

      if (!error && data && data.length > 0) {
        adminUser = data[0];
      }
    } catch (dbErr) {
      console.warn('[Auth] Supabase DB lookup failed:', dbErr.message);
    }

    const envAdminUser = (process.env.ADMIN_USER || 'admin@jayshreerealty').toLowerCase();
    const envAdminPass = process.env.ADMIN_PASS || 'jayshreerealty@8989';

    // 2. Check DB user password if found
    let isMatch = false;
    if (adminUser) {
      if (adminUser.password_hash && adminUser.password_hash.startsWith('$2')) {
        isMatch = await bcrypt.compare(cleanPassword, adminUser.password_hash);
      } else {
        isMatch = cleanPassword === adminUser.password_hash;
      }
    }

    // 3. Fallback: If DB match failed or user wasn't in DB, test against env credentials
    if (!isMatch && cleanUsername === envAdminUser && cleanPassword === envAdminPass) {
      isMatch = true;
      // Auto-update/create admin user in DB with fresh correct bcrypt hash (non-blocking)
      (async () => {
        try {
          const hash = await bcrypt.hash(envAdminPass, 10);
          await supabase.from('admin_users').upsert([{
            id: 'admin-1',
            username: envAdminUser,
            password_hash: hash,
            role: 'super_admin'
          }], { onConflict: 'id' });
          console.log('[Auth] Admin user password hash synced in Supabase DB');
        } catch (e) {
          console.warn('[Auth] Admin sync warning:', e.message);
        }
      })();

      const token = generateToken({
        id: 'admin-1',
        username: envAdminUser,
        role: 'super_admin'
      });

      return res.json({
        success: true,
        token,
        user: { username: envAdminUser, role: 'super_admin' }
      });
    }

    if (!isMatch || !adminUser) {
      return res.status(401).json({ success: false, message: INVALID_CREDENTIALS_MSG });
    }

    // 5. Generate JWT token (24h expiry)
    const token = generateToken({
      id: adminUser.id,
      username: adminUser.username,
      role: adminUser.role || 'super_admin'
    });

    // 6. Log successful login (non-blocking)
    (async () => {
      try {
        await supabase.from('activity_logs').insert([{
          id: `log-${Date.now()}`,
          user_name: adminUser.username,
          action: 'Admin Login',
          details: 'Successful login to Admin Dashboard',
          ip_address: req.ip || 'unknown',
          timestamp: new Date().toISOString()
        }]);
      } catch (e) {}
    })();

    return res.json({
      success: true,
      token,
      user: {
        username: adminUser.username,
        role: adminUser.role || 'super_admin'
      }
    });

  } catch (error) {
    console.error('[Auth] Login error:', error.message);
    return res.status(401).json({ success: false, message: INVALID_CREDENTIALS_MSG });
  }
});

// ================================================================
// GET /api/auth/me (Verify current token + return user info)
// ================================================================
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('id, username, role, created_at')
      .eq('id', req.user.id)
      .limit(1);

    if (!error && data && data.length > 0) {
      return res.json({ success: true, user: data[0] });
    }

    // Fallback: token is valid, return payload (works when DB is unavailable)
    return res.json({
      success: true,
      user: {
        id: req.user.id,
        username: req.user.username,
        role: req.user.role || 'super_admin'
      }
    });
  } catch (error) {
    console.error('[Auth] /me error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error verifying session.' });
  }
});

// ================================================================
// POST /api/auth/update-credentials (Change admin username/password)
// ================================================================
router.post('/update-credentials', authenticateToken, async (req, res) => {
  try {
    const { newUsername, newPassword } = req.body;

    if (!newUsername || !newPassword || newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Username and password (minimum 6 characters) are required.'
      });
    }

    const cleanUsername = newUsername.trim().toLowerCase();
    const hash = await bcrypt.hash(newPassword.trim(), 10);

    const { error } = await supabase
      .from('admin_users')
      .update({ username: cleanUsername, password_hash: hash })
      .eq('id', req.user.id);

    if (error) {
      return res.status(500).json({ success: false, message: 'Failed to update credentials.' });
    }

    // Log activity
    (async () => {
      try {
        await supabase.from('activity_logs').insert([{
          id: `log-${Date.now()}`,
          user_name: req.user.username,
          action: 'Credentials Updated',
          details: `Username changed to ${cleanUsername}`,
          ip_address: req.ip || 'unknown',
          timestamp: new Date().toISOString()
        }]);
      } catch (e) {}
    })();

    return res.json({ success: true, message: 'Admin credentials updated successfully.' });
  } catch (error) {
    console.error('[Auth] Update credentials error:', error.message);
    return res.status(500).json({ success: false, message: 'Error updating credentials.' });
  }
});

export default router;
