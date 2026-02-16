# Deployment Commands & Configuration

Quick reference for deploying frontend and backend on different platforms.

---

## 🎯 Backend Deployment

### Render
```yaml
Service Type: Web Service
Environment: Node
Root Directory: server
Build Command: npm install
Start Command: node index.js
Port: 10000 (auto-detected from PORT env var)
```

**Environment Variables:**
```env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
NODE_ENV=production
PORT=10000
BACKEND_URL=https://vikas-catering.onrender.com
FRONTEND_URL=https://vikas-catering.vercel.app
```

---

### Railway
```
Root Directory: server
Build Command: npm install
Start Command: node index.js
```

**Environment Variables:**
```env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
NODE_ENV=production
PORT=3000
BACKEND_URL=https://your-app.railway.app
FRONTEND_URL=https://your-frontend.vercel.app
```

---

### Heroku
```bash
# From project root
heroku create your-backend-app
git subtree push --prefix server heroku main

# Or set root directory
heroku config:set PROJECT_PATH=server
```

**Procfile (in server/):**
```
web: node index.js
```

**Environment Variables:**
```bash
heroku config:set MONGODB_URI=mongodb+srv://...
heroku config:set JWT_SECRET=your-secret-key
heroku config:set NODE_ENV=production
heroku config:set BACKEND_URL=https://your-app.herokuapp.com
heroku config:set FRONTEND_URL=https://your-frontend.vercel.app
```

---

### DigitalOcean App Platform
```yaml
name: vikas-catering-backend
services:
  - name: api
    source_dir: /server
    build_command: npm install
    run_command: node index.js
    environment_slug: node-js
    envs:
      - key: MONGODB_URI
        value: mongodb+srv://...
      - key: JWT_SECRET
        value: your-secret-key
      - key: NODE_ENV
        value: production
      - key: BACKEND_URL
        value: ${APP_URL}
      - key: FRONTEND_URL
        value: https://your-frontend.vercel.app
```

---

## 🎨 Frontend Deployment

### Vercel
```
Framework Preset: Vite
Root Directory: Frontend
Build Command: npm run build
Output Directory: dist
Install Command: npm install
Node Version: 18.x or higher
```

**Environment Variables:**
```env
VITE_API_URL=https://vikas-catering.onrender.com
```

**vercel.json (already in Frontend/):**
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

### Netlify
```
Base Directory: Frontend
Build Command: npm run build
Publish Directory: Frontend/dist
```

**Environment Variables:**
```env
VITE_API_URL=https://vikas-catering.onrender.com
```

**netlify.toml (create in Frontend/):**
```toml
[build]
  base = "Frontend"
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

### Cloudflare Pages
```
Framework Preset: Vite
Build Command: npm run build
Build Output Directory: dist
Root Directory: Frontend
```

**Environment Variables:**
```env
VITE_API_URL=https://vikas-catering.onrender.com
NODE_VERSION=18
```

---

### GitHub Pages (with GitHub Actions)

**Create `.github/workflows/deploy.yml`:**
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install and Build
        working-directory: ./Frontend
        run: |
          npm install
          npm run build
        env:
          VITE_API_URL: https://vikas-catering.onrender.com
          
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./Frontend/dist
```

---

## 📦 Package.json Scripts

### Backend (server/package.json)
```json
{
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "test": "echo \"No tests yet\""
  }
}
```

### Frontend (Frontend/package.json)
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint .",
    "test": "vitest run"
  }
}
```

---

## 🔧 Platform-Specific Settings

### Render Settings
| Setting | Value |
|---------|-------|
| Environment | Node |
| Branch | main |
| Root Directory | server |
| Build Command | npm install |
| Start Command | node index.js |
| Auto-Deploy | Yes |

### Vercel Settings
| Setting | Value |
|---------|-------|
| Framework | Vite |
| Root Directory | Frontend |
| Build Command | npm run build |
| Output Directory | dist |
| Install Command | npm install |
| Node Version | 18.x |

### Railway Settings
| Setting | Value |
|---------|-------|
| Root Directory | server |
| Build Command | npm install |
| Start Command | node index.js |
| Watch Paths | server/** |

### Netlify Settings
| Setting | Value |
|---------|-------|
| Base Directory | Frontend |
| Build Command | npm run build |
| Publish Directory | Frontend/dist |
| Node Version | 18 |

---

## 🚀 Quick Deploy Commands

### Deploy Backend to Render
```bash
# 1. Push to GitHub
git add .
git commit -m "Deploy backend"
git push origin main

