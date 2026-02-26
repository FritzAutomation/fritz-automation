import { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import { LoginForm } from './LoginForm'
import { FritzLogo } from '@/components/FritzLogo'

export const metadata: Metadata = {
  title: 'Login',
  description: 'Sign in to your Fritz Automation client portal.',
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" aria-label="Fritz Automation home">
            <FritzLogo width={220} variant="light" />
          </Link>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
          <h1 className="text-2xl font-bold text-center mb-2 text-slate-900">Welcome Back</h1>
          <p className="text-slate-600 text-center mb-8">Sign in to access your client portal</p>

          <Suspense fallback={<div className="animate-pulse space-y-6"><div className="h-10 bg-slate-200 rounded"></div><div className="h-10 bg-slate-200 rounded"></div><div className="h-10 bg-slate-200 rounded"></div></div>}>
            <LoginForm />
          </Suspense>

          <div className="mt-6 text-center text-sm">
            <span className="text-slate-600">Don't have an account? </span>
            <Link href="/register" className="text-primary font-semibold hover:underline">
              Request Access
            </Link>
          </div>
        </div>

        {/* Back to home */}
        <div className="text-center mt-6">
          <Link href="/" className="text-slate-600 hover:text-primary transition-colors text-sm">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
