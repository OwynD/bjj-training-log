'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { SessionCard } from '@/components/SessionCard'
import { Navigation } from '@/components/Navigation'
import type { Database } from '@/lib/database.types'

export const dynamic = 'force-dynamic'

type Session = Database['public']['Tables']['sessions']['Row']
type Profile = Database['public']['Tables']['profiles']['Row']

type SessionWithProfile = Session & {
  profiles: Profile
}

export default function FeedPage() {
  const supabase = createClient()
  const [sessions, setSessions] = useState<SessionWithProfile[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadFeed()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function loadFeed() {
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
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) throw error
      setSessions(data as SessionWithProfile[])
    } catch (error) {
      // Silently fail in preview mode
      if (process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder')) {
        // Preview mode - no real database
      } else {
        console.error('Error loading feed:', error)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-surface-base pb-24 md:pb-4">
        <div className="max-w-4xl mx-auto px-4 pt-24 md:pt-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-text-primary mb-1">Feed</h1>
            <p className="text-sm text-text-tertiary">See what everyone&apos;s been training</p>
          </div>

          {/* Feed */}
          {loading ? (
            <div className="text-center py-16">
              <div className="inline-block w-6 h-6 border-2 border-border-subtle border-t-accent-gold rounded-full animate-spin"></div>
              <p className="text-sm text-text-tertiary mt-3">Loading feed...</p>
            </div>
          ) : sessions.length === 0 ? (
            <div className="text-center py-16 bg-surface-elevated rounded-lg border border-border-subtle">
              <svg className="w-12 h-12 text-text-tertiary mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <h3 className="text-sm font-medium text-text-primary mb-1">No training sessions yet</h3>
              <p className="text-sm text-text-tertiary mb-6">Be the first to log a training session!</p>
              <Link
                href="/sessions/new"
                className="inline-flex items-center gap-2 bg-accent-gold hover:bg-accent-gold/90 text-surface-base text-sm font-medium px-4 py-2 rounded-md transition-colors"
              >
                Log a Session
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {sessions.map((session) => (
                <SessionCard
                  key={session.id}
                  session={session}
                  showUser={true}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
