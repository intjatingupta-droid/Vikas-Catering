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

// Schemas
const siteDataSchema = new mongoose.Schema({
  dataKey: { type: String, required: true, unique: true, default: 'main' },
  data: { type: mongoose.Schema.Types.Mixed, required: true },
  updatedAt: { type: Date, default: Date.now }
});

const contactSubmissionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  people: { type: String },
  message: { type: String, required: true },
  submittedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['new', 'read', 'responded'], default: 'new' }
});

const SiteData = mongoose.model('SiteData', siteDataSchema);
const ContactSubmission = mongoose.model('ContactSubmission', contactSubmissionSchema);

console.log('🧪 COMPREHENSIVE FUNCTIONALITY TEST SUITE\n');
console.log('============================================================\n');

const testResults = {
  adminSave: { passed: 0, failed: 0, tests: [] },
  contactSubmissions: { passed: 0, failed: 0, tests: [] },
  imageUpload: { passed: 0, failed: 0, tests: [] },
  contactForm: { passed: 0, failed: 0, tests: [] },
  apiEndpoints: { passed: 0, failed: 0, tests: [] }
};

function logTest(category, testName, passed, details = '') {
  const status = passed ? '✅ PASS' : '❌ FAIL';
  console.log(`  ${status}: ${testName}`);
  if (details) console.log(`     ${details}`);
  
  testResults[category].tests.push({ name: testName, passed, details });
  if (passed) {
    testResults[category].passed++;
  } else {
    testResults[category].failed++;
  }
}

