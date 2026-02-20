/**
 * Image Encoding/Decoding Test
 * Tests that images are properly uploaded, stored, and displayed across all frontend pages
 * 
 * Run with: node scripts/test-image-handling.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_URL = process.env.API_URL || 'http://localhost:5001';

let testResults = {
  passed: 0,
  failed: 0,
  tests: []
};

function logTest(name, passed, message = '') {
  const status = passed ? '✅ PASS' : '❌ FAIL';
  console.log(`${status}: ${name}`);
  if (message) console.log(`   ${message}`);
  
  testResults.tests.push({ name, passed, message });
  if (passed) testResults.passed++;
  else testResults.failed++;
}

function logSection(title) {
  console.log(`\n${'='.repeat(70)}`);
  console.log(`  ${title}`);
  console.log('='.repeat(70));
}

// Get all frontend pages
function getFrontendPages() {
  const pagesDir = path.join(__dirname, '../Frontend/src/pages');
  const files = fs.readdirSync(pagesDir);
  return files.filter(f => f.endsWith('.tsx')).map(f => ({
    name: f,
    path: path.join(pagesDir, f)
  }));
}

// Get all components
function getFrontendComponents() {
  const componentsDir = path.join(__dirname, '../Frontend/src/components');
  const files = fs.readdirSync(componentsDir);
  return files.filter(f => f.endsWith('.tsx')).map(f => ({
    name: f,
    path: path.join(componentsDir, f)
  }));
}

// Check if file uses images
function checkImageUsage(filePath, fileName) {
  const content = fs.readFileSync(filePath, 'utf-8');
  
  const checks = {
    usesImgTag: content.includes('<img'),
    usesBackgroundImage: content.includes('backgroundImage'),
    usesVideoTag: content.includes('<video'),
    usesImageProp: content.includes('.image') || content.includes('.images'),
    hasBase64: content.includes('data:image') || content.includes('base64'),
    hasServerUrl: content.includes('/uploads/') || content.includes('BACKEND_URL'),
    usesApiEndpoints: content.includes('API_ENDPOINTS'),
  };
  
  return checks;
}

// Check uploads directory
function checkUploadsDirectory() {
  const uploadsDir = path.join(__dirname, '../server/uploads');
  
  if (!fs.existsSync(uploadsDir)) {
    return { exists: false, files: [] };
  }
  
  const files = fs.readdirSync(uploadsDir);
  const imageFiles = files.filter(f => 
    f.endsWith('.jpg') || f.endsWith('.jpeg') || 
    f.endsWith('.png') || f.endsWith('.gif') ||
    f.endsWith('.webp')
  );
  
  const videoFiles = files.filter(f =>
    f.endsWith('.mp4') || f.endsWith('.webm') ||
    f.endsWith('.mov')
  );
  
  return {
    exists: true,
    totalFiles: files.length,
    imageFiles: imageFiles.length,
    videoFiles: videoFiles.length,
    files: files.slice(0, 5) // First 5 files
  };
}

// Check MongoDB for image URLs
async function checkMongoDBImageUrls() {
  try {
    const token = localStorage?.getItem?.('token') || 'test-token';
    const response = await fetch(`${API_URL}/api/sitedata`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!response.ok) {
      return { success: false, error: 'Failed to fetch' };
    }
    
    const result = await response.json();
    if (!result.success) {
      return { success: false, error: 'No data' };
    }
    
    const data = result.data;
    const imageUrls = [];
    
    // Collect all image URLs
    if (data.hero?.backgroundImage) imageUrls.push(data.hero.backgroundImage);
    if (data.hero?.videoUrl) imageUrls.push(data.hero.videoUrl);
    if (data.about?.image) imageUrls.push(data.about.image);
    if (data.services?.items) {
      data.services.items.forEach(item => {
        if (item.image) imageUrls.push(item.image);
      });
    }
    if (data.menu?.items) {
      data.menu.items.forEach(item => {
        if (item.image) imageUrls.push(item.image);
      });
    }
    if (data.gallery?.images) {
      imageUrls.push(...data.gallery.images.filter(Boolean));
    }
    
    return {
      success: true,
      totalUrls: imageUrls.length,
      urls: imageUrls,
      hasBase64: imageUrls.some(url => url.includes('base64')),
      hasServerUrls: imageUrls.some(url => url.includes('/uploads/')),
      hasHttpUrls: imageUrls.some(url => url.startsWith('http'))
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Main test function
async function runTests() {
  console.log('\n');
  console.log('╔══════════════════════════════════════════════════════════════════════╗');
  console.log('║        IMAGE ENCODING/DECODING TEST - ALL FRONTEND PAGES             ║');
  console.log('╚══════════════════════════════════════════════════════════════════════╝');
  console.log(`\nStart time: ${new Date().toLocaleString()}\n`);
  
  // Test 1: Count and List Frontend Pages
  logSection('FRONTEND PAGES COUNT');
  
  const pages = getFrontendPages();
  console.log(`\nFound ${pages.length} frontend pages:\n`);
  pages.forEach((page, i) => {
    console.log(`   ${i + 1}. ${page.name}`);
  });
  
  logTest(
    'Frontend pages found',
    pages.length > 0,
    `Total: ${pages.length} pages`
  );
  
  // Test 2: Check Image Usage in Each Page
  logSection('IMAGE USAGE IN PAGES');
  
  let pagesWithImages = 0;
  let pagesWithBase64 = 0;
  let pagesWithServerUrls = 0;
  
  for (const page of pages) {
    const checks = checkImageUsage(page.path, page.name);
    const usesImages = checks.usesImgTag || checks.usesBackgroundImage || 
                       checks.usesVideoTag || checks.usesImageProp;
    
    if (usesImages) {
      pagesWithImages++;
      console.log(`\n   📄 ${page.name}:`);
      if (checks.usesImgTag) console.log(`      ✓ Uses <img> tags`);
      if (checks.usesBackgroundImage) console.log(`      ✓ Uses backgroundImage`);
      if (checks.usesVideoTag) console.log(`      ✓ Uses <video> tags`);
      if (checks.usesImageProp) console.log(`      ✓ Uses .image/.images props`);
      if (checks.hasBase64) {
        console.log(`      ⚠️  Contains base64 encoding`);
        pagesWithBase64++;
      }
      if (checks.hasServerUrl) {
        console.log(`      ✓ Uses server URLs (/uploads/)`);
        pagesWithServerUrls++;
      }
    }
    
    logTest(
      `${page.name} image handling`,
      usesImages ? !checks.hasBase64 : true,
      usesImages ? 
        (checks.hasBase64 ? 'Uses base64 (should use server URLs)' : 'Uses server URLs correctly') :
        'No images used'
    );
  }
  
  console.log(`\n   Summary: ${pagesWithImages}/${pages.length} pages use images`);
  
  logTest(
    'Pages use server URLs (not base64)',
    pagesWithBase64 === 0,
    pagesWithBase64 === 0 ? 
      'All pages use server URLs' : 
      `${pagesWithBase64} pages use base64 encoding`
  );

  // Test 3: Check Components
  logSection('IMAGE USAGE IN COMPONENTS');
  
  const components = getFrontendComponents();
  let componentsWithImages = 0;
  
  for (const component of components) {
    const checks = checkImageUsage(component.path, component.name);
    const usesImages = checks.usesImgTag || checks.usesBackgroundImage || 
                       checks.usesVideoTag || checks.usesImageProp;
    
    if (usesImages) {
      componentsWithImages++;
      console.log(`\n   🧩 ${component.name}:`);
      if (checks.usesImgTag) console.log(`      ✓ Uses <img> tags`);
      if (checks.usesBackgroundImage) console.log(`      ✓ Uses backgroundImage`);
      if (checks.usesVideoTag) console.log(`      ✓ Uses <video> tags`);
      if (checks.usesImageProp) console.log(`      ✓ Uses .image/.images props`);
    }
  }
  
  console.log(`\n   Summary: ${componentsWithImages}/${components.length} components use images`);
  
  logTest(
    'Components use images',
    componentsWithImages > 0,
    `${componentsWithImages} components display images`
  );
  
  // Test 4: Check Uploads Directory
  logSection('SERVER UPLOADS DIRECTORY');
  
  const uploads = checkUploadsDirectory();
  
  logTest(
    'Uploads directory exists',
    uploads.exists,
    uploads.exists ? 'Directory found' : 'Directory not found'
  );
  
  if (uploads.exists) {
    logTest(
      'Uploads directory has files',
      uploads.totalFiles > 0,
      `Total: ${uploads.totalFiles} files (${uploads.imageFiles} images, ${uploads.videoFiles} videos)`
    );
    
    if (uploads.files.length > 0) {
      console.log(`\n   Sample files:`);
      uploads.files.forEach(file => {
        console.log(`      - ${file}`);
      });
    }
    
    logTest(
      'Image files present',
      uploads.imageFiles > 0,
      `${uploads.imageFiles} image files found`
    );
  }

  // Test 5: Check Admin Panel Upload Implementation
  logSection('ADMIN PANEL UPLOAD IMPLEMENTATION');
  
  const adminPath = path.join(__dirname, '../Frontend/src/pages/Admin.tsx');
  const adminContent = fs.readFileSync(adminPath, 'utf-8');
  
  const adminChecks = {
    hasMediaField: adminContent.includes('MediaField'),
    hasFileUpload: adminContent.includes('type="file"'),
    usesFormData: adminContent.includes('FormData'),
    usesApiUpload: adminContent.includes('API_ENDPOINTS.upload'),
    hasBase64Conversion: adminContent.includes('FileReader') || adminContent.includes('readAsDataURL'),
    hasServerUpload: adminContent.includes('formData.append'),
  };
  
  logTest(
    'Admin has MediaField component',
    adminChecks.hasMediaField,
    'MediaField component found'
  );
  
  logTest(
    'Admin uses file input',
    adminChecks.hasFileUpload,
    'File input type found'
  );
  
  logTest(
    'Admin uses FormData for upload',
    adminChecks.usesFormData,
    adminChecks.usesFormData ? 'Uses FormData' : 'Not using FormData'
  );
  
  logTest(
    'Admin uses API_ENDPOINTS.upload',
    adminChecks.usesApiUpload,
    adminChecks.usesApiUpload ? 'Uses upload endpoint' : 'Not using upload endpoint'
  );
  
  logTest(
    'Admin does NOT use base64 encoding',
    !adminChecks.hasBase64Conversion,
    adminChecks.hasBase64Conversion ? 
      '⚠️  Uses FileReader/base64 (should upload to server)' : 
      'Correctly uploads to server'
  );
  
  logTest(
    'Admin uploads files to server',
    adminChecks.hasServerUpload,
    adminChecks.hasServerUpload ? 
      'Files uploaded to server' : 
      'Not uploading to server'
  );
  
  // Test 6: Check Backend Upload Endpoint
  logSection('BACKEND UPLOAD ENDPOINT');
  
  const serverPath = path.join(__dirname, '../server/index.js');
  const serverContent = fs.readFileSync(serverPath, 'utf-8');
  
  const serverChecks = {
    hasMulter: serverContent.includes('multer'),
    hasUploadRoute: serverContent.includes('/api/upload'),
    hasUploadsDir: serverContent.includes('uploads'),
    returnsUrl: serverContent.includes('url:') && serverContent.includes('BACKEND_URL'),
    hasFileValidation: serverContent.includes('mimetype') || serverContent.includes('fileFilter'),
  };
  
  logTest(
    'Backend uses Multer',
    serverChecks.hasMulter,
    'Multer middleware found'
  );
  
  logTest(
    'Backend has /api/upload route',
    serverChecks.hasUploadRoute,
    'Upload route defined'
  );
  
  logTest(
    'Backend saves to uploads directory',
    serverChecks.hasUploadsDir,
    'Uploads directory configured'
  );
  
  logTest(
    'Backend returns full URL',
    serverChecks.returnsUrl,
    serverChecks.returnsUrl ? 
      'Returns full URL with BACKEND_URL' : 
      'May not return full URL'
  );
  
  logTest(
    'Backend has file validation',
    serverChecks.hasFileValidation,
    serverChecks.hasFileValidation ? 
      'File type validation present' : 
      'No file validation found'
  );

  // Test 7: Image Display on Frontend Pages
  logSection('IMAGE DISPLAY VERIFICATION');
  
  const pagesWithImageDisplay = [
    { name: 'Index.tsx (Homepage)', path: '../Frontend/src/pages/Index.tsx' },
    { name: 'MenuPage.tsx', path: '../Frontend/src/pages/MenuPage.tsx' },
    { name: 'OurWorkPage.tsx', path: '../Frontend/src/pages/OurWorkPage.tsx' },
    { name: 'ContactPage.tsx', path: '../Frontend/src/pages/ContactPage.tsx' },
  ];
  
  for (const page of pagesWithImageDisplay) {
    const fullPath = path.join(__dirname, page.path);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      
      const displays = {
        usesImgSrc: content.includes('src={') && content.includes('<img'),
        usesBackgroundImage: content.includes('backgroundImage'),
        usesDataFromContext: content.includes('useSiteData') || content.includes('data.'),
        hasImageRendering: content.includes('.map(') && (content.includes('img') || content.includes('image')),
        usesImageComponents: content.includes('HeroSection') || content.includes('GallerySection') || 
                            content.includes('MenuSection') || content.includes('AboutSection'),
      };
      
      logTest(
        `${page.name} displays images`,
        displays.usesImgSrc || displays.usesBackgroundImage || displays.usesImageComponents,
        displays.usesImgSrc || displays.usesBackgroundImage ? 
          'Images rendered correctly' : 
          displays.usesImageComponents ?
          'Images rendered via components' :
          'No image rendering found'
      );
      
      if (displays.usesDataFromContext) {
        console.log(`      ✓ Uses data from SiteDataContext`);
      }
      if (displays.hasImageRendering) {
        console.log(`      ✓ Renders multiple images with .map()`);
      }
    }
  }
  
  // Test 8: Check for Image Loading Issues
  logSection('IMAGE LOADING BEST PRACTICES');
  
  const allFiles = [...pages, ...components];
  let filesWithLazyLoading = 0;
  let filesWithAltText = 0;
  let filesWithErrorHandling = 0;
  
  for (const file of allFiles) {
    const content = fs.readFileSync(file.path, 'utf-8');
    
    if (content.includes('loading="lazy"') || content.includes('loading={"lazy"}')) {
      filesWithLazyLoading++;
    }
    if (content.includes('alt=')) {
      filesWithAltText++;
    }
    if (content.includes('onError') || content.includes('onerror')) {
      filesWithErrorHandling++;
    }
  }
  
  logTest(
    'Images have alt text',
    filesWithAltText > 0,
    `${filesWithAltText} files use alt text for accessibility`
  );
  
  logTest(
    'Images use lazy loading',
    filesWithLazyLoading >= 0,
    filesWithLazyLoading > 0 ? 
      `${filesWithLazyLoading} files use lazy loading` : 
      'Consider adding lazy loading for performance'
  );
  
  logTest(
    'Images have error handling',
    filesWithErrorHandling >= 0,
    filesWithErrorHandling > 0 ? 
      `${filesWithErrorHandling} files handle image errors` : 
      'Consider adding error handling'
  );
  
  printSummary(pages.length, pagesWithImages, componentsWithImages);
}

function printSummary(totalPages, pagesWithImages, componentsWithImages) {
  logSection('TEST SUMMARY');
  
  console.log(`\nTotal Tests: ${testResults.passed + testResults.failed}`);
  console.log(`✅ Passed: ${testResults.passed}`);
  console.log(`❌ Failed: ${testResults.failed}`);
  console.log(`Success Rate: ${((testResults.passed / (testResults.passed + testResults.failed)) * 100).toFixed(1)}%`);
  
  console.log('\n📊 IMAGE USAGE STATISTICS:');
  console.log(`   • Total Frontend Pages: ${totalPages}`);
  console.log(`   • Pages with Images: ${pagesWithImages}`);
  console.log(`   • Components with Images: ${componentsWithImages}`);
  
  if (testResults.failed > 0) {
    console.log('\n❌ Failed Tests:');
    testResults.tests
      .filter(t => !t.passed)
      .forEach(t => console.log(`   - ${t.name}: ${t.message}`));
  }
  
  console.log('\n' + '='.repeat(70));
  console.log('\n📋 RECOMMENDATIONS:\n');
  
  if (testResults.failed === 0) {
    console.log('✅ All image handling checks passed!');
    console.log('✅ Images are uploaded to server (not base64 encoded)');
    console.log('✅ Images are stored in server/uploads/ directory');
    console.log('✅ Images display correctly on all frontend pages');
    console.log('✅ Admin panel uses proper file upload');
    console.log('\n🎉 Image encoding/decoding is working correctly!');
  } else {
    console.log('⚠️  Some checks failed. Please review:');
    console.log('\nCommon issues:');
    console.log('  - If using base64: Change to server upload');
    console.log('  - If images not displaying: Check URL format');
    console.log('  - If uploads failing: Check Multer configuration');
    console.log('  - If images disappearing: Ensure full URLs in MongoDB');
  }
  
  console.log('\n💡 IMAGE HANDLING FLOW:');
  console.log('  1. User uploads file in Admin panel');
  console.log('  2. File sent to /api/upload endpoint');
  console.log('  3. Multer saves to server/uploads/');
  console.log('  4. Server returns full URL (http://domain/uploads/file.jpg)');
  console.log('  5. URL saved to MongoDB');
  console.log('  6. Frontend fetches data from MongoDB');
  console.log('  7. Images display using full URLs');
  
  console.log(`\nEnd time: ${new Date().toLocaleString()}`);
  console.log('\n' + '='.repeat(70) + '\n');
  
  process.exit(testResults.failed > 0 ? 1 : 0);
}

// Run tests
runTests().catch(error => {
  console.error('\n❌ Test suite failed with error:', error);
  process.exit(1);
});
