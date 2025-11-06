# Deployment Checklist

Use this checklist when deploying Fritz Automation to production.

## Pre-Deployment

- [ ] Code pushed to GitHub repository
- [ ] All migrations created and tested locally
- [ ] `.env.example` files are up to date
- [ ] No sensitive data in code (API keys, passwords, etc.)
- [ ] Static files work locally (`python manage.py collectstatic`)
- [ ] All tests passing (if applicable)

## Railway (Backend) Setup

- [ ] Create Railway account
- [ ] Create new project from GitHub repo
- [ ] Add PostgreSQL database
- [ ] Set root directory to `backend`
- [ ] Add all environment variables (see ENV_VARIABLES.md)
- [ ] Generate and set SECRET_KEY
- [ ] Wait for successful deployment
- [ ] Note Railway URL for frontend config

## Vercel (Frontend) Setup

- [ ] Create Vercel account  
- [ ] Import project from GitHub
- [ ] Set root directory to `frontend`
- [ ] Add NEXT_PUBLIC_API_URL with Railway URL
- [ ] Deploy and note Vercel URL

## Post-Deployment Configuration

- [ ] Update Railway CORS_ALLOWED_ORIGINS with Vercel URL
- [ ] Update Railway CSRF_TRUSTED_ORIGINS with Vercel URL
- [ ] Update Railway ALLOWED_HOSTS with Railway domain
- [ ] Update Railway SITE_URL with Vercel URL
- [ ] Redeploy backend if variables changed

## Initial Setup

- [ ] Create superuser via Railway CLI
- [ ] Test admin login at Railway URL/admin/
- [ ] Test client portal at Vercel URL
- [ ] Verify email sending (test contact form)
- [ ] Check browser console for CORS errors
- [ ] Verify all pages load correctly

## Email Configuration

- [ ] Set up Gmail App Password (or other SMTP)
- [ ] Configure EMAIL_HOST_USER
- [ ] Configure EMAIL_HOST_PASSWORD  
- [ ] Test email notifications

## SSL/Security Verification

- [ ] HTTPS working on both domains
- [ ] No mixed content warnings
- [ ] Security headers present (check headers)
- [ ] HSTS enabled
- [ ] Cookies marked as Secure

## Performance Checks

- [ ] Static files loading correctly
- [ ] Images optimized
- [ ] API responses fast (<500ms)
- [ ] No console errors
- [ ] Mobile responsive

## Optional Enhancements

- [ ] Add custom domain to Railway
- [ ] Add custom domain to Vercel
- [ ] Configure CDN (Cloudflare)
- [ ] Set up monitoring (Sentry, Datadog)
- [ ] Configure backups
- [ ] Set up CI/CD (GitHub Actions)

## Documentation

- [ ] Update README with production URLs
- [ ] Document environment variables
- [ ] Create admin user guide
- [ ] Note any production-specific configurations

---

## Quick Commands Reference

### Generate SECRET_KEY
```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

### Create Superuser (Railway CLI)
```bash
railway login
railway link
railway run python manage.py createsuperuser
```

### Check Logs (Railway)
```bash
railway logs
```

### Force Redeploy (Railway)
Trigger by pushing a commit or use Railway dashboard → Redeploy

---

## Troubleshooting Quick Fixes

**CORS Error?**
→ Check CORS_ALLOWED_ORIGINS includes your Vercel URL

**500 Error?**
→ Check Railway logs for detailed error

**Static files not loading?**
→ Run `collectstatic` via Railway CLI

**Database errors?**
→ Verify DATABASE_URL is set (auto-set by Railway)

**Emails not sending?**
→ Check EMAIL_HOST_PASSWORD and test SMTP settings
