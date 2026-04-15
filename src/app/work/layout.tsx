import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Work',
  description: 'A small sample of sites I built for clients. Each one shipped and in production.',
}

export default function WorkLayout({ children }: { children: React.ReactNode }) {
  return children
}
