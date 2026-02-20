# Quick Deployment Checklist

## 🚀 Deploy in 10 Minutes

### Step 1: Deploy Backend to Render (5 min)

1. **Create New Web Service on Render**
   - Connect GitHub repo
   - Root Directory: `server`
   - Build Command: `npm install`
   - Start Command: `node index.js`

2. **Add Environment Variables** (in Render Dashboard)
   ```
   MONGODB_URI = mongodb+srv://intarjungupta_db_user:iM6kYdM9td723RHe@cluster0.vxgwivf.mongodb.net/catering-admin?retryWrites=true&w=majority
   
   JWT_SECRET = your-random-secret-key-32-characters-long
   
   NODE_ENV = production
   
   FRONTEND_URL = https://your-app.vercel.app
   
   BACKEND_URL = https://your-app.onrender.com
   ```

3. **Copy Your Render URL**
   - Example: `https://vikas-catering.onrender.com`
   - You'll need this for Vercel!

---

### Step 2: Deploy Frontend to Vercel (5 min)

1. **Create New Project on Vercel**
   - Connect GitHub repo
   - Root Directory: `Frontend`
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

2. **Add Environment Variable** (in Vercel Dashboard)
   ```
   VITE_API_URL = https://your-app.onrender.com
   ```
   ⚠️ Use the Render URL you copied in Step 1!

3. **Redeploy**
   - Go to Deployments tab
   - Click "..." → Redeploy

---

### Step 3: Update CORS (2 min)

1. **Go back to Render Dashboard**
2. **Update FRONTEND_URL** with your Vercel URL
   ```
   FRONTEND_URL = https://your-app.vercel.app
   ```

3. **Redeploy** (Render will auto-redeploy)

---

## ✅ Test Your Deployment

1. Visit your Vercel URL: `https://your-app.vercel.app`
2. Click "Login" or go to `/login`
3. Login with:
   - Username: `admin`
   - Password: `admin123`
4. Try editing content
5. Check if changes save

---

## 🐛 If Something Doesn't Work

### Frontend shows "Failed to fetch"
- Check `VITE_API_URL` in Vercel matches your Render URL
- Redeploy Vercel after changing environment variables

### Backend shows CORS error
- Check `FRONTEND_URL` in Render matches your Vercel URL
- Make sure there's no trailing slash

### Can't login
- Check Render logs for errors
- Verify MongoDB connection string is correct
- Make sure Render service is "Live"

---

## 📝 URLs to Remember

| Service | URL | Where to Set |
|---------|-----|--------------|
| Backend | `https://your-app.onrender.com` | Render Dashboard |
| Frontend | `https://your-app.vercel.app` | Vercel Dashboard |
| MongoDB | MongoDB Atlas | Both platforms |

---

## 🔄 After Deployment

### To Update Backend:
1. Push changes to GitHub
2. Render auto-deploys

### To Update Frontend:
1. Push changes to GitHub
2. Vercel auto-deploys

### To Change Environment Variables:
1. Update in platform dashboard (Render or Vercel)
2. Redeploy

---

**That's it! Your site is live! 🎉**
