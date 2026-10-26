'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

export default function ReferPage() {
  const [rate, setRate] = useState(0.25)
  const [currency, setCurrency] = useState('ZMW')
  useEffect(() => { void createClient().from('referral_settings').select('commission_rate,currency').eq('id', 1).single().then(({ data }) => { if (data) { setRate(Number(data.commission_rate)); setCurrency(data.currency ?? 'ZMW') } }) }, [])
  return <main className="min-h-screen bg-background px-4 py-16"><div className="mx-auto max-w-4xl space-y-12"><div className="text-center space-y-4"><p className="text-sm font-semibold uppercase tracking-wider text-primary">{currency} referrals</p><h1 className="text-5xl font-bold text-foreground">Refer and earn</h1><p className="mx-auto max-w-xl text-lg text-muted-foreground">Earn {Math.round(rate * 100)}% when someone you refer upgrades to Pro.</p><div className="flex justify-center gap-3"><Link href="/promoter/sign-up"><Button>Become a promoter</Button></Link><Link href="/promoter/sign-in"><Button variant="outline">Promoter log in</Button></Link></div></div><div className="grid gap-4 md:grid-cols-3">{[['1','Sign up as a promoter'],['2','Share your link'],['3','Get paid at the end of the month']].map(([number, title]) => <div key={number} className="rounded-lg border border-border bg-card p-6"><span className="text-sm font-bold text-primary">Step {number}</span><h2 className="mt-3 font-semibold text-foreground">{title}</h2></div>)}</div></div></main>
}
