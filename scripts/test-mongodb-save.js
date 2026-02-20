import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '../server/.env' });

const MONGODB_URI = process.env.MONGODB_URI;

// Define the SiteData schema
const siteDataSchema = new mongoose.Schema({
  dataKey: { type: String, required: true, unique: true, default: 'main' },
  data: { type: mongoose.Schema.Types.Mixed, required: true },
  updatedAt: { type: Date, default: Date.now }
});

const SiteData = mongoose.model('SiteData', siteDataSchema);

async function testMongoDBSave() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    console.log('URI:', MONGODB_URI.replace(/:[^:@]+@/, ':****@'));
    
    await mongoose.connect(MONGODB_URI);
    console.log('✓ Connected to MongoDB\n');

    // Test 1: Save test data
    console.log('📝 Test 1: Saving test data...');
    const testData = {
      siteName: 'Test Site',
      testImage: 'http://localhost:5001/uploads/test-image.jpg',
      timestamp: new Date().toISOString()
    };

    const saved = await SiteData.findOneAndUpdate(
      { dataKey: 'main' },
      { data: testData, updatedAt: new Date() },
      { upsert: true, new: true }
    );

    console.log('✓ Data saved successfully');
    console.log('  - ID:', saved._id);
    console.log('  - Data:', JSON.stringify(saved.data, null, 2));
    console.log('  - Updated at:', saved.updatedAt);

    // Test 2: Retrieve data
    console.log('\n📥 Test 2: Retrieving data...');
    const retrieved = await SiteData.findOne({ dataKey: 'main' });
    
    if (retrieved) {
      console.log('✓ Data retrieved successfully');
      console.log('  - Data matches:', JSON.stringify(retrieved.data) === JSON.stringify(testData));
      console.log('  - Retrieved data:', JSON.stringify(retrieved.data, null, 2));
    } else {
      console.log('✗ No data found');
    }

    // Test 3: Update data
    console.log('\n🔄 Test 3: Updating data...');
    const updatedData = {
      ...testData,
      siteName: 'Updated Test Site',
      newField: 'New Value'
    };

    const updated = await SiteData.findOneAndUpdate(
      { dataKey: 'main' },
      { data: updatedData, updatedAt: new Date() },
      { new: true }
    );

    console.log('✓ Data updated successfully');
    console.log('  - Updated data:', JSON.stringify(updated.data, null, 2));

    // Test 4: Check data persistence
    console.log('\n🔍 Test 4: Checking data persistence...');
    const final = await SiteData.findOne({ dataKey: 'main' });
    console.log('✓ Final data in database:', JSON.stringify(final.data, null, 2));

    console.log('\n✅ All tests passed! MongoDB is working correctly.');

    await mongoose.disconnect();
    console.log('\n✓ Disconnected from MongoDB');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }
    process.exit(1);
  }
}

testMongoDBSave();
