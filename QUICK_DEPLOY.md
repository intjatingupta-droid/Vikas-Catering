# Quick Deploy Reference Card

## 🎯 TL;DR - Deploy in 5 Minutes

### Backend (Render)
```
Root Directory: server
Build Command: npm install
Start Command: node index.js
```

**Environment Variables:**
```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=random-secret-key
NODE_ENV=production
BACKEND_URL=https://your-backend.onrender.com
FRONTEND_URL=https://your-frontend.vercel.app
```

---

### Frontend (Vercel)
```
Root Directory: Frontend
Build Command: npm run build
Output Directory: dist
```

**Environment Variables:**
```
VITE_API_URL=https://your-backend.onrender.com
```

---

## 📋 Deployment Steps

### 1. Push to GitHub
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Deploy Backend (Render)
1. Go to [render.com](https://render.com)
2. New → Web Service
3. Connect GitHub repo
4. Settings:
   - Name: `vikas-catering-backend`
   - Root Directory: `server`
   - Build: `npm install`
   - Start: `node index.js`
5. Add environment variables (see above)
6. Create Web Service

### 3. Deploy Frontend (Vercel)
1. Go to [vercel.com](https://vercel.com)
2. New Project
3. Import GitHub repo
4. Settings:
   - Framework: Vite
   - Root Directory: `Frontend`
   - Build: `npm run build`
   - Output: `dist`
5. Add environment variable: `VITE_API_URL`
6. Deploy

### 4. Update URLs
After both are deployed:

**Update Backend .env on Render:**
```
BACKEND_URL=https://your-actual-backend.onrender.com
FRONTEND_URL=https://your-actual-frontend.vercel.app
```

**Update Frontend .env on Vercel:**
```
VITE_API_URL=https://your-actual-backend.onrender.com
```

### 5. Redeploy Both
- Render: Manual Deploy → Deploy latest commit
- Vercel: Deployments → Redeploy

---

## ✅ Verify Deployment

1. Open frontend URL
2. Try to login (admin/admin123)
3. Upload an image
4. Check if images load
5. Submit contact form

---

## 🆘 If Something Breaks

### Backend not starting?
- Check Render logs
- Verify MONGODB_URI is correct
- Ensure all env vars are set

### Frontend can't connect to backend?
- Check VITE_API_URL matches backend URL
- Verify CORS settings in backend
- Check browser console for errors

### Images not loading?
- Verify BACKEND_URL in backend env vars
- Check if uploads folder exists
- Test: `https://your-backend.com/uploads/test.jpg`

---

## 🔗 Important URLs

After deployment, save these:

- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-app.onrender.com`
- Admin: `https://your-app.vercel.app/login`
- MongoDB: `https://cloud.mongodb.com`

---

## 📞 Default Credentials

```
Username: admin
Password: admin123
```

**⚠️ Change these in production!**

---

## 🎉 Done!

Your site is now live. Share the frontend URL with your client.

For detailed instructions, see:
- `DEPLOYMENT_COMMANDS.md` - Full deployment guide
- `ENVIRONMENT_VARIABLES.md` - Environment variables reference
- `CONFIGURATION_GUIDE.md` - Configuration options
