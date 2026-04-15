import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Services',
  description: 'Two kinds of projects: websites & online stores, and internal tools & automation for small businesses.',
}

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return children
}
