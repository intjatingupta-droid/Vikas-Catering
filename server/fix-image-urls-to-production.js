import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
const NEW_BACKEND_URL = process.env.BACKEND_URL || 'https://vikascateringservice.com/api';

console.log('🔧 UPDATING IMAGE URLS TO PRODUCTION\n');
console.log('============================================================\n');
console.log(`Target Backend URL: ${NEW_BACKEND_URL}\n`);

const siteDataSchema = new mongoose.Schema({
  dataKey: { type: String, required: true, unique: true, default: 'main' },
  data: { type: mongoose.Schema.Types.Mixed, required: true },
  updatedAt: { type: Date, default: Date.now }
});

const SiteData = mongoose.model('SiteData', siteDataSchema);

// List of old URLs to replace
const OLD_URLS = [
  'http://localhost:5001',
  'http://localhost:5000',
  'https://vikas-catering.onrender.com',
  'https://backend.vikascateringservice.com',
  'http://backend.vikascateringservice.com'
];

function replaceImageUrls(obj) {
  if (typeof obj === 'string') {
    for (const oldUrl of OLD_URLS) {
      if (obj.includes(oldUrl)) {
        const newUrl = obj.replace(oldUrl, NEW_BACKEND_URL);
        console.log(`  ✓ ${obj}`);
        console.log(`    → ${newUrl}`);
        return newUrl;
      }
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

async function updateUrls() {
  try {
    console.log('📡 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✓ Connected to MongoDB\n');

    console.log('📥 Fetching site data...');
    const siteData = await SiteData.findOne({ dataKey: 'main' });
    
    if (!siteData) {
      console.log('❌ No site data found!');
      return;
    }

    console.log('✓ Site data found\n');
    console.log('============================================================\n');
    console.log('🔄 Replacing URLs...\n');

    const originalData = JSON.stringify(siteData.data);
    let totalOldUrls = 0;
    
    OLD_URLS.forEach(oldUrl => {
      const count = (originalData.match(new RegExp(oldUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
      totalOldUrls += count;
    });

    console.log(`Found ${totalOldUrls} URLs to update\n`);

    if (totalOldUrls === 0) {
      console.log('✅ No URLs need to be updated!\n');
      return;
    }

    const updatedData = replaceImageUrls(siteData.data);

    console.log('\n============================================================\n');
    console.log('💾 Saving updated data to MongoDB...\n');

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
    const newUrlCount = (verifyString.match(new RegExp(NEW_BACKEND_URL.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
    
    let remainingOldUrls = 0;
    OLD_URLS.forEach(oldUrl => {
      const count = (verifyString.match(new RegExp(oldUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
      remainingOldUrls += count;
    });

    console.log('📊 VERIFICATION:\n');
    console.log(`Old URLs remaining: ${remainingOldUrls}`);
    console.log(`New URLs found: ${newUrlCount}\n`);

    if (remainingOldUrls === 0 && newUrlCount > 0) {
      console.log('✅ SUCCESS! All URLs have been updated to production!\n');
    } else {
      console.log('⚠️  Some URLs may not have been updated. Please check manually.\n');
    }

    console.log('============================================================\n');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('✓ MongoDB connection closed\n');
  }
}

updateUrls();
