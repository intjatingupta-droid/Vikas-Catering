# Image Upload Script Guide

This script uploads all images from `src/assets` to the server and updates the MongoDB database with the proper URLs.

## Prerequisites

1. Make sure the backend server is running locally:
   ```bash
   cd server
   npm run dev
   ```

2. Ensure MongoDB connection is working (check `.env` file)

## How to Run

### Option 1: Upload to Local Server (Recommended for Testing)

1. Start the backend server in one terminal:
   ```bash
   cd server
   npm run dev
   ```

2. In another terminal, run the upload script:
   ```bash
   cd server
   npm run upload-images
   ```

### Option 2: Upload to Production Server

1. Edit `server/upload-images.js` and change the SERVER_URL:
   ```javascript
   const SERVER_URL = 'https://vikas-catering.onrender.com';
   ```

2. Run the script:
   ```bash
   cd server
   npm run upload-images
   ```

## What the Script Does

1. **Uploads Images**: Reads all images from `src/assets/` and uploads them to the server via the `/api/upload` endpoint
2. **Updates Database**: Connects to MongoDB and replaces all image paths (like `/src/assets/hero-bg.jpg`) with the uploaded URLs (like `http://localhost:5000/uploads/hero-bg.jpg`)
3. **Preserves Data**: Only updates image URLs, all other data remains unchanged

## Images That Will Be Uploaded

- hero-bg.jpg
- about-award.jpg
- indian-cuisine.jpg
- south-indian.jpg
- punjabi-cuisine.jpg
- italian-cuisine.jpg
- chinese-cuisine.jpg
- festive-catering.jpg
- wedding-catering.jpg
- corporate-catering.jpg
- gallery-1.jpg
- gallery-2.jpg

## Troubleshooting

### "Failed to upload" errors
- Make sure the backend server is running
- Check that the SERVER_URL is correct
- Verify the images exist in `src/assets/`

### "No site data found in database"
- Log in to the admin panel first to initialize the database
- Make sure MongoDB connection is working

### "Connection refused"
- Ensure the backend server is running on the correct port
- Check firewall settings

## After Running

Once the script completes successfully:
1. All images will be stored in `server/uploads/`
2. The database will have proper URLs instead of `/src/assets/` paths
3. Images will work in both development and production
4. You can commit and push the changes to deploy

## Note

The uploaded images in `server/uploads/` should be committed to Git so they're available in production. Make sure `server/uploads/` is NOT in `.gitignore`.
