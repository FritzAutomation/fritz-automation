import { Metadata } from 'next'
import Link from 'next/link'
import { RegisterForm } from './RegisterForm'

export const metadata: Metadata = {
  title: 'Register',
  description: 'Create an account to access the Fritz Automation client portal.',
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-light rounded-xl flex items-center justify-center text-white font-bold text-lg">
              FA
            </div>
            <span className="text-2xl font-bold gradient-text">Fritz Automation</span>
          </Link>
        </div>

        {/* Register Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
          <h1 className="text-2xl font-bold text-center mb-2 text-slate-900">Create Account</h1>
          <p className="text-slate-600 text-center mb-8">Sign up to access your client portal</p>

          <RegisterForm />

          <div className="mt-6 text-center text-sm">
            <span className="text-slate-600">Already have an account? </span>
            <Link href="/login" className="text-primary font-semibold hover:underline">
              Sign In
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
