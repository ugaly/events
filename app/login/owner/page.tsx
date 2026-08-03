'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, Loader2, Smartphone } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { toast } from '@/components/ui/toaster'
import { OTP_DEMO, OWNER_PHONE_DEMO } from '@/lib/data'

export default function OwnerLoginPage() {
  const router = useRouter()
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const inputs = useRef<Array<HTMLInputElement | null>>([])

  useEffect(() => {
    if (step === 'otp') inputs.current[0]?.focus()
  }, [step])

  function sendOtp() {
    if (phone.replace(/\D/g, '').length < 9) {
      toast('Enter a valid phone number', { variant: 'error' })
      return
    }
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setStep('otp')
      toast('OTP sent', { description: `Use demo code ${OTP_DEMO}`, variant: 'info' })
    }, 900)
  }

  function handleOtpChange(i: number, v: string) {
    if (!/^\d?$/.test(v)) return
    const next = [...otp]
    next[i] = v
    setOtp(next)
    if (v && i < 5) inputs.current[i + 1]?.focus()
  }

  function handleKeyDown(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !otp[i] && i > 0) inputs.current[i - 1]?.focus()
  }

  function verify() {
    const code = otp.join('')
    if (code.length < 6) {
      toast('Enter the 6-digit code', { variant: 'error' })
      return
    }
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      if (code === OTP_DEMO) {
        toast('Welcome back', { description: 'Signing you in…' })
        router.push('/owner')
      } else {
        toast('Invalid OTP', { description: `Demo code is ${OTP_DEMO}`, variant: 'error' })
        setOtp(['', '', '', '', '', ''])
        inputs.current[0]?.focus()
      }
    }, 900)
  }

  return (
    <main className="flex min-h-dvh flex-col px-5 py-8 sm:items-center sm:justify-center">
      <div className="mx-auto w-full max-w-sm">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back
        </Link>

        <span className="grid size-12 place-items-center rounded-full bg-primary/15 text-primary">
          <Smartphone className="size-6" />
        </span>
        <h1 className="mt-5 text-2xl font-bold tracking-tight">Event Owner sign in</h1>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
          {step === 'phone'
            ? 'Enter your phone number to receive a one-time passcode.'
            : `We sent a 6-digit code to ${phone}. Demo code is ${OTP_DEMO}.`}
        </p>

        <AnimatePresence mode="wait">
          {step === 'phone' ? (
            <motion.div
              key="phone"
              initial={{ x: -16 }}
              animate={{ x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.25 }}
              className="mt-7 space-y-4"
            >
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  Phone number
                </label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.nativeEvent.isComposing) sendOtp()
                  }}
                  inputMode="tel"
                  placeholder={OWNER_PHONE_DEMO}
                  className="h-12 w-full rounded-full bg-elevated px-5 text-base text-foreground outline-none ring-inset placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-ring"
                />
              </div>
              <button
                onClick={sendOtp}
                disabled={loading}
                className="btn-uppercase flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary text-sm font-bold text-primary-foreground transition-transform active:scale-[0.98] disabled:opacity-70"
              >
                {loading ? <Loader2 className="size-4 animate-spin" /> : 'Send code'}
              </button>
              <p className="text-center text-xs text-muted-foreground/70">
                Try demo phone {OWNER_PHONE_DEMO}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="otp"
              initial={{ x: 16 }}
              animate={{ x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.25 }}
              className="mt-7 space-y-5"
            >
              <div className="flex justify-between gap-2">
                {otp.map((d, i) => (
                  <input
                    key={i}
                    ref={(el) => {
                      inputs.current[i] = el
                    }}
                    value={d}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    inputMode="numeric"
                    maxLength={1}
                    className="size-12 rounded-xl bg-elevated text-center text-xl font-bold text-foreground outline-none ring-inset focus:ring-2 focus:ring-ring"
                  />
                ))}
              </div>
              <button
                onClick={verify}
                disabled={loading}
                className="btn-uppercase flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary text-sm font-bold text-primary-foreground transition-transform active:scale-[0.98] disabled:opacity-70"
              >
                {loading ? <Loader2 className="size-4 animate-spin" /> : 'Verify & continue'}
              </button>
              <button
                onClick={() => setStep('phone')}
                className="w-full text-center text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
              >
                Change phone number
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}
