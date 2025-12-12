'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

export function RegisterForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const firstName = formData.get('firstName') as string
    const lastName = formData.get('lastName') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string

    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      setIsLoading(false)
      return
    }

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters')
      setIsLoading(false)
      return
    }

    const supabase = createClient()

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      toast.error(error.message)
      setIsLoading(false)
      return
    }

    toast.success('Account created! Please check your email to verify your account.')
    router.push('/login')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Input
          id="firstName"
          name="firstName"
          label="First Name"
          placeholder="John"
          required
          autoComplete="given-name"
        />
        <Input
          id="lastName"
          name="lastName"
          label="Last Name"
          placeholder="Doe"
          required
          autoComplete="family-name"
        />
      </div>

      <Input
        id="email"
        name="email"
        type="email"
        label="Email Address"
        placeholder="you@example.com"
        required
        autoComplete="email"
      />

      <Input
        id="password"
        name="password"
        type="password"
        label="Password"
        placeholder="At least 8 characters"
        required
        autoComplete="new-password"
      />

      <Input
        id="confirmPassword"
        name="confirmPassword"
        type="password"
        label="Confirm Password"
        placeholder="Confirm your password"
        required
        autoComplete="new-password"
      />

      <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
        Create Account
      </Button>
    </form>
  )
}
