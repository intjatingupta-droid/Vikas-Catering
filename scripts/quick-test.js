/**
 * Quick Test Script - Checks if servers are running and basic functionality works
 * Run with: node scripts/quick-test.js
 */

// Configuration
const BACKEND_URL = process.env.API_URL || 'http://localhost:5001';
const FRONTEND_URL = 'http://localhost:8080';

console.log('\n╔════════════════════════════════════════════════════════════╗');
console.log('║         VIKAS CATERINGS - QUICK HEALTH CHECK              ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');

async function checkServer(url, name) {
  try {
    const response = await fetch(url);
    if (response.ok || response.status === 401) {
      console.log(`✅ ${name} is running at ${url}`);
      return true;
    } else {
      console.log(`⚠️  ${name} responded with status ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ ${name} is NOT running at ${url}`);
    console.log(`   Error: ${error.message}`);
    return false;
  }
}

async function runQuickTest() {
  console.log('🔍 Checking server status...\n');
  
  const backendRunning = await checkServer(`${BACKEND_URL}/api/sitedata`, 'Backend Server');
  const frontendRunning = await checkServer(FRONTEND_URL, 'Frontend Server');
  
  console.log('\n' + '─'.repeat(60));
  
  if (backendRunning && frontendRunning) {
    console.log('\n✅ All servers are running!');
    console.log('\n📋 Next steps:');
    console.log('   1. Open browser: http://localhost:8080');
    console.log('   2. Login to admin: http://localhost:8080/login');
    console.log('      Username: admin');
    console.log('      Password: admin123');
    console.log('   3. Run full tests: node scripts/test-admin-panel.js');
  } else {
    console.log('\n❌ Some servers are not running!');
    console.log('\n📋 To start the servers:');
    
    if (!backendRunning) {
      console.log('\n   Backend:');
      console.log('   cd server');
      console.log('   npm start');
    }
    
    if (!frontendRunning) {
      console.log('\n   Frontend:');
      console.log('   cd Frontend');
      console.log('   npm run dev');
    }
  }
  
  console.log('\n' + '─'.repeat(60) + '\n');
  
  process.exit(backendRunning && frontendRunning ? 0 : 1);
}

runQuickTest().catch(error => {
  console.error('\n❌ Test failed:', error.message);
  process.exit(1);
});
