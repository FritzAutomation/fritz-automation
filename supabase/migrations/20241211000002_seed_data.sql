-- =====================
-- Seed Data for Fritz Automation
-- =====================

-- Services
INSERT INTO public.services (title, slug, description, icon, features, technologies, display_order) VALUES
(
    'Process Automation',
    'process-automation',
    'Streamline your business operations with intelligent automation solutions that save time and reduce errors.',
    'cog',
    '["Workflow automation", "Data processing pipelines", "Report generation", "Task scheduling & monitoring", "Email & notification automation", "File processing & management"]',
    '["Python", "Celery", "Apache Airflow", "Pandas"]',
    1
),
(
    'System Integration',
    'system-integration',
    'Connect your existing systems and tools to work together seamlessly, eliminating manual data transfer and reducing silos.',
    'link',
    '["API development & integration", "Database synchronization", "Third-party service connections", "Legacy system modernization", "Real-time data sync", "Webhook automation"]',
    '["REST APIs", "GraphQL", "Webhooks", "ETL Pipelines"]',
    2
),
(
    'Custom Software Development',
    'custom-software',
    'Tailored software applications built specifically for your business needs, from concept to deployment.',
    'code',
    '["Web applications", "Internal tools & dashboards", "Customer portals", "Data visualization", "Admin panels", "Progressive web apps"]',
    '["React", "Next.js", "TypeScript", "PostgreSQL"]',
    3
);

-- Industries
INSERT INTO public.industries (title, slug, description, icon, display_order) VALUES
(
    'Manufacturing',
    'manufacturing',
    'Streamline production workflows, quality control, and inventory management with custom automation solutions.',
    'factory',
    1
),
(
    'Finance & Accounting',
    'finance-accounting',
    'Automate financial reporting, reconciliation, and compliance processes to reduce errors and save time.',
    'chart',
    2
),
(
    'Supply Chain & Logistics',
    'supply-chain',
    'Optimize inventory tracking, order processing, and shipment management with integrated systems.',
    'truck',
    3
),
(
    'Operations',
    'operations',
    'Transform manual operational processes into efficient, automated workflows that scale with your business.',
    'settings',
    4
);
