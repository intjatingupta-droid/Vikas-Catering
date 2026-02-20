import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../server/.env') });

const MONGODB_URI = process.env.MONGODB_URI;

// Site Data Schema
const siteDataSchema = new mongoose.Schema({
  dataKey: { type: String, required: true, unique: true, default: 'main' },
  data: { type: mongoose.Schema.Types.Mixed, required: true },
  updatedAt: { type: Date, default: Date.now }
});

const SiteData = mongoose.model('SiteData', siteDataSchema);

// The correct backend URL
const OLD_URL = 'https://vikas-catering.onrender.com';
const NEW_URL = 'https://backend.vikascateringservice.com';

console.log('🔧 FIXING IMAGE URLS TO CUSTOM DOMAIN\n');
console.log('============================================================\n');
console.log(`Old URL: ${OLD_URL}`);
console.log(`New URL: ${NEW_URL}\n`);

function replaceImageUrls(obj) {
  if (typeof obj === 'string') {
    if (obj.includes(OLD_URL)) {
      const newUrl = obj.replace(OLD_URL, NEW_URL);
      console.log(`  ✓ ${obj}`);
      console.log(`    → ${newUrl}`);
      return newUrl;
    }
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => replaceImageUrls(item));
  }
  
  if (obj && typeof obj === 'object') {
    const newObj = {};
    for (const key in obj) {
      newObj[key] = replaceImageUrls(obj[key]);
    }
    return newObj;
  }
  
  return obj;
}

async function fixImageUrls() {
  try {
    // Connect to MongoDB
    console.log('📡 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✓ Connected to MongoDB\n');

    // Fetch site data
    console.log('📥 Fetching site data from MongoDB...');
    const siteData = await SiteData.findOne({ dataKey: 'main' });
    
    if (!siteData) {
      console.log('❌ No site data found in MongoDB!');
      return;
    }
    
    console.log('✓ Site data found\n');
    console.log('============================================================\n');

    const originalData = JSON.stringify(siteData.data);
    
    // Count occurrences
    const oldUrlCount = (originalData.match(new RegExp(OLD_URL.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
    
    console.log(`Found ${oldUrlCount} occurrences of old URL\n`);
    
    if (oldUrlCount === 0) {
      console.log('✅ No URLs need to be updated!\n');
      return;
    }

    console.log('🔄 Replacing URLs...\n');
    
    // Replace URLs
    const updatedData = replaceImageUrls(siteData.data);
    
    console.log('\n============================================================\n');
    console.log('💾 Saving updated data to MongoDB...');
    
    // Save to database
    await SiteData.findOneAndUpdate(
      { dataKey: 'main' },
      { data: updatedData, updatedAt: new Date() },
      { new: true }
    );
    
    console.log('✓ Data saved successfully!\n');
    console.log('============================================================\n');
    
    // Verify
    const verifyData = await SiteData.findOne({ dataKey: 'main' });
    const verifyString = JSON.stringify(verifyData.data);
    const newUrlCount = (verifyString.match(new RegExp(NEW_URL.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
    const remainingOldUrls = (verifyString.match(new RegExp(OLD_URL.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
    
    console.log('📊 VERIFICATION:\n');
    console.log(`Old URLs remaining: ${remainingOldUrls}`);
    console.log(`New URLs found: ${newUrlCount}`);
    
    if (remainingOldUrls === 0 && newUrlCount > 0) {
      console.log('\n✅ SUCCESS! All URLs have been updated to the custom domain!\n');
    } else {
      console.log('\n⚠️  Some URLs may not have been updated. Please check manually.\n');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('✓ MongoDB connection closed\n');
  }
}

fixImageUrls();
