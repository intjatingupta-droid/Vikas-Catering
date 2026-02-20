import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/catering-admin';

// Site Data Schema
const siteDataSchema = new mongoose.Schema({
  dataKey: { type: String, required: true, unique: true, default: 'main' },
  data: { type: mongoose.Schema.Types.Mixed, required: true },
  updatedAt: { type: Date, default: Date.now }
});

const SiteData = mongoose.model('SiteData', siteDataSchema);

async function diagnoseImageIssue() {
  try {
    console.log('🔍 DIAGNOSING IMAGE LOADING ISSUE\n');
    console.log('=' .repeat(60));
    
    // Connect to MongoDB
    console.log('\n📡 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✓ Connected to MongoDB\n');

    // Fetch site data
    console.log('📥 Fetching site data from MongoDB...');
    const siteData = await SiteData.findOne({ dataKey: 'main' });
    
    if (!siteData) {
      console.log('❌ No site data found in MongoDB!');
      await mongoose.connection.close();
      return;
    }

    console.log('✓ Site data found\n');
    console.log('=' .repeat(60));

    // Check menu items
    console.log('\n🍽️  MENU ITEMS IMAGE URLS:\n');
    if (siteData.data.menu && siteData.data.menu.items) {
      siteData.data.menu.items.forEach((item, index) => {
        console.log(`${index + 1}. ${item.title}`);
        console.log(`   URL: ${item.image}`);
        console.log(`   Type: ${typeof item.image}`);
        console.log(`   Valid URL: ${item.image.startsWith('http') ? '✓' : '✗'}`);
        console.log('');
      });
    } else {
      console.log('❌ No menu items found');
    }

    // Check services
    console.log('=' .repeat(60));
    console.log('\n🎉 SERVICES IMAGE URLS:\n');
    if (siteData.data.services && siteData.data.services.items) {
      siteData.data.services.items.forEach((item, index) => {
        console.log(`${index + 1}. ${item.title}`);
        console.log(`   URL: ${item.image}`);
        console.log(`   Type: ${typeof item.image}`);
        console.log(`   Valid URL: ${item.image.startsWith('http') ? '✓' : '✗'}`);
        console.log('');
      });
    } else {
      console.log('❌ No service items found');
    }

    // Check gallery
    console.log('=' .repeat(60));
    console.log('\n📸 GALLERY IMAGE URLS:\n');
    if (siteData.data.gallery && siteData.data.gallery.images) {
      siteData.data.gallery.images.forEach((image, index) => {
        console.log(`${index + 1}. Gallery Image`);
        console.log(`   URL: ${image}`);
        console.log(`   Type: ${typeof image}`);
        console.log(`   Valid URL: ${image.startsWith('http') ? '✓' : '✗'}`);
        console.log('');
      });
    } else {
      console.log('❌ No gallery images found');
    }

    // Check hero section
    console.log('=' .repeat(60));
    console.log('\n🎨 HERO SECTION:\n');
    if (siteData.data.hero) {
      console.log(`Background Image: ${siteData.data.hero.backgroundImage || 'Not set'}`);
      console.log(`Valid URL: ${siteData.data.hero.backgroundImage?.startsWith('http') ? '✓' : '✗'}`);
    }

    // Check about section
    console.log('\n=' .repeat(60));
    console.log('\n📖 ABOUT SECTION:\n');
    if (siteData.data.about) {
      console.log(`Image: ${siteData.data.about.image || 'Not set'}`);
      console.log(`Valid URL: ${siteData.data.about.image?.startsWith('http') ? '✓' : '✗'}`);
    }

    // Environment check
    console.log('\n=' .repeat(60));
    console.log('\n🔧 ENVIRONMENT CONFIGURATION:\n');
    console.log(`Backend URL (from .env): ${process.env.BACKEND_URL || 'Not set'}`);
    console.log(`MongoDB URI: ${MONGODB_URI.replace(/:[^:@]+@/, ':****@')}`);
    
    // URL pattern analysis
    console.log('\n=' .repeat(60));
    console.log('\n🔍 URL PATTERN ANALYSIS:\n');
    
    const allUrls = [];
    
    // Collect all image URLs
    if (siteData.data.menu?.items) {
      allUrls.push(...siteData.data.menu.items.map(i => i.image));
    }
    if (siteData.data.services?.items) {
      allUrls.push(...siteData.data.services.items.map(i => i.image));
    }
    if (siteData.data.gallery?.images) {
      allUrls.push(...siteData.data.gallery.images);
    }
    if (siteData.data.hero?.backgroundImage) {
      allUrls.push(siteData.data.hero.backgroundImage);
    }
    if (siteData.data.about?.image) {
      allUrls.push(siteData.data.about.image);
    }

    const urlPatterns = {
      localhost5001: allUrls.filter(url => url?.includes('localhost:5001')).length,
      localhost5000: allUrls.filter(url => url?.includes('localhost:5000')).length,
      renderDomain: allUrls.filter(url => url?.includes('onrender.com')).length,
      customDomain: allUrls.filter(url => url?.includes('vikascateringservice.com')).length,
      relative: allUrls.filter(url => url && !url.startsWith('http')).length,
      invalid: allUrls.filter(url => !url || url === '').length,
    };

    console.log('URL Distribution:');
    console.log(`  localhost:5001 URLs: ${urlPatterns.localhost5001}`);
    console.log(`  localhost:5000 URLs: ${urlPatterns.localhost5000}`);
    console.log(`  Render.com URLs: ${urlPatterns.renderDomain}`);
    console.log(`  Custom domain URLs: ${urlPatterns.customDomain}`);
    console.log(`  Relative URLs: ${urlPatterns.relative}`);
    console.log(`  Invalid/Empty URLs: ${urlPatterns.invalid}`);

    // Problem detection
    console.log('\n=' .repeat(60));
    console.log('\n⚠️  POTENTIAL ISSUES:\n');
    
    const issues = [];
    
    if (urlPatterns.localhost5001 > 0 || urlPatterns.localhost5000 > 0) {
      issues.push('❌ Found localhost URLs - these won\'t work in production!');
    }
    
    if (urlPatterns.relative > 0) {
      issues.push('❌ Found relative URLs - these need to be absolute URLs!');
    }
    
    if (urlPatterns.invalid > 0) {
      issues.push('❌ Found invalid/empty URLs!');
    }

    if (issues.length === 0) {
      console.log('✓ No obvious URL issues detected');
    } else {
      issues.forEach(issue => console.log(issue));
    }

    // Recommendations
    console.log('\n=' .repeat(60));
    console.log('\n💡 RECOMMENDATIONS:\n');
    
    if (urlPatterns.localhost5001 > 0 || urlPatterns.localhost5000 > 0) {
      console.log('1. Update BACKEND_URL in server/.env to production URL');
      console.log('2. Re-upload all images through admin panel');
      console.log('3. Or run a migration script to update URLs in database');
    }
    
    if (urlPatterns.customDomain > 0) {
      console.log('✓ URLs are using custom domain - good!');
      console.log('  Make sure backend.vikascateringservice.com is accessible');
    }

    console.log('\n=' .repeat(60));
    console.log('\n✅ Diagnosis complete!\n');

    await mongoose.connection.close();
    console.log('✓ MongoDB connection closed');

  } catch (error) {
    console.error('❌ Error during diagnosis:', error);
    process.exit(1);
  }
}

diagnoseImageIssue();
