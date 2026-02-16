# Complete Deployment Guide

## 🚀 Deployment Overview

- **Backend**: Deploy to Render
- **Frontend**: Deploy to Vercel
- **Database**: MongoDB Atlas (already configured)

---

## 📋 Pre-Deployment Checklist

- [ ] MongoDB Atlas is set up and accessible
- [ ] You have accounts on Render and Vercel
- [ ] Your code is pushed to GitHub
- [ ] Custom domains are configured (optional)

---

## 🔧 Part 1: Deploy Backend to Render

### Step 1: Create New Web Service

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Select the repository: `catering-site`

### Step 2: Configure Service

**Basic Settings:**
- **Name**: `vikas-caterings-backend` (or your choice)
- **Region**: Choose closest to your users
- **Branch**: `main`
- **Root Directory**: `server`
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `node index.js`

### Step 3: Set Environment Variables

Click "Environment" tab and add these variables:

| Key | Value |
|-----|-------|
| `MONGODB_URI` | `mongodb+srv://intarjungupta_db_user:iM6kYdM9td723RHe@cluster0.vxgwivf.mongodb.net/catering-admin?retryWrites=true&w=majority` |
| `JWT_SECRET` | `your-random-secret-key-here-change-this` |
| `PORT` | `10000` |
| `NODE_ENV` | `production` |
| `FRONTEND_URL` | `https://vikascateringservice.com` (or your Vercel URL) |
| `BACKEND_URL` | `https://your-backend-url.onrender.com` (or custom domain) |

**Important Notes:**
- Change `JWT_SECRET` to a random string (use a password generator)
- `BACKEND_URL` should be your Render service URL or custom domain
- `FRONTEND_URL` should be your Vercel URL or custom domain

### Step 4: Deploy

1. Click "Create Web Service"
2. Wait for deployment (5-10 minutes)
3. Note your backend URL: `https://your-service.onrender.com`

### Step 5: Custom Domain (Optional)

1. Go to Settings → Custom Domain
2. Add: `backend.vikascateringservice.com`
3. Update DNS records as instructed
4. Update `BACKEND_URL` environment variable to use custom domain

---

## 🎨 Part 2: Deploy Frontend to Vercel

### Step 1: Import Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Select the repository: `catering-site`

### Step 2: Configure Project

**Framework Preset:** Vite
**Root Directory:** `Frontend`
**Build Command:** `npm run build`
**Output Directory:** `dist`
**Install Command:** `npm install`

### Step 3: Set Environment Variables

Click "Environment Variables" and add:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://backend.vikascateringservice.com` (your backend URL) |

**Important:**
- Use your actual Render backend URL (from Part 1, Step 4)
- If using custom domain, use that instead

### Step 4: Deploy

1. Click "Deploy"
2. Wait for deployment (2-5 minutes)
3. Note your frontend URL: `https://your-project.vercel.app`

### Step 5: Custom Domain (Optional)

1. Go to Settings → Domains
2. Add: `vikascateringservice.com` and `www.vikascateringservice.com`
3. Update DNS records as instructed

### Step 6: Update Backend CORS

After getting your Vercel URL:
1. Go back to Render Dashboard
2. Update `FRONTEND_URL` environment variable with your Vercel URL
3. Redeploy backend service

---

## 🔄 Part 3: Update Environment Variables

### If You Get New URLs

**After Render deployment, update Vercel:**
1. Vercel Dashboard → Your Project → Settings → Environment Variables
2. Update `VITE_API_URL` to your Render backend URL
3. Redeploy frontend

**After Vercel deployment, update Render:**
1. Render Dashboard → Your Service → Environment
2. Update `FRONTEND_URL` to your Vercel URL
3. Redeploy backend

---

## 📊 Part 4: Verify Deployment

### Test Backend

Visit: `https://your-backend-url.onrender.com/api/sitedata`

Should return:
```json
{
  "success": true,
  "data": { ... }
}
```

