import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import FormData from 'form-data';
import axios from 'axios';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://intarjungupta_db_user:iM6kYdM9td723RHe@cluster0.vxgwivf.mongodb.net/catering-admin?retryWrites=true&w=majority';

// Server URL - reads from BACKEND_URL env variable
const SERVER_URL = process.env.BACKEND_URL || process.env.SERVER_URL || 'http://localhost:5000';

// Admin credentials for authentication
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

let authToken = null;

// Login to get auth token
async function login() {
  try {
    console.log('🔐 Logging in to get authentication token...');
    const response = await axios.post(`${SERVER_URL}/api/login`, {
      username: ADMIN_USERNAME,
      password: ADMIN_PASSWORD,
    });
    
    authToken = response.data.token;
    console.log('✓ Authentication successful\n');
    return true;
  } catch (error) {
    console.error('✗ Login failed:', error.message);
    return false;
  }
}

// Define the SiteData schema (same as in server/index.js)
const siteDataSchema = new mongoose.Schema({
  data: mongoose.Schema.Types.Mixed,
}, { timestamps: true });

const SiteData = mongoose.model('SiteData', siteDataSchema);

// Image mapping from local paths to asset names
const imageMapping = {
  'hero-bg.jpg': 'hero-bg.jpg',
  'about-award.jpg': 'about-award.jpg',
  'indian-cuisine.jpg': 'indian-cuisine.jpg',
  'south-indian.jpg': 'south-indian.jpg',
  'punjabi-cuisine.jpg': 'punjabi-cuisine.jpg',
  'italian-cuisine.jpg': 'italian-cuisine.jpg',
  'chinese-cuisine.jpg': 'chinese-cuisine.jpg',
  'festive-catering.jpg': 'festive-catering.jpg',
  'wedding-catering.jpg': 'wedding-catering.jpg',
  'corporate-catering.jpg': 'corporate-catering.jpg',
  'gallery-1.jpg': 'gallery-1.jpg',
  'gallery-2.jpg': 'gallery-2.jpg',
};

// Upload a single image
async function uploadImage(imagePath, imageName) {
  try {
    const form = new FormData();
    const fileStream = fs.createReadStream(imagePath);
    form.append('file', fileStream, imageName);

    const response = await axios.post(`${SERVER_URL}/api/upload`, form, {
      headers: {
        ...form.getHeaders(),
        'Authorization': `Bearer ${authToken}`,
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });

    console.log(`✓ Uploaded: ${imageName} -> ${response.data.url}`);
    return response.data.url;
  } catch (error) {
    console.error(`✗ Failed to upload ${imageName}:`, error.message);
    return null;
  }
}

// Upload all images
async function uploadAllImages() {
  const assetsDir = path.join(__dirname, '..', 'src', 'assets');
  const uploadedUrls = {};

  console.log('\n📤 Starting image upload...\n');

  for (const [fileName, assetName] of Object.entries(imageMapping)) {
    const imagePath = path.join(assetsDir, fileName);
    
    if (fs.existsSync(imagePath)) {
      const url = await uploadImage(imagePath, fileName);
      if (url) {
        uploadedUrls[assetName] = url;
      }
    } else {
      console.log(`⚠ File not found: ${fileName}`);
    }
  }

  return uploadedUrls;
}

// Replace image paths in the database
function replaceImagePaths(obj, uploadedUrls) {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => replaceImagePaths(item, uploadedUrls));
  }

  const newObj = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      // Check if it's an image path that needs replacement
      for (const [assetName, url] of Object.entries(uploadedUrls)) {
        if (value.includes(assetName) || value.includes(`/assets/${assetName}`)) {
          newObj[key] = url;
          console.log(`  Replaced: ${assetName} -> ${url}`);
          break;
        }
      }
      if (!newObj[key]) {
        newObj[key] = value;
      }
    } else {
      newObj[key] = replaceImagePaths(value, uploadedUrls);
    }
  }

  return newObj;
}

// Main function
async function main() {
  try {
    console.log('🚀 Image Upload & Database Update Script\n');
    console.log('Server URL:', SERVER_URL);
    console.log('MongoDB URI:', MONGODB_URI.replace(/:[^:@]+@/, ':****@'));

    // Step 0: Login to get auth token
    const loginSuccess = await login();
    if (!loginSuccess) {
      console.log('\n❌ Authentication failed. Exiting...');
      return;
    }

    // Step 1: Upload all images
    const uploadedUrls = await uploadAllImages();
    
    if (Object.keys(uploadedUrls).length === 0) {
      console.log('\n❌ No images were uploaded. Exiting...');
      return;
    }

    console.log('\n✅ Upload complete!\n');
    console.log('Uploaded URLs:', JSON.stringify(uploadedUrls, null, 2));

    // Step 2: Connect to MongoDB
    console.log('\n📊 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✓ Connected to MongoDB\n');

    // Step 3: Get current site data
    const siteDataDoc = await SiteData.findOne();
    
    if (!siteDataDoc) {
      console.log('❌ No site data found in database. Please initialize the site first.');
      await mongoose.disconnect();
      return;
    }

    console.log('📝 Updating database with new image URLs...\n');

    // Step 4: Replace image paths
    const updatedData = replaceImagePaths(siteDataDoc.data, uploadedUrls);

    // Step 5: Save to database
    siteDataDoc.data = updatedData;
    await siteDataDoc.save();

    console.log('\n✅ Database updated successfully!\n');

    // Disconnect
    await mongoose.disconnect();
    console.log('✓ Disconnected from MongoDB\n');
    console.log('🎉 All done! Your images are now hosted on the server.');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }
    process.exit(1);
  }
}

// Run the script
main();
