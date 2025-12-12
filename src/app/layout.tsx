import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Fritz Automation | Enterprise Automation Solutions',
    template: '%s | Fritz Automation',
  },
  description: 'Enterprise automation solutions built on 20+ years of manufacturing experience. We help businesses eliminate manual processes and scale efficiently.',
  keywords: ['automation', 'process automation', 'custom software', 'manufacturing', 'enterprise solutions'],
  authors: [{ name: 'Fritz Automation' }],
  openGraph: {
    title: 'Fritz Automation | Enterprise Automation Solutions',
    description: 'We help businesses eliminate manual processes and scale efficiently.',
    url: 'https://fritzautomation.dev',
    siteName: 'Fritz Automation',
    locale: 'en_US',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  )
}
