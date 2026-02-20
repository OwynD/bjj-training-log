'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export const dynamic = 'force-dynamic'

export default function NewSessionPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
    gym: '',
    giType: 'gi' as 'gi' | 'nogi',
    duration: '',
    notes: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/login')
        return
      }

      const { error: insertError } = await supabase
        .from('sessions')
        .insert({
          user_id: user.id,
          date: formData.date,
          gym: formData.gym,
          gi_type: formData.giType as 'gi' | 'nogi',
          duration_min: parseInt(formData.duration),
          notes: formData.notes || null,
        })

      if (insertError) throw insertError

      // Success - redirect to My Log
      router.push('/my-log?success=true')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save session')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface-base pb-24 md:pb-4">
      <div className="max-w-2xl mx-auto px-4 pt-24 md:pt-8">
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="text-sm text-text-tertiary hover:text-text-primary transition-colors flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        </div>

        <div className="bg-surface-elevated rounded-lg border border-border-subtle p-6">
          <h1 className="text-xl font-semibold text-text-primary mb-6">Log Training Session</h1>

          {error && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-md">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Date */}
            <div>
              <label htmlFor="date" className="block text-xs font-medium text-text-secondary mb-2">
                Date
              </label>
              <input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
                className="w-full px-3 py-2 bg-surface-base border border-border-default rounded-md text-sm text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-1 focus:ring-accent-gold focus:border-accent-gold transition"
              />
            </div>

            {/* Gym */}
            <div>
              <label htmlFor="gym" className="block text-xs font-medium text-text-secondary mb-2">
                Gym
              </label>
              <input
                id="gym"
                type="text"
                value={formData.gym}
                onChange={(e) => setFormData({ ...formData, gym: e.target.value })}
                required
                placeholder="Gym name"
                className="w-full px-3 py-2 bg-surface-base border border-border-default rounded-md text-sm text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-1 focus:ring-accent-gold focus:border-accent-gold transition"
              />
            </div>

            {/* Gi Type */}
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-2">
                Type
              </label>
              <div className="inline-flex p-0.5 bg-surface-base border border-border-default rounded-md">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, giType: 'gi' })}
                  className={`px-3 py-1.5 text-xs font-medium rounded transition-all ${
                    formData.giType === 'gi'
                      ? 'bg-surface-elevated text-text-primary shadow-sm'
                      : 'text-text-tertiary hover:text-text-secondary'
                  }`}
                >
                  Gi
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, giType: 'nogi' })}
                  className={`px-3 py-1.5 text-xs font-medium rounded transition-all ${
                    formData.giType === 'nogi'
                      ? 'bg-surface-elevated text-text-primary shadow-sm'
                      : 'text-text-tertiary hover:text-text-secondary'
                  }`}
                >
                  No-Gi
                </button>
              </div>
            </div>

            {/* Duration */}
            <div>
              <label htmlFor="duration" className="block text-xs font-medium text-text-secondary mb-2">
                Duration (minutes)
              </label>
              <input
                id="duration"
                type="number"
                min="1"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                required
                placeholder="60"
                className="w-full px-3 py-2 bg-surface-base border border-border-default rounded-md text-sm text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-1 focus:ring-accent-gold focus:border-accent-gold transition"
              />
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="notes" className="block text-xs font-medium text-text-secondary mb-2">
                Notes (optional)
              </label>
              <textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={4}
                placeholder="What did you work on today?"
                className="w-full px-3 py-2 bg-surface-base border border-border-default rounded-md text-sm text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-1 focus:ring-accent-gold focus:border-accent-gold resize-none transition"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent-gold hover:bg-accent-gold/90 disabled:bg-surface-higher disabled:text-text-tertiary disabled:cursor-not-allowed text-surface-base text-sm font-medium py-2.5 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-accent-gold focus:ring-offset-2 focus:ring-offset-surface-elevated"
            >
              {loading ? 'Saving...' : 'Save Session'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
