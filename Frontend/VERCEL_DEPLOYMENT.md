# Vercel Deployment Guide for Vikas Caterings

## 🚀 Deployment Steps

### Part 1: Deploy Backend (Choose One Option)

#### Option A: Deploy Backend to Render.com (Recommended - Free)

1. Go to https://render.com and sign up/login
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `vikas-caterings-backend`
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`
5. Add Environment Variables:
   - `MONGODB_URI`: `mongodb+srv://intarjungupta_db_user:iM6kYdM9td723RHe@cluster0.vxgwivf.mongodb.net/catering-admin?retryWrites=true&w=majority`
   - `JWT_SECRET`: `your-random-secret-key-here-change-this`
   - `PORT`: `5000`
   - `FRONTEND_URL`: `https://your-frontend-url.vercel.app` (update after deploying frontend)
6. Click "Create Web Service"
7. Copy the deployed URL (e.g., `https://vikas-caterings-backend.onrender.com`)

#### Option B: Deploy Backend to Railway.app (Alternative - Free)

1. Go to https://railway.app and sign up/login
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Configure:
   - **Root Directory**: `server`
   - **Start Command**: `node index.js`
5. Add Environment Variables (same as above)
6. Deploy and copy the URL

### Part 2: Deploy Frontend to Vercel

1. Go to https://vercel.com and sign up/login
2. Click "Add New" → "Project"
3. Import your GitHub repository: `intjatingupta-droid/Vikas-Catering`
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (leave as root)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add Environment Variable:
   - **Name**: `VITE_API_URL`
   - **Value**: Your backend URL from Step 1 (e.g., `https://vikas-caterings-backend.onrender.com`)
6. Click "Deploy"
7. Wait for deployment to complete
8. Copy your Vercel URL (e.g., `https://vikas-caterings.vercel.app`)

### Part 3: Update CORS Settings

1. Go back to your backend hosting (Render/Railway)
2. Update the `FRONTEND_URL` environment variable with your Vercel URL
3. Redeploy the backend

## ✅ Verification Checklist

- [ ] Backend is deployed and accessible
- [ ] Frontend is deployed on Vercel
- [ ] MongoDB Atlas connection is working
- [ ] Login page works (username: `admin`, password: `admin123`)
- [ ] Admin panel loads correctly
- [ ] Contact form submissions save to database
- [ ] Images and videos load properly
- [ ] All pages are accessible

## 🔧 Troubleshooting

### Backend Issues
- Check environment variables are set correctly
- Verify MongoDB Atlas IP whitelist (allow all: `0.0.0.0/0`)
- Check backend logs for errors

### Frontend Issues
- Verify `VITE_API_URL` points to correct backend
- Check browser console for CORS errors
- Ensure all API calls use the environment variable

### Database Issues
- Verify MongoDB Atlas connection string
- Check database user permissions
- Ensure network access is configured

## 📝 Important Notes

1. **Security**: Change the `JWT_SECRET` to a strong random string
2. **MongoDB**: Ensure IP whitelist allows connections from your hosting provider
3. **Environment Variables**: Never commit `.env` files to GitHub
4. **CORS**: Backend must allow requests from your Vercel domain

## 🎉 Your Site Will Be Live At:
- Frontend: `https://vikas-caterings.vercel.app` (or your custom domain)
- Backend: `https://vikas-caterings-backend.onrender.com` (or Railway URL)

## 📞 Need Help?
If you encounter any issues, check the logs in your hosting dashboard or contact support.
