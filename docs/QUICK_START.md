# Quick Start Guide

Get Fritz Automation running in under 10 minutes!

## Prerequisites

- Python 3.11+ installed
- Node.js 18+ installed
- Git installed

## Setup Backend (3 minutes)

```bash
# 1. Navigate to backend
cd backend

# 2. Create and activate virtual environment
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Mac/Linux

# 3. Install dependencies
pip install -r requirements.txt

# 4. Run migrations
python manage.py migrate

# 5. Create admin user
python manage.py createsuperuser
# Enter: username, email, password

# 6. Start server
python manage.py runserver
```

✅ Backend running at http://127.0.0.1:8000/

## Setup Frontend (3 minutes)

**Open a NEW terminal window**

```bash
# 1. Navigate to frontend
cd frontend

# 2. Install dependencies
npm install

# 3. Create environment file
copy .env.local.example .env.local  # Windows
# cp .env.local.example .env.local  # Mac/Linux

# 4. Start dev server
npm run dev
```

✅ Frontend running at http://localhost:3000/

## First Steps

### 1. Add Content (Django Admin)

Visit: http://127.0.0.1:8000/admin/

Login with your superuser credentials, then:

- **Add a Skill**: Portfolio → Skills → Add Skill
  - Name: Python
  - Category: Backend
  - Proficiency: 90
  - Order: 1
  - Is Active: ✓

- **Add a Project**: Portfolio → Projects → Add Project
  - Title: My First Project
  - Short Description: A cool project
  - Description: Detailed description here...
  - Status: Completed
  - Featured: ✓

### 2. View Your Site

Visit: http://localhost:3000/

You should see your newly added content!

### 3. Explore API

Visit: http://127.0.0.1:8000/api/docs/

Try these endpoints:
- `GET /api/skills/` - See your skills
- `GET /api/projects/` - See your projects

## Project Structure

```
fritz-automation/
├── backend/           # Django REST API (Python)
├── frontend/          # Next.js App (TypeScript/React)
├── docs/              # Learning materials
├── CHANGELOG.md       # Project history
└── PROJECT_README.md  # Full documentation
```

## Next Steps

1. **Read Documentation**
   - Start with `PROJECT_README.md`
   - Then `docs/01-getting-started.md`

2. **Add More Content**
   - Skills, projects, work experience
   - Customize in Django Admin

3. **Customize**
   - Edit frontend pages in `frontend/app/`
   - Modify backend models in `backend/portfolio/models.py`

4. **Deploy**
   - See `docs/04-deployment.md` when ready

## Troubleshooting

**Backend won't start:**
```bash
# Make sure venv is activated
venv\Scripts\activate

# Reinstall dependencies
pip install -r requirements.txt
```

**Frontend won't start:**
```bash
# Delete and reinstall node_modules
rm -rf node_modules
npm install
```

**Can't see content:**
- Make sure backend is running
- Check `.env.local` has correct API URL
- Add content in Django Admin first

## Help

- **Full Docs**: `PROJECT_README.md`
- **Training**: `docs/` folder
- **Changelog**: `CHANGELOG.md`
- **Email**: forward@fritzautomation.dev

Happy coding! 🚀
