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
          profiles (
            id,
            display_name,
            created_at
          )
        `)
        .eq('id', params.id as string)
        .single()

      if (error) throw error
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
      <div className="min-h-screen bg-gray-900 p-4">
        <div className="max-w-3xl mx-auto pt-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-gray-600 border-t-blue-500 rounded-full animate-spin"></div>
              <p className="text-gray-400 mt-4">Loading session...</p>
            </div>
          ) : !session ? (
            <div className="text-center py-12 bg-gray-800 rounded-lg border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-2">Session not found</h3>
              <p className="text-gray-400 mb-6">This session may have been deleted.</p>
              <button
                onClick={() => router.back()}
                className="text-blue-400 hover:text-blue-300"
              >
                Go back
              </button>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <button
                  onClick={() => router.back()}
                  className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </button>
              </div>

              <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-gray-700">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h1 className="text-3xl font-bold text-white mb-2">{session.gym}</h1>
                      <p className="text-gray-400">{formatDate(session.date)}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      session.gi_type === 'gi' 
                        ? 'bg-blue-900/50 text-blue-200 border border-blue-700' 
                        : 'bg-purple-900/50 text-purple-200 border border-purple-700'
                    }`}>
                      {session.gi_type === 'gi' ? 'Gi' : 'No-Gi'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-gray-300">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>{session.profiles.display_name}</span>
                    </div>
                    <span className="text-gray-600">•</span>
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{session.duration_min} minutes</span>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="p-6 space-y-6">
                  {session.notes && (
                    <div>
                      <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
                        Notes
                      </h2>
                      <p className="text-gray-300 whitespace-pre-wrap">{session.notes}</p>
                    </div>
                  )}

                  <div className="pt-6 border-t border-gray-700">
                    <p className="text-sm text-gray-500">
                      Logged on {formatDate(session.created_at)} at {formatTime(session.created_at)}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                {canDelete && (
                  <div className="p-6 border-t border-gray-700 bg-gray-800/50">
                    <button
                      onClick={handleDelete}
                      disabled={deleting}
                      className="text-red-400 hover:text-red-300 disabled:text-gray-600 disabled:cursor-not-allowed transition-colors text-sm font-medium"
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
