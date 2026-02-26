-- Add Website Development as the 7th service
INSERT INTO public.services (title, slug, description, icon, features, technologies, display_order) VALUES
(
    'Website Development',
    'website-development',
    'Professional websites that load fast, rank well, and convert visitors into customers. From marketing sites to full-stack web applications, we build it all.',
    'layout',
    '["Custom design & development", "Mobile-responsive layouts", "SEO & performance optimization", "CMS integration", "E-commerce solutions", "Hosting & domain setup"]',
    '["Next.js", "React", "TypeScript", "Tailwind CSS", "Supabase"]',
    7
);
