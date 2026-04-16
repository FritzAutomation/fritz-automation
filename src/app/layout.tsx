import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { Toaster } from 'sonner'
import { BackToTop } from '@/components/BackToTop'
import { CommandPalette } from '@/components/CommandPalette'
import { ScrollProgress } from '@/components/ScrollProgress'
import { CursorEffects } from '@/components/CursorEffects'
import { OrganizationSchema, WebSiteSchema } from '@/components/StructuredData'
import { BootSplash } from '@/components/animations/BootSplash'
import { StatusBar } from '@/components/layout/StatusBar'
import { KeyboardShortcuts } from '@/components/KeyboardShortcuts'
import { ShortcutOverlay } from '@/components/ShortcutOverlay'
import { ContextMenu } from '@/components/ContextMenu'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-inter',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: {
    default: 'Fritz Automation — Custom software for small businesses',
    template: '%s | Fritz Automation',
  },
  description: 'A small software studio by Joshua Fritzjunker in Burlington, Iowa. I build websites and custom web tools for small businesses.',
  keywords: ['small business software', 'custom web development', 'web apps', 'internal tools', 'automation', 'Iowa web developer', 'Next.js developer'],
  authors: [{ name: 'Joshua Fritzjunker' }],
  creator: 'Joshua Fritzjunker',
  publisher: 'Fritz Automation LLC',
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
  },
  metadataBase: new URL('https://fritzautomation.dev'),
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Fritz Automation — Custom software for small businesses',
    description: 'A small software studio by Joshua Fritzjunker. I build websites and custom web tools for small businesses.',
    url: 'https://fritzautomation.dev',
    siteName: 'Fritz Automation',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fritz Automation — Custom software for small businesses',
    description: 'A small software studio by Joshua Fritzjunker.',
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
    <html lang="en" className={`scroll-smooth ${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <OrganizationSchema />
        <WebSiteSchema />
      </head>
      <body className="font-sans">
        <BootSplash />
        <a href="#main-content" className="skip-to-content">
          Skip to main content
        </a>
        <ScrollProgress />
        <main id="main-content" className="pb-6">
          {children}
        </main>
        <BackToTop />
        <CommandPalette />
        <Toaster position="top-right" richColors />
        <StatusBar />
        <KeyboardShortcuts />
        <ShortcutOverlay />
        <ContextMenu />
        <CursorEffects />
      </body>
    </html>
  )
}
