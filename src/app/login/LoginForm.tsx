'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const supabase = createClient()

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      toast.error(error.message)
      setIsLoading(false)
      return
    }

    toast.success('Signed in successfully!')

    // Redirect to the page they were trying to access, or portal
    const redirect = searchParams.get('redirect') || '/portal'
    router.push(redirect)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        id="email"
        name="email"
        type="email"
        label="Email Address"
        placeholder="you@example.com"
        required
        autoComplete="email"
      />

      <div>
        <Input
          id="password"
          name="password"
          type="password"
          label="Password"
          placeholder="Your password"
          required
          autoComplete="current-password"
        />
        <div className="mt-2 text-right">
          <Link href="/forgot-password" className="text-sm text-primary hover:underline">
            Forgot password?
          </Link>
        </div>
      </div>

      <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
        Sign In
      </Button>
    </form>
  )
}
