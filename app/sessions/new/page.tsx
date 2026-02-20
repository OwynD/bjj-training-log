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
    <div className="min-h-screen bg-gradient-to-b from-gi-black to-gi-dark p-4">
      <div className="max-w-2xl mx-auto pt-8">
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ← Back
          </button>
        </div>

        <div className="bg-gi-darker rounded-lg shadow-2xl p-6 border border-gray-800">
          <h1 className="text-2xl font-bold text-white mb-6">Log Training Session</h1>

          {error && (
            <div className="mb-6 p-4 bg-red-900/30 border border-red-800 rounded-lg">
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Date */}
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-300 mb-2">
                Date
              </label>
              <input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
                className="w-full px-4 py-3 bg-gi-dark border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition"
              />
            </div>

            {/* Gym */}
            <div>
              <label htmlFor="gym" className="block text-sm font-medium text-gray-300 mb-2">
                Gym
              </label>
              <input
                id="gym"
                type="text"
                value={formData.gym}
                onChange={(e) => setFormData({ ...formData, gym: e.target.value })}
                required
                placeholder="Gym name"
                className="w-full px-4 py-3 bg-gi-dark border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition"
              />
            </div>

            {/* Gi Type */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Type
              </label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, giType: 'gi' })}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                    formData.giType === 'gi'
                      ? 'bg-belt-blue text-white ring-2 ring-belt-blue/50 shadow-lg'
                      : 'bg-gi-dark text-gray-300 hover:bg-mat-900 border border-gray-800'
                  }`}
                >
                  Gi
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, giType: 'nogi' })}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                    formData.giType === 'nogi'
                      ? 'bg-belt-purple text-white ring-2 ring-belt-purple/50 shadow-lg'
                      : 'bg-gi-dark text-gray-300 hover:bg-mat-900 border border-gray-800'
                  }`}
                >
                  No-Gi
                </button>
              </div>
            </div>

            {/* Duration */}
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-300 mb-2">
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
                className="w-full px-4 py-3 bg-gi-dark border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition"
              />
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-300 mb-2">
                Notes (optional)
              </label>
              <textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={4}
                placeholder="What did you work on today?"
                className="w-full px-4 py-3 bg-gi-dark border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent resize-none transition"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 focus:ring-offset-gi-dark shadow-lg"
            >
              {loading ? 'Saving...' : 'Save Session'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
