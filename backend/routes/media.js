const express = require('express');
const multer = require('multer');
const initAWS = require('../config/aws');
const AWS = initAWS();
const router = express.Router();

// Local upload (for EJS create post). For production use S3 presigned uploads.
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

router.post('/upload-local', upload.single('file'), (req, res) => {
  res.json({ url: `/uploads/${req.file.filename}` });
});

// S3 presign (example)
router.post('/presign', async (req, res) => {
  const { filename, contentType } = req.body;
  const key = `uploads/${Date.now()}-${filename}`;
  const s3 = new AWS.S3();
  const params = { Bucket: process.env.S3_BUCKET_NAME, Key: key, Expires: 60, ContentType: contentType, ACL: 'public-read' };
  const url = s3.getSignedUrl('putObject', params);
  res.json({ url, key, publicUrl: `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}` });
});

module.exports = router;
