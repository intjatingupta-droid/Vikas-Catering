/**
 * Check actual image URLs in MongoDB and test if they're accessible
 */

const API_URL = 'http://localhost:5001';

async function checkImageUrls() {
  console.log('\n🔍 Checking Image URLs in MongoDB...\n');
  
  try {
    // Fetch site data
    const response = await fetch(`${API_URL}/api/sitedata`);
    const result = await response.json();
    
    if (!result.success) {
      console.log('❌ Failed to fetch site data');
      return;
    }
    
    const data = result.data;
    console.log('✅ Site data fetched successfully\n');
    
    // Check hero images
    console.log('📸 HERO SECTION:');
    console.log(`   Background: ${data.hero?.backgroundImage || 'Not set'}`);
    console.log(`   Video: ${data.hero?.videoUrl || 'Not set'}`);
    
    // Check about image
    console.log('\n📸 ABOUT SECTION:');
    console.log(`   Image: ${data.about?.image || 'Not set'}`);
    
    // Check menu items
    console.log('\n📸 MENU ITEMS (Homepage):');
    if (data.menu?.items) {
      data.menu.items.forEach((item, i) => {
        console.log(`   ${i + 1}. ${item.title}: ${item.image || 'No image'}`);
      });
    }
    
    // Check services
    console.log('\n📸 SERVICES:');
    if (data.services?.items) {
      data.services.items.forEach((item, i) => {
        console.log(`   ${i + 1}. ${item.title}: ${item.image || 'No image'}`);
      });
    }
    
    // Check gallery
    console.log('\n📸 GALLERY:');
    if (data.gallery?.images) {
      data.gallery.images.forEach((url, i) => {
        console.log(`   ${i + 1}. ${url || 'Empty'}`);
      });
    }
    
    // Test if URLs are accessible
    console.log('\n🌐 Testing URL Accessibility...\n');
    
    const urlsToTest = [];
    if (data.hero?.backgroundImage) urlsToTest.push(data.hero.backgroundImage);
    if (data.about?.image) urlsToTest.push(data.about.image);
    if (data.menu?.items) {
      data.menu.items.forEach(item => {
        if (item.image) urlsToTest.push(item.image);
      });
    }
    
    for (const url of urlsToTest.slice(0, 5)) {
      try {
        const testResponse = await fetch(url);
        console.log(`   ${testResponse.ok ? '✅' : '❌'} ${url} (${testResponse.status})`);
      } catch (error) {
        console.log(`   ❌ ${url} (Error: ${error.message})`);
      }
    }
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

checkImageUrls();
