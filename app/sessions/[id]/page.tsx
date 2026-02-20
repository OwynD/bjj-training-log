'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Navigation } from '@/components/Navigation'
import type { Database } from '@/lib/database.types'

export const dynamic = 'force-dynamic'

type Session = Database['public']['Tables']['sessions']['Row']
type Profile = Database['public']['Tables']['profiles']['Row']

type SessionWithProfile = Session & {
  profiles: Profile
}

export default function SessionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const supabase = createClient()
  const [session, setSession] = useState<SessionWithProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    loadSession()
    loadCurrentUser()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id])

  async function loadCurrentUser() {
    try {
      if (!supabase) return
      const { data: { user } } = await supabase.auth.getUser()
      setCurrentUserId(user?.id || null)
    } catch (error) {
      // Silently fail in preview mode
    }
  }

  async function loadSession() {
    try {
      // Skip if no valid Supabase client
      if (!supabase) {
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('sessions')
        .select(`
          *,
          profiles!user_id (
            id,
            display_name,
            created_at
          )
        `)
        .eq('id', params.id as string)
        .single()

      if (error) {
        // Don't throw on "not found" - that's expected
        if (error.code !== 'PGRST116') {
          throw error
        }
        return
      }
      setSession(data as SessionWithProfile)
    } catch (error) {
      // Silently fail in preview mode
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder')) {
        console.error('Error loading session:', error)
      }
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this session?')) return

    setDeleting(true)
    try {
      const { error } = await supabase
        .from('sessions')
        .delete()
        .eq('id', params.id as string)

      if (error) throw error

      router.push('/my-log')
    } catch (error) {
      console.error('Error deleting session:', error)
      alert('Failed to delete session')
      setDeleting(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date)
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const canDelete = session && currentUserId === session.user_id

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-surface-base pb-24 md:pb-4">
        <div className="max-w-3xl mx-auto px-4 pt-24 md:pt-8">
          {loading ? (
            <div className="text-center py-16">
              <div className="inline-block w-6 h-6 border-2 border-border-subtle border-t-accent-gold rounded-full animate-spin"></div>
              <p className="text-sm text-text-tertiary mt-3">Loading session...</p>
            </div>
          ) : !session ? (
            <div className="text-center py-16 bg-surface-elevated rounded-lg border border-border-subtle">
              <h3 className="text-sm font-medium text-text-primary mb-1">Session not found</h3>
              <p className="text-sm text-text-tertiary mb-6">This session may have been deleted.</p>
              <button
                onClick={() => router.back()}
                className="text-sm text-accent-gold hover:text-accent-gold/80 transition-colors"
              >
                Go back
              </button>
            </div>
          ) : (
            <>
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

              <div className="bg-surface-elevated rounded-lg border border-border-subtle overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-border-subtle">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h1 className="text-xl font-semibold text-text-primary mb-1">{session.gym}</h1>
                      <p className="text-sm text-text-tertiary">{formatDate(session.date)}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-md text-xs font-medium ring-1 ring-inset ${
                      session.gi_type === 'gi' 
                        ? 'bg-accent-blue/10 text-accent-blue ring-accent-blue/20' 
                        : 'bg-accent-purple/10 text-accent-purple ring-accent-purple/20'
                    }`}>
                      {session.gi_type === 'gi' ? 'Gi' : 'No-Gi'}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-text-secondary">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>{session.profiles.display_name}</span>
                    </div>
                    <span className="text-border-strong">•</span>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="tabular-nums">{session.duration_min} min</span>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="p-6 space-y-6">
                  {session.notes && (
                    <div>
                      <h2 className="text-xs font-medium text-text-tertiary uppercase tracking-wider mb-3">
                        Notes
                      </h2>
                      <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">{session.notes}</p>
                    </div>
                  )}

                  <div className="pt-6 border-t border-border-subtle">
                    <p className="text-xs text-text-tertiary">
                      Logged on {formatDate(session.created_at)} at {formatTime(session.created_at)}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                {canDelete && (
                  <div className="p-4 border-t border-border-subtle bg-surface-higher">
                    <button
                      onClick={handleDelete}
                      disabled={deleting}
                      className="text-xs text-red-400 hover:text-red-300 disabled:text-text-tertiary disabled:cursor-not-allowed transition-colors font-medium"
                    >
                      {deleting ? 'Deleting...' : 'Delete Session'}
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
