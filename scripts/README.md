# Utility Scripts

This folder contains utility scripts for database management and image uploads.

## Database Scripts

### check-mongodb.js
Check MongoDB connection and verify database access.

**Usage:**
```bash
cd scripts
node check-mongodb.js
```

### test-connection.js
Test MongoDB connection with detailed diagnostics.

**Usage:**
```bash
cd scripts
node test-connection.js
```

## Image Management Scripts

### upload-images.js
Upload images from `Frontend/src/assets/` to the server and update database with new URLs.

**Usage:**
```bash
cd scripts
BACKEND_URL=https://your-backend.com node upload-images.js
```

**Environment Variables:**
- `BACKEND_URL` - Your backend server URL
- `MONGODB_URI` - MongoDB connection string
- `ADMIN_USERNAME` - Admin username (default: admin)
- `ADMIN_PASSWORD` - Admin password (default: admin123)

### fix-image-urls.js
Fix image URLs in database by replacing localhost URLs with production URLs.

**Usage:**
```bash
cd scripts
BACKEND_URL=https://your-backend.com node fix-image-urls.js
```

### fix-all-images.js
Comprehensive image URL fixer that handles all image paths in the database.

**Usage:**
```bash
cd scripts
BACKEND_URL=https://your-backend.com node fix-all-images.js
```

## Notes

- All scripts read from `.env` file in the `server/` directory
- Make sure to set `BACKEND_URL` environment variable before running image scripts
- Scripts require MongoDB connection to be configured
- For detailed information, see [IMAGE_UPLOAD_GUIDE.md](../docs/IMAGE_UPLOAD_GUIDE.md)
