'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export const dynamic = 'force-dynamic'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null)
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        setMessage({ type: 'error', text: error.message })
      } else {
        setMessage({ 
          type: 'success', 
          text: 'Check your email for the magic link!' 
        })
        setEmail('')
      }
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: 'An unexpected error occurred' 
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-base p-4">
      <div className="w-full max-w-md">
        <div className="bg-surface-elevated rounded-lg border border-border-subtle p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-text-primary mb-1 tracking-tight">BJJ Training Log</h1>
            <p className="text-sm text-text-tertiary">Track your journey on the mats</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-text-secondary mb-2">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 bg-surface-base border border-border-default rounded-md text-sm text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-1 focus:ring-accent-gold focus:border-accent-gold transition"
                placeholder="you@example.com"
                disabled={loading}
              />
            </div>

            {message && (
              <div
                className={`p-3 rounded-md ${
                  message.type === 'error'
                    ? 'bg-red-500/10 border border-red-500/20 text-red-400'
                    : 'bg-accent-gold/10 border border-accent-gold/20 text-accent-gold'
                }`}
              >
                <p className="text-sm">{message.text}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent-gold hover:bg-accent-gold/90 disabled:bg-surface-higher disabled:text-text-tertiary disabled:cursor-not-allowed text-surface-base text-sm font-medium py-2.5 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-accent-gold focus:ring-offset-2 focus:ring-offset-surface-elevated"
            >
              {loading ? 'Sending magic link...' : 'Send magic link'}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-text-tertiary">
            No password needed. We&apos;ll email you a magic link to sign in.
          </p>
        </div>
      </div>
    </div>
  )
}
