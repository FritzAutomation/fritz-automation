import { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import { ResetPasswordForm } from './ResetPasswordForm'
import { Logo } from '@/components/ui/Logo'

export const metadata: Metadata = {
  title: 'Reset Password',
  description: 'Set a new password for your Fritz Automation account.',
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2" aria-label="Fritz Automation home">
            <Logo size="lg" />
          </Link>
        </div>

        {/* Reset Password Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
          <h1 className="text-2xl font-bold text-center mb-2 text-slate-900">Set New Password</h1>
          <p className="text-slate-600 text-center mb-8">
            Please enter your new password below.
          </p>

          <Suspense fallback={<div className="animate-pulse space-y-6"><div className="h-10 bg-slate-200 rounded"></div><div className="h-10 bg-slate-200 rounded"></div><div className="h-10 bg-slate-200 rounded"></div></div>}>
            <ResetPasswordForm />
          </Suspense>
        </div>

        {/* Back to home */}
        <div className="text-center mt-6">
          <Link href="/" className="text-slate-600 hover:text-primary transition-colors text-sm">
            &larr; Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
