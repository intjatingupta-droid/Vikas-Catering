# Environment Variables Configuration

This document explains all environment variables used in the project and how to configure them for different deployment scenarios.

## 🎯 Quick Setup

### For Local Development
No changes needed! The project auto-detects localhost URLs.

### For Production Deployment
Set these environment variables on your hosting platform:

**Backend (Render/Railway/etc):**
```env
BACKEND_URL=https://your-backend-domain.com
FRONTEND_URL=https://your-frontend-domain.com
NODE_ENV=production
```

**Frontend (Vercel/Netlify/etc):**
```env
VITE_API_URL=https://your-backend-domain.com
```

---

## 📋 All Environment Variables

### Frontend Variables (Frontend/.env)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_API_URL` | No | Auto-detect | Backend API URL |

**Auto-detection logic:**
- If `VITE_API_URL` is set → Uses that URL
- If empty and in development → Uses `http://localhost:5000`
- If empty and in production → Uses `https://vikas-catering.onrender.com`

**Examples:**
```env
# For Render backend
VITE_API_URL=https://vikas-catering.onrender.com

# For Railway backend
VITE_API_URL=https://your-app.railway.app

# For custom domain
VITE_API_URL=https://api.yourdomain.com

# Auto-detect (leave empty)
VITE_API_URL=
```

---

### Backend Variables (server/.env)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `MONGODB_URI` | Yes | localhost | MongoDB connection string |
| `JWT_SECRET` | Yes | default | Secret key for JWT tokens |
| `PORT` | No | 5000 | Server port |
| `NODE_ENV` | No | development | Environment (development/production) |
| `FRONTEND_URL` | No | localhost:8080 | Frontend URL for CORS |
| `BACKEND_URL` | No | Auto-detect | Backend URL for file uploads |

**Auto-detection for BACKEND_URL:**
- If `BACKEND_URL` is set → Uses that URL
- If empty and `NODE_ENV=production` → Uses `https://vikas-catering.onrender.com`
- If empty and in development → Uses `http://localhost:PORT`

**Example Configuration:**
```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/database

# JWT Secret (use a strong random string)
JWT_SECRET=your-super-secret-key-here

# Server Port
PORT=5000

# Node Environment
NODE_ENV=production

# Frontend URL (for CORS)
FRONTEND_URL=https://your-frontend.vercel.app

# Backend URL (for file uploads)
BACKEND_URL=https://your-backend.onrender.com
```

---

## 🚀 Deployment Scenarios

### Scenario 1: Render + Vercel (Current Setup)

**Backend on Render:**
```env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
PORT=10000
NODE_ENV=production
FRONTEND_URL=https://vikas-catering.vercel.app
BACKEND_URL=https://vikas-catering.onrender.com
```

**Frontend on Vercel:**
```env
VITE_API_URL=https://vikas-catering.onrender.com
```

---

### Scenario 2: Railway + Netlify

**Backend on Railway:**
```env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://your-app.netlify.app
BACKEND_URL=https://your-app.railway.app
```

**Frontend on Netlify:**
```env
VITE_API_URL=https://your-app.railway.app
```

---

### Scenario 3: Custom Domain

**Backend:**
```env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://www.yourdomain.com
BACKEND_URL=https://api.yourdomain.com
```

**Frontend:**
```env
VITE_API_URL=https://api.yourdomain.com
```

---

### Scenario 4: Same Domain (Fullstack)

If you deploy both frontend and backend on the same domain:

**Backend:**
```env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
PORT=10000
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com
BACKEND_URL=https://yourdomain.com
```

**Frontend:**
```env
VITE_API_URL=https://yourdomain.com
```

---

## 🔧 How It Works

### Frontend API Configuration
Located in `Frontend/src/config/api.ts`:

```typescript
const envApiUrl = import.meta.env.VITE_API_URL;
const isDevelopment = import.meta.env.DEV;

export const API_URL = envApiUrl 
  ? envApiUrl 
  : (isDevelopment 
      ? 'http://localhost:5000' 
      : 'https://vikas-catering.onrender.com');
```

All API calls use `API_ENDPOINTS` which are built from `API_URL`:
- `API_ENDPOINTS.login` → `${API_URL}/api/login`
- `API_ENDPOINTS.upload` → `${API_URL}/api/upload`
- etc.

### Backend URL Configuration
Located in `server/index.js`:

```javascript
const BACKEND_URL = process.env.BACKEND_URL || (
  process.env.NODE_ENV === 'production' 
    ? 'https://vikas-catering.onrender.com' 
    : `http://localhost:${PORT}`
);
```

Used for:
- File upload URLs
- Image serving
- API responses

### CORS Configuration
Located in `server/index.js`:

```javascript
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:8080',
    'http://localhost:5173', // Vite dev server
    'https://vikas-catering.vercel.app' // Backward compatibility
  ],
  credentials: true
}));
```

---

## 📝 Helper Scripts

All helper scripts now read from environment variables:

### upload-images.js
Reads `BACKEND_URL` or `SERVER_URL` for the server URL.

### fix-image-urls.js
Reads `BACKEND_URL` for the production URL.

### fix-all-images.js
Reads `BACKEND_URL` for the production URL.

**Usage:**
```bash
# Set environment variable before running
BACKEND_URL=https://your-backend.com node server/upload-images.js
```

Or add to your `.env` file:
```env
BACKEND_URL=https://your-backend.com
```

---

## ✅ Verification Checklist

After setting environment variables:

### Backend
- [ ] Server starts without errors
- [ ] MongoDB connection successful
- [ ] File uploads return correct URLs
- [ ] CORS allows frontend domain

### Frontend
- [ ] Build completes successfully
- [ ] API calls go to correct backend URL
- [ ] Login works
- [ ] Image uploads work
- [ ] Images display correctly

### Test Commands
```bash
# Backend - Check environment
cd server
node -e "require('dotenv').config(); console.log(process.env)"

# Frontend - Check build
cd Frontend
npm run build
# Check console output for API_URL

# Test API connection
curl https://your-backend.com/api/verify
```

---

## 🆘 Troubleshooting

### Issue: CORS errors
**Solution:** Make sure `FRONTEND_URL` in backend matches your frontend domain exactly.

### Issue: Images not loading
**Solution:** Verify `BACKEND_URL` is set correctly and matches your backend domain.

### Issue: API calls fail
**Solution:** Check `VITE_API_URL` in frontend matches your backend URL.

### Issue: 404 on API routes
**Solution:** Ensure backend is running and `BACKEND_URL` doesn't have trailing slash.

---

## 📚 Additional Resources

- [Render Environment Variables](https://render.com/docs/environment-variables)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
