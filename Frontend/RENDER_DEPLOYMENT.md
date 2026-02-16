# 🚀 Complete Deployment Guide - Render + Vercel

## Part 1: Deploy Backend to Render.com

### Step 1: Create Render Account
1. Go to https://render.com
2. Sign up with GitHub (recommended)

### Step 2: Create New Web Service
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository: `intjatingupta-droid/Vikas-Catering`
3. Click **"Connect"**

### Step 3: Configure Service
Fill in these settings:

- **Name**: `vikas-caterings-backend`
- **Region**: Choose closest to you (e.g., Singapore)
- **Branch**: `main`
- **Root Directory**: `server`
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `node index.js`
- **Instance Type**: `Free`

### Step 4: Add Environment Variables
Click **"Advanced"** → **"Add Environment Variable"**

Add these 4 variables:

1. **MONGODB_URI**
   ```
   mongodb+srv://intarjungupta_db_user:iM6kYdM9td723RHe@cluster0.vxgwivf.mongodb.net/catering-admin?retryWrites=true&w=majority
   ```

2. **JWT_SECRET**
   ```
   vikas-caterings-secret-2024-change-this-to-random-string
   ```

3. **PORT**
   ```
   10000
   ```

4. **FRONTEND_URL**
   ```
   https://vikas-caterings.vercel.app
   ```
   (Update this after deploying frontend - for now use `*` or leave as is)

### Step 5: Deploy
1. Click **"Create Web Service"**
2. Wait 3-5 minutes for deployment
3. Copy your backend URL (e.g., `https://vikas-caterings-backend.onrender.com`)

---

## Part 2: Deploy Frontend to Vercel

### Step 1: Go to Vercel
1. Go to https://vercel.com
2. Sign up/login with GitHub

### Step 2: Import Project
1. Click **"Add New"** → **"Project"**
2. Import `intjatingupta-droid/Vikas-Catering`
3. Click **"Import"**

### Step 3: Configure Project
- **Framework Preset**: Vite (auto-detected)
- **Root Directory**: `./` (leave as root)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### Step 4: Add Environment Variable
Click **"Environment Variables"**

Add this variable:

**Key**: `VITE_API_URL`
**Value**: Your Render backend URL (e.g., `https://vikas-caterings-backend.onrender.com`)

### Step 5: Deploy
1. Click **"Deploy"**
2. Wait 2-3 minutes
3. Copy your Vercel URL (e.g., `https://vikas-caterings.vercel.app`)

---

## Part 3: Update Backend CORS

### Step 1: Update FRONTEND_URL
1. Go back to Render dashboard
2. Click on your backend service
3. Go to **"Environment"** tab
4. Update **FRONTEND_URL** with your Vercel URL
5. Click **"Save Changes"**
6. Service will auto-redeploy

---

## ✅ Verification Checklist

Test these features:

- [ ] Homepage loads with video
- [ ] All pages accessible (Menu, Our Work, Contact)
- [ ] Login page works (`/login`)
- [ ] Admin login successful (username: `admin`, password: `admin123`)
- [ ] Admin panel loads
- [ ] Can edit content in admin
- [ ] Contact form submissions work
- [ ] Contact submissions appear in admin panel
- [ ] Images and videos load properly

---

## 🔧 Troubleshooting

### Backend Issues

**Problem**: Backend not starting
- Check Render logs for errors
- Verify all environment variables are set
- Check MongoDB Atlas IP whitelist (allow `0.0.0.0/0`)

**Problem**: Database connection failed
- Verify MONGODB_URI is correct
- Check MongoDB Atlas network access settings
- Ensure database user has read/write permissions

### Frontend Issues

**Problem**: API calls failing
- Check VITE_API_URL is correct
- Verify backend is running on Render
- Check browser console for CORS errors

**Problem**: Routes not working (404 errors)
- Ensure `vercel.json` exists in root
- Check Vercel deployment logs

### CORS Issues

**Problem**: CORS errors in browser
- Update FRONTEND_URL in Render backend
- Ensure it matches your Vercel domain exactly
- Redeploy backend after updating

---

## 📝 Important URLs

After deployment, save these:

- **Frontend**: https://vikas-caterings.vercel.app
- **Backend**: https://vikas-caterings-backend.onrender.com
- **Admin Panel**: https://vikas-caterings.vercel.app/admin
- **MongoDB**: Already configured in Atlas

---

## 🎉 You're Done!

Your site is now live! Share the URL with your clients.

**Default Admin Credentials:**
- Username: `admin`
- Password: `admin123`

**⚠️ Security Note**: Change the admin password after first login!

---

## 💡 Next Steps

1. **Custom Domain** (Optional)
   - Add custom domain in Vercel settings
   - Update FRONTEND_URL in Render

2. **Change Admin Password**
   - Login to admin panel
   - Update credentials in MongoDB

3. **Add Content**
   - Upload images
   - Update menu items
   - Add testimonials

4. **Monitor**
   - Check Render logs for backend
   - Monitor Vercel analytics
   - Review contact submissions regularly

---

Need help? Check the logs in Render/Vercel dashboards!
