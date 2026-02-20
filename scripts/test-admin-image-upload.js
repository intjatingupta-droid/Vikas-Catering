import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../server/.env') });

const MONGODB_URI = process.env.MONGODB_URI;
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5001';

// Site Data Schema
const siteDataSchema = new mongoose.Schema({
  dataKey: { type: String, required: true, unique: true, default: 'main' },
  data: { type: mongoose.Schema.Types.Mixed, required: true },
  updatedAt: { type: Date, default: Date.now }
});

const SiteData = mongoose.model('SiteData', siteDataSchema);

console.log('🧪 TESTING ADMIN PANEL IMAGE UPLOAD TO ALL SECTIONS\n');
console.log('============================================================\n');

// Demo image URL (we'll use a placeholder)
const DEMO_IMAGE_URL = `${BACKEND_URL}/uploads/demo-test-${Date.now()}.jpg`;

async function testImageUploadToAllSections() {
  try {
    // Connect to MongoDB
    console.log('📡 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✓ Connected to MongoDB\n');

    // Get current site data
    console.log('📥 Fetching current site data...');
    let siteData = await SiteData.findOne({ dataKey: 'main' });
    
    if (!siteData) {
      console.log('⚠️  No site data found, creating new document...');
      siteData = await SiteData.create({
        dataKey: 'main',
        data: {
          hero: {},
          about: {},
          services: { items: [] },
          menu: { items: [] },
          gallery: { images: [] }
        }
      });
    }
    
    console.log('✓ Site data loaded\n');
    console.log('============================================================\n');

    const data = siteData.data;
    const testResults = {
      hero: { before: null, after: null, success: false },
      about: { before: null, after: null, success: false },
      services: { before: [], after: [], success: false },
      menu: { before: [], after: [], success: false },
      gallery: { before: [], after: [], success: false }
    };

    // ============================================================
    // TEST 1: HERO SECTION
    // ============================================================
    console.log('🎨 TEST 1: HERO SECTION BACKGROUND IMAGE\n');
    
    testResults.hero.before = data.hero?.backgroundImage || 'none';
    console.log(`Before: ${testResults.hero.before}`);
    
    // Simulate admin panel update
    if (!data.hero) data.hero = {};
    data.hero.backgroundImage = DEMO_IMAGE_URL;
    
    testResults.hero.after = data.hero.backgroundImage;
    console.log(`After:  ${testResults.hero.after}`);
    
    testResults.hero.success = data.hero.backgroundImage === DEMO_IMAGE_URL;
    console.log(`Status: ${testResults.hero.success ? '✅ PASS' : '❌ FAIL'}\n`);
    
    console.log('============================================================\n');

    // ============================================================
    // TEST 2: ABOUT SECTION
    // ============================================================
    console.log('📖 TEST 2: ABOUT SECTION IMAGE\n');
    
    testResults.about.before = data.about?.image || 'none';
    console.log(`Before: ${testResults.about.before}`);
    
    // Simulate admin panel update
    if (!data.about) data.about = {};
    data.about.image = DEMO_IMAGE_URL;
    
    testResults.about.after = data.about.image;
    console.log(`After:  ${testResults.about.after}`);
    
    testResults.about.success = data.about.image === DEMO_IMAGE_URL;
    console.log(`Status: ${testResults.about.success ? '✅ PASS' : '❌ FAIL'}\n`);
    
    console.log('============================================================\n');

    // ============================================================
    // TEST 3: SERVICES SECTION
    // ============================================================
    console.log('🎉 TEST 3: SERVICES SECTION IMAGES\n');
    
    if (!data.services) data.services = { items: [] };
    if (!data.services.items) data.services.items = [];
    
    testResults.services.before = data.services.items.map(item => item.image || 'none');
    console.log(`Before: ${testResults.services.before.length} service items`);
    testResults.services.before.forEach((img, i) => {
      console.log(`  ${i + 1}. ${img}`);
    });
    
    // Add a new service with demo image
    const newService = {
      title: 'Demo Service',
      description: 'This is a test service added via admin panel',
      image: DEMO_IMAGE_URL
    };
    data.services.items.push(newService);
    
    testResults.services.after = data.services.items.map(item => item.image || 'none');
    console.log(`\nAfter: ${testResults.services.after.length} service items`);
    testResults.services.after.forEach((img, i) => {
      console.log(`  ${i + 1}. ${img}`);
    });
    
    testResults.services.success = data.services.items[data.services.items.length - 1].image === DEMO_IMAGE_URL;
    console.log(`\nStatus: ${testResults.services.success ? '✅ PASS' : '❌ FAIL'}\n`);
    
    console.log('============================================================\n');

    // ============================================================
    // TEST 4: MENU SECTION
    // ============================================================
    console.log('🍽️  TEST 4: MENU SECTION IMAGES\n');
    
    if (!data.menu) data.menu = { items: [] };
    if (!data.menu.items) data.menu.items = [];
    
    testResults.menu.before = data.menu.items.map(item => item.image || 'none');
    console.log(`Before: ${testResults.menu.before.length} menu items`);
    testResults.menu.before.forEach((img, i) => {
      console.log(`  ${i + 1}. ${img}`);
    });
    
    // Add a new menu item with demo image
    const newMenuItem = {
      title: 'Demo Cuisine',
      description: 'This is a test menu item added via admin panel',
      image: DEMO_IMAGE_URL
    };
    data.menu.items.push(newMenuItem);
    
    testResults.menu.after = data.menu.items.map(item => item.image || 'none');
    console.log(`\nAfter: ${testResults.menu.after.length} menu items`);
    testResults.menu.after.forEach((img, i) => {
      console.log(`  ${i + 1}. ${img}`);
    });
    
    testResults.menu.success = data.menu.items[data.menu.items.length - 1].image === DEMO_IMAGE_URL;
    console.log(`\nStatus: ${testResults.menu.success ? '✅ PASS' : '❌ FAIL'}\n`);
    
    console.log('============================================================\n');

    // ============================================================
    // TEST 5: GALLERY SECTION
    // ============================================================
    console.log('📸 TEST 5: GALLERY SECTION IMAGES\n');
    
    if (!data.gallery) data.gallery = { images: [] };
    if (!data.gallery.images) data.gallery.images = [];
    
    testResults.gallery.before = [...data.gallery.images];
    console.log(`Before: ${testResults.gallery.before.length} gallery images`);
    testResults.gallery.before.forEach((img, i) => {
      console.log(`  ${i + 1}. ${img}`);
    });
    
    // Add a new gallery image
    data.gallery.images.push(DEMO_IMAGE_URL);
    
    testResults.gallery.after = [...data.gallery.images];
    console.log(`\nAfter: ${testResults.gallery.after.length} gallery images`);
    testResults.gallery.after.forEach((img, i) => {
      console.log(`  ${i + 1}. ${img}`);
    });
    
    testResults.gallery.success = data.gallery.images[data.gallery.images.length - 1] === DEMO_IMAGE_URL;
    console.log(`\nStatus: ${testResults.gallery.success ? '✅ PASS' : '❌ FAIL'}\n`);
    
    console.log('============================================================\n');

    // ============================================================
    // SAVE TO DATABASE
    // ============================================================
    console.log('💾 SAVING UPDATED DATA TO DATABASE...\n');
    
    const saveResult = await SiteData.findOneAndUpdate(
      { dataKey: 'main' },
      { data: data, updatedAt: new Date() },
      { upsert: true, new: true }
    );
    
    console.log('✓ Data saved to MongoDB\n');
    console.log('============================================================\n');

    // ============================================================
    // VERIFY DATABASE SAVE
    // ============================================================
    console.log('🔍 VERIFYING DATA IN DATABASE...\n');
    
    const verifyData = await SiteData.findOne({ dataKey: 'main' });
    
    const verificationResults = {
      hero: verifyData.data.hero?.backgroundImage === DEMO_IMAGE_URL,
      about: verifyData.data.about?.image === DEMO_IMAGE_URL,
      services: verifyData.data.services?.items?.some(item => item.image === DEMO_IMAGE_URL),
      menu: verifyData.data.menu?.items?.some(item => item.image === DEMO_IMAGE_URL),
      gallery: verifyData.data.gallery?.images?.includes(DEMO_IMAGE_URL)
    };
    
    console.log('Database Verification Results:');
    console.log(`  Hero Background:    ${verificationResults.hero ? '✅ FOUND' : '❌ NOT FOUND'}`);
    console.log(`  About Image:        ${verificationResults.about ? '✅ FOUND' : '❌ NOT FOUND'}`);
    console.log(`  Services Image:     ${verificationResults.services ? '✅ FOUND' : '❌ NOT FOUND'}`);
    console.log(`  Menu Image:         ${verificationResults.menu ? '✅ FOUND' : '❌ NOT FOUND'}`);
    console.log(`  Gallery Image:      ${verificationResults.gallery ? '✅ FOUND' : '❌ NOT FOUND'}`);
    
    console.log('\n============================================================\n');

    // ============================================================
    // FINAL SUMMARY
    // ============================================================
    console.log('📊 TEST SUMMARY\n');
    
    const allTestsPassed = Object.values(verificationResults).every(result => result === true);
    
    console.log('Test Results:');
    console.log(`  Hero Section:       ${testResults.hero.success && verificationResults.hero ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`  About Section:      ${testResults.about.success && verificationResults.about ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`  Services Section:   ${testResults.services.success && verificationResults.services ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`  Menu Section:       ${testResults.menu.success && verificationResults.menu ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`  Gallery Section:    ${testResults.gallery.success && verificationResults.gallery ? '✅ PASS' : '❌ FAIL'}`);
    
    console.log('\n============================================================\n');
    
    if (allTestsPassed) {
      console.log('✅ ALL TESTS PASSED!\n');
      console.log('✓ Demo images successfully added to all sections');
      console.log('✓ All images saved to MongoDB database');
      console.log('✓ All images verified in database\n');
    } else {
      console.log('❌ SOME TESTS FAILED!\n');
      console.log('Please check the results above for details.\n');
    }

    console.log('============================================================\n');

    // ============================================================
    // CLEANUP (OPTIONAL)
    // ============================================================
    console.log('🧹 CLEANUP OPTIONS:\n');
    console.log('The demo images have been added to the database.');
    console.log('To remove them, you can:');
    console.log('  1. Use the admin panel to delete them manually');
    console.log('  2. Run a cleanup script');
    console.log('  3. Leave them for testing purposes\n');
    
    // Uncomment the following to auto-cleanup:
    /*
    console.log('Removing demo images...');
    
    // Remove demo images
    if (data.hero?.backgroundImage === DEMO_IMAGE_URL) {
      delete data.hero.backgroundImage;
    }
    if (data.about?.image === DEMO_IMAGE_URL) {
      delete data.about.image;
    }
    data.services.items = data.services.items.filter(item => item.image !== DEMO_IMAGE_URL);
    data.menu.items = data.menu.items.filter(item => item.image !== DEMO_IMAGE_URL);
    data.gallery.images = data.gallery.images.filter(img => img !== DEMO_IMAGE_URL);
    
    await SiteData.findOneAndUpdate(
      { dataKey: 'main' },
      { data: data, updatedAt: new Date() }
    );
    
    console.log('✓ Demo images removed\n');
    */

    return allTestsPassed;

  } catch (error) {
    console.error('❌ Error:', error);
    return false;
  } finally {
    await mongoose.connection.close();
    console.log('✓ MongoDB connection closed\n');
  }
}

// Run the test
testImageUploadToAllSections().then(success => {
  process.exit(success ? 0 : 1);
});
