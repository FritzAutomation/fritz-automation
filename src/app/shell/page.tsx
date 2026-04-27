import type { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ShellTerminal } from './ShellTerminal'

export const metadata: Metadata = {
  title: 'Shell',
  description: 'Browse Fritz Automation as a filesystem. Type tree, ls, cd, cat, open.',
}

export default function ShellPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-6 sm:py-10">
        <ShellTerminal />
      </main>
      <Footer />
    </div>
  )
}
