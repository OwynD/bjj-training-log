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
      <div className="min-h-screen bg-gradient-to-b from-gi-black to-gi-dark p-4">
        <div className="max-w-4xl mx-auto pt-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Group Feed</h1>
            <p className="text-gray-400">See what everyone&apos;s been training</p>
          </div>

          {/* Feed */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-gray-700 border-t-gold-500 rounded-full animate-spin"></div>
              <p className="text-gray-400 mt-4">Loading feed...</p>
            </div>
          ) : sessions.length === 0 ? (
            <div className="text-center py-12 bg-gi-darker rounded-lg border border-gray-800">
              <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <h3 className="text-xl font-semibold text-white mb-2">No training sessions yet</h3>
              <p className="text-gray-400 mb-6">Be the first to log a training session!</p>
              <Link
                href="/sessions/new"
                className="inline-block bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-white font-semibold py-2 px-6 rounded-lg transition-all shadow-md hover:shadow-lg"
              >
                Log a Session
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
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
