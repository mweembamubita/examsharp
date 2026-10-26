'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { BookOpen, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function SignInForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = useMemo(() => createClient(), [])
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [resendCooldown, setResendCooldown] = useState(0)
  const resend = async () => {
    if (!email || resendCooldown > 0) return
    const { error } = await supabase.auth.resend({ type: 'signup', email, options: { emailRedirectTo: `${window.location.origin}/auth/callback` } })
    if (error?.message.toLowerCase().includes('email limit')) setError('Too many emails were sent. Please wait a few minutes and try again.')
    else if (error) setError(error.message)
    else setMessage('Confirmation email sent. Check your spam or junk folder.')
    setResendCooldown(60)
    const timer = window.setInterval(() => setResendCooldown((value) => { if (value <= 1) { window.clearInterval(timer); return 0 } return value - 1 }), 1000)
  }

  useEffect(() => {
    const msg = searchParams.get('message')
    if (msg) setMessage(msg)
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setIsLoading(true)
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
    if (signInError) {
      setError(signInError.message || 'Invalid email or password')
      setIsLoading(false)
      return
    }
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/" className="flex items-center gap-2 w-fit">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center"><BookOpen className="w-6 h-6 text-primary-foreground" /></div>
            <span className="font-bold text-xl text-foreground">Examsharp</span>
          </Link>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-2 text-center"><h1 className="text-3xl font-bold text-foreground">Welcome back</h1><p className="text-muted-foreground">Sign in to your Examsharp account</p></div>
          <form onSubmit={handleSubmit} className="space-y-4">
            {message && <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 text-sm">{message}</div>}
            {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">{error}</div>}
            <div className="space-y-2"><label htmlFor="email" className="block text-sm font-medium text-foreground">Email address</label><div className="relative"><Mail className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" /><input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder-muted-foreground" required /></div></div>
            <div className="space-y-2"><label htmlFor="password" className="block text-sm font-medium text-foreground">Password</label><div className="relative"><Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" /><input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder-muted-foreground" required /></div></div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium h-10" disabled={isLoading}>{isLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Signing in...</> : <>Sign in<ArrowRight className="w-4 h-4 ml-2" /></>}</Button>
            <div className="flex justify-between text-sm"><Link href="/forgot-password" className="text-primary hover:underline">Forgot password?</Link>{error?.toLowerCase().includes('not confirmed') && <button type="button" className="text-primary hover:underline" onClick={()=>void resend()} disabled={resendCooldown>0}>{resendCooldown ? `Resend in ${resendCooldown}s` : 'Resend confirmation email'}</button>}</div>
          </form>
          <div className="relative"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div><div className="relative flex justify-center text-sm"><span className="px-2 bg-background text-muted-foreground">Don&apos;t have an account?</span></div></div>
          <Link href="/sign-up"><Button type="button" variant="outline" className="w-full border-border hover:bg-muted text-foreground">Create account</Button></Link>
          <div className="p-4 bg-secondary/30 border border-secondary/50 rounded-lg text-sm text-muted-foreground space-y-2"><p className="font-medium text-foreground">Note:</p><p>Create an account first to get started. Check your email after sign-up to confirm your account.</p></div>
        </div>
      </main>
    </div>
  )
}
