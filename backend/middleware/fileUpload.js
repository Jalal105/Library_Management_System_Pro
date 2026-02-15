const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// File type validation
const ALLOWED_FILE_TYPES = {
  'application/pdf': '.pdf',
  'application/epub+zip': '.epub',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
  'application/msword': '.doc',
  'text/plain': '.txt',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
  'application/vnd.ms-excel': '.xls',
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/gif': '.gif',
};

const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const contentType = req.body.type || 'other';
    const typeDir = path.join(uploadsDir, contentType);

    if (!fs.existsSync(typeDir)) {
      fs.mkdirSync(typeDir, { recursive: true });
    }

    cb(null, typeDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, name + '-' + uniqueSuffix + ext);
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  // Check MIME type
  if (!ALLOWED_FILE_TYPES[file.mimetype]) {
    return cb(
      new Error(
        `File type not allowed. Allowed types: ${Object.values(ALLOWED_FILE_TYPES).join(', ')}`
      ),
      false
    );
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return cb(new Error(`File size exceeds maximum limit of ${MAX_FILE_SIZE / (1024 * 1024)}MB`), false);
  }

  cb(null, true);
};

// Multer upload middleware
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
});

// Content type validation
const validateContentType = (req, res, next) => {
  const validTypes = ['ebook', 'journal', 'paper', 'thesis', 'notes', 'other'];

  if (req.body.type && !validTypes.includes(req.body.type)) {
    return res.status(400).json({
      success: false,
      message: `Invalid content type. Allowed types: ${validTypes.join(', ')}`,
    });
  }

  next();
};

// Storage management helper
const getStorageInfo = (uploadDir = uploadsDir) => {
  let totalSize = 0;

  const getDirectorySize = (dir) => {
    let size = 0;
    const files = fs.readdirSync(dir);

    files.forEach((file) => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        size += getDirectorySize(filePath);
      } else {
        size += stat.size;
      }
    });

    return size;
  };

  if (fs.existsSync(uploadDir)) {
    totalSize = getDirectorySize(uploadDir);
  }

  const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(2);
  const remainingMB = (5000 - totalSizeMB).toFixed(2); // 5GB total limit

  return {
    totalSize,
    totalSizeMB: parseFloat(totalSizeMB),
    remainingMB: parseFloat(remainingMB),
    percentUsed: ((totalSizeMB / 5000) * 100).toFixed(2),
  };
};

module.exports = {
  upload,
  validateContentType,
  getStorageInfo,
  ALLOWED_FILE_TYPES,
  MAX_FILE_SIZE,
};
