import mongoose from 'mongoose';

console.log('Checking MongoDB connection...\n');

mongoose.connect('mongodb://localhost:27017/catering-admin', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000
})
.then(() => {
  console.log('✓ MongoDB is running and accessible!');
  console.log('✓ Connection successful to: mongodb://localhost:27017/catering-admin\n');
  process.exit(0);
})
.catch((err) => {
  console.error('✗ MongoDB connection failed!');
  console.error('Error:', err.message);
  console.error('\nPlease make sure MongoDB is installed and running.');
  console.error('Run: mongod\n');
  process.exit(1);
});
