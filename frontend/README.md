# Fritz Automation Frontend

Next.js 15 frontend application for the Fritz Automation company website.

## Features

- ✅ Next.js 15 with App Router
- ✅ TypeScript for type safety
- ✅ Tailwind CSS for styling
- ✅ Server-Side Rendering (SSR) and Static Site Generation (SSG)
- ✅ API integration with Django backend
- ✅ Responsive design
- ✅ SEO optimized

## Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Deployment**: Vercel (recommended)

## Project Structure

```
frontend/
├── app/                # Next.js App Router
│   ├── layout.tsx     # Root layout
│   ├── page.tsx       # Homepage
│   ├── globals.css    # Global styles
│   └── ...            # Other pages
├── components/         # Reusable React components
├── lib/               # Utility functions
│   └── api.ts         # API client
├── types/             # TypeScript type definitions
│   └── index.ts       # API types
├── public/            # Static assets
├── package.json       # Dependencies
├── next.config.mjs    # Next.js configuration
├── tailwind.config.ts # Tailwind configuration
└── tsconfig.json      # TypeScript configuration
```

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Backend API running on `http://localhost:8000`

### 1. Install dependencies

```bash
cd frontend
npm install
```

### 2. Configure environment variables

```bash
# Copy the example file
copy .env.local.example .env.local

# Edit .env.local
```

Environment variables:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## Pages

### Home Page (`/`)
- Hero section with introduction
- Skills showcase
- Work experience timeline
- Featured projects
- Contact CTA

### Projects Page (`/projects`)
- Grid of all projects
- Filter by technology/status
- Search functionality

### Project Detail (`/projects/[slug]`)
- Detailed project information
- Screenshots/images
- Technologies used
- Links to GitHub and live demo

### Contact Page (`/contact`)
- Contact form
- Social links
- Email integration

## API Integration

The frontend communicates with the Django backend using a typed API client located at `lib/api.ts`.

### Example Usage:

```typescript
import { getProjects, submitContactMessage } from '@/lib/api';

// Get projects
const projects = await getProjects();

// Submit contact form
const response = await submitContactMessage({
  name: 'John Doe',
  email: 'john@example.com',
  message: 'Hello!',
});
```

### Available API Functions:

- `getSkills()` - Get all skills
- `getSkillsByCategory()` - Skills grouped by category
- `getWorkExperience()` - Get work history
- `getProjects()` - Get all projects
- `getFeaturedProjects()` - Get featured projects
- `getProject(slug)` - Get single project
- `submitContactMessage(data)` - Submit contact form
- `getSiteSettings()` - Get site configuration

## Styling

This project uses Tailwind CSS for styling. The configuration includes custom colors matching the company brand:

- **Primary Blue**: `#0a61ae`
- **Secondary Yellow**: `#ffda4b`

### Custom Classes:

```tsx
<button className="bg-primary text-white hover:bg-primary-light">
  Click Me
</button>
```

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import repository to Vercel
3. Set environment variables:
   - `NEXT_PUBLIC_API_URL`: Your production API URL
   - `NEXT_PUBLIC_SITE_URL`: Your production site URL
4. Deploy!

Vercel will automatically:
- Build the Next.js app
- Set up CDN
- Enable automatic deployments on push

### Manual Deployment

```bash
# Build the application
npm run build

# Start production server
npm start
```

## Performance Optimization

- **Image Optimization**: Next.js Image component with automatic optimization
- **Code Splitting**: Automatic route-based code splitting
- **Static Generation**: Pre-render pages at build time when possible
- **Server Components**: Reduce client-side JavaScript

## SEO

The site includes:
- Meta tags (title, description, keywords)
- Open Graph tags for social sharing
- Twitter Card tags
- Semantic HTML
- Sitemap generation (add `sitemap.ts` in app directory)

## Best Practices

### Data Fetching

```typescript
// Server Component (recommended for SEO)
export default async function Page() {
  const data = await getProjects();
  return <div>{/* render data */}</div>;
}

// Client Component (for interactivity)
'use client';
export default function Page() {
  const [data, setData] = useState([]);
  useEffect(() => {
    getProjects().then(setData);
  }, []);
  return <div>{/* render data */}</div>;
}
```

### TypeScript

All API responses are fully typed. Use the types from `types/index.ts`:

```typescript
import type { Project, Skill } from '@/types';

const project: Project = await getProject('my-project');
```

## Troubleshooting

### CORS Errors

Make sure the Django backend has CORS enabled and includes your frontend URL:

```python
# backend/config/settings.py
CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'https://your-vercel-app.vercel.app',
]
```

### API Not Found

Check that:
1. Backend is running on correct port
2. `NEXT_PUBLIC_API_URL` is set correctly
3. Backend URL is accessible from browser

### Build Errors

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Try building again
npm run build
```

## Next Steps

- [ ] Add more pages (About, Blog, Services)
- [ ] Implement search functionality
- [ ] Add loading states and skeletons
- [ ] Implement error boundaries
- [ ] Add animations (Framer Motion)
- [ ] Set up analytics (Google Analytics, Plausible)
- [ ] Add sitemap and robots.txt
- [ ] Implement dark mode
- [ ] Add tests (Jest, React Testing Library)

## Support

For issues or questions, contact: forward@fritzautomation.dev