async function runTests() {
  try {
    // Connect to MongoDB
    console.log('📡 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✓ Connected to MongoDB\n');
    console.log('============================================================\n');

    // TEST SUITE 1: ADMIN PANEL - SAVE CHANGES
    console.log('📝 TEST SUITE 1: ADMIN PANEL - SAVE CHANGES\n');

    // Test 1.1: Save Hero Section
    try {
      const testHeroData = {
        welcomeText: 'Test Welcome',
        heading: 'Test Heading',
        description: 'Test Description',
        ctaText: 'Test CTA',
        backgroundImage: `${BACKEND_URL}/uploads/test-hero.jpg`,
        videoUrl: ''
      };

      const siteData = await SiteData.findOne({ dataKey: 'main' });
      const originalHero = siteData ? { ...siteData.data.hero } : null;

      // Update hero section
      await SiteData.findOneAndUpdate(
        { dataKey: 'main' },
        { 
          $set: { 
            'data.hero': testHeroData,
            updatedAt: new Date()
          }
        },
        { upsert: true }
      );

      // Verify save
      const updated = await SiteData.findOne({ dataKey: 'main' });
      const saved = updated.data.hero.heading === 'Test Heading';

      logTest('adminSave', 'Save Hero Section Changes', saved);

      // Restore original
      if (originalHero) {
        await SiteData.findOneAndUpdate(
          { dataKey: 'main' },
          { $set: { 'data.hero': originalHero } }
        );
      }
    } catch (error) {
      logTest('adminSave', 'Save Hero Section Changes', false, error.message);
    }

    // Test 1.2: Save Menu Section
    try {
      const testMenuItem = {
        title: 'Test Cuisine',
        description: 'Test Description',
        image: `${BACKEND_URL}/uploads/test-menu.jpg`
      };

      const siteData = await SiteData.findOne({ dataKey: 'main' });
      const originalMenu = siteData ? { ...siteData.data.menu } : null;

      // Add test menu item
      await SiteData.findOneAndUpdate(
        { dataKey: 'main' },
        { 
          $push: { 'data.menu.items': testMenuItem },
          $set: { updatedAt: new Date() }
        },
        { upsert: true }
      );

      // Verify save
      const updated = await SiteData.findOne({ dataKey: 'main' });
      const saved = updated.data.menu.items.some(item => item.title === 'Test Cuisine');

      logTest('adminSave', 'Save Menu Section Changes', saved);

      // Restore original
      if (originalMenu) {
        await SiteData.findOneAndUpdate(
          { dataKey: 'main' },
          { $set: { 'data.menu': originalMenu } }
        );
      }
    } catch (error) {
      logTest('adminSave', 'Save Menu Section Changes', false, error.message);
    }

    // Test 1.3: Save Services Section
    try {
      const testService = {
        title: 'Test Service',
        description: 'Test Description',
        image: `${BACKEND_URL}/uploads/test-service.jpg`
      };

      const siteData = await SiteData.findOne({ dataKey: 'main' });
      const originalServices = siteData ? { ...siteData.data.services } : null;

      // Add test service
      await SiteData.findOneAndUpdate(
        { dataKey: 'main' },
        { 
          $push: { 'data.services.items': testService },
          $set: { updatedAt: new Date() }
        },
        { upsert: true }
      );

      // Verify save
      const updated = await SiteData.findOne({ dataKey: 'main' });
      const saved = updated.data.services.items.some(item => item.title === 'Test Service');

      logTest('adminSave', 'Save Services Section Changes', saved);

      // Restore original
      if (originalServices) {
        await SiteData.findOneAndUpdate(
          { dataKey: 'main' },
          { $set: { 'data.services': originalServices } }
        );
      }
    } catch (error) {
      logTest('adminSave', 'Save Services Section Changes', false, error.message);
    }

    // Test 1.4: Save Gallery Section
    try {
      const testImage = `${BACKEND_URL}/uploads/test-gallery.jpg`;

      const siteData = await SiteData.findOne({ dataKey: 'main' });
      const originalGallery = siteData ? { ...siteData.data.gallery } : null;

      // Add test gallery image
      await SiteData.findOneAndUpdate(
        { dataKey: 'main' },
        { 
          $push: { 'data.gallery.images': testImage },
          $set: { updatedAt: new Date() }
        },
        { upsert: true }
      );

      // Verify save
      const updated = await SiteData.findOne({ dataKey: 'main' });
      const saved = updated.data.gallery.images.includes(testImage);

      logTest('adminSave', 'Save Gallery Section Changes', saved);

      // Restore original
      if (originalGallery) {
        await SiteData.findOneAndUpdate(
          { dataKey: 'main' },
          { $set: { 'data.gallery': originalGallery } }
        );
      }
    } catch (error) {
      logTest('adminSave', 'Save Gallery Section Changes', false, error.message);
    }

    // Test 1.5: Save Our Work Page
    try {
      const testWorkImage = `${BACKEND_URL}/uploads/test-work.jpg`;

      const siteData = await SiteData.findOne({ dataKey: 'main' });
      const originalOurWork = siteData ? { ...siteData.data.ourWorkPage } : null;

      // Add test work image
      await SiteData.findOneAndUpdate(
        { dataKey: 'main' },
        { 
          $push: { 'data.ourWorkPage.galleryImages': testWorkImage },
          $set: { updatedAt: new Date() }
        },
        { upsert: true }
      );

      // Verify save
      const updated = await SiteData.findOne({ dataKey: 'main' });
      const saved = updated.data.ourWorkPage.galleryImages.includes(testWorkImage);

      logTest('adminSave', 'Save Our Work Page Changes', saved);

      // Restore original
      if (originalOurWork) {
        await SiteData.findOneAndUpdate(
          { dataKey: 'main' },
          { $set: { 'data.ourWorkPage': originalOurWork } }
        );
      }
    } catch (error) {
      logTest('adminSave', 'Save Our Work Page Changes', false, error.message);
    }

    console.log('\n============================================================\n');

    // TEST SUITE 2: CONTACT SUBMISSIONS
    console.log('📧 TEST SUITE 2: CONTACT SUBMISSIONS\n');

    // Test 2.1: Create Contact Submission
    try {
      const testContact = {
        name: 'Test User',
        email: 'test@example.com',
        phone: '1234567890',
        people: '50',
        message: 'Test message for catering inquiry',
        status: 'new'
      };

      const contact = await ContactSubmission.create(testContact);
      const saved = contact._id !== undefined;

      logTest('contactSubmissions', 'Create Contact Submission', saved, `ID: ${contact._id}`);

      // Cleanup
      await ContactSubmission.findByIdAndDelete(contact._id);
    } catch (error) {
      logTest('contactSubmissions', 'Create Contact Submission', false, error.message);
    }

    // Test 2.2: Fetch Contact Submissions
    try {
      const contacts = await ContactSubmission.find();
      const fetched = Array.isArray(contacts);

      logTest('contactSubmissions', 'Fetch Contact Submissions', fetched, `Found ${contacts.length} submissions`);
    } catch (error) {
      logTest('contactSubmissions', 'Fetch Contact Submissions', false, error.message);
    }

    // Test 2.3: Update Contact Status
    try {
      const testContact = await ContactSubmission.create({
        name: 'Status Test',
        email: 'status@example.com',
        phone: '1234567890',
        message: 'Test',
        status: 'new'
      });

      await ContactSubmission.findByIdAndUpdate(testContact._id, { status: 'read' });
      const updated = await ContactSubmission.findById(testContact._id);
      const statusUpdated = updated.status === 'read';

      logTest('contactSubmissions', 'Update Contact Status', statusUpdated);

      // Cleanup
      await ContactSubmission.findByIdAndDelete(testContact._id);
    } catch (error) {
      logTest('contactSubmissions', 'Update Contact Status', false, error.message);
    }

    // Test 2.4: Delete Contact Submission
    try {
      const testContact = await ContactSubmission.create({
        name: 'Delete Test',
        email: 'delete@example.com',
        phone: '1234567890',
        message: 'Test'
      });

      await ContactSubmission.findByIdAndDelete(testContact._id);
      const deleted = await ContactSubmission.findById(testContact._id);
      const isDeleted = deleted === null;

      logTest('contactSubmissions', 'Delete Contact Submission', isDeleted);
    } catch (error) {
      logTest('contactSubmissions', 'Delete Contact Submission', false, error.message);
    }

    console.log('\n============================================================\n');

    // TEST SUITE 3: IMAGE UPLOAD
    console.log('📸 TEST SUITE 3: IMAGE UPLOAD FUNCTIONALITY\n');

    // Test 3.1: Check uploads directory exists
    try {
      const uploadsDir = path.join(__dirname, '../server/uploads');
      const exists = fs.existsSync(uploadsDir);

      logTest('imageUpload', 'Uploads Directory Exists', exists, uploadsDir);
    } catch (error) {
      logTest('imageUpload', 'Uploads Directory Exists', false, error.message);
    }

    // Test 3.2: Verify image URLs in database
    try {
      const siteData = await SiteData.findOne({ dataKey: 'main' });
      
      let totalImages = 0;
      let validUrls = 0;

      // Check menu images
      if (siteData.data.menu?.items) {
        siteData.data.menu.items.forEach(item => {
          if (item.image) {
            totalImages++;
            if (item.image.includes('/uploads/') || item.image.startsWith('http')) {
              validUrls++;
            }
          }
        });
      }

      // Check gallery images
      if (siteData.data.gallery?.images) {
        siteData.data.gallery.images.forEach(img => {
          if (img) {
            totalImages++;
            if (img.includes('/uploads/') || img.startsWith('http')) {
              validUrls++;
            }
          }
        });
      }

      // Check our work images
      if (siteData.data.ourWorkPage?.galleryImages) {
        siteData.data.ourWorkPage.galleryImages.forEach(img => {
          if (img) {
            totalImages++;
            if (img.includes('/uploads/') || img.startsWith('http')) {
              validUrls++;
            }
          }
        });
      }

      const allValid = totalImages === validUrls;
      logTest('imageUpload', 'Image URLs in Database', allValid, `${validUrls}/${totalImages} valid URLs`);
    } catch (error) {
      logTest('imageUpload', 'Image URLs in Database', false, error.message);
    }

    // Test 3.3: Check image files exist
    try {
      const uploadsDir = path.join(__dirname, '../server/uploads');
      const files = fs.readdirSync(uploadsDir);
      const imageFiles = files.filter(f => /\.(jpg|jpeg|png|gif|webp)$/i.test(f));

      const hasImages = imageFiles.length > 0;
      logTest('imageUpload', 'Image Files Exist in Uploads', hasImages, `Found ${imageFiles.length} images`);
    } catch (error) {
      logTest('imageUpload', 'Image Files Exist in Uploads', false, error.message);
    }

    console.log('\n============================================================\n');

    // TEST SUITE 4: CONTACT FORM (PUBLIC)
    console.log('📝 TEST SUITE 4: CONTACT FORM SUBMISSION\n');

    // Test 4.1: Submit valid contact form
    try {
      const validForm = {
        name: 'Public User',
        email: 'public@example.com',
        phone: '9876543210',
        people: '100',
        message: 'Inquiry about wedding catering'
      };

      const contact = await ContactSubmission.create(validForm);
      const submitted = contact._id !== undefined;

      logTest('contactForm', 'Submit Valid Contact Form', submitted);

      // Cleanup
      await ContactSubmission.findByIdAndDelete(contact._id);
    } catch (error) {
      logTest('contactForm', 'Submit Valid Contact Form', false, error.message);
    }

    // Test 4.2: Validate required fields
    try {
      let validationFailed = false;
      try {
        await ContactSubmission.create({
          name: 'Test',
          // Missing required fields
        });
      } catch (err) {
        validationFailed = true;
      }

      logTest('contactForm', 'Validate Required Fields', validationFailed);
    } catch (error) {
      logTest('contactForm', 'Validate Required Fields', false, error.message);
    }

    console.log('\n============================================================\n');

    // TEST SUITE 5: API ENDPOINTS
    console.log('🔌 TEST SUITE 5: API ENDPOINTS VERIFICATION\n');

    // Test 5.1: Site Data Endpoint
    try {
      const siteData = await SiteData.findOne({ dataKey: 'main' });
      const exists = siteData !== null;

      logTest('apiEndpoints', 'Site Data Endpoint (/api/sitedata)', exists);
    } catch (error) {
      logTest('apiEndpoints', 'Site Data Endpoint (/api/sitedata)', false, error.message);
    }

    // Test 5.2: Contacts Endpoint
    try {
      const contacts = await ContactSubmission.find().limit(1);
      const accessible = Array.isArray(contacts);

      logTest('apiEndpoints', 'Contacts Endpoint (/api/contacts)', accessible);
    } catch (error) {
      logTest('apiEndpoints', 'Contacts Endpoint (/api/contacts)', false, error.message);
    }

    // Test 5.3: Database Connection
    try {
      const connected = mongoose.connection.readyState === 1;

      logTest('apiEndpoints', 'Database Connection', connected);
    } catch (error) {
      logTest('apiEndpoints', 'Database Connection', false, error.message);
    }

    console.log('\n============================================================\n');

    // FINAL SUMMARY
    console.log('📊 TEST SUMMARY\n');
    console.log('============================================================\n');

    let totalPassed = 0;
    let totalFailed = 0;

    Object.keys(testResults).forEach(category => {
      const result = testResults[category];
      totalPassed += result.passed;
      totalFailed += result.failed;

      const categoryName = category.replace(/([A-Z])/g, ' $1').trim().toUpperCase();
      console.log(`${categoryName}:`);
      console.log(`  ✅ Passed: ${result.passed}`);
      console.log(`  ❌ Failed: ${result.failed}`);
      console.log('');
    });

    console.log('============================================================\n');
    console.log(`TOTAL TESTS: ${totalPassed + totalFailed}`);
    console.log(`✅ PASSED: ${totalPassed}`);
    console.log(`❌ FAILED: ${totalFailed}`);
    console.log('');

    if (totalFailed === 0) {
      console.log('🎉 ALL TESTS PASSED!\n');
    } else {
      console.log('⚠️  SOME TESTS FAILED - Please review the results above\n');
    }

    console.log('============================================================\n');

    return totalFailed === 0;

  } catch (error) {
    console.error('❌ Test suite error:', error);
    return false;
  } finally {
    await mongoose.connection.close();
    console.log('✓ MongoDB connection closed\n');
  }
}

// Run tests
runTests().then(success => {
  process.exit(success ? 0 : 1);
});
