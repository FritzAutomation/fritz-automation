-- Add missing services 4-6 (not included in original seed) and new service 7
INSERT INTO public.services (title, slug, description, icon, features, technologies, display_order) VALUES
(
    'Data Analytics & Reporting',
    'data-analytics',
    'Transform raw data into actionable insights. We build dashboards, automated reports, and analytics pipelines that help you make better decisions.',
    'chart',
    '["Custom dashboard development", "Automated reporting systems", "Data visualization", "KPI tracking and alerts", "Historical trend analysis", "Predictive analytics"]',
    '["Python", "SQL", "Power BI", "Tableau", "Pandas"]',
    4
),
(
    'Web Scraping & Data Collection',
    'web-scraping',
    'Automatically gather data from websites, competitors, and online sources. We build reliable scrapers that handle pagination, authentication, and rate limiting.',
    'globe',
    '["Competitor price monitoring", "Market research automation", "Lead generation", "Content aggregation", "Inventory tracking", "News and social monitoring"]',
    '["Python", "BeautifulSoup", "Scrapy", "Puppeteer"]',
    5
),
(
    'Email & Document Automation',
    'email-document-automation',
    'Automate your communication workflows. From bulk email campaigns to document generation and PDF processing, we handle it all.',
    'mail',
    '["Automated email campaigns", "Document generation (PDF, Word, Excel)", "Invoice and quote automation", "Email parsing and routing", "Template-based document creation", "Digital signature integration"]',
    '["Python", "SMTP", "PDF libraries", "DocuSign API"]',
    6
),
(
    'Website Development',
    'website-development',
    'Professional websites that load fast, rank well, and convert visitors into customers. From marketing sites to full-stack web applications, we build it all.',
    'layout',
    '["Custom design & development", "Mobile-responsive layouts", "SEO & performance optimization", "CMS integration", "E-commerce solutions", "Hosting & domain setup"]',
    '["Next.js", "React", "TypeScript", "Tailwind CSS", "Supabase"]',
    7
);
