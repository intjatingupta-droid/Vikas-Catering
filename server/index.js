import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/catering-admin';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:8080';

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware
app.use(cors({
  origin: FRONTEND_URL === '*' ? '*' : FRONTEND_URL,
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/uploads', express.static(uploadsDir));

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp|mp4|webm|mov/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images and videos are allowed'));
    }
  }
});

// MongoDB Connection
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('✓ Connected to MongoDB Atlas');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

// Site Data Schema
const siteDataSchema = new mongoose.Schema({
  dataKey: { type: String, required: true, unique: true, default: 'main' },
  data: { type: mongoose.Schema.Types.Mixed, required: true },
  updatedAt: { type: Date, default: Date.now }
});

const SiteData = mongoose.model('SiteData', siteDataSchema);

// Contact Submission Schema
const contactSubmissionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  people: { type: String },
  message: { type: String, required: true },
  submittedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['new', 'read', 'responded'], default: 'new' }
});

const ContactSubmission = mongoose.model('ContactSubmission', contactSubmissionSchema);

// Initialize admin user
const initializeAdmin = async () => {
  try {
    const existingAdmin = await User.findOne({ username: 'admin' });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.create({ username: 'admin', password: hashedPassword });
      console.log('✓ Admin user created (username: admin, password: admin123)');
    }
  } catch (error) {
    console.error('Error initializing admin:', error);
  }
};

initializeAdmin();

// Login Route
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password required' });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id, username: user.username }, JWT_SECRET, {
      expiresIn: '24h',
    });

    res.json({ token, username: user.username });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Verify Token Middleware
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Protected Route Example
app.get('/api/verify', verifyToken, (req, res) => {
  res.json({ valid: true, user: req.user });
});

// File Upload Endpoint
app.post('/api/upload', verifyToken, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;
    res.json({
      success: true,
      url: fileUrl,
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
});

// Get Site Data
app.get('/api/sitedata', async (req, res) => {
  try {
    const siteData = await SiteData.findOne({ dataKey: 'main' });
    if (siteData) {
      res.json({ success: true, data: siteData.data });
    } else {
      // No data in DB, return null so frontend uses defaults
      res.json({ success: true, data: null });
    }
  } catch (error) {
    console.error('Get site data error:', error);
    res.status(500).json({ message: 'Failed to get site data', error: error.message });
  }
});

// Debug endpoint to check what's in database
app.get('/api/sitedata/debug', async (req, res) => {
  try {
    const siteData = await SiteData.findOne({ dataKey: 'main' });
    res.json({ 
      success: true, 
      hasData: !!siteData,
      data: siteData ? siteData.data : null,
      updatedAt: siteData ? siteData.updatedAt : null
    });
  } catch (error) {
    res.status(500).json({ message: 'Debug failed', error: error.message });
  }
});

// Reset site data (Protected) - deletes DB data to use defaults
app.delete('/api/sitedata/reset', verifyToken, async (req, res) => {
  try {
    await SiteData.deleteOne({ dataKey: 'main' });
    res.json({ success: true, message: 'Site data reset to defaults' });
  } catch (error) {
    console.error('Reset site data error:', error);
    res.status(500).json({ message: 'Failed to reset site data', error: error.message });
  }
});

// Update Site Data (Protected)
app.post('/api/sitedata', verifyToken, async (req, res) => {
  try {
    const { data } = req.body;
    
    if (!data) {
      return res.status(400).json({ message: 'No data provided' });
    }

    const siteData = await SiteData.findOneAndUpdate(
      { dataKey: 'main' },
      { data: data, updatedAt: new Date() },
      { upsert: true, new: true }
    );

    res.json({ success: true, data: siteData.data });
  } catch (error) {
    console.error('Update site data error:', error);
    res.status(500).json({ message: 'Failed to update site data', error: error.message });
  }
});

// Submit Contact Form (Public)
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, people, message } = req.body;

    if (!name || !email || !phone || !message) {
      return res.status(400).json({ message: 'Name, email, phone, and message are required' });
    }

    const submission = await ContactSubmission.create({
      name,
      email,
      phone,
      people: people || '',
      message,
    });

    res.json({ success: true, message: 'Contact form submitted successfully', id: submission._id });
  } catch (error) {
    console.error('Contact submission error:', error);
    res.status(500).json({ message: 'Failed to submit contact form', error: error.message });
  }
});

// Get All Contact Submissions (Protected)
app.get('/api/contacts', verifyToken, async (req, res) => {
  try {
    const contacts = await ContactSubmission.find().sort({ submittedAt: -1 });
    res.json({ success: true, contacts });
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({ message: 'Failed to get contacts', error: error.message });
  }
});

// Update Contact Status (Protected)
app.patch('/api/contacts/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['new', 'read', 'responded'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const contact = await ContactSubmission.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.json({ success: true, contact });
  } catch (error) {
    console.error('Update contact status error:', error);
    res.status(500).json({ message: 'Failed to update contact status', error: error.message });
  }
});

// Delete Contact Submission (Protected)
app.delete('/api/contacts/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await ContactSubmission.findByIdAndDelete(id);

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.json({ success: true, message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('Delete contact error:', error);
    res.status(500).json({ message: 'Failed to delete contact', error: error.message });
  }
});

// Serve static files from the React app (frontend build)
const frontendDistPath = path.join(__dirname, '..', 'dist');
if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));
  
  // Handle React routing - return index.html for all non-API routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
  console.log('✓ Serving frontend from:', frontendDistPath);
} else {
  console.log('⚠ Frontend build not found at:', frontendDistPath);
  console.log('  Run "npm run build" in the root directory to build the frontend');
}

app.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`);
});
