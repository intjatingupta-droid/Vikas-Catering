# Deployment Environment Variables Guide

## 🎯 Overview

Environment variables are configured differently for local development vs production deployment.

---

## 🏠 Local Development

### Frontend (.env file)
**File:** `Frontend/.env`

```env
# Leave empty for auto-detection (will use http://localhost:5000)
VITE_API_URL=

# OR explicitly set:
VITE_API_URL=http://localhost:5000
```

### Backend (.env file)
**File:** `server/.env`

```env
MONGODB_URI=mongodb+srv://intarjungupta_db_user:iM6kYdM9td723RHe@cluster0.vxgwivf.mongodb.net/catering-admin?retryWrites=true&w=majority
JWT_SECRET=your-secret-key-change-in-production
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:8080
BACKEND_URL=http://localhost:5000
```

---

## 🚀 Production Deployment

### ⚠️ IMPORTANT: Do NOT use .env files in production!

Set environment variables in the platform dashboards instead.

---

## 🔴 Render (Backend) Configuration

### Step 1: Deploy to Render
1. Connect your GitHub repository
2. Select `server` folder as root directory
3. Build Command: `npm install`
4. Start Command: `node index.js`

### Step 2: Set Environment Variables in Render Dashboard

Go to: **Render Dashboard → Your Service → Environment**

Add these variables:

| Key | Value | Notes |
|-----|-------|-------|
| `MONGODB_URI` | `mongodb+srv://intarjungupta_db_user:iM6kYdM9td723RHe@cluster0.vxgwivf.mongodb.net/catering-admin?retryWrites=true&w=majority` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | `your-random-secret-key-here` | Generate a random string (32+ characters) |
| `NODE_ENV` | `production` | Tells the app it's in production |
| `PORT` | `10000` | Render's default port (auto-set) |
| `FRONTEND_URL` | `https://vikascateringservice.com` | Your Vercel domain (for CORS) |
| `BACKEND_URL` | `https://backend.vikascateringservice.com` | Your Render domain (for file uploads) |

### Step 3: Get Your Render URL

After deployment, Render gives you a URL like:
- Default: `https://your-app-name.onrender.com`
- Custom: `https://backend.vikascateringservice.com` (if you set up custom domain)

**Use this URL for `BACKEND_URL` and in Vercel's `VITE_API_URL`**

---

## 🔵 Vercel (Frontend) Configuration

### Step 1: Deploy to Vercel
1. Connect your GitHub repository
2. Select `Frontend` folder as root directory
3. Framework Preset: Vite
4. Build Command: `npm run build`
5. Output Directory: `dist`

### Step 2: Set Environment Variables in Vercel Dashboard

Go to: **Vercel Dashboard → Your Project → Settings → Environment Variables**

Add this variable:

| Key | Value | Environment |
|-----|-------|-------------|
| `VITE_API_URL` | `https://backend.vikascateringservice.com` | Production, Preview, Development |

**Replace with your actual Render URL!**

Examples:
- Render default: `https://your-backend.onrender.com`
- Custom domain: `https://backend.vikascateringservice.com`

### Step 3: Redeploy

After adding environment variables:
1. Go to Deployments tab
2. Click "..." on latest deployment
3. Click "Redeploy"

---

## 🔄 How It Works

### Development Mode
```
Frontend (localhost:8080)
    ↓ VITE_API_URL=http://localhost:5000
Backend (localhost:5000)
    ↓ MONGODB_URI
MongoDB Atlas
```

### Production Mode
```
Frontend (Vercel)
    ↓ VITE_API_URL=https://backend.vikascateringservice.com
Backend (Render)
    ↓ MONGODB_URI
MongoDB Atlas
```

---

## 🐛 Troubleshooting

### Error: "Failed to fetch" or "ERR_CONNECTION_REFUSED"

**Problem:** Frontend can't connect to backend

**Solutions:**

1. **Check Vercel Environment Variables:**
   - Go to Vercel Dashboard → Settings → Environment Variables
   - Verify `VITE_API_URL` is set to your Render URL
   - Redeploy after changing

2. **Check Render is Running:**
   - Go to Render Dashboard
   - Check if service is "Live" (green)
   - Check logs for errors

3. **Check CORS Configuration:**
   - In Render Dashboard → Environment Variables
   - Verify `FRONTEND_URL` matches your Vercel domain
   - Should be: `https://vikascateringservice.com` (no trailing slash)

4. **Check URLs Match:**
   - Vercel's `VITE_API_URL` should match Render's `BACKEND_URL`
   - Both should use HTTPS in production

### Error: "Mixed Content" (HTTP/HTTPS)

**Problem:** Frontend (HTTPS) trying to connect to backend (HTTP)

**Solution:**
- Ensure `VITE_API_URL` uses `https://` not `http://`
- Render automatically provides HTTPS

### Error: "CORS Error"

**Problem:** Backend rejecting requests from frontend

**Solution:**
- Check `FRONTEND_URL` in Render environment variables
- Should match your Vercel domain exactly
- No trailing slash
- Include `https://`

---

## 📋 Deployment Checklist

### Before Deploying Backend (Render):
- [ ] MongoDB Atlas is accessible (not IP restricted)
- [ ] Have your MongoDB connection string ready
- [ ] Generated a secure JWT_SECRET (32+ random characters)

### After Deploying Backend (Render):
- [ ] Set all environment variables in Render Dashboard
- [ ] Service shows "Live" status
- [ ] Copy the Render URL (e.g., `https://your-app.onrender.com`)
- [ ] Test backend: Visit `https://your-app.onrender.com/api/sitedata`

### Before Deploying Frontend (Vercel):
- [ ] Backend is deployed and running
- [ ] Have your Render URL ready

### After Deploying Frontend (Vercel):
- [ ] Set `VITE_API_URL` in Vercel Dashboard (use Render URL)
- [ ] Redeploy after setting environment variable
- [ ] Test login at `https://your-app.vercel.app/login`

### Final Verification:
- [ ] Can access homepage
- [ ] Can login to admin panel
- [ ] Can upload images
- [ ] Can edit content
- [ ] Changes save to database

---

## 🔐 Security Notes

1. **Never commit .env files to Git** (already in .gitignore)
2. **Use different JWT_SECRET for production** (not the default one)
3. **Keep MongoDB credentials secure**
4. **Use HTTPS only in production**

---

## 📞 Quick Reference

### Current Configuration

**Production URLs:**
- Frontend: `https://vikascateringservice.com`
- Backend: `https://backend.vikascateringservice.com`
- Database: MongoDB Atlas

**Render Environment Variables:**
```env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
NODE_ENV=production
FRONTEND_URL=https://vikascateringservice.com
BACKEND_URL=https://backend.vikascateringservice.com
```

**Vercel Environment Variables:**
```env
VITE_API_URL=https://backend.vikascateringservice.com
```

---

**Last Updated:** February 20, 2026
