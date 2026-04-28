import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Send a quick note about your project. I reply within a workday — usually faster.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
