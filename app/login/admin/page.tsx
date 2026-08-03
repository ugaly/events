'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, Eye, EyeOff, Loader2, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { DeviceGate } from '@/components/ui/device-gate'
import { toast } from '@/components/ui/toaster'
import { ADMIN_PASS_DEMO, ADMIN_USER_DEMO } from '@/lib/data'

export default function AdminLoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)

  function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      if (username === ADMIN_USER_DEMO && password === ADMIN_PASS_DEMO) {
        toast('Access granted', { description: 'Loading control center…' })
        router.push('/admin')
      } else {
        toast('Invalid credentials', {
          description: `Demo: ${ADMIN_USER_DEMO} / ${ADMIN_PASS_DEMO}`,
          variant: 'error',
        })
      }
    }, 900)
  }

  return (
    <DeviceGate
      mode="desktop-only"
      title="Use a computer"
      description="The Super Admin console is built for large screens. Please open this page on a laptop or desktop PC — not on a phone."
    >
      <main className="grid min-h-dvh lg:grid-cols-2">
        {/* Form side */}
        <div className="flex flex-col justify-center px-5 py-10 sm:px-12">
          <div className="mx-auto w-full max-w-sm">
            <Link
              href="/"
              className="mb-8 inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-4" />
              Back
            </Link>

            <span className="grid size-12 place-items-center rounded-full bg-primary/15 text-primary">
              <ShieldCheck className="size-6" />
            </span>
            <h1 className="mt-5 text-2xl font-bold tracking-tight">Super Admin console</h1>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              Sign in to manage events, owners, scanners and analytics.
            </p>

            <form onSubmit={submit} className="mt-7 space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  Username
                </label>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={ADMIN_USER_DEMO}
                  autoComplete="username"
                  className="h-12 w-full rounded-full bg-elevated px-5 text-base outline-none ring-inset placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  Password
                </label>
                <div className="relative">
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type={show ? 'text' : 'password'}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="h-12 w-full rounded-full bg-elevated px-5 pr-12 text-base outline-none ring-inset placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-ring"
                  />
                  <button
                    type="button"
                    onClick={() => setShow((s) => !s)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                    aria-label={show ? 'Hide password' : 'Show password'}
                  >
                    {show ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-uppercase flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary text-sm font-bold text-primary-foreground transition-transform active:scale-[0.98] disabled:opacity-70"
              >
                {loading ? <Loader2 className="size-4 animate-spin" /> : 'Sign in'}
              </button>
              <p className="text-center text-xs text-muted-foreground/70">
                Demo credentials — {ADMIN_USER_DEMO} / {ADMIN_PASS_DEMO}
              </p>
            </form>
          </div>
        </div>

        {/* Visual side */}
        <div className="relative hidden overflow-hidden lg:block">
          <motion.div
            initial={{ scale: 1.08 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.4, ease: 'easeOut' }}
            className="absolute inset-0"
            style={{
              backgroundImage: "url('/wedding-hero.png')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-background via-background/60 to-transparent" />
          <div className="absolute bottom-12 left-12 right-12">
            <p className="text-sm font-bold uppercase tracking-widest text-primary">Habari Events</p>
            <p className="mt-3 text-balance text-3xl font-bold leading-tight">
              One console for every event, owner and gate.
            </p>
          </div>
        </div>
      </main>
    </DeviceGate>
  )
}
