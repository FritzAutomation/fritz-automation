import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export const metadata = {
  title: 'Invite only',
  description: 'Fritz Automation client portal is invite-only.',
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-3">Portal access is invite-only</h1>
        <p className="text-slate-600 mb-6">
          The Fritz Automation client portal is for clients I&apos;ve kicked off a project with.
          If that&apos;s you and you&apos;re looking for your account, contact me and I&apos;ll get you set up.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/contact"><Button>Contact me</Button></Link>
          <Link href="/login">
            <Button variant="outline">I already have an account</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
