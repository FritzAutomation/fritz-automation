# Quick Deploy Checklist ✅

## Backend (Railway) - 10 minutes

1. ☐ Go to [railway.app](https://railway.app) → Sign up with GitHub
2. ☐ New Project → Deploy from GitHub → Select `fritz-automation`
3. ☐ Settings → Root Directory: `backend`
4. ☐ Add PostgreSQL database (New → Database → PostgreSQL)
5. ☐ Add Environment Variables:
   ```
   DEBUG=False
   SECRET_KEY=(generate random 50-char string)
   ALLOWED_HOSTS=*.railway.app,api.fritzautomation.dev
   CORS_ALLOWED_ORIGINS=https://www.fritzautomation.dev
   ```
6. ☐ Deploy & copy URL: `https://______.railway.app`
7. ☐ Run: `railway run python manage.py createsuperuser`

## Frontend (Vercel) - 5 minutes

1. ☐ Go to [vercel.com](https://vercel.com) → Sign up with GitHub
2. ☐ New Project → Import `fritz-automation`
3. ☐ Root Directory: `frontend`
4. ☐ Add Environment Variables:
   ```
   NEXT_PUBLIC_API_URL=https://______.railway.app/api
   NEXT_PUBLIC_SITE_URL=https://www.fritzautomation.dev
   ```
5. ☐ Deploy & copy URL: `https://______.vercel.app`

## Domain Setup - 5 minutes

1. ☐ Vercel → Settings → Domains → Add `fritzautomation.dev` and `www.fritzautomation.dev`
2. ☐ Railway → Settings → Domains → Add `api.fritzautomation.dev` (optional)
3. ☐ Update DNS at domain registrar (copy records from Vercel/Railway)

## Final Updates

1. ☐ Update Railway `ALLOWED_HOSTS` with final domains
2. ☐ Update Vercel `NEXT_PUBLIC_API_URL` with final backend URL
3. ☐ Visit `https://api.fritzautomation.dev/admin` → Add content
4. ☐ Test `https://www.fritzautomation.dev`

**Total Time: ~20 minutes** 🎉

---

## Generate SECRET_KEY (Python)

```python
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

## Common URLs

- **Frontend:** https://www.fritzautomation.dev
- **Backend API:** https://api.fritzautomation.dev/api
- **Admin Panel:** https://api.fritzautomation.dev/admin
- **API Docs:** https://api.fritzautomation.dev/api/schema/swagger-ui/
