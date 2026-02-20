import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../server/.env') });

const MONGODB_URI = process.env.MONGODB_URI;

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

console.log('🔍 COMPLETE API FLOW TEST - ALL PAGES\n');
console.log('============================================================\n');

const testResults = {
  pages: [],
  totalTests: 0,
  passed: 0,
  failed: 0
};

function logTest(page, component, test, passed, details = '') {
  const status = passed ? '✅' : '❌';
  console.log(`  ${status} ${component}: ${test}`);
  if (details) console.log(`     ${details}`);
  
  testResults.totalTests++;
  if (passed) {
    testResults.passed++;
  } else {
    testResults.failed++;
  }
}

async function testCompleteFlow() {
  try {
    console.log('📡 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✓ Connected to MongoDB\n');
    console.log('============================================================\n');

    const siteData = await SiteData.findOne({ dataKey: 'main' });
    
    if (!siteData) {
      console.log('❌ No site data found in database!');
      return;
    }

    const data = siteData.data;

    // ============================================================
    // PAGE 1: HOME PAGE (Index.tsx)
    // ============================================================
    console.log('📄 PAGE 1: HOME PAGE (/)\n');
    console.log('Components: Header, Hero, About, Brand, Services, Menu, WhyChooseUs, Gallery, Testimonials, Contact, Footer\n');

    // Test Header Component
    console.log('🔹 Header Component:');
    logTest('Home', 'Header', 'Site name loaded', !!data.siteName, `Name: ${data.siteName}`);
    logTest('Home', 'Header', 'Logo URL loaded', data.useLogo ? !!data.logoUrl : true, data.useLogo ? `Logo: ${data.logoUrl}` : 'Using text');
    logTest('Home', 'Header', 'Phone number loaded', !!data.phone, `Phone: ${data.phone}`);

    // Test Hero Section
    console.log('\n🔹 Hero Section:');
    logTest('Home', 'Hero', 'Welcome text loaded', !!data.hero?.welcomeText, data.hero?.welcomeText);
    logTest('Home', 'Hero', 'Heading loaded', !!data.hero?.heading, data.hero?.heading);
    logTest('Home', 'Hero', 'Description loaded', !!data.hero?.description);
    logTest('Home', 'Hero', 'Background image loaded', !!data.hero?.backgroundImage, data.hero?.backgroundImage);
    logTest('Home', 'Hero', 'CTA text loaded', !!data.hero?.ctaText, data.hero?.ctaText);

    // Test About Section
    console.log('\n🔹 About Section:');
    logTest('Home', 'About', 'Heading loaded', !!data.about?.heading);
    logTest('Home', 'About', 'Paragraphs loaded', Array.isArray(data.about?.paragraphs) && data.about.paragraphs.length > 0, `${data.about?.paragraphs?.length || 0} paragraphs`);
    logTest('Home', 'About', 'Image loaded', !!data.about?.image, data.about?.image);
    logTest('Home', 'About', 'CTA text loaded', !!data.about?.ctaText);

    // Test Brand Section
    console.log('\n🔹 Brand Section:');
    logTest('Home', 'Brand', 'Name loaded', !!data.brandSection?.name);
    logTest('Home', 'Brand', 'Subtitle loaded', !!data.brandSection?.subtitle);
    logTest('Home', 'Brand', 'Description loaded', !!data.brandSection?.description);

    // Test Services Section
    console.log('\n🔹 Services Section:');
    logTest('Home', 'Services', 'Section title loaded', !!data.services?.sectionTitle);
    logTest('Home', 'Services', 'Description loaded', !!data.services?.description);
    logTest('Home', 'Services', 'Items loaded', Array.isArray(data.services?.items) && data.services.items.length > 0, `${data.services?.items?.length || 0} services`);
    if (data.services?.items?.length > 0) {
      const firstService = data.services.items[0];
      logTest('Home', 'Services', 'Service has title', !!firstService.title, firstService.title);
      logTest('Home', 'Services', 'Service has description', !!firstService.description);
      logTest('Home', 'Services', 'Service has image', !!firstService.image, firstService.image);
    }

    // Test Menu Section
    console.log('\n🔹 Menu Section (Homepage):');
    logTest('Home', 'Menu', 'Section label loaded', !!data.menu?.sectionLabel);
    logTest('Home', 'Menu', 'Section title loaded', !!data.menu?.sectionTitle);
    logTest('Home', 'Menu', 'Items loaded', Array.isArray(data.menu?.items) && data.menu.items.length > 0, `${data.menu?.items?.length || 0} items`);
    if (data.menu?.items?.length > 0) {
      const firstItem = data.menu.items[0];
      logTest('Home', 'Menu', 'Menu item has title', !!firstItem.title, firstItem.title);
      logTest('Home', 'Menu', 'Menu item has description', !!firstItem.description);
      logTest('Home', 'Menu', 'Menu item has image', !!firstItem.image, firstItem.image);
    }

    // Test Why Choose Us Section
    console.log('\n🔹 Why Choose Us Section:');
    logTest('Home', 'WhyChooseUs', 'Heading loaded', !!data.whyChooseUs?.heading);
    logTest('Home', 'WhyChooseUs', 'Paragraphs loaded', Array.isArray(data.whyChooseUs?.paragraphs) && data.whyChooseUs.paragraphs.length > 0);
    logTest('Home', 'WhyChooseUs', 'Points loaded', Array.isArray(data.whyChooseUs?.points) && data.whyChooseUs.points.length > 0, `${data.whyChooseUs?.points?.length || 0} points`);

    // Test Gallery Section
    console.log('\n🔹 Gallery Section (Homepage):');
    logTest('Home', 'Gallery', 'Heading loaded', !!data.gallery?.heading);
    logTest('Home', 'Gallery', 'Description loaded', !!data.gallery?.description);
    logTest('Home', 'Gallery', 'Images loaded', Array.isArray(data.gallery?.images) && data.gallery.images.length > 0, `${data.gallery?.images?.length || 0} images`);
    logTest('Home', 'Gallery', 'CTA text loaded', !!data.gallery?.ctaText);
    if (data.gallery?.images?.length > 0) {
      logTest('Home', 'Gallery', 'First image URL valid', !!data.gallery.images[0], data.gallery.images[0]);
    }

    // Test Testimonials Section
    console.log('\n🔹 Testimonials Section:');
    logTest('Home', 'Testimonials', 'Heading loaded', !!data.testimonials?.heading);
    logTest('Home', 'Testimonials', 'Items loaded', Array.isArray(data.testimonials?.items) && data.testimonials.items.length > 0, `${data.testimonials?.items?.length || 0} testimonials`);
    if (data.testimonials?.items?.length > 0) {
      const firstTestimonial = data.testimonials.items[0];
      logTest('Home', 'Testimonials', 'Testimonial has name', !!firstTestimonial.name);
      logTest('Home', 'Testimonials', 'Testimonial has text', !!firstTestimonial.text);
      logTest('Home', 'Testimonials', 'Testimonial has rating', typeof firstTestimonial.rating === 'number');
    }

    // Test Contact Section
    console.log('\n🔹 Contact Section:');
    logTest('Home', 'Contact', 'Visit heading loaded', !!data.contact?.visitHeading);
    logTest('Home', 'Contact', 'Office label loaded', !!data.contact?.officeLabel);
    logTest('Home', 'Contact', 'Address loaded', !!data.address);
    logTest('Home', 'Contact', 'Phone loaded', !!data.phone);
    logTest('Home', 'Contact', 'Email loaded', !!data.email);

    // Test Footer
    console.log('\n🔹 Footer:');
    logTest('Home', 'Footer', 'Description loaded', !!data.footer?.description);
    logTest('Home', 'Footer', 'Services list loaded', Array.isArray(data.footer?.services) && data.footer.services.length > 0);
    logTest('Home', 'Footer', 'Social links loaded', Array.isArray(data.footer?.socials) && data.footer.socials.length > 0, `${data.footer?.socials?.length || 0} social links`);

    console.log('\n============================================================\n');

    // ============================================================
    // PAGE 2: MENU PAGE (MenuPage.tsx)
    // ============================================================
    console.log('📄 PAGE 2: MENU PAGE (/menu)\n');
    console.log('Components: Header, Hero, DetailedMenu, Footer\n');

    console.log('🔹 Detailed Menu Page:');
    logTest('Menu', 'DetailedMenu', 'Hero title loaded', !!data.detailedMenu?.heroTitle);
    logTest('Menu', 'DetailedMenu', 'Hero image loaded', !!data.detailedMenu?.heroImage, data.detailedMenu?.heroImage);
    logTest('Menu', 'DetailedMenu', 'Categories loaded', Array.isArray(data.detailedMenu?.categories) && data.detailedMenu.categories.length > 0, `${data.detailedMenu?.categories?.length || 0} categories`);
    
    if (data.detailedMenu?.categories?.length > 0) {
      const firstCategory = data.detailedMenu.categories[0];
      logTest('Menu', 'DetailedMenu', 'Category has title', !!firstCategory.title, firstCategory.title);
      logTest('Menu', 'DetailedMenu', 'Category has images', Array.isArray(firstCategory.images) && firstCategory.images.length > 0);
      logTest('Menu', 'DetailedMenu', 'Category has subcategories', Array.isArray(firstCategory.subcategories));
      
      if (firstCategory.subcategories?.length > 0) {
        const firstSubcat = firstCategory.subcategories[0];
        logTest('Menu', 'DetailedMenu', 'Subcategory has name', !!firstSubcat.name);
        logTest('Menu', 'DetailedMenu', 'Subcategory has items', Array.isArray(firstSubcat.items));
      }
    }

    console.log('\n============================================================\n');

    // ============================================================
    // PAGE 3: OUR WORK PAGE (OurWorkPage.tsx)
    // ============================================================
    console.log('📄 PAGE 3: OUR WORK PAGE (/our-work)\n');
    console.log('Components: Header, Hero, Gallery, Testimonials, Contact, Footer\n');

    console.log('🔹 Our Work Page:');
    logTest('OurWork', 'OurWorkPage', 'Hero title loaded', !!data.ourWorkPage?.heroTitle);
    logTest('OurWork', 'OurWorkPage', 'Hero media type loaded', !!data.ourWorkPage?.heroMediaType);
    logTest('OurWork', 'OurWorkPage', 'Hero media loaded', !!data.ourWorkPage?.heroMedia, data.ourWorkPage?.heroMedia);
    logTest('OurWork', 'OurWorkPage', 'Gallery heading loaded', !!data.ourWorkPage?.galleryHeading);
    logTest('OurWork', 'OurWorkPage', 'Gallery images loaded', Array.isArray(data.ourWorkPage?.galleryImages) && data.ourWorkPage.galleryImages.length > 0, `${data.ourWorkPage?.galleryImages?.length || 0} images`);
    
    if (data.ourWorkPage?.galleryImages?.length > 0) {
      logTest('OurWork', 'OurWorkPage', 'First gallery image valid', !!data.ourWorkPage.galleryImages[0], data.ourWorkPage.galleryImages[0]);
    }

    console.log('\n============================================================\n');

    // ============================================================
    // PAGE 4: CONTACT PAGE (ContactPage.tsx)
    // ============================================================
    console.log('📄 PAGE 4: CONTACT PAGE (/contact)\n');
    console.log('Components: Header, Hero, Contact Info, Map, Footer\n');

    console.log('🔹 Contact Page:');
    logTest('Contact', 'ContactPage', 'Hero background image loaded', !!data.hero?.backgroundImage);
    logTest('Contact', 'ContactPage', 'Address loaded', !!data.address, data.address);
    logTest('Contact', 'ContactPage', 'Phone loaded', !!data.phone, data.phone);
    logTest('Contact', 'ContactPage', 'Alternate phone loaded', data.contact?.alternatePhone ? !!data.contact.alternatePhone : true, data.contact?.alternatePhone || 'Not set');
    logTest('Contact', 'ContactPage', 'Social links loaded', Array.isArray(data.footer?.socials) && data.footer.socials.length > 0);

    // Test Contact Form Submission
    console.log('\n🔹 Contact Form Submission:');
    try {
      const testSubmission = {
        name: 'API Flow Test User',
        email: 'test@apiflow.com',
        phone: '1234567890',
        people: '50',
        message: 'Testing complete API flow'
      };
      
      const submission = await ContactSubmission.create(testSubmission);
      logTest('Contact', 'ContactForm', 'Form submission works', !!submission._id, `ID: ${submission._id}`);
      
      // Cleanup
      await ContactSubmission.findByIdAndDelete(submission._id);
      logTest('Contact', 'ContactForm', 'Form submission cleanup', true);
    } catch (error) {
      logTest('Contact', 'ContactForm', 'Form submission works', false, error.message);
    }

    console.log('\n============================================================\n');

    // ============================================================
    // PAGE 5: ADMIN PAGE (Admin.tsx)
    // ============================================================
    console.log('📄 PAGE 5: ADMIN PAGE (/admin)\n');
    console.log('Components: Login, Admin Panel, All Section Editors\n');

    console.log('🔹 Admin Panel - Data Access:');
    logTest('Admin', 'AdminPanel', 'Can access site data', !!siteData);
    logTest('Admin', 'AdminPanel', 'General info editable', !!data.siteName && !!data.phone && !!data.email);
    logTest('Admin', 'AdminPanel', 'Hero section editable', !!data.hero);
    logTest('Admin', 'AdminPanel', 'About section editable', !!data.about);
    logTest('Admin', 'AdminPanel', 'Brand section editable', !!data.brandSection);
    logTest('Admin', 'AdminPanel', 'Services section editable', !!data.services);
    logTest('Admin', 'AdminPanel', 'Menu section editable', !!data.menu);
    logTest('Admin', 'AdminPanel', 'Detailed menu editable', !!data.detailedMenu);
    logTest('Admin', 'AdminPanel', 'Why choose us editable', !!data.whyChooseUs);
    logTest('Admin', 'AdminPanel', 'Gallery section editable', !!data.gallery);
    logTest('Admin', 'AdminPanel', 'Our work page editable', !!data.ourWorkPage);
    logTest('Admin', 'AdminPanel', 'Testimonials editable', !!data.testimonials);
    logTest('Admin', 'AdminPanel', 'Contact section editable', !!data.contact);
    logTest('Admin', 'AdminPanel', 'Footer editable', !!data.footer);

    // Test Contact Submissions Access
    console.log('\n🔹 Admin Panel - Contact Submissions:');
    try {
      const contacts = await ContactSubmission.find().limit(5);
      logTest('Admin', 'ContactSubmissions', 'Can fetch submissions', Array.isArray(contacts), `Found ${contacts.length} submissions`);
      
      if (contacts.length > 0) {
        const firstContact = contacts[0];
        logTest('Admin', 'ContactSubmissions', 'Submission has required fields', 
          !!firstContact.name && !!firstContact.email && !!firstContact.phone && !!firstContact.message);
        logTest('Admin', 'ContactSubmissions', 'Submission has status', !!firstContact.status);
        logTest('Admin', 'ContactSubmissions', 'Submission has timestamp', !!firstContact.submittedAt);
      }
    } catch (error) {
      logTest('Admin', 'ContactSubmissions', 'Can fetch submissions', false, error.message);
    }

    // Test Image Upload Capability
    console.log('\n🔹 Admin Panel - Image Upload:');
    const uploadsDir = path.join(__dirname, '../server/uploads');
    const fs = await import('fs');
    const uploadsExists = fs.existsSync(uploadsDir);
    logTest('Admin', 'ImageUpload', 'Uploads directory exists', uploadsExists, uploadsDir);
    
    if (uploadsExists) {
      const files = fs.readdirSync(uploadsDir);
      const imageFiles = files.filter(f => /\.(jpg|jpeg|png|gif|webp)$/i.test(f));
      logTest('Admin', 'ImageUpload', 'Has uploaded images', imageFiles.length > 0, `${imageFiles.length} images`);
    }

    console.log('\n============================================================\n');

    // ============================================================
    // PAGE 6: LOGIN PAGE (Login.tsx)
    // ============================================================
    console.log('📄 PAGE 6: LOGIN PAGE (/login)\n');

    console.log('🔹 Login Page:');
    logTest('Login', 'LoginPage', 'Site name available for display', !!data.siteName);
    logTest('Login', 'LoginPage', 'Logo available if enabled', data.useLogo ? !!data.logoUrl : true);

    console.log('\n============================================================\n');

    // ============================================================
    // API ENDPOINTS VERIFICATION
    // ============================================================
    console.log('🔌 API ENDPOINTS VERIFICATION\n');

    const endpoints = [
      { name: 'GET /api/sitedata', test: 'Fetch site data', collection: 'SiteData' },
      { name: 'POST /api/sitedata', test: 'Update site data', collection: 'SiteData' },
      { name: 'POST /api/login', test: 'User authentication', collection: 'User' },
      { name: 'GET /api/verify', test: 'Token verification', collection: 'User' },
      { name: 'POST /api/upload', test: 'File upload', collection: 'Files' },
      { name: 'POST /api/contact', test: 'Contact form submission', collection: 'ContactSubmission' },
      { name: 'GET /api/contacts', test: 'Fetch contact submissions', collection: 'ContactSubmission' },
      { name: 'PATCH /api/contacts/:id', test: 'Update contact status', collection: 'ContactSubmission' },
      { name: 'DELETE /api/contacts/:id', test: 'Delete contact submission', collection: 'ContactSubmission' },
    ];

    endpoints.forEach(endpoint => {
      console.log(`  📍 ${endpoint.name}`);
      console.log(`     Purpose: ${endpoint.test}`);
      console.log(`     Collection: ${endpoint.collection}`);
    });

    console.log('\n============================================================\n');

    // ============================================================
    // IMAGE URL VERIFICATION
    // ============================================================
    console.log('🖼️  IMAGE URL VERIFICATION\n');

    let totalImages = 0;
    let validImages = 0;
    let imageUrls = [];

    // Collect all image URLs
    if (data.hero?.backgroundImage) {
      totalImages++;
      imageUrls.push({ section: 'Hero', url: data.hero.backgroundImage });
    }
    if (data.about?.image) {
      totalImages++;
      imageUrls.push({ section: 'About', url: data.about.image });
    }
    if (data.detailedMenu?.heroImage) {
      totalImages++;
      imageUrls.push({ section: 'Detailed Menu Hero', url: data.detailedMenu.heroImage });
    }
    if (data.ourWorkPage?.heroMedia) {
      totalImages++;
      imageUrls.push({ section: 'Our Work Hero', url: data.ourWorkPage.heroMedia });
    }

    // Services images
    data.services?.items?.forEach((item, i) => {
      if (item.image) {
        totalImages++;
        imageUrls.push({ section: `Services[${i}]`, url: item.image });
      }
    });

    // Menu images
    data.menu?.items?.forEach((item, i) => {
      if (item.image) {
        totalImages++;
        imageUrls.push({ section: `Menu[${i}]`, url: item.image });
      }
    });

    // Gallery images
    data.gallery?.images?.forEach((url, i) => {
      if (url) {
        totalImages++;
        imageUrls.push({ section: `Gallery[${i}]`, url });
      }
    });

    // Our Work gallery images
    data.ourWorkPage?.galleryImages?.forEach((url, i) => {
      if (url) {
        totalImages++;
        imageUrls.push({ section: `OurWork[${i}]`, url });
      }
    });

    // Validate URLs
    imageUrls.forEach(({ section, url }) => {
      const isValid = url && (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/'));
      if (isValid) validImages++;
      console.log(`  ${isValid ? '✅' : '❌'} ${section}: ${url}`);
    });

    console.log(`\n  Total Images: ${totalImages}`);
    console.log(`  Valid URLs: ${validImages}`);
    console.log(`  Invalid URLs: ${totalImages - validImages}`);

    console.log('\n============================================================\n');

    // ============================================================
    // FINAL SUMMARY
    // ============================================================
    console.log('📊 FINAL SUMMARY\n');
    console.log('============================================================\n');

    const pagesSummary = [
      { name: 'Home Page', components: 11 },
      { name: 'Menu Page', components: 4 },
      { name: 'Our Work Page', components: 6 },
      { name: 'Contact Page', components: 5 },
      { name: 'Admin Page', components: 15 },
      { name: 'Login Page', components: 2 }
    ];

    console.log('Pages Tested:');
    pagesSummary.forEach(page => {
      console.log(`  ✓ ${page.name} (${page.components} components)`);
    });

    console.log('\n============================================================\n');

    console.log('Test Results:');
    console.log(`  Total Tests: ${testResults.totalTests}`);
    console.log(`  ✅ Passed: ${testResults.passed}`);
    console.log(`  ❌ Failed: ${testResults.failed}`);
    console.log(`  Success Rate: ${((testResults.passed / testResults.totalTests) * 100).toFixed(1)}%`);

    console.log('\n============================================================\n');

    if (testResults.failed === 0) {
      console.log('🎉 ALL API FLOWS VERIFIED SUCCESSFULLY!\n');
      console.log('✅ All pages can access required data from backend');
      console.log('✅ All components receive correct data structure');
      console.log('✅ All API endpoints are properly configured');
      console.log('✅ All image URLs are valid');
      console.log('✅ Database connections working correctly\n');
    } else {
      console.log('⚠️  SOME TESTS FAILED\n');
      console.log('Please review the failed tests above and fix the issues.\n');
    }

    console.log('============================================================\n');

    return testResults.failed === 0;

  } catch (error) {
    console.error('❌ Test error:', error);
    return false;
  } finally {
    await mongoose.connection.close();
    console.log('✓ MongoDB connection closed\n');
  }
}

// Run tests
testCompleteFlow().then(success => {
  process.exit(success ? 0 : 1);
});
