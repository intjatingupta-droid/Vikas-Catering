# Full-Stack Deployment on Render

This guide explains how to deploy both frontend and backend together on Render.

## Architecture
- **Single Render Service**: Serves both frontend (React) and backend (Express)
- **Frontend**: Built as static files and served by Express
- **Backend**: Express server handles API routes and serves frontend
- **Database**: MongoDB Atlas (external)

## Deployment Steps

### 1. Push Code to GitHub
```bash
git add .
git commit -m "Configure full-stack deployment on Render"
git push origin main
```

### 2. Update Render Service

#### Option A: Update Existing Service
1. Go to your Render dashboard: https://dashboard.render.com
2. Select your existing `vikas-caterings-backend` service
3. Go to **Settings**
4. Update the following:

**Build Command:**
```
npm install && npm run build && cd server && npm install
```

**Start Command:**
```
cd server && node index.js
```

**Root Directory:** Leave empty (use repository root)

#### Option B: Create New Service
1. Go to Render Dashboard
2. Click **New +** → **Web Service**
3. Connect your GitHub repository: `intjatingupta-droid/Vikas-Catering`
4. Configure:
   - **Name**: `vikas-caterings`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build && cd server && npm install`
   - **Start Command**: `cd server && node index.js`
   - **Instance Type**: Free or Starter

### 3. Environment Variables

Set these in Render Dashboard → Service → Environment:

```
MONGODB_URI=mongodb+srv://intarjungupta_db_user:iM6kYdM9td723RHe@cluster0.vxgwivf.mongodb.net/catering-admin?retryWrites=true&w=majority
JWT_SECRET=your-secret-key-change-in-production-use-random-string-here
FRONTEND_URL=*
PORT=10000
NODE_ENV=production
```

### 4. Deploy

- Render will automatically deploy when you push to GitHub
- Or manually trigger deploy from Render Dashboard

### 5. Access Your Site

After deployment completes:
- **Frontend**: `https://vikas-caterings.onrender.com`
- **Backend API**: `https://vikas-caterings.onrender.com/api/*`
- **Admin Panel**: `https://vikas-caterings.onrender.com/admin`

## How It Works

1. **Build Process**:
   - `npm install` - Installs frontend dependencies
   - `npm run build` - Builds React app to `/dist` folder
   - `cd server && npm install` - Installs backend dependencies

2. **Runtime**:
   - Express server starts on port 10000
   - Serves API routes at `/api/*`
   - Serves uploaded files at `/uploads/*`
   - Serves frontend static files from `/dist`
   - All non-API routes return `index.html` (React Router handles routing)

## Local Development

For local development with this setup:

1. **Start Backend** (Terminal 1):
```bash
cd server
npm run dev
```

2. **Start Frontend** (Terminal 2):
```bash
npm run dev
```

3. **Update .env** for local development:
```
VITE_API_URL=http://localhost:5000
```

## Troubleshooting

### Images Not Loading
- Check that images are in `server/uploads/` folder
- Verify MongoDB has correct image URLs
- Run `npm run fix-all-images` in server folder if needed

### 404 on Page Refresh
- Make sure the catch-all route is after all API routes in `server/index.js`
- Verify `dist` folder exists after build

### Build Fails
- Check Node version (should be 18+)
- Verify all dependencies are in `package.json`
- Check build logs in Render dashboard

## MongoDB Atlas Configuration

Ensure MongoDB Atlas allows connections from Render:
1. Go to MongoDB Atlas → Network Access
2. Add IP: `0.0.0.0/0` (allow all) or Render's IP ranges
3. Save changes

## Benefits of This Setup

✅ Single deployment (easier to manage)
✅ No CORS issues (same domain)
✅ Faster (no cross-origin requests)
✅ Lower cost (one service instead of two)
✅ Simpler environment configuration
