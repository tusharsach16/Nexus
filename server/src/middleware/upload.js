import multer from 'multer';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use OS temp dir in production environments (e.g., Render) to avoid
// permission issues when writing inside the app source tree.
const tempDir = path.join(os.tmpdir(), 'nexus-chat-uploads');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'image/', 
    'video/', 
    'application/pdf', 
    'application/zip', 
    'application/x-zip-compressed',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  if (allowedMimeTypes.some(type => file.mimetype.startsWith(type) || file.mimetype === type)) {
    cb(null, true);
  } else {
    cb(new Error('File type not supported. Please upload images, videos, or documents (PDF, Word, ZIP).'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

export const singleFile = (fieldName) => (req, res, next) => {
  upload.single(fieldName)(req, res, (err) => {
    if (!err) return next();

    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return next({ statusCode: 400, message: 'File too large. Maximum allowed size is 10MB.' });
      }
      return next({ statusCode: 400, message: `Upload error: ${err.message}` });
    }

    return next({ statusCode: 400, message: err.message || 'File upload failed' });
  });
};

export default upload;
