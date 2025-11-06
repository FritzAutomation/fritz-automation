# Deployment Guide - Fritz Automation Portfolio

This guide will help you deploy your Django + Next.js portfolio to production.

## Architecture Overview

- **Frontend (Next.js):** Vercel
- **Backend (Django):** Railway or Render
- **Domain:** Your custom domain
- **Database:** PostgreSQL (provided by Railway/Render)

---

## 📋 Prerequisites

1. GitHub account with your code pushed
2. Domain name (e.g., fritzautomation.dev)
3. Accounts on:
   - [Vercel](https://vercel.com) (free)
   - [Railway](https://railway.app) or [Render](https://render.com) (free tier)

---

## Part 1: Deploy Django Backend (Railway - Recommended)

### Step 1: Create Railway Account

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project"

### Step 2: Deploy Backend

1. Click "Deploy from GitHub repo"
2. Select your `fritz-automation` repository
3. Railway will auto-detect it's a Django app
4. Click "Add variables" and set:

```
DEBUG=False
SECRET_KEY=your-long-random-secret-key-here
ALLOWED_HOSTS=your-project.railway.app,api.fritzautomation.dev
CORS_ALLOWED_ORIGINS=https://www.fritzautomation.dev,https://fritzautomation.dev
```

### Step 3: Add PostgreSQL Database

1. In your Railway project, click "New"
2. Select "Database" → "PostgreSQL"
3. Railway automatically connects it and sets `DATABASE_URL`

### Step 4: Configure Root Directory

1. In Railway project settings, set:
   - **Root Directory:** `backend`
   - **Start Command:** `gunicorn config.wsgi:application`

### Step 5: Deploy

1. Click "Deploy"
2. Wait for build to complete (~2-3 minutes)
3. Copy your Railway URL: `https://your-project.railway.app`

### Step 6: Run Migrations & Create Superuser

1. In Railway, click on your service
2. Go to "Settings" → "Deploy"
3. Add these commands in "Build Command":
   ```
   python manage.py migrate
   python manage.py collectstatic --noinput
   ```
4. To create superuser, use Railway CLI:
   ```bash
   railway run python manage.py createsuperuser
   ```

---

## Part 2: Deploy Next.js Frontend (Vercel)

### Step 1: Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click "New Project"

### Step 2: Import Repository

1. Select your `fritz-automation` repository
2. Configure:
   - **Framework Preset:** Next.js
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`

### Step 3: Set Environment Variables

Click "Environment Variables" and add:

```
NEXT_PUBLIC_API_URL=https://your-project.railway.app/api
NEXT_PUBLIC_SITE_URL=https://www.fritzautomation.dev
```

Replace `your-project.railway.app` with your actual Railway URL.

### Step 4: Deploy

1. Click "Deploy"
2. Wait for build (~2-3 minutes)
3. Your site will be live at `https://your-project.vercel.app`

---

## Part 3: Connect Your Domain

### Connect Domain to Vercel (Frontend)

1. In Vercel project, go to "Settings" → "Domains"
2. Add your domain: `fritzautomation.dev` and `www.fritzautomation.dev`
3. Vercel will provide DNS records to add

### Connect Domain to Railway (Backend - Optional)

1. In Railway project, go to "Settings" → "Domains"
2. Click "Generate Domain" or add custom: `api.fritzautomation.dev`
3. Add DNS records provided by Railway

### Configure DNS (at your domain registrar)

Add these records:

**For Vercel (Frontend):**
```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

**For Railway (Backend - if using custom domain):**
```
Type: CNAME
Name: api
Value: your-project.railway.app
```

---

## Part 4: Update Django Settings

After deploying, update your Railway environment variables:

1. Go to Railway → Variables
2. Update:
   ```
   ALLOWED_HOSTS=api.fritzautomation.dev,your-project.railway.app
   CORS_ALLOWED_ORIGINS=https://www.fritzautomation.dev,https://fritzautomation.dev
   ```

---

## Part 5: Update Next.js Environment Variables

1. Go to Vercel → Settings → Environment Variables
2. Update:
   ```
   NEXT_PUBLIC_API_URL=https://api.fritzautomation.dev/api
   ```
   (or keep using the Railway URL)

3. Redeploy to apply changes

---

## Part 6: Final Steps

### 1. Upload Content via Django Admin

1. Go to `https://api.fritzautomation.dev/admin`
2. Login with your superuser credentials
3. Add your:
   - Skills
   - Projects
   - Work Experience
   - Site Settings

### 2. Test Your Site

1. Visit `https://www.fritzautomation.dev`
2. Check:
   - All images load
   - Projects display
   - Navigation works
   - Contact page works

### 3. Enable HTTPS (Automatic)

Both Vercel and Railway automatically provide SSL certificates. No action needed!

---

## 🔧 Troubleshooting

### Images Not Loading

**Problem:** Images show broken icon
**Solution:**
1. Check `NEXT_PUBLIC_API_URL` is set correctly in Vercel
2. Verify images exist in Railway Django admin
3. Check CORS settings in Railway

### API Errors

**Problem:** API calls fail
**Solution:**
1. Check `CORS_ALLOWED_ORIGINS` includes your Vercel domain
2. Verify `ALLOWED_HOSTS` includes your Railway domain
3. Check Railway logs for errors

### Build Fails

**Backend:**
- Check `requirements.txt` is complete
- Verify root directory is set to `backend`
- Check Railway logs

**Frontend:**
- Verify `NEXT_PUBLIC_API_URL` is set
- Check `package.json` is in `frontend` directory
- Review Vercel build logs

---

## 📊 Monitoring

### Backend (Railway)
- View logs: Railway → Service → Logs
- Monitor resources: Railway → Metrics

### Frontend (Vercel)
- View logs: Vercel → Deployments → Logs
- Analytics: Vercel → Analytics

---

## 💰 Cost Breakdown

### Free Tier Limits

**Railway:**
- $5/month free credit
- Enough for small portfolio (~500 hours/month)

**Vercel:**
- 100GB bandwidth/month
- Unlimited deployments
- Completely free for hobby projects

**Total Monthly Cost:** $0 (within free tiers)

---

## 🚀 Going to Production

When you outgrow free tiers:

1. **Railway Pro:** $20/month
   - More resources
   - Higher uptime
   - Priority support

2. **Vercel Pro:** $20/month
   - Analytics
   - More bandwidth
   - Team features

---

## 📝 Updating Your Site

### Update Content
1. Go to Django admin
2. Add/edit content
3. Changes appear immediately

### Update Code

**Backend:**
```bash
git add .
git commit -m "Update backend"
git push
```
Railway auto-deploys on push

**Frontend:**
```bash
git add .
git commit -m "Update frontend"
git push
```
Vercel auto-deploys on push

---

## Alternative: Render Instead of Railway

If you prefer Render:

1. Go to [render.com](https://render.com)
2. Create "New Web Service"
3. Connect GitHub repo
4. Set:
   - **Root Directory:** `backend`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn config.wsgi:application`
5. Add PostgreSQL database
6. Set same environment variables

Process is nearly identical to Railway.

---

## 🎉 You're Live!

Your portfolio is now deployed and accessible worldwide at:
- **Frontend:** https://www.fritzautomation.dev
- **Backend:** https://api.fritzautomation.dev
- **Admin:** https://api.fritzautomation.dev/admin

Good luck with your business! 🚀
