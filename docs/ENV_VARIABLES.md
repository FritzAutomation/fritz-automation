# Environment Variables Reference

Quick reference for setting up environment variables in Railway and Vercel.

## Railway (Backend) Environment Variables

Copy these to Railway dashboard → Your Service → Variables:

```bash
# Required
SECRET_KEY=<generate-with-django>
DEBUG=False
DATABASE_URL=<auto-set-by-railway>

# Domains (update after deploying frontend)
ALLOWED_HOSTS=<your-railway-domain>
CORS_ALLOWED_ORIGINS=https://<your-vercel-domain>
CSRF_TRUSTED_ORIGINS=https://<your-vercel-domain>
SITE_URL=https://<your-vercel-domain>

# Email (Gmail example)
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=<your-email@gmail.com>
EMAIL_HOST_PASSWORD=<your-gmail-app-password>
DEFAULT_FROM_EMAIL=Fritz Automation <noreply@yourdomain.com>
ADMIN_EMAIL=<your-admin@email.com>

# Security (production)
SECURE_SSL_REDIRECT=True
SECURE_HSTS_SECONDS=31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS=True
SECURE_HSTS_PRELOAD=True
SESSION_COOKIE_SECURE=True
CSRF_COOKIE_SECURE=True
```

## Vercel (Frontend) Environment Variables

Copy to Vercel dashboard → Your Project → Settings → Environment Variables:

```bash
NEXT_PUBLIC_API_URL=https://<your-railway-domain>/api
```

---

## How to Generate SECRET_KEY

Run this command locally:

```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

Copy the output to Railway's `SECRET_KEY` variable.

---

## How to Get Gmail App Password

1. Go to Google Account → Security
2. Enable 2-Step Verification
3. Go to App Passwords
4. Generate password for "Mail"
5. Copy the 16-character password (no spaces)
6. Use this as `EMAIL_HOST_PASSWORD`

---

## Domain Update Workflow

After deploying:

1. Deploy backend to Railway → Get Railway domain (e.g., `app-production.up.railway.app`)
2. Deploy frontend to Vercel → Get Vercel domain (e.g., `app.vercel.app`)
3. Update Railway variables with Vercel domain
4. Update Vercel variables with Railway domain
5. Redeploy if needed

---

## Testing Environment Variables

### Backend (Railway)
```bash
# Check if variables are loaded
railway run python -c "import os; print(os.getenv('SECRET_KEY')[:10])"
```

### Frontend (Vercel)
Check browser console:
```javascript
console.log(process.env.NEXT_PUBLIC_API_URL)
```

Should show your Railway API URL.