### Test Frontend

1. Visit: `https://your-frontend-url.vercel.app`
2. Check if homepage loads
3. Try logging in: `/login`
   - Username: `admin`
   - Password: `admin123`
4. Check if admin panel works

### Test API Connection

1. Open browser console (F12)
2. Look for: `🔧 API Configuration:`
3. Verify `API_URL` points to your backend

---

## 🔐 Security Checklist

After deployment:

- [ ] Change default admin password in MongoDB
- [ ] Update `JWT_SECRET` to a strong random string
- [ ] Verify CORS only allows your frontend domain
- [ ] Enable HTTPS (automatic on Render/Vercel)
- [ ] Set up MongoDB IP whitelist (or allow all for cloud deployment)

---

## 🐛 Troubleshooting

### Frontend can't connect to backend

**Check:**
1. `VITE_API_URL` is set correctly in Vercel
2. Backend is running on Render
3. CORS is configured with correct frontend URL
4. Both services use HTTPS

**Fix:**
```bash
# Check browser console for API URL
# Should show: https://your-backend-url.onrender.com
```

### Backend CORS errors

**Check:**
1. `FRONTEND_URL` is set in Render
2. URL matches exactly (with/without www)
3. Both use HTTPS

**Fix:**
Update `server/index.js` CORS config to include your domain:
```javascript
origin: [
  process.env.FRONTEND_URL,
  'https://your-vercel-url.vercel.app',
  'https://vikascateringservice.com',
  'https://www.vikascateringservice.com'
]
```

### Images not loading

**Check:**
1. `BACKEND_URL` is set correctly in Render
2. Images are uploaded to server (not using local paths)

**Fix:**
Run the image upload script:
```bash
BACKEND_URL=https://your-backend-url.onrender.com node scripts/upload-images.js
```

---

## 🔄 Redeployment

### Update Backend
1. Push changes to GitHub
2. Render auto-deploys from `main` branch
3. Or manually redeploy from Render dashboard

### Update Frontend
1. Push changes to GitHub
2. Vercel auto-deploys from `main` branch
3. Or manually redeploy from Vercel dashboard

### Update Environment Variables
1. Change in Render/Vercel dashboard
2. Manually trigger redeploy
3. Changes take effect immediately

---

## 📝 Environment Variables Summary

### Local Development

**Frontend/.env:**
```env
VITE_API_URL=http://localhost:5000
```

**server/.env:**
```env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:8080
BACKEND_URL=http://localhost:5000
```

### Production (Render + Vercel)

**Vercel Environment Variables:**
```env
VITE_API_URL=https://backend.vikascateringservice.com
```

**Render Environment Variables:**
```env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-random-secret-key
PORT=10000
NODE_ENV=production
FRONTEND_URL=https://vikascateringservice.com
BACKEND_URL=https://backend.vikascateringservice.com
```

---

## 🎯 Quick Reference

| What | Where to Set | Variable Name | Value |
|------|-------------|---------------|-------|
| Backend API URL | Vercel Dashboard | `VITE_API_URL` | Your Render URL |
| Frontend URL | Render Dashboard | `FRONTEND_URL` | Your Vercel URL |
| Backend URL | Render Dashboard | `BACKEND_URL` | Your Render URL |
| MongoDB | Render Dashboard | `MONGODB_URI` | Your Atlas URI |
| JWT Secret | Render Dashboard | `JWT_SECRET` | Random string |

---

## ✅ Success Indicators

Your deployment is successful when:

- ✅ Frontend loads without errors
- ✅ Login works
- ✅ Admin panel loads
- ✅ Images display correctly
- ✅ Contact form submissions work
- ✅ No CORS errors in browser console
- ✅ API calls show correct backend URL in network tab

---

**Last Updated:** February 16, 2026
**Deployment Stack:** Render (Backend) + Vercel (Frontend) + MongoDB Atlas (Database)
