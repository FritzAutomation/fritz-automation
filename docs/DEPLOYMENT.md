# Fritz Automation - Deployment Guide

This guide will walk you through deploying the Fritz Automation application using **Vercel** (frontend) and **Railway** (backend).

## Prerequisites

- GitHub account
- Vercel account (free tier available)
- Railway account (free tier available with $5 monthly credit)
- Your application code pushed to a GitHub repository

---

## Part 1: Deploy Backend to Railway

### Step 1: Create Railway Project

1. Go to [Railway.app](https://railway.app/) and sign in
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your `fritz-automation` repository
5. Railway will automatically detect the Django app in the `backend` folder

### Step 2: Add PostgreSQL Database

1. In your Railway project, click **"+ New"**
2. Select **"Database" → "PostgreSQL"**
3. Railway will automatically provision a PostgreSQL database
4. The `DATABASE_URL` environment variable will be automatically set

### Step 3: Configure Environment Variables

In Railway, go to your Django service → **Variables** tab and add:

```
SECRET_KEY=your-generated-secret-key-here
DEBUG=False
ALLOWED_HOSTS=your-railway-app.up.railway.app
CORS_ALLOWED_ORIGINS=https://your-vercel-app.vercel.app
CSRF_TRUSTED_ORIGINS=https://your-vercel-app.vercel.app
SITE_URL=https://your-vercel-app.vercel.app

# Email Configuration (Gmail example)
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-gmail-app-password
DEFAULT_FROM_EMAIL=Fritz Automation <noreply@yourdomain.com>
ADMIN_EMAIL=your-admin@email.com

# Security Settings
SECURE_SSL_REDIRECT=True
SECURE_HSTS_SECONDS=31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS=True
SECURE_HSTS_PRELOAD=True
SESSION_COOKIE_SECURE=True
CSRF_COOKIE_SECURE=True
```

**Important Notes:**
- Replace `your-railway-app.up.railway.app` with your actual Railway domain (found in Settings)
- Replace `your-vercel-app.vercel.app` with your Vercel domain (you'll get this after deploying frontend)
- Generate a secure SECRET_KEY using: `python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"`
- For Gmail, use an [App Password](https://support.google.com/accounts/answer/185833)

### Step 4: Set Root Directory

1. In Railway, go to **Settings → Service Settings**
2. Set **Root Directory** to `backend`
3. Railway will now run from the backend folder

### Step 5: Deploy

1. Railway will automatically deploy when you push to your main branch
2. Monitor the deployment logs in Railway dashboard
3. Once deployed, note your Railway URL (e.g., `https://fritz-automation-backend-production.up.railway.app`)

---

## Part 2: Deploy Frontend to Vercel

### Step 1: Create Vercel Project

1. Go to [Vercel.com](https://vercel.com/) and sign in
2. Click **"Add New..." → "Project"**
3. Import your GitHub repository
4. Vercel will detect it's a Next.js project

### Step 2: Configure Project Settings

1. **Root Directory**: Set to `frontend`
2. **Framework Preset**: Next.js (should auto-detect)
3. **Build Command**: `npm run build` (default)
4. **Output Directory**: `.next` (default)

### Step 3: Set Environment Variables

In Vercel project settings → **Environment Variables**, add:

```
NEXT_PUBLIC_API_URL=https://your-railway-app.up.railway.app/api
```

Replace with your actual Railway backend URL from Part 1, Step 5.

### Step 4: Deploy

1. Click **"Deploy"**
2. Vercel will build and deploy your frontend
3. Once deployed, you'll get a URL like `https://fritz-automation.vercel.app`

### Step 5: Update Backend Environment Variables

Now that you have your Vercel URL, go back to Railway and update these variables:

```
CORS_ALLOWED_ORIGINS=https://your-actual-vercel-url.vercel.app
CSRF_TRUSTED_ORIGINS=https://your-actual-vercel-url.vercel.app
SITE_URL=https://your-actual-vercel-url.vercel.app
ALLOWED_HOSTS=your-railway-app.up.railway.app
```

This ensures your backend accepts requests from your frontend.

---

## Part 3: Custom Domains (Optional)

### Railway Custom Domain

1. In Railway project → **Settings → Domains**
2. Click **"Add Custom Domain"**
3. Enter your domain (e.g., `api.yourdomain.com`)
4. Add the CNAME record to your DNS provider

### Vercel Custom Domain

1. In Vercel project → **Settings → Domains**
2. Click **"Add"**
3. Enter your domain (e.g., `yourdomain.com`)
4. Follow DNS configuration instructions

**After adding custom domains, update environment variables accordingly!**

---

## Part 4: Initial Setup & Superuser

### Create Django Superuser

1. In Railway, go to your Django service
2. Open the **CLI** tab (or use Railway CLI locally)
3. Run: `python manage.py createsuperuser`
4. Follow prompts to create your admin account

OR use Railway CLI locally:
```bash
railway login
railway link
railway run python backend/manage.py createsuperuser
```

---

## Post-Deployment Checklist

- [ ] Backend deployed successfully on Railway
- [ ] PostgreSQL database connected
- [ ] Frontend deployed successfully on Vercel
- [ ] Environment variables set correctly
- [ ] CORS configured properly (check browser console)
- [ ] Created superuser account
- [ ] Tested admin login at `https://your-backend/admin/`
- [ ] Tested client portal login
- [ ] Email notifications working (test contact form)
- [ ] Verified SSL certificates (HTTPS)

---

## Troubleshooting

### CORS Errors
- Ensure `CORS_ALLOWED_ORIGINS` in Railway includes your Vercel URL
- Check that URLs don't have trailing slashes
- Verify `CSRF_TRUSTED_ORIGINS` is set

### Static Files Not Loading
- Run `python manage.py collectstatic` in Railway CLI
- Check that `STATIC_ROOT` is set in settings
- Verify WhiteNoise is in `MIDDLEWARE`

### Database Errors
- Ensure `DATABASE_URL` is set (Railway sets this automatically)
- Check PostgreSQL service is running in Railway
- Verify migrations ran successfully (check Railway logs)

### 500 Errors
- Set `DEBUG=True` temporarily to see error details
- Check Railway deployment logs
- Verify all environment variables are set

---

## Continuous Deployment

Both platforms support automatic deployments:

- **Railway**: Automatically deploys when you push to your main branch
- **Vercel**: Automatically deploys on every push to main

To disable auto-deploy:
- Railway: Settings → Service → Disable auto-deploy
- Vercel: Project Settings → Git → Disable Production deployments

---

## Monitoring

### Railway
- View logs in real-time: **Deployments → Latest → Logs**
- Monitor metrics: CPU, Memory, Network usage
- Set up alerts for downtime

### Vercel
- View deployment logs in dashboard
- Analytics available on Pro plan
- Speed Insights for performance monitoring

---

## Backup Strategy

### Database Backups
Railway provides automatic daily backups for PostgreSQL. To manually backup:

```bash
railway link
railway run pg_dump $DATABASE_URL > backup.sql
```

### Media Files
If using uploaded files (avatars, project files), consider:
- AWS S3 for file storage
- Cloudinary for image optimization
- Railway Volumes for persistent storage

---

## Scaling

### Railway
- Vertical scaling: Settings → Resources (increase RAM/CPU)
- Horizontal scaling: Pro plan required

### Vercel
- Automatically scales based on traffic
- Edge network for global performance
- No configuration needed

---

## Cost Estimation

### Free Tier Limits

**Railway:**
- $5 monthly credit (free)
- ~500 hours of runtime
- 1GB RAM, shared CPU
- Good for MVP testing

**Vercel:**
- 100GB bandwidth/month
- Unlimited deployments
- Serverless functions
- Good for most small-mid apps

**When to Upgrade:**
- Railway: When you exceed $5/month credit (~high traffic)
- Vercel: When bandwidth exceeds 100GB

---

## Need Help?

- Railway Docs: https://docs.railway.app/
- Vercel Docs: https://vercel.com/docs
- Django Deployment: https://docs.djangoproject.com/en/stable/howto/deployment/

Good luck with your deployment! 🚀
