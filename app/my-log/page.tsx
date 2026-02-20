'use client'

import { useEffect, useState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { SessionCard } from '@/components/SessionCard'
import { Navigation } from '@/components/Navigation'
import { Toast } from '@/components/Toast'
import type { Database } from '@/lib/database.types'

type Session = Database['public']['Tables']['sessions']['Row']

function MyLogContent() {
  const searchParams = useSearchParams()
  const supabase = createClient()
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [showToast, setShowToast] = useState(false)

  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      setShowToast(true)
    }
  }, [searchParams])

  useEffect(() => {
    loadSessions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function loadSessions() {
    try {
      // Skip if no valid Supabase client
      if (!supabase) {
        setLoading(false)
        return
      }

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setSessions(data || [])
    } catch (error) {
      // Silently fail in preview mode
      if (process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder')) {
        // Preview mode - no real database
      } else {
        console.error('Error loading sessions:', error)
      }
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this session?')) return

    setDeletingId(id)
    try {
      const { error } = await supabase
        .from('sessions')
        .delete()
        .eq('id', id)

      if (error) throw error

      setSessions(sessions.filter(s => s.id !== id))
    } catch (error) {
      console.error('Error deleting session:', error)
      alert('Failed to delete session')
    } finally {
      setDeletingId(null)
    }
  }

  // Calculate stats
  const totalSessions = sessions.length
  const totalMinutes = sessions.reduce((sum, s) => sum + s.duration_min, 0)
  const giSessions = sessions.filter(s => s.gi_type === 'gi').length
  const nogiSessions = sessions.filter(s => s.gi_type === 'nogi').length

  return (
    <div className="min-h-screen bg-surface-base pb-24 md:pb-4">
      <div className="max-w-4xl mx-auto px-4 pt-24 md:pt-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-text-primary mb-1">My Log</h1>
          <p className="text-sm text-text-tertiary">Track your progress and view your training history</p>
        </div>

        {/* Stats */}
        {!loading && totalSessions > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            <div className="bg-surface-elevated rounded-lg p-4 border border-border-subtle">
              <div className="text-2xl font-semibold tabular-nums text-text-primary mb-0.5">{totalSessions}</div>
              <div className="text-xs text-text-tertiary">Total Sessions</div>
            </div>
            <div className="bg-surface-elevated rounded-lg p-4 border border-border-subtle">
              <div className="text-2xl font-semibold tabular-nums text-text-primary mb-0.5">{Math.round(totalMinutes / 60)}h</div>
              <div className="text-xs text-text-tertiary">Total Time</div>
            </div>
            <div className="bg-surface-elevated rounded-lg p-4 border border-border-subtle">
              <div className="text-2xl font-semibold tabular-nums text-accent-blue mb-0.5">{giSessions}</div>
              <div className="text-xs text-text-tertiary">Gi Sessions</div>
            </div>
            <div className="bg-surface-elevated rounded-lg p-4 border border-border-subtle">
              <div className="text-2xl font-semibold tabular-nums text-accent-purple mb-0.5">{nogiSessions}</div>
              <div className="text-xs text-text-tertiary">No-Gi Sessions</div>
            </div>
          </div>
        )}

        {/* Sessions List */}
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block w-6 h-6 border-2 border-border-subtle border-t-accent-gold rounded-full animate-spin"></div>
            <p className="text-sm text-text-tertiary mt-3">Loading your sessions...</p>
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-16 bg-surface-elevated rounded-lg border border-border-subtle">
            <svg className="w-12 h-12 text-text-tertiary mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-sm font-medium text-text-primary mb-1">No sessions yet</h3>
            <p className="text-sm text-text-tertiary mb-6">Start logging your training to track your progress!</p>
            <Link
              href="/sessions/new"
              className="inline-flex items-center gap-2 bg-accent-gold hover:bg-accent-gold/90 text-surface-base text-sm font-medium px-4 py-2 rounded-md transition-colors"
            >
              Log Your First Session
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {sessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                onDelete={handleDelete}
                isDeleting={deletingId === session.id}
              />
            ))}
          </div>
        )}
      </div>

      {showToast && (
        <Toast
          message="Session logged successfully!"
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  )
}

export default function MyLogPage() {
  return (
    <>
      <Navigation />
      <Suspense fallback={
        <div className="min-h-screen bg-surface-base pb-24 md:pb-4">
          <div className="max-w-4xl mx-auto px-4 pt-24 md:pt-8 text-center">
            <div className="inline-block w-6 h-6 border-2 border-border-subtle border-t-accent-gold rounded-full animate-spin"></div>
          </div>
        </div>
      }>
        <MyLogContent />
      </Suspense>
    </>
  )
}
