# Fritz Automation - Full Stack Portfolio Platform

A modern, scalable portfolio website built with Django REST Framework backend and Next.js frontend. Designed to grow from a personal portfolio into a business platform.

## 🎯 Project Vision

Transform a static portfolio website into a dynamic, full-stack application that can:
- Manage content without code deployments
- Scale to support business features (services, bookings, payments)
- Serve as a learning platform for modern web development
- Demonstrate professional development practices

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                    CLIENT SIDE                       │
│  ┌────────────────────────────────────────────┐     │
│  │         Next.js 15 Frontend                │     │
│  │  - Server-Side Rendering (SSR)             │     │
│  │  - Static Site Generation (SSG)            │     │
│  │  - TypeScript + Tailwind CSS               │     │
│  │  - Deployed on Vercel                      │     │
│  └─────────────────┬──────────────────────────┘     │
└────────────────────┼────────────────────────────────┘
                     │ REST API (JSON)
                     │
┌────────────────────┼────────────────────────────────┐
│                    │ SERVER SIDE                     │
│  ┌─────────────────┴──────────────────────────┐     │
│  │      Django REST Framework Backend         │     │
│  │  - Python 3.11+                            │     │
│  │  - PostgreSQL Database                     │     │
│  │  - Django Admin Panel                      │     │
│  │  - Auto-generated API Docs                 │     │
│  │  - Deployed on Railway.app                 │     │
│  └────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────┘
```

## 📁 Project Structure

```
fritz-automation/
├── backend/                 # Django REST API
│   ├── config/             # Django project settings
│   ├── portfolio/          # Main app (models, views, serializers)
│   ├── requirements.txt    # Python dependencies
│   └── README.md          # Backend documentation
│
├── frontend/               # Next.js application
│   ├── app/               # Next.js App Router pages
│   ├── components/        # React components
│   ├── lib/               # Utilities (API client)
│   ├── types/             # TypeScript definitions
│   ├── package.json       # Node dependencies
│   └── README.md          # Frontend documentation
│
├── docs/                   # Training and documentation
│   ├── 01-getting-started.md
│   ├── 02-django-concepts.md
│   ├── 03-nextjs-concepts.md
│   ├── 04-deployment.md
│   └── 05-next-steps.md
│
├── CHANGELOG.md           # Project milestones and changes
└── PROJECT_README.md      # This file
```

## 🚀 Quick Start

### Prerequisites

- Python 3.11+
- Node.js 18+
- Git

### Backend Setup (5 minutes)

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create admin user
python manage.py createsuperuser

# Start server
python manage.py runserver
```

Backend will be available at: http://127.0.0.1:8000/

### Frontend Setup (3 minutes)

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Configure environment
copy .env.local.example .env.local

# Start dev server
npm run dev
```

Frontend will be available at: http://localhost:3000/

## 📚 Documentation

### For Learning

See the `docs/` folder for comprehensive training materials:

1. **Getting Started** - Initial setup and overview
2. **Django Concepts** - Understanding the backend
3. **Next.js Concepts** - Understanding the frontend
4. **Deployment** - Going to production
5. **Next Steps** - Advanced features

### For Development

- **Backend API Docs**: http://127.0.0.1:8000/api/docs/
- **Django Admin**: http://127.0.0.1:8000/admin/
- **Backend README**: `backend/README.md`
- **Frontend README**: `frontend/README.md`

## 🎨 Features

### Current Features

#### Backend
- ✅ RESTful API with Django REST Framework
- ✅ Content models (Projects, Skills, Work Experience)
- ✅ Contact form with spam protection
- ✅ Django Admin for content management
- ✅ Auto-generated API documentation
- ✅ CORS enabled for frontend
- ✅ Media file handling (images, resumes)

#### Frontend
- ✅ Server-side rendering for SEO
- ✅ Responsive design with Tailwind CSS
- ✅ TypeScript for type safety
- ✅ Dynamic content from API
- ✅ Contact form integration
- ✅ Image optimization

### Planned Features (Business Growth)

- [ ] User authentication (JWT)
- [ ] Blog/content management system
- [ ] Service offerings pages
- [ ] Booking/scheduling system
- [ ] Payment integration (Stripe)
- [ ] Email notifications (SendGrid)
- [ ] Analytics dashboard
- [ ] Client portal
- [ ] Multi-language support

## 🛠️ Technology Stack

### Backend
| Technology | Purpose |
|------------|---------|
| Django 5.2 | Web framework |
| Django REST Framework | API creation |
| PostgreSQL | Database (production) |
| SQLite | Database (development) |
| python-decouple | Environment config |
| Pillow | Image processing |
| drf-spectacular | API documentation |

### Frontend
| Technology | Purpose |
|------------|---------|
| Next.js 15 | React framework |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Axios | HTTP client |
| React 19 | UI library |

## 📊 Development Workflow

### Local Development

1. Start backend: `cd backend && python manage.py runserver`
2. Start frontend: `cd frontend && npm run dev`
3. Access site at `http://localhost:3000`
4. Manage content at `http://127.0.0.1:8000/admin`

