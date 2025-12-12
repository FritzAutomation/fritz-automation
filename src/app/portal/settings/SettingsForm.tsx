'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface Profile {
  id: string
  email: string | null
  first_name: string | null
  last_name: string | null
  company_name: string | null
  phone: string | null
  industry: string | null
}

interface SettingsFormProps {
  profile: Profile | null
  userEmail: string
}

export function SettingsForm({ profile, userEmail }: SettingsFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const firstName = formData.get('firstName') as string
    const lastName = formData.get('lastName') as string
    const companyName = formData.get('companyName') as string
    const phone = formData.get('phone') as string
    const industry = formData.get('industry') as string

    const supabase = createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      toast.error('You must be logged in')
      setIsLoading(false)
      return
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('profiles')
      .update({
        first_name: firstName,
        last_name: lastName,
        company_name: companyName || null,
        phone: phone || null,
        industry: industry || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)

    if (error) {
      toast.error(error.message)
      setIsLoading(false)
      return
    }

    toast.success('Profile updated successfully!')
    setIsLoading(false)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input
          id="firstName"
          name="firstName"
          label="First Name"
          defaultValue={profile?.first_name || ''}
          placeholder="John"
        />
        <Input
          id="lastName"
          name="lastName"
          label="Last Name"
          defaultValue={profile?.last_name || ''}
          placeholder="Doe"
        />
      </div>

      <Input
        id="companyName"
        name="companyName"
        label="Company Name"
        defaultValue={profile?.company_name || ''}
        placeholder="Acme Inc."
      />

      <Input
        id="phone"
        name="phone"
        type="tel"
        label="Phone Number"
        defaultValue={profile?.phone || ''}
        placeholder="+1 (555) 123-4567"
      />

      <div>
        <label htmlFor="industry" className="block text-sm font-medium text-slate-700 mb-1">
          Industry
        </label>
        <select
          id="industry"
          name="industry"
          defaultValue={profile?.industry || ''}
          className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-slate-900"
        >
          <option value="">Select your industry</option>
          <option value="manufacturing">Manufacturing</option>
          <option value="finance">Finance & Accounting</option>
          <option value="supply-chain">Supply Chain & Logistics</option>
          <option value="operations">Operations</option>
          <option value="healthcare">Healthcare</option>
          <option value="retail">Retail</option>
          <option value="technology">Technology</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="pt-4">
        <Button type="submit" isLoading={isLoading}>
          Save Changes
        </Button>
      </div>
    </form>
  )
}
