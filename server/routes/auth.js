import express from 'express';
import bcrypt from 'bcryptjs';
import { getOne, run } from '../db/database.js';
import { generateToken, authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Invalid username or password.' });
    }

    const cleanUsername = username.trim().toLowerCase();
    const adminUser = await getOne(`SELECT * FROM admin_users WHERE username = ?`, [cleanUsername]);

    if (!adminUser) {
      // Return generic error message with NO credential hints
      return res.status(401).json({ success: false, message: 'Invalid username or password.' });
    }

    const isMatch = await bcrypt.compare(password.trim(), adminUser.password_hash);
    if (!isMatch) {
      // Return generic error message with NO credential hints
      return res.status(401).json({ success: false, message: 'Invalid username or password.' });
    }

    const token = generateToken({
      id: adminUser.id,
      username: adminUser.username,
      role: adminUser.role
    });

    // Log login activity
    await run(`INSERT INTO activity_logs (id, user, action, details, ip_address) VALUES (?, ?, ?, ?, ?)`, [
      `log-${Date.now()}`,
      adminUser.username,
      'Admin Login',
      'Successful login to Admin Dashboard',
      req.ip
    ]);

    return res.json({
      success: true,
      token,
      user: {
        username: adminUser.username,
        role: adminUser.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Invalid username or password.' });
  }
});

// GET /api/auth/me
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const adminUser = await getOne(`SELECT id, username, role, created_at FROM admin_users WHERE id = ?`, [req.user.id]);
    if (!adminUser) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    return res.json({ success: true, user: adminUser });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST /api/auth/update-credentials
router.post('/update-credentials', authenticateToken, async (req, res) => {
  try {
    const { newUsername, newPassword } = req.body;
    if (!newUsername || !newPassword || newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Username and password (min 6 chars) are required.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newPassword.trim(), salt);

    await run(`UPDATE admin_users SET username = ?, password_hash = ? WHERE id = ?`, [
      newUsername.trim().toLowerCase(),
      hash,
      req.user.id
    ]);

    await run(`INSERT INTO activity_logs (id, user, action, details, ip_address) VALUES (?, ?, ?, ?, ?)`, [
      `log-${Date.now()}`,
      req.user.username,
      'Credentials Updated',
      `Username updated to ${newUsername.trim().toLowerCase()}`,
      req.ip
    ]);

    return res.json({ success: true, message: 'Credentials updated successfully.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error updating credentials' });
  }
});

export default router;
