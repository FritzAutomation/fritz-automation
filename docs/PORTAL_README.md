# Fritz Automation Client Portal

A complete client portal system for managing projects, tickets, and file sharing.

## Features

### 1. **Dashboard** (`/portal/dashboard`)
- Overview statistics (total projects, active projects, open tickets)
- Recent project updates
- Recent tickets
- Quick action buttons

### 2. **Projects** (`/portal/projects`)
- View all client projects
- Track project progress with progress bars
- See project status, priority, and deadlines
- Detailed project view with updates, deliverables, and links

### 3. **Tickets** (`/portal/tickets`)
- Create support tickets (bug reports, feature requests, questions)
- Track ticket status (open, in progress, resolved, closed)
- Link tickets to specific projects
- Set priority levels (low, medium, high, urgent)

### 4. **Files** (`/portal/files`)
- Access project files and documents
- Filter files by project
- Download files securely
- View file categories (documents, credentials, reports, designs, code)

## Setup Instructions

### Backend (Django)

1. **Install dependencies** (already done):
   ```bash
   cd backend
   pip install djangorestframework django-cors-headers django rest-framework-authtoken
   ```

2. **Run migrations** (already completed):
   ```bash
   python manage.py migrate
   ```

3. **Create admin user** (to manage clients):
   ```bash
   python manage.py createsuperuser
   ```

4. **Start Django server**:
   ```bash
   python manage.py runserver
   ```

### Frontend (Next.js)

1. **Create environment file**:
   ```bash
   cd frontend
   cp .env.local.example .env.local
   ```

2. **Update `.env.local`** with your API URL:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

3. **Install dependencies** (if not already installed):
   ```bash
   npm install
   ```

4. **Start Next.js dev server**:
   ```bash
   npm run dev
   ```

## Usage

### For Admin (You)

1. **Access Django Admin**: `http://localhost:8000/admin`
2. **Create Client Accounts**:
   - Go to Users → Add User
   - Create username/password
   - Save and add user details (email, name)
   - A `ClientProfile` will be auto-created

3. **Create Projects**:
   - Portal → Client Projects → Add Client Project
   - Assign to client
   - Set status, priority, timeline
   - Add deliverables

4. **Add Project Updates**:
   - Edit a project → Project Updates → Add
   - Keep clients informed of progress

5. **Manage Tickets**:
   - View tickets in Portal → Tickets
   - Assign tickets to yourself
   - Add comments (mark as internal if needed)
   - Resolve when complete

6. **Share Files**:
   - Portal → Project Files → Add
   - Upload file, select project
   - Choose category (document, credential, etc.)
   - Mark as confidential if needed

### For Clients

1. **Sign Up**: `/portal/signup`
   - Fill in account details
   - Create username and password
   - Optionally add company info

2. **Login**: `/portal/login`
   - Use created credentials

3. **Dashboard**: View project overview and recent activity

4. **Projects**: Track project progress and view updates

5. **Create Tickets**: Submit bug reports or feature requests

6. **Download Files**: Access project files and documents

## API Endpoints

All portal endpoints are prefixed with `/api/portal/`

### Authentication
- `POST /api/portal/auth/register/` - Register new client
- `POST /api/portal/auth/login/` - Login (returns auth token)
- `POST /api/portal/auth/logout/` - Logout

### Dashboard
- `GET /api/portal/dashboard/stats/` - Get dashboard statistics
- `GET /api/portal/dashboard/activity/` - Get recent activity

### Projects
- `GET /api/portal/projects/` - List all projects
- `GET /api/portal/projects/{id}/` - Get project details
- `POST /api/portal/projects/{id}/add_update/` - Add project update (admin only)

### Tickets
- `GET /api/portal/tickets/` - List tickets (filterable)
- `GET /api/portal/tickets/{id}/` - Get ticket details
- `POST /api/portal/tickets/` - Create new ticket
- `POST /api/portal/tickets/{id}/add_comment/` - Add comment
- `POST /api/portal/tickets/{id}/resolve/` - Mark as resolved

### Files
- `GET /api/portal/files/` - List files (filterable by project)
- `POST /api/portal/files/` - Upload file (admin only)
- `DELETE /api/portal/files/{id}/` - Delete file (admin only)

### Profile
- `GET /api/portal/profile/me/` - Get current user's profile

## Security

- **Token Authentication**: All API requests require authentication token in header:
  ```
  Authorization: Token {your-token-here}
  ```

- **Permissions**:
  - Clients only see their own projects, tickets, and files
  - Admins can see and manage everything
  - File downloads require authentication

- **Confidential Files**: Mark sensitive files (credentials, passwords) as confidential

## Next Steps

Consider adding:
- **Messaging System**: Direct chat between clients and admin
- **Invoicing**: Track and pay invoices
- **Notifications**: Email notifications for updates/tickets
- **File Upload by Clients**: Allow clients to upload files
- **Project Timeline**: Visual timeline/Gantt chart
- **Analytics**: Usage metrics and reports
- **Two-Factor Authentication**: Extra security layer

## Troubleshooting

**CORS errors?**
- Check that Django `CORS_ALLOWED_ORIGINS` includes your Next.js URL
- Default: `http://localhost:3000`

**Can't login?**
- Verify Django server is running on port 8000
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Ensure user account exists

**Files not uploading?**
- Check Django `MEDIA_ROOT` and `MEDIA_URL` settings
- Ensure media directory exists and is writable

## Production Deployment

1. **Update CORS settings** in Django
2. **Set production API URL** in Next.js environment
3. **Use PostgreSQL** instead of SQLite
4. **Set up file storage** (AWS S3, etc.)
5. **Configure HTTPS** for both frontend and backend
6. **Set `DEBUG=False`** in Django

## Support

For questions or issues with the portal, create a ticket or contact Fritz Automation directly.
