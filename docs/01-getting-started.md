# Getting Started with Fritz Automation

Welcome! This guide will help you understand and set up the Fritz Automation project.

## 🎯 What You'll Learn

- What this project is and why it's structured this way
- How to set up your development environment
- How to run the backend and frontend
- How the pieces fit together

## 📖 Project Overview

Fritz Automation is a **full-stack web application** that consists of two main parts:

### Backend (Django REST API)
The "brain" of the application that:
- Stores data in a database (Projects, Skills, Work Experience)
- Provides REST API endpoints that return JSON data
- Handles business logic (validation, processing)
- Manages file uploads (images, resumes)
- Provides an admin panel for content management

**Think of it as:** A restaurant kitchen that prepares food (data) when ordered

### Frontend (Next.js)
The "face" of the application that:
- Displays data to users in a beautiful interface
- Fetches data from the backend API
- Handles user interactions (clicking, form submissions)
- Provides SEO-friendly pages

**Think of it as:** The dining room where customers see and enjoy the food

## 🏗️ Architecture Explained

```
┌─────────────────────────┐
│   User's Browser        │
│  (Chrome, Safari, etc)  │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│   Next.js Frontend      │  ← What the user sees
│   (localhost:3000)      │  ← Runs on Node.js
└───────────┬─────────────┘
            │
            │ HTTP Requests (GET, POST)
            │ Sends/receives JSON data
            ▼
┌─────────────────────────┐
│   Django Backend        │  ← Where data lives
│   (localhost:8000)      │  ← Runs on Python
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│   SQLite Database       │  ← Stores all content
│   (db.sqlite3)          │
└─────────────────────────┘
```

## 🛠️ Prerequisites

Before starting, you need:

### Required Software

1. **Python 3.11 or higher**
   - Check: `python --version`
   - Download: https://www.python.org/downloads/

2. **Node.js 18 or higher**
   - Check: `node --version`
   - Download: https://nodejs.org/

3. **Git**
   - Check: `git --version`
   - Download: https://git-scm.com/

4. **Code Editor** (Recommended: VS Code)
   - Download: https://code.visualstudio.com/

### Helpful But Optional

- Basic understanding of Python
- Basic understanding of JavaScript/React
- Familiarity with command line/terminal

**Don't worry if you're new!** This documentation will guide you through everything.

## 🚀 Setup Instructions

### Step 1: Navigate to Project

```bash
cd C:\Users\Joshua\Desktop\Josh\Python\fritz-automation
```

### Step 2: Backend Setup

#### 2.1 Create Virtual Environment

A virtual environment keeps Python packages isolated for this project.

```bash
cd backend
python -m venv venv
```

**What this does:** Creates a folder called `venv` with a clean Python installation

#### 2.2 Activate Virtual Environment

**Windows:**
```bash
venv\Scripts\activate
```

**Mac/Linux:**
```bash
source venv/bin/activate
```

**You'll know it worked when** you see `(venv)` at the start of your command prompt:
```
(venv) C:\Users\Joshua\Desktop\Josh\Python\fritz-automation\backend>
```

#### 2.3 Install Python Dependencies

```bash
pip install -r requirements.txt
```

**What this does:** Installs Django, Django REST Framework, and other required packages

**This might take 2-3 minutes** ☕

#### 2.4 Run Database Migrations

```bash
python manage.py migrate
```

**What this does:** Creates database tables based on your models (Projects, Skills, etc.)

**You should see output like:**
```
Running migrations:
  Applying contenttypes.0001_initial... OK
  Applying auth.0001_initial... OK
  ...
```

#### 2.5 Create Admin User

```bash
python manage.py createsuperuser
```

