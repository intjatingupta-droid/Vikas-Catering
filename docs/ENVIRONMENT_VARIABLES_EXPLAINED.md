# Environment Variables Explained Simply

## 🤔 What Goes Where?

### Frontend (Vercel)
**Only needs to know:** Where is the backend API?

```
Frontend/.env (local):
VITE_API_URL=http://localhost:5000

Vercel Dashboard (production):
VITE_API_URL=https://backend.vikascateringservice.com
```

**That's it!** Frontend doesn't need to know its own URL.

---

### Backend (Render)
**Needs to know:** 
1. Where is the frontend? (for CORS)
2. What's my own URL? (for file uploads)
3. Database connection
4. Security keys

```
server/.env (local):
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:8080
BACKEND_URL=http://localhost:5000

Render Dashboard (production):
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-random-secret-key
PORT=10000
NODE_ENV=production
FRONTEND_URL=https://vikascateringservice.com
BACKEND_URL=https://backend.vikascateringservice.com
```

---

## 📊 Visual Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    LOCAL DEVELOPMENT                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Frontend (localhost:8080)                                   │
│  ├─ VITE_API_URL = http://localhost:5000                    │
│  └─ Calls → Backend                                         │
│                                                              │
│  Backend (localhost:5000)                                    │
│  ├─ FRONTEND_URL = http://localhost:8080 (CORS)            │
│  ├─ BACKEND_URL = http://localhost:5000 (uploads)          │
│  └─ MONGODB_URI = MongoDB Atlas                             │
│                                                              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                      PRODUCTION                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Frontend (Vercel)                                           │
│  ├─ VITE_API_URL = https://backend.vikascateringservice.com│
│  └─ Calls → Backend                                         │
│                                                              │
│  Backend (Render)                                            │
│  ├─ FRONTEND_URL = https://vikascateringservice.com (CORS) │
│  ├─ BACKEND_URL = https://backend.vikascateringservice.com │
│  └─ MONGODB_URI = MongoDB Atlas                             │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 Common Questions

### Q: Do I change the `.env` files in my code?
**A: NO!** Keep local `.env` files for development only.

For production:
- Set variables in **Vercel Dashboard** (for frontend)
- Set variables in **Render Dashboard** (for backend)

### Q: Does frontend need its own URL?
**A: NO!** Frontend only needs to know where the backend is.

### Q: What if I deploy both on Render?
**A:** Same concept, just different URLs:

**Frontend on Render:**
```
VITE_API_URL=https://your-backend.onrender.com
```

**Backend on Render:**
```
FRONTEND_URL=https://your-frontend.onrender.com
BACKEND_URL=https://your-backend.onrender.com
```

### Q: What if I use custom domains?
**A:** Use your custom domains in the environment variables:

**Vercel:**
```
VITE_API_URL=https://api.yourdomain.com
```

**Render:**
```
FRONTEND_URL=https://yourdomain.com
BACKEND_URL=https://api.yourdomain.com
```

---

## 🔄 Deployment Steps Simplified

### 1. Deploy Backend First
1. Push code to GitHub
2. Create Render service
3. Set environment variables in Render dashboard
4. Get your backend URL: `https://your-backend.onrender.com`

### 2. Deploy Frontend Second
1. Create Vercel project
2. Set `VITE_API_URL` to your backend URL (from step 1.4)
3. Deploy
4. Get your frontend URL: `https://your-frontend.vercel.app`

### 3. Update Backend CORS
1. Go back to Render
2. Update `FRONTEND_URL` to your frontend URL (from step 2.4)
3. Redeploy backend

### 4. Done! ✅

---

## 📝 Checklist

Before deploying:
- [ ] MongoDB Atlas is accessible
- [ ] Code is pushed to GitHub
- [ ] You have Render and Vercel accounts

After deploying backend:
- [ ] Note backend URL
- [ ] Test: `https://your-backend-url/api/sitedata`

After deploying frontend:
- [ ] Set `VITE_API_URL` to backend URL
- [ ] Note frontend URL
- [ ] Update backend `FRONTEND_URL`

After both deployed:
- [ ] Test login
- [ ] Test admin panel
- [ ] Check browser console for errors
- [ ] Verify images load

---

## 🚨 Important Notes

1. **Never commit `.env` files with production secrets to GitHub**
   - Use `.env.example` for templates
   - Set actual values in hosting dashboards

2. **Always use HTTPS in production**
   - Render and Vercel provide this automatically
   - Don't use `http://` in production URLs

3. **CORS must match exactly**
   - `https://yourdomain.com` ≠ `https://www.yourdomain.com`
   - Add both if you use www

4. **Environment variables need redeploy**
   - After changing variables in dashboard
   - Trigger manual redeploy
   - Changes don't apply automatically

---

## 💡 Pro Tips

1. **Use custom domains for cleaner URLs:**
   - Frontend: `yourdomain.com`
   - Backend: `api.yourdomain.com`

2. **Keep local `.env` files for development:**
   - Don't delete them
   - They're for local testing only

3. **Test locally before deploying:**
   ```bash
   # Frontend
   cd Frontend
   npm run build
   npm run preview
   
   # Backend
   cd server
   npm start
   ```

4. **Use environment-specific values:**
   - Development: `localhost`
   - Staging: `staging.yourdomain.com`
   - Production: `yourdomain.com`

---

**Remember:** 
- Frontend only needs backend URL
- Backend needs frontend URL (CORS) and its own URL (uploads)
- Set production values in hosting dashboards, not in code!
