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

console.log('🧹 CLEANING UP DEMO IMAGES\n');
console.log('============================================================\n');

async function cleanupDemoImages() {
  try {
    // Connect to MongoDB
    console.log('📡 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✓ Connected to MongoDB\n');

    // Get current site data
    console.log('📥 Fetching current site data...');
    const siteData = await SiteData.findOne({ dataKey: 'main' });
    
    if (!siteData) {
      console.log('❌ No site data found!');
      return;
    }
    
    console.log('✓ Site data loaded\n');
    console.log('============================================================\n');

    const data = siteData.data;
    let removedCount = 0;

    // Remove demo images from hero
    if (data.hero?.backgroundImage?.includes('demo-test')) {
      console.log('🎨 Removing demo image from Hero section...');
      console.log(`   Removed: ${data.hero.backgroundImage}`);
      // Restore to first gallery image or remove
      data.hero.backgroundImage = 'https://backend.vikascateringservice.com/uploads/1771220993821-360100129.jpg';
      removedCount++;
    }

    // Remove demo images from about
    if (data.about?.image?.includes('demo-test')) {
      console.log('📖 Removing demo image from About section...');
      console.log(`   Removed: ${data.about.image}`);
      data.about.image = 'https://backend.vikascateringservice.com/uploads/1771220993828-396589484.jpg';
      removedCount++;
    }

    // Remove demo images from services
    if (data.services?.items) {
      const beforeCount = data.services.items.length;
      data.services.items = data.services.items.filter(item => !item.image?.includes('demo-test'));
      const afterCount = data.services.items.length;
      if (beforeCount !== afterCount) {
        console.log('🎉 Removing demo images from Services section...');
        console.log(`   Removed: ${beforeCount - afterCount} service item(s)`);
        removedCount += (beforeCount - afterCount);
      }
    }

    // Remove demo images from menu
    if (data.menu?.items) {
      const beforeCount = data.menu.items.length;
      data.menu.items = data.menu.items.filter(item => !item.image?.includes('demo-test'));
      const afterCount = data.menu.items.length;
      if (beforeCount !== afterCount) {
        console.log('🍽️  Removing demo images from Menu section...');
        console.log(`   Removed: ${beforeCount - afterCount} menu item(s)`);
        removedCount += (beforeCount - afterCount);
      }
    }

    // Remove demo images from gallery
    if (data.gallery?.images) {
      const beforeCount = data.gallery.images.length;
      data.gallery.images = data.gallery.images.filter(img => !img.includes('demo-test'));
      const afterCount = data.gallery.images.length;
      if (beforeCount !== afterCount) {
        console.log('📸 Removing demo images from Gallery section...');
        console.log(`   Removed: ${beforeCount - afterCount} gallery image(s)`);
        removedCount += (beforeCount - afterCount);
      }
    }

    console.log('\n============================================================\n');

    if (removedCount === 0) {
      console.log('✓ No demo images found to remove\n');
    } else {
      console.log(`💾 Saving cleaned data to database...\n`);
      
      await SiteData.findOneAndUpdate(
        { dataKey: 'main' },
        { data: data, updatedAt: new Date() },
        { new: true }
      );
      
      console.log('✓ Data saved successfully\n');
      console.log(`✅ Removed ${removedCount} demo image(s) from database\n`);
    }

    console.log('============================================================\n');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('✓ MongoDB connection closed\n');
  }
}

cleanupDemoImages();
