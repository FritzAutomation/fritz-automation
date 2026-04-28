import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About',
  description: '15 years writing code, now building custom software solo from Burlington, Iowa. Here is the long version.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
