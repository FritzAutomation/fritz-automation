import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import { BackToTop } from '@/components/BackToTop'
import { OrganizationSchema, WebSiteSchema } from '@/components/StructuredData'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
})

export const metadata: Metadata = {
  title: {
    default: 'Fritz Automation | Enterprise Automation Solutions',
    template: '%s | Fritz Automation',
  },
  description: 'Enterprise automation solutions built on 20+ years of manufacturing experience. We help businesses eliminate manual processes and scale efficiently.',
  keywords: ['automation', 'process automation', 'custom software', 'manufacturing', 'enterprise solutions', 'business automation', 'workflow automation', 'data integration'],
  authors: [{ name: 'Fritz Automation' }],
  creator: 'Fritz Automation',
  publisher: 'Fritz Automation',
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
  metadataBase: new URL('https://fritzautomation.dev'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Fritz Automation | Enterprise Automation Solutions',
    description: 'We help businesses eliminate manual processes and scale efficiently.',
    url: 'https://fritzautomation.dev',
    siteName: 'Fritz Automation',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fritz Automation | Enterprise Automation Solutions',
    description: 'We help businesses eliminate manual processes and scale efficiently.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <OrganizationSchema />
        <WebSiteSchema />
      </head>
      <body className={inter.className}>
        <a href="#main-content" className="skip-to-content">
          Skip to main content
        </a>
        <main id="main-content">
          {children}
        </main>
        <BackToTop />
        <Toaster position="top-right" richColors />
      </body>
    </html>
  )
}
