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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gi-black via-gi-dark to-mat-900 p-4">
      <div className="w-full max-w-md">
        <div className="bg-gi-darker rounded-lg shadow-2xl p-8 border border-gray-800">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">BJJ Training Log</h1>
            <p className="text-gray-400">Track your journey on the mats</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gi-dark border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition"
                placeholder="you@example.com"
                disabled={loading}
              />
            </div>

            {message && (
              <div
                className={`p-4 rounded-lg ${
                  message.type === 'error'
                    ? 'bg-red-900/30 border border-red-800 text-red-200'
                    : 'bg-gold-900/30 border border-gold-700 text-gold-200'
                }`}
              >
                <p className="text-sm">{message.text}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 focus:ring-offset-gi-dark shadow-lg"
            >
              {loading ? 'Sending magic link...' : 'Send magic link'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-400">
            No password needed. We&apos;ll email you a magic link to sign in.
          </p>
        </div>
      </div>
    </div>
  )
}
