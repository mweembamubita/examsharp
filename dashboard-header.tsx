'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { LogOut, Zap, BookOpen } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export function DashboardHeader() {
  const router = useRouter()
  const supabase = createClient()
  const [profile, setProfile] = useState<{ full_name: string; email: string; plan: string } | null>(null)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase.from('profiles').select('full_name,email,plan').eq('id', user.id).maybeSingle()
      setProfile(data ?? { full_name: user.email?.split('@')[0] ?? 'Student', email: user.email ?? '', plan: 'free' })
    }
    void load()
  }, [supabase])

  async function logout() {
    await supabase.auth.signOut()
    router.push('/sign-in')
  }

  return <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div className="flex items-center justify-between h-16"><Link href="/dashboard" className="flex items-center gap-2"><div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center"><BookOpen className="w-6 h-6 text-primary-foreground" /></div><span className="font-bold text-lg text-foreground">Examsharp</span></Link><div className="flex items-center gap-4">{profile?.plan === 'pro' ? <span className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary border border-primary/20 rounded-full flex items-center gap-1"><Zap className="w-3 h-3" />Pro Member</span> : <span className="px-3 py-1 text-xs font-medium text-muted-foreground border border-border rounded-full">Free Plan</span>}<div className="hidden sm:block text-right text-sm"><div className="font-medium text-foreground">{profile?.full_name}</div><div className="text-xs text-muted-foreground">{profile?.email}</div></div><Button onClick={logout} variant="ghost" size="sm"><LogOut className="w-4 h-4 mr-2" /><span className="hidden sm:inline">Logout</span></Button></div></div></div></header>
}
