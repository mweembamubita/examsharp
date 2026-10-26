'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { BookOpen, Check, ArrowRight, Zap, Users, BarChart3 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

export default function Page() {
  const router = useRouter()
  const supabase = useMemo(() => typeof window === 'undefined' ? null : createClient(), [])!
  const [signedIn, setSignedIn] = useState(false)
  const [rate, setRate] = useState(25)

  useEffect(() => {
    void (async () => {
      const [{ data: { user } }, { data: settings }] = await Promise.all([
        supabase.auth.getUser(),
        supabase.from('referral_settings').select('commission_rate').eq('id', 1).single(),
      ])
      setSignedIn(Boolean(user))
      if (settings) setRate(Math.round(Number(settings.commission_rate) * 100))
    })()
  }, [supabase])

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border sticky top-0 z-50 bg-background/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg text-foreground">Examsharp</span>
            </div>
            <div className="flex items-center gap-3"><Link href="/refer" className="hidden text-sm text-muted-foreground hover:text-foreground sm:block">Refer & Earn</Link>
              {signedIn ? <Link href="/dashboard"><Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Go to dashboard</Button></Link> : <><Link href="/sign-in"><Button variant="outline" className="border-border hover:bg-muted text-foreground">Sign in</Button></Link><Link href="/sign-up"><Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Get Started</Button></Link></>}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        <section className="text-center space-y-6 pt-8">
          <div className="inline-block px-4 py-2 bg-primary/10 border border-primary/20 rounded-full">
            <p className="text-sm font-medium text-primary">Master your exams</p>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-foreground text-balance leading-tight">
            Ace Your Exams with{' '}
            <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Intelligent Practice
            </span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            Prepare with real exam papers, get detailed explanations for every answer, and track your progress in real-time.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/sign-up">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg h-12 px-8">
                Start Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/sign-in">
              <Button variant="outline" className="border-border hover:bg-muted text-foreground text-lg h-12 px-8">
                Sign In
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-foreground">Powerful Features</h2>
            <p className="text-muted-foreground">Everything you need to succeed</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: BookOpen,
                title: 'Real Exam Papers',
                description: 'Practice with authentic exam papers from multiple subjects and grades.',
              },
              {
                icon: BarChart3,
                title: 'Detailed Analytics',
                description: 'Track your progress with comprehensive statistics and insights.',
              },
              {
                icon: Check,
                title: 'Complete Explanations',
                description: 'Understand why answers are right or wrong with detailed explanations.',
              },
              {
                icon: Users,
                title: 'Group Exams',
                description: 'Compete with classmates and see leaderboards (Pro feature).',
              },
              {
                icon: Zap,
                title: 'Unlimited Practice',
                description: 'Take unlimited exams with Pro plan for unrestricted learning.',
              },
              {
                icon: BarChart3,
                title: 'Smart Insights',
                description: 'Get personalized recommendations based on your performance.',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="border border-border rounded-lg p-6 space-y-3 bg-card hover:border-primary/50 transition-colors"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border border-primary/20 rounded-lg bg-primary/5 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div><h2 className="text-2xl font-bold text-foreground">Refer and earn</h2><p className="text-muted-foreground">Earn {rate}% every time someone you refer upgrades to Pro.</p></div>
          <div className="flex gap-3"><Link href="/promoter/sign-up"><Button>Become a promoter</Button></Link><Link href="/refer"><Button variant="outline">How it works</Button></Link></div>
        </section>

        {/* Pricing Section */}
        <section className="space-y-8 py-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-foreground">Simple Pricing</h2>
            <p className="text-muted-foreground">Choose the plan that works for you</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            {/* Free Plan */}
            <div className="border border-border rounded-lg p-8 space-y-6 bg-card">
              <div>
                <h3 className="text-2xl font-bold text-foreground">Free</h3>
                <p className="text-muted-foreground text-sm mt-1">Perfect for getting started</p>
              </div>

              <div>
                <p className="text-3xl font-bold text-foreground">K0</p>
                <p className="text-muted-foreground text-sm">Forever free</p>
              </div>

              <ul className="space-y-3">
                {['5 exams per month', 'Basic answer review', 'Progress tracking'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-foreground text-sm">
                    <Check className="w-4 h-4 text-primary flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              <Link href="/sign-up" className="block">
                <Button className="w-full border-border hover:bg-muted text-foreground" variant="outline">
                  Get Started
                </Button>
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="border-2 border-primary rounded-lg p-8 space-y-6 bg-card relative">
              <div className="absolute -top-3 -right-3 px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full">
                Most Popular
              </div>

              <div>
                <h3 className="text-2xl font-bold text-foreground">Pro</h3>
                <p className="text-muted-foreground text-sm mt-1">For serious learners</p>
              </div>

              <div>
                <p className="text-3xl font-bold text-foreground">K20</p>
                <p className="text-muted-foreground text-sm">/month</p>
              </div>

              <ul className="space-y-3">
                {[
                  'Unlimited exams',
                  'Group exams with leaderboard',
                  'Detailed answer explanations',
                  'Priority support',
                  'Progress analytics',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-foreground text-sm">
                    <Check className="w-4 h-4 text-primary flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              <Link href="/sign-up" className="block">
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  Start Free Trial
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center space-y-6 py-12 bg-primary/5 border border-primary/20 rounded-lg p-12">
          <h2 className="text-3xl font-bold text-foreground">Ready to ace your exams?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join thousands of students who are already preparing with Examsharp.
          </p>
          <Link href="/sign-up">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg h-12 px-8">
              Get Started Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-sm text-muted-foreground">
          <div className="flex justify-center gap-4 mb-3"><Link href="/refer" className="text-primary hover:underline">Refer &amp; Earn</Link></div><p>© 2024 Examsharp. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
