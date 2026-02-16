import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://intarjungupta_db_user:iM6kYdM9td723RHe@cluster0.vxgwivf.mongodb.net/catering-admin?retryWrites=true&w=majority';
const PRODUCTION_URL = process.env.BACKEND_URL || 'https://vikas-catering.onrender.com';

// Define the SiteData schema
const siteDataSchema = new mongoose.Schema({
  data: mongoose.Schema.Types.Mixed,
}, { timestamps: true });

const SiteData = mongoose.model('SiteData', siteDataSchema);

// Replace localhost URLs with production URLs
function replaceUrls(obj) {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => replaceUrls(item));
  }

  const newObj = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string' && value.includes('http://localhost:5000/uploads/')) {
      newObj[key] = value.replace('http://localhost:5000', PRODUCTION_URL);
      console.log(`  Fixed: ${key}`);
    } else {
      newObj[key] = replaceUrls(value);
    }
  }

  return newObj;
}

async function main() {
  try {
    console.log('🔧 Fixing Image URLs Script\n');
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

    console.log('📝 Replacing localhost URLs with production URLs...\n');

    // Replace URLs
    const updatedData = replaceUrls(siteDataDoc.data);

    // Save to database
    siteDataDoc.data = updatedData;
    await siteDataDoc.save();

    console.log('\n✅ URLs updated successfully!\n');

    // Disconnect
    await mongoose.disconnect();
    console.log('✓ Disconnected from MongoDB\n');
    console.log('🎉 All done! Image URLs now point to production server.');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }
    process.exit(1);
  }
}

main();
