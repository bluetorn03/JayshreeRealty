import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'jayshree_realty_jwt_secret_key_2026_super_secure_key';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token required.' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Invalid or expired token.' });
    }
    req.user = user;
    next();
  });
};

export const generateToken = (userPayload) => {
  return jwt.sign(userPayload, JWT_SECRET, { expiresIn: '24h' });
};