### Adding Content

1. Log into Django Admin
2. Add/edit Projects, Skills, or Work Experience
3. Frontend automatically reflects changes

### Code Changes

**Backend:**
1. Modify models, views, or serializers
2. Run migrations if models changed: `python manage.py makemigrations && python manage.py migrate`
3. Test in API docs: `http://127.0.0.1:8000/api/docs/`

**Frontend:**
1. Modify components or pages in `app/` or `components/`
2. Changes hot-reload automatically
3. Build for production: `npm run build`

## 🚢 Deployment

### Recommended Setup

- **Backend**: Railway.app ($5-20/month)
- **Frontend**: Vercel (Free tier available)
- **Database**: Railway PostgreSQL (included)
- **Media**: AWS S3 or Cloudflare R2 (optional)

### Deployment Steps

See `docs/04-deployment.md` for detailed instructions.

**Backend (Railway):**
1. Push code to GitHub
2. Connect GitHub repo to Railway
3. Add PostgreSQL database
4. Set environment variables
5. Deploy!

**Frontend (Vercel):**
1. Push code to GitHub
2. Import project to Vercel
3. Set `NEXT_PUBLIC_API_URL` to Railway URL
4. Deploy!

## 💰 Cost Breakdown

### Starter (Learning)
- Railway backend: $5/month
- Vercel frontend: Free
- **Total: $5/month**

### Business (Professional)
- Railway backend: $20/month
- Vercel frontend: $20/month (Pro features)
- Email service: $15/month
- CDN/Storage: $10/month
- **Total: $65/month**

## 📈 Learning Path

This project is designed as a learning journey:

### Phase 1: Setup & Basics (Week 1-2)
- [x] Set up Django backend
- [x] Create data models
- [x] Build REST API
- [x] Set up Next.js frontend
- [x] Connect frontend to backend

### Phase 2: Content Management (Week 3-4)
- [ ] Populate with real content
- [ ] Customize Django Admin
- [ ] Add image galleries
- [ ] Implement contact form

### Phase 3: Deployment (Week 5)
- [ ] Deploy backend to Railway
- [ ] Deploy frontend to Vercel
- [ ] Set up custom domain
- [ ] Configure SSL certificates

### Phase 4: Enhancement (Week 6+)
- [ ] Add blog functionality
- [ ] Implement search
- [ ] Add analytics
- [ ] Optimize performance

## 🤝 Contributing

This is a personal learning project, but suggestions and improvements are welcome!

## 📝 License

This project is for personal/educational use.

## 🆘 Support

- **Documentation**: See `docs/` folder
- **Issues**: Check GitHub issues
- **Contact**: forward@fritzautomation.dev

## 🎓 Resources

- [Django Documentation](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript](https://www.typescriptlang.org/docs)
- [Railway Deployment](https://docs.railway.app/)
- [Vercel Deployment](https://vercel.com/docs)

---

**Built with ❤️ by Joshua Fritzjunker**
