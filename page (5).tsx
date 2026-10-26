'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { BookOpen, Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function SignUpPage() {
  const router = useRouter()
  const supabase = useMemo(() => typeof window === 'undefined' ? null : createClient(), [])!
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [alreadyRegistered, setAlreadyRegistered] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
  const resendConfirmation = async () => {
    if (!formData.email || resendCooldown) return
    const { error } = await supabase.auth.resend({ type: 'signup', email: formData.email, options: { emailRedirectTo: `${window.location.origin}/auth/callback` } })
    setError(error?.message.toLowerCase().includes('email limit') ? 'Too many emails were sent. Please wait a few minutes and try again.' : error?.message || 'Confirmation email sent. Check your spam or junk folder.')
    setResendCooldown(60)
    const timer = window.setInterval(() => setResendCooldown((value) => { if (value <= 1) { window.clearInterval(timer); return 0 } return value - 1 }), 1000)
  }
  const [referralCode, setReferralCode] = useState('')

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('ref')?.trim().toUpperCase() || localStorage.getItem('referral_code') || ''
    if (code) { setReferralCode(code); localStorage.setItem('referral_code', code); document.cookie = `ref=${encodeURIComponent(code)}; Max-Age=2592000; Path=/; SameSite=Lax` }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    if (!formData.name.trim()) {
      setError('Name is required')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 6 characters')
      return
    }

    setIsLoading(true)

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo:
            process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ??
            `${window.location.origin}/auth/callback`,
          data: {
            full_name: formData.name,
            ...(referralCode ? { referral_code: referralCode } : {}),
          },
        },
      })

      if (signUpError) {
        setError(signUpError.message || 'Failed to sign up')
        setIsLoading(false)
        return
      }

      if (data?.user?.identities?.length === 0) {
        setAlreadyRegistered(true)
        setIsLoading(false)
        return
      }

      if (data?.user) {
        setSuccess(true)
        setFormData({ name: '', email: '', password: '', confirmPassword: '' })
        setTimeout(() => {
          router.push('/sign-in?message=Check your email to confirm your account')
        }, 1500)
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/" className="flex items-center gap-2 w-fit">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl text-foreground">Examsharp</span>
          </Link>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="space-y-8">
            {/* Heading */}
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold text-foreground">Get started</h1>
              <p className="text-muted-foreground">Create your Examsharp account</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {referralCode && <p className="text-sm text-primary">You were invited by a friend</p>}
              {alreadyRegistered && <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm">This email is already registered. <Link href="/sign-in" className="font-semibold underline">Sign in instead</Link>, or <Link href="/forgot-password" className="font-semibold underline">reset your password</Link>.</div>}
              {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
                Check your email to confirm your account. <button type="button" className="font-semibold underline" onClick={() => void resendConfirmation()} disabled={resendCooldown > 0}>{resendCooldown ? `Resend in ${resendCooldown}s` : 'Resend confirmation email'}</button><span className="block mt-1">Check your spam or junk folder.</span>
              </div>
            )}

              {/* Name Input */}
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-foreground">
                  Full name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder-muted-foreground"
                    required
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-foreground">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder-muted-foreground"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-foreground">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder-muted-foreground"
                    required
                  />
                </div>
              </div>

              {/* Confirm Password Input */}
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground">
                  Confirm password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder-muted-foreground"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium h-10"
                disabled={isLoading || success}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create account
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-background text-muted-foreground">Already have an account?</span>
              </div>
            </div>

            {/* Sign In Link */}
            <Link href="/sign-in">
              <Button
                type="button"
                variant="outline"
                className="w-full border-border hover:bg-muted text-foreground"
              >
                Sign in instead
              </Button>
            </Link>
          </div>

          {/* Info */}
          <div className="mt-12 p-4 bg-secondary/30 border border-secondary/50 rounded-lg text-sm text-muted-foreground space-y-2">
            <p className="font-medium text-foreground">Free account includes:</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>5 exams per month</li>
              <li>Basic answer review</li>
              <li>Progress tracking</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}
