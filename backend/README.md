# Fritz Automation Backend API

Django REST Framework backend for the Fritz Automation portfolio website.

## Features

- ✅ Django 5.2 + Django REST Framework
- ✅ Portfolio management (Projects, Skills, Work Experience)
- ✅ Contact form API
- ✅ Site settings management
- ✅ Auto-generated API documentation (Swagger/OpenAPI)
- ✅ CORS enabled for frontend communication
- ✅ Django Admin panel for content management

## Tech Stack

- **Framework**: Django 5.2
- **API**: Django REST Framework 3.16
- **Database**: SQLite (dev), PostgreSQL (production)
- **API Docs**: drf-spectacular
- **Image Handling**: Pillow
- **Config Management**: python-decouple

## Project Structure

```
backend/
├── config/              # Django project settings
│   ├── settings.py     # Main settings
│   ├── urls.py         # URL routing
│   └── wsgi.py         # WSGI config
├── portfolio/          # Main app
│   ├── models.py       # Database models
│   ├── serializers.py  # API serializers
│   ├── views.py        # API views
│   ├── admin.py        # Django admin config
│   └── urls.py         # App URLs
├── media/              # Uploaded files (created on first upload)
├── staticfiles/        # Static files (created on collectstatic)
├── requirements.txt    # Python dependencies
└── .env.example        # Environment variables template
```

## Getting Started

### 1. Set up virtual environment

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure environment variables

```bash
# Copy the example file
copy .env.example .env

# Edit .env and update values as needed
```

### 4. Run migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### 5. Create superuser (admin account)

```bash
python manage.py createsuperuser
```

Follow the prompts to create your admin account.

### 6. Run development server

```bash
python manage.py runserver
```

The API will be available at `http://127.0.0.1:8000/`

## API Endpoints

### Base URL: `http://127.0.0.1:8000/api/`

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/skills/` | GET | List all active skills |
| `/api/skills/by_category/` | GET | Skills grouped by category |
| `/api/work-experience/` | GET | List work experience |
| `/api/projects/` | GET | List projects |
| `/api/projects/featured/` | GET | Featured projects only |
| `/api/projects/{slug}/` | GET | Project detail by slug |
| `/api/contact/` | POST | Submit contact message |
| `/api/settings/` | GET | Get site settings |

### API Documentation

- **Swagger UI**: `http://127.0.0.1:8000/api/docs/`
- **OpenAPI Schema**: `http://127.0.0.1:8000/api/schema/`

## Admin Panel

Access the Django admin at: `http://127.0.0.1:8000/admin/`

Use the superuser credentials you created earlier.

### Admin Features:

- **Projects**: Add, edit, delete portfolio projects
- **Skills**: Manage skill badges with proficiency levels
- **Work Experience**: Add employment history
- **Contact Messages**: View submissions from contact form
- **Site Settings**: Update global site configuration (singleton)

## Database Models

### Skill
- Skills organized by category (Frontend, Backend, Tools, Other)
- Proficiency level (0-100)
- Optional icon image
- Active/inactive status

### WorkExperience
- Company, position, dates
- Description and location
- Optional company image
- Calculated duration property

### Project
- Title, description, images
- GitHub and live URLs
- Status (completed, in_progress, planned, archived)
- Featured flag for homepage
- Many-to-many relationship with Skills

### ContactMessage
- Name, email, subject, message
- Auto-captured: IP address, user agent
- Status tracking (new, read, replied, archived)

### SiteSettings (Singleton)
- Site title, tagline, about text
- Social media links
- SEO meta tags
- Hero image and resume file

## Deployment Notes

### Railway.app Deployment

1. Update `requirements.txt` if needed
2. Set environment variables in Railway dashboard
3. Railway will auto-detect Django and run migrations
4. Set `DATABASE_URL` for PostgreSQL
5. Set `DEBUG=False` in production

### Environment Variables for Production

```
DEBUG=False
SECRET_KEY=<generate-strong-secret-key>
ALLOWED_HOSTS=yoursite.railway.app,www.fritzautomation.dev
CORS_ALLOWED_ORIGINS=https://www.fritzautomation.dev
DATABASE_URL=postgresql://user:password@host:port/dbname
```

### Static Files

```bash
python manage.py collectstatic
```

## Development Tips

### Create sample data

```bash
python manage.py shell
```

```python
from portfolio.models import SiteSettings, Skill, Project

# Initialize site settings
settings = SiteSettings.load()
settings.site_title = "Fritz Automation"
settings.tagline = "Software Developer & Designer"
settings.save()

# Create a skill
Skill.objects.create(name="Python", category="backend", proficiency=90)
```

### Run tests

```bash
python manage.py test
```

### Database reset

```bash
# Delete database
del db.sqlite3

# Recreate
python manage.py migrate
python manage.py createsuperuser
```

## Next Steps

- [ ] Add authentication for protected endpoints
- [ ] Implement caching with Redis
- [ ] Add Celery for background tasks (email notifications)
- [ ] Write unit tests
- [ ] Add blog functionality
- [ ] Implement full-text search

## API Response Examples

### GET /api/projects/

```json
[
  {
    "id": 1,
    "title": "Waterfall Scheduler",
    "slug": "waterfall-scheduler",
    "short_description": "Python automation tool",
    "image": "/media/projects/waterfall.png",
    "status": "completed",
    "featured": true,
    "technologies": [
      {"id": 1, "name": "Python", "category": "backend"}
    ]
  }
]
```

### POST /api/contact/

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Question about services",
  "message": "I'd like to discuss a project..."
}
```

Response:
```json
{
  "message": "Thank you for your message! We will get back to you soon."
}
```

## Support

For issues or questions, contact: forward@fritzautomation.dev