# 2. Render auto-deploys from GitHub
# Or manually trigger from Render dashboard
```

### Deploy Frontend to Vercel
```bash
# Using Vercel CLI
cd Frontend
vercel --prod

# Or push to GitHub (if connected)
git push origin main
```

### Deploy Both (Separate Services)
```bash
# 1. Commit all changes
git add .
git commit -m "Deploy updates"
git push origin main

# 2. Both services auto-deploy
# Render: Backend
# Vercel: Frontend
```

---

## 📋 Pre-Deployment Checklist

### Backend
- [ ] `.env` file configured (don't commit this!)
- [ ] `.env.example` updated with all variables
- [ ] MongoDB URI is correct
- [ ] JWT_SECRET is set to a strong random string
- [ ] BACKEND_URL matches your backend domain
- [ ] FRONTEND_URL matches your frontend domain
- [ ] CORS origins include frontend domain
- [ ] Port is configured correctly

### Frontend
- [ ] `.env` file configured (don't commit this!)
- [ ] `.env.example` updated
- [ ] VITE_API_URL points to backend
- [ ] Build completes without errors: `npm run build`
- [ ] Preview works: `npm run preview`
- [ ] API calls work in preview

### Both
- [ ] All changes committed to Git
- [ ] Pushed to GitHub
- [ ] Environment variables set on hosting platform
- [ ] Deployment logs checked for errors

---

## 🧪 Test Deployment

### Test Backend
```bash
# Health check
curl https://your-backend.com/api/verify

# Test login
curl -X POST https://your-backend.com/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Test site data
curl https://your-backend.com/api/sitedata
```

### Test Frontend
```bash
# Build locally
cd Frontend
npm run build

# Preview build
npm run preview

# Check API URL in browser console
# Should show: API_URL: https://your-backend.com
```

---

## 🆘 Common Issues

### Issue: Build fails with "Module not found"
**Solution:** 
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: Environment variables not working
**Solution:**
- Vercel: Redeploy after adding env vars
- Render: Restart service after adding env vars
- Check variable names match exactly (case-sensitive)

### Issue: CORS errors in production
**Solution:**
```env
# Backend .env - Add your frontend domain
FRONTEND_URL=https://your-exact-frontend-domain.com
```

### Issue: Images not loading
**Solution:**
```env
# Backend .env - Set correct backend URL
BACKEND_URL=https://your-backend-domain.com
```

### Issue: 404 on routes
**Solution:**
- Vercel: Check `vercel.json` has rewrites
- Netlify: Check `netlify.toml` has redirects
- Ensure SPA routing is configured

---

## 📚 Additional Resources

- [Render Docs](https://render.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [Railway Docs](https://docs.railway.app)
- [Netlify Docs](https://docs.netlify.com)
- [Vite Deployment](https://vitejs.dev/guide/static-deploy.html)
- [Express Production Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)

---

## 🎉 Success Checklist

After deployment, verify:

- [ ] Frontend loads at your domain
- [ ] Backend responds at your API domain
- [ ] Login works
- [ ] Images display correctly
- [ ] File uploads work
- [ ] Contact form submissions work
- [ ] Admin panel accessible
- [ ] All pages load without errors
- [ ] Mobile responsive
- [ ] HTTPS enabled
- [ ] No console errors

---

## 📝 Notes

1. **Never commit `.env` files** - They contain sensitive data
2. **Always use HTTPS in production** - Most platforms provide this automatically
3. **Set strong JWT_SECRET** - Use a random string generator
4. **Monitor logs** - Check deployment logs for errors
5. **Test before announcing** - Verify everything works before sharing the URL
