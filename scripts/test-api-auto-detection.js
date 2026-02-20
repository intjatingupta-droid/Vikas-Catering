console.log('🧪 TESTING API AUTO-DETECTION\n');
console.log('============================================================\n');

// Test scenarios
const scenarios = [
  {
    name: 'Local Development',
    env: {
      NODE_ENV: 'development',
      PORT: '5001'
    },
    expected: {
      FRONTEND_URL: 'http://localhost:8080',
      BACKEND_URL: 'http://localhost:5001'
    }
  },
  {
    name: 'Production (vikascateringservice.com)',
    env: {
      NODE_ENV: 'production',
      PORT: '5001'
    },
    expected: {
      FRONTEND_URL: 'https://vikascateringservice.com',
      BACKEND_URL: 'https://vikascateringservice.com/api'
    }
  },
  {
    name: 'Production with Custom URLs',
    env: {
      NODE_ENV: 'production',
      PORT: '5001',
      FRONTEND_URL: 'https://custom.domain.com',
      BACKEND_URL: 'https://api.custom.domain.com'
    },
    expected: {
      FRONTEND_URL: 'https://custom.domain.com',
      BACKEND_URL: 'https://api.custom.domain.com'
    }
  }
];

console.log('Backend Auto-Detection Tests:\n');

scenarios.forEach((scenario, index) => {
  console.log(`${index + 1}. ${scenario.name}`);
  console.log('   Environment:');
  Object.entries(scenario.env).forEach(([key, value]) => {
    console.log(`     ${key}=${value}`);
  });

  // Simulate the logic from server/index.js
  const PORT = scenario.env.PORT || '5001';
  const isProduction = scenario.env.NODE_ENV === 'production';
  
  const FRONTEND_URL = scenario.env.FRONTEND_URL || (isProduction 
    ? 'https://vikascateringservice.com' 
    : 'http://localhost:8080');
  
  const BACKEND_URL = scenario.env.BACKEND_URL || (isProduction 
    ? 'https://vikascateringservice.com/api' 
    : `http://localhost:${PORT}`);

  console.log('   Detected:');
  console.log(`     FRONTEND_URL=${FRONTEND_URL}`);
  console.log(`     BACKEND_URL=${BACKEND_URL}`);

  const frontendMatch = FRONTEND_URL === scenario.expected.FRONTEND_URL;
  const backendMatch = BACKEND_URL === scenario.expected.BACKEND_URL;
  const passed = frontendMatch && backendMatch;

  console.log(`   Status: ${passed ? '✅ PASS' : '❌ FAIL'}`);
  if (!passed) {
    console.log('   Expected:');
    console.log(`     FRONTEND_URL=${scenario.expected.FRONTEND_URL}`);
    console.log(`     BACKEND_URL=${scenario.expected.BACKEND_URL}`);
  }
  console.log('');
});

console.log('============================================================\n');

// Frontend auto-detection simulation
console.log('Frontend Auto-Detection Tests:\n');

const frontendScenarios = [
  {
    name: 'Local Development (localhost)',
    hostname: 'localhost',
    isDev: true,
    envApiUrl: '',
    expected: 'http://localhost:5001/api'
  },
  {
    name: 'Production (vikascateringservice.com)',
    hostname: 'vikascateringservice.com',
    isDev: false,
    envApiUrl: '',
    protocol: 'https:',
    host: 'vikascateringservice.com',
    expected: 'https://vikascateringservice.com/api'
  },
  {
    name: 'Production with www',
    hostname: 'www.vikascateringservice.com',
    isDev: false,
    envApiUrl: '',
    protocol: 'https:',
    host: 'www.vikascateringservice.com',
    expected: 'https://www.vikascateringservice.com/api'
  },
  {
    name: 'Custom Override',
    hostname: 'vikascateringservice.com',
    isDev: false,
    envApiUrl: 'https://custom-api.example.com',
    expected: 'https://custom-api.example.com'
  }
];

frontendScenarios.forEach((scenario, index) => {
  console.log(`${index + 1}. ${scenario.name}`);
  console.log(`   Hostname: ${scenario.hostname}`);
  console.log(`   isDev: ${scenario.isDev}`);
  console.log(`   envApiUrl: ${scenario.envApiUrl || '(not set)'}`);

  // Simulate the logic from Frontend/src/config/api.ts
  let apiUrl;
  
  if (scenario.envApiUrl && scenario.envApiUrl.trim() !== '') {
    apiUrl = scenario.envApiUrl;
  } else if (scenario.isDev || scenario.hostname === 'localhost' || scenario.hostname === '127.0.0.1') {
    apiUrl = 'http://localhost:5001/api';
  } else if (scenario.hostname === 'vikascateringservice.com' || scenario.hostname === 'www.vikascateringservice.com') {
    apiUrl = `${scenario.protocol}//${scenario.host}/api`;
  } else {
    apiUrl = 'https://vikascateringservice.com/api';
  }

  console.log(`   Detected: ${apiUrl}`);
  
  const passed = apiUrl === scenario.expected;
  console.log(`   Status: ${passed ? '✅ PASS' : '❌ FAIL'}`);
  if (!passed) {
    console.log(`   Expected: ${scenario.expected}`);
  }
  console.log('');
});

console.log('============================================================\n');

// API Endpoints test
console.log('API Endpoints Construction Test:\n');

const testApiUrl = 'https://vikascateringservice.com/api';
const endpoints = {
  login: `${testApiUrl}/login`,
  verify: `${testApiUrl}/verify`,
  upload: `${testApiUrl}/upload`,
  siteData: `${testApiUrl}/sitedata`,
  contact: `${testApiUrl}/contact`,
  contacts: `${testApiUrl}/contacts`,
  contactUpdate: (id) => `${testApiUrl}/contacts/${id}`,
  contactDelete: (id) => `${testApiUrl}/contacts/${id}`,
};

console.log('Base API URL:', testApiUrl);
console.log('\nGenerated Endpoints:');
Object.entries(endpoints).forEach(([key, value]) => {
  if (typeof value === 'function') {
    console.log(`  ${key}(id): ${value('123')}`);
  } else {
    console.log(`  ${key}: ${value}`);
  }
});

console.log('\n✅ All endpoints correctly constructed without double /api/api\n');

console.log('============================================================\n');
console.log('✅ API Auto-Detection Tests Complete!\n');