**Follow the prompts:**
- Username: `admin` (or your choice)
- Email: your email
- Password: create a strong password (you won't see it as you type)

**Remember these credentials!** You'll use them to log into the admin panel.

#### 2.6 Start Backend Server

```bash
python manage.py runserver
```

**You should see:**
```
Starting development server at http://127.0.0.1:8000/
Quit the server with CTRL-BREAK.
```

**Test it:** Open http://127.0.0.1:8000/admin/ in your browser

✅ **Success!** You should see a login page

**Leave this terminal running** and open a new one for the frontend.

### Step 3: Frontend Setup

#### 3.1 Open New Terminal

Keep the backend running! Open a fresh terminal window.

#### 3.2 Navigate to Frontend

```bash
cd C:\Users\Joshua\Desktop\Josh\Python\fritz-automation\frontend
```

#### 3.3 Install Dependencies

```bash
npm install
```

**What this does:** Installs Next.js, React, TypeScript, Tailwind CSS, and other packages

**This might take 3-5 minutes** ☕☕

#### 3.4 Create Environment File

```bash
copy .env.local.example .env.local
```

**Open `.env.local` and verify:**
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

#### 3.5 Start Frontend Server

```bash
npm run dev
```

**You should see:**
```
▲ Next.js 15.1.6
- Local:        http://localhost:3000
- Ready in 2.3s
```

✅ **Success!** Open http://localhost:3000 in your browser

## 🎉 Verification

You should now have:

- ✅ Backend running at http://127.0.0.1:8000/
- ✅ Frontend running at http://localhost:3000/
- ✅ Django Admin at http://127.0.0.1:8000/admin/
- ✅ API Docs at http://127.0.0.1:8000/api/docs/

### Quick Tests

**Test 1: Django Admin**
1. Go to http://127.0.0.1:8000/admin/
2. Log in with your superuser credentials
3. You should see the Django administration panel

**Test 2: API Docs**
1. Go to http://127.0.0.1:8000/api/docs/
2. You should see interactive API documentation (Swagger UI)
3. Try the "GET /api/skills/" endpoint

**Test 3: Frontend**
1. Go to http://localhost:3000/
2. You should see the portfolio homepage (might be empty if no content yet)

## 📁 Project Structure Explained

```
fritz-automation/
│
├── backend/                    # Django Backend
│   ├── config/                # Project settings
│   │   ├── settings.py        # Configuration (VERY IMPORTANT)
│   │   ├── urls.py            # URL routing
│   │   └── wsgi.py            # Production server config
│   │
│   ├── portfolio/             # Main app
│   │   ├── models.py          # Database structure
│   │   ├── views.py           # API endpoints logic
│   │   ├── serializers.py     # Data formatting
│   │   ├── admin.py           # Admin panel config
│   │   └── urls.py            # App-specific URLs
│   │
│   ├── manage.py              # Django command-line tool
│   ├── db.sqlite3             # Database file (created after migrate)
│   └── requirements.txt       # Python dependencies
│
└── frontend/                   # Next.js Frontend
    ├── app/                   # Pages and routes
    │   ├── layout.tsx         # Root layout (wraps all pages)
    │   ├── page.tsx           # Homepage
    │   └── globals.css        # Global styles
    │
    ├── components/            # Reusable UI components
    ├── lib/                   # Utilities
    │   └── api.ts             # API client (IMPORTANT)
    ├── types/                 # TypeScript types
    │   └── index.ts           # API data types
    │
    ├── package.json           # Node dependencies
    └── next.config.mjs        # Next.js configuration
```

## 🔄 Development Workflow

### Day-to-Day Development

**Starting Work:**
1. Open two terminals
2. Terminal 1: `cd backend && venv\Scripts\activate && python manage.py runserver`
3. Terminal 2: `cd frontend && npm run dev`
4. Open http://localhost:3000/ in browser

**Adding Content:**
1. Go to http://127.0.0.1:8000/admin/
2. Add Projects, Skills, or Work Experience
3. Check http://localhost:3000/ - changes appear automatically!

**Stopping Servers:**
- Press `Ctrl + C` in each terminal

### Typical Tasks

**Add a new skill:**
1. Go to Admin → Skills → Add Skill
2. Fill in name, category, proficiency
3. Save
4. View on frontend automatically

**Edit project:**
1. Go to Admin → Projects → Select project
2. Make changes
3. Save
4. Frontend updates automatically

**Restart servers (if needed):**
1. Stop with Ctrl + C
2. Restart with commands above

## ❓ Troubleshooting

### Backend Issues

**"No module named django"**
```bash
# Make sure virtual environment is activated
venv\Scripts\activate

# Reinstall requirements
pip install -r requirements.txt
```

**"Port 8000 is already in use"**
```bash
# Use a different port
python manage.py runserver 8001
```

**"Database is locked"**
```bash
# Close any other Django processes
# Delete db.sqlite3 and re-migrate (YOU'LL LOSE DATA!)
del db.sqlite3
python manage.py migrate
python manage.py createsuperuser
```

### Frontend Issues

**"Cannot find module '@/lib/api'"**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**"EADDRINUSE: Port 3000 already in use"**
```bash
# Use a different port
npm run dev -- -p 3001
```

**"Network request failed"**
- Check backend is running on port 8000
- Check `.env.local` has correct `NEXT_PUBLIC_API_URL`
- Check CORS settings in Django `settings.py`

## 📚 Next Steps

Now that you have everything running:

1. **Add some content**: Log into Django Admin and add a few projects
2. **Explore the code**: Open `backend/portfolio/models.py` to see data structure
3. **Check the API**: Visit http://127.0.0.1:8000/api/docs/ and try endpoints
4. **Read Next**: Move on to [02-django-concepts.md](./02-django-concepts.md)

## 🎯 Learning Checkpoints

You should now understand:

- ✅ What the backend and frontend do
- ✅ How to start both servers
- ✅ Where to add content (Django Admin)
- ✅ Basic project structure
- ✅ How to troubleshoot common issues

**Questions?** Refer to the troubleshooting section or move on to the next guide!

---

**Next Guide:** [Django Concepts →](./02-django-concepts.md)
