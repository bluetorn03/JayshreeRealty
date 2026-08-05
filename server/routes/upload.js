import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { authenticateToken } from '../middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, '..', '..', 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const sanitizedBase = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    cb(null, `${sanitizedBase}_${Date.now()}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.pdf', '.svg'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('File format not supported. Upload JPG, PNG, WEBP, GIF, SVG or PDF files.'), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB max file size
  fileFilter
});

const router = express.Router();

// POST /api/upload (Single File Upload)
router.post('/', authenticateToken, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }
    const publicUrl = `/uploads/${req.file.filename}`;
    return res.json({
      success: true,
      url: publicUrl,
      fileUrl: publicUrl,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'File upload failed.' });
  }
});

// POST /api/upload/multiple (Multiple Files Upload)
router.post('/multiple', authenticateToken, upload.array('files', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded.' });
    }
    const urls = req.files.map(file => `/uploads/${file.filename}`);
    return res.json({
      success: true,
      urls,
      fileUrls: urls,
      count: req.files.length
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Multiple files upload failed.' });
  }
});

export default router;
