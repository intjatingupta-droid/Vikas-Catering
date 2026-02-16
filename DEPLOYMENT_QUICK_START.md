# 🚀 Deployment Quick Start

## TL;DR - What You Need to Know

### Frontend (Vercel)
**Set ONE variable in Vercel Dashboard:**
```
VITE_API_URL = https://your-backend-url.onrender.com
```

### Backend (Render)
**Set FIVE variables in Render Dashboard:**
```
MONGODB_URI = mongodb+srv://...
JWT_SECRET = random-secret-key
PORT = 10000
NODE_ENV = production
FRONTEND_URL = https://your-frontend-url.vercel.app
BACKEND_URL = https://your-backend-url.onrender.com
```

---

## 📋 Step-by-Step (5 Minutes)

### 1️⃣ Deploy Backend (Render)
1. Go to Render → New Web Service
2. Connect GitHub repo
3. Root Directory: `server`
4. Build: `npm install`
5. Start: `node index.js`
6. Add environment variables (see above)
7. Deploy
8. **Copy your backend URL**

### 2️⃣ Deploy Frontend (Vercel)
1. Go to Vercel → New Project
2. Import GitHub repo
3. Root Directory: `Frontend`
4. Framework: Vite
5. Add environment variable: `VITE_API_URL` = (backend URL from step 1.8)
6. Deploy
7. **Copy your frontend URL**

### 3️⃣ Update Backend CORS
1. Go back to Render
2. Update `FRONTEND_URL` = (frontend URL from step 2.7)
3. Redeploy

### 4️⃣ Test
- Visit your frontend URL
- Login: admin / admin123
- Check if everything works

---

## ❓ FAQ

**Q: Do I change the `.env` files in my code?**
A: NO! Set variables in Render/Vercel dashboards only.

**Q: Does frontend need FRONTEND_URL?**
A: NO! Frontend only needs `VITE_API_URL` (backend URL).

**Q: What if I deploy both on Render?**
A: Same process, just use both Render URLs.

**Q: Custom domains?**
A: Use custom domain URLs in environment variables instead.

---

## 📚 Full Documentation

- **Complete Guide:** `docs/DEPLOYMENT_GUIDE.md`
- **Environment Variables:** `docs/ENVIRONMENT_VARIABLES_EXPLAINED.md`
- **API Configuration:** `docs/API_CONFIGURATION_STATUS.md`

---

**Need Help?** Check the docs folder for detailed guides!
