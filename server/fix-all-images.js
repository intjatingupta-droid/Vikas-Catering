import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://intarjungupta_db_user:iM6kYdM9td723RHe@cluster0.vxgwivf.mongodb.net/catering-admin?retryWrites=true&w=majority';
const PRODUCTION_URL = 'https://vikas-catering.onrender.com';

// Define the SiteData schema
const siteDataSchema = new mongoose.Schema({
  data: mongoose.Schema.Types.Mixed,
}, { timestamps: true });

const SiteData = mongoose.model('SiteData', siteDataSchema);

// Mapping of /src/assets filenames to uploaded URLs
const uploadedImages = {
  'hero-bg.jpg': `${PRODUCTION_URL}/uploads/1771220993821-360100129.jpg`,
  'about-award.jpg': `${PRODUCTION_URL}/uploads/1771220993828-396589484.jpg`,
  'indian-cuisine.jpg': `${PRODUCTION_URL}/uploads/1771220993832-915028909.jpg`,
  'south-indian.jpg': `${PRODUCTION_URL}/uploads/1771220993835-770527517.jpg`,
  'punjabi-cuisine.jpg': `${PRODUCTION_URL}/uploads/1771220993838-280671764.jpg`,
  'italian-cuisine.jpg': `${PRODUCTION_URL}/uploads/1771220993842-314975598.jpg`,
  'chinese-cuisine.jpg': `${PRODUCTION_URL}/uploads/1771220993845-420240580.jpg`,
  'festive-catering.jpg': `${PRODUCTION_URL}/uploads/1771220993849-701092426.jpg`,
  'wedding-catering.jpg': `${PRODUCTION_URL}/uploads/1771220993852-74965930.jpg`,
  'corporate-catering.jpg': `${PRODUCTION_URL}/uploads/1771220993855-646097186.jpg`,
  'gallery-1.jpg': `${PRODUCTION_URL}/uploads/1771220993857-291233180.jpg`,
  'gallery-2.jpg': `${PRODUCTION_URL}/uploads/1771220993859-748151459.jpg`,
};

// Replace /src/assets/ paths with uploaded URLs
function fixImagePaths(obj, path = '') {
  if (typeof obj !== 'object' || obj === null) {
    if (typeof obj === 'string' && obj.startsWith('/src/assets/')) {
      // Extract filename from path
      const filename = obj.split('/').pop();
      if (uploadedImages[filename]) {
        console.log(`  ✓ Fixed at ${path}: ${obj} -> ${uploadedImages[filename]}`);
        return uploadedImages[filename];
      } else {
        console.log(`  ⚠ No upload found for: ${obj} at ${path}`);
        return obj; // Keep original if no match
      }
    }
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item, index) => fixImagePaths(item, `${path}[${index}]`));
  }

  const newObj = {};
  for (const [key, value] of Object.entries(obj)) {
    const currentPath = path ? `${path}.${key}` : key;
    newObj[key] = fixImagePaths(value, currentPath);
  }

  return newObj;
}

async function main() {
  try {
    console.log('🔧 Fixing All Image Paths\n');
    console.log('MongoDB URI:', MONGODB_URI.replace(/:[^:@]+@/, ':****@'));
    console.log('Production URL:', PRODUCTION_URL);

    // Connect to MongoDB
    console.log('\n📊 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✓ Connected to MongoDB\n');

    // Get current site data
    const siteDataDoc = await SiteData.findOne();
    
    if (!siteDataDoc) {
      console.log('❌ No site data found in database.');
      await mongoose.disconnect();
      return;
    }

    console.log('📝 Fixing all /src/assets/ paths...\n');

    // Fix all image paths
    const updatedData = fixImagePaths(siteDataDoc.data);

    // Save to database
    siteDataDoc.data = updatedData;
    await siteDataDoc.save();

    console.log('\n✅ All image paths fixed!\n');

    // Disconnect
    await mongoose.disconnect();
    console.log('✓ Disconnected from MongoDB\n');
    console.log('🎉 Done! All images now use production URLs.');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }
    process.exit(1);
  }
}

main();
