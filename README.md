# Fritz Automation

> Modern full-stack portfolio and automation platform built with Django and Next.js

[![Live Site](https://img.shields.io/badge/live-fritzautomation.dev-blue)](https://fritzautomation.dev)
[![Backend](https://img.shields.io/badge/backend-Django_5.2-green)](https://www.djangoproject.com/)
[![Frontend](https://img.shields.io/badge/frontend-Next.js_15-black)](https://nextjs.org/)
[![Python](https://img.shields.io/badge/python-3.11+-blue)](https://www.python.org/)
[![TypeScript](https://img.shields.io/badge/typescript-5.0+-blue)](https://www.typescriptlang.org/)

## 🚀 Overview

Fritz Automation is a full-stack web application showcasing modern software development and automation capabilities. Built with a Django REST API backend and a Next.js frontend, it features a dynamic portfolio, project showcase, and contact management system.

**Live Site**: [fritzautomation.dev](https://fritzautomation.dev)

## ✨ Features

### Portfolio Management
- **Dynamic Project Showcase**: Display projects with rich descriptions, images, and technology tags
- **Skills Matrix**: Visual representation of technical proficiencies across categories
- **Work Experience Timeline**: Professional history with company logos and descriptions
- **Animated Code Editor**: Interactive hero section with live code demonstrations

### Content Management
- **Django Admin Panel**: Powerful admin interface for managing all content
- **REST API**: Fully documented API with Swagger/OpenAPI specification
- **Contact Form**: Message submission system with status tracking
- **SEO Optimized**: Meta tags, Open Graph, and sitemap support

### Modern Architecture
- **Server-Side Rendering**: Fast initial page loads with Next.js App Router
- **Type Safety**: Full TypeScript implementation on the frontend
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Image Optimization**: Automatic image optimization via Next.js Image component

## 🛠️ Tech Stack

### Backend
- **Django 5.2** - High-level Python web framework
- **Django REST Framework** - Powerful toolkit for building Web APIs
- **PostgreSQL** - Production database (Railway)
- **Gunicorn** - WSGI HTTP server
- **WhiteNoise** - Static file serving

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **React Hooks** - Modern state management
- **Axios** - HTTP client for API calls

### Deployment
- **Railway** - Backend hosting with PostgreSQL
- **Vercel** - Frontend hosting with automatic deployments
- **Custom Domain** - fritzautomation.dev with SSL

## 📁 Project Structure

```
fritz-automation/
├── backend/                  # Django REST API
│   ├── config/              # Django settings and configuration
│   ├── company/             # Main app (models, views, serializers)
│   │   ├── models.py        # Database models
│   │   ├── serializers.py   # DRF serializers
│   │   ├── views.py         # API views
│   │   └── admin.py         # Admin panel configuration
│   ├── portal/              # Portal app with custom commands
│   ├── requirements.txt     # Python dependencies
│   ├── Procfile            # Railway deployment config
│   └── manage.py           # Django management script
│
├── frontend/                 # Next.js application
│   ├── app/                 # App Router pages
│   │   ├── page.tsx         # Homepage
│   │   ├── projects/        # Projects pages
│   │   └── contact/         # Contact page
│   ├── components/          # React components
│   │   ├── AnimatedCodeHero.tsx
│   │   ├── Navbar.tsx
│   │   └── OptimizedImage.tsx
│   ├── lib/                 # Utilities and API client
│   ├── public/              # Static assets
│   ├── package.json         # Node dependencies
│   └── next.config.mjs      # Next.js configuration
│
└── docs/                     # Documentation
    ├── README.md            # Documentation index
    ├── DEPLOYMENT.md        # Deployment guide
    └── DESIGN_IMPROVEMENTS.md
```

## 🚦 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- pip and npm
- Git

### Backend Setup

```bash
# Navigate to backend
cd backend

# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Configure environment
copy .env.example .env
# Edit .env with your settings

# Run migrations
python manage.py migrate

# Create admin user
python manage.py createsuperuser

# Start development server
python manage.py runserver
```

Backend will be available at `http://localhost:8000`

**Admin Panel**: `http://localhost:8000/admin/`

**API Docs**: `http://localhost:8000/api/docs/`

### Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Configure environment
copy .env.example .env.local
# Edit .env.local with your API URL

# Start development server
npm run dev
```

Frontend will be available at `http://localhost:3000`

## 🔌 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/skills/` | GET | List all active skills |
| `/api/skills/by_category/` | GET | Skills grouped by category |
| `/api/work-experience/` | GET | Work experience timeline |
| `/api/projects/` | GET | All projects |
| `/api/projects/featured/` | GET | Featured projects |
| `/api/projects/{slug}/` | GET | Project details |
| `/api/contact/` | POST | Submit contact message |
| `/api/settings/` | GET | Site settings |

Full API documentation available at `/api/docs/` when running the backend.

## 📚 Documentation

Comprehensive documentation is available in the `/docs` directory:

- **[Getting Started](./docs/01-getting-started.md)** - Setup and architecture overview
- **[Django Concepts](./docs/02-django-concepts.md)** - Backend deep dive
- **[Next.js Concepts](./docs/03-nextjs-concepts.md)** - Frontend architecture
- **[Deployment Guide](./docs/DEPLOYMENT.md)** - Production deployment
- **[Design Improvements](./docs/DESIGN_IMPROVEMENTS.md)** - UI/UX enhancements

## 🌐 Deployment

### Production Stack
- **Backend**: Railway with PostgreSQL database
- **Frontend**: Vercel with automatic deployments
- **Domain**: Custom domain with SSL via Squarespace DNS

### Environment Variables

**Backend (Railway)**:
```env
DEBUG=False
SECRET_KEY=<your-secret-key>
ALLOWED_HOSTS=fritz-automation-production.up.railway.app,api.fritzautomation.dev
CORS_ALLOWED_ORIGINS=https://fritzautomation.dev,https://www.fritzautomation.dev
DATABASE_URL=<railway-postgres-url>
DJANGO_SUPERUSER_USERNAME=admin
DJANGO_SUPERUSER_EMAIL=admin@fritzautomation.dev
DJANGO_SUPERUSER_PASSWORD=<secure-password>
```

**Frontend (Vercel)**:
```env
NEXT_PUBLIC_API_URL=https://fritz-automation-production.up.railway.app/api
```

See [DEPLOYMENT.md](./docs/DEPLOYMENT.md) for detailed deployment instructions.

## 🎨 Features Showcase

### Animated Code Hero
Interactive typing animation showcasing Python automation examples with a VS Code-style editor and terminal output.

### Skills Marquee
Infinite scrolling marquee displaying technical skills with proficiency percentages and custom icons.

### Project Cards
Responsive grid layout with project thumbnails, descriptions, technology tags, and links to live demos and source code.

### Contact Form
Validated contact form with API submission, rate limiting, and admin dashboard for message management.

## 🧪 Development

### Running Tests

**Backend**:
```bash
cd backend
python manage.py test
```

**Frontend**:
```bash
cd frontend
npm run lint
npm run build  # Test production build
```

### Database Migrations

```bash
cd backend
python manage.py makemigrations
python manage.py migrate
```

### Building for Production

**Backend**:
```bash
python manage.py collectstatic
gunicorn config.wsgi
```

**Frontend**:
```bash
npm run build
npm run start
```

## 🤝 Contributing

This is a personal portfolio project, but suggestions and feedback are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/improvement`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/improvement`)
5. Open a Pull Request

## 📄 License

This project is open source and available for reference and learning purposes.

## 📧 Contact

**Josh Fritz** - Fritz Automation Solutions

- Website: [fritzautomation.dev](https://fritzautomation.dev)
- Email: forward@fritzautomation.dev
- GitHub: [@FritzAutomation](https://github.com/FritzAutomation)

## 🙏 Acknowledgments

- Built with [Django](https://www.djangoproject.com/) and [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons from [Icons8](https://icons8.com/)
- Hosted on [Railway](https://railway.app/) and [Vercel](https://vercel.com/)

---

**Made with 💙 by Fritz Automation**
