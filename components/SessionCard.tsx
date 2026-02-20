import Link from 'next/link'
import type { Database } from '@/lib/database.types'

type Session = Database['public']['Tables']['sessions']['Row']
type Profile = Database['public']['Tables']['profiles']['Row']

interface SessionCardProps {
  session: Session & {
    profiles?: Profile
  }
  showUser?: boolean
  onDelete?: (id: string) => void
  isDeleting?: boolean
}

export function SessionCard({ session, showUser = false, onDelete, isDeleting = false }: SessionCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(date)
  }

  return (
    <div className="bg-gi-darker rounded-lg p-5 border border-gray-800 hover:border-gold-600/50 transition-all duration-200 hover:shadow-lg hover:shadow-gold-900/20">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h3 className="text-lg font-semibold text-white">
              {session.gym}
            </h3>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
              session.gi_type === 'gi' 
                ? 'bg-belt-blue/20 text-belt-blue border border-belt-blue/30' 
                : 'bg-belt-purple/20 text-belt-purple border border-belt-purple/30'
            }`}>
              {session.gi_type === 'gi' ? 'Gi' : 'No-Gi'}
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-400">
            <time>{formatDate(session.date)}</time>
            {showUser && session.profiles && (
              <>
                <span>•</span>
                <span>{session.profiles.display_name}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-gray-300">
          <svg className="w-5 h-5 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm">{session.duration_min} minutes</span>
        </div>

        {session.notes && (
          <p className="text-gray-400 text-sm mt-3 line-clamp-2">
            {session.notes}
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-800">
        <Link
          href={`/sessions/${session.id}`}
          className="text-sm text-gold-400 hover:text-gold-300 transition-colors font-medium"
        >
          View details
        </Link>
        {onDelete && (
          <>
            <span className="text-gray-700">•</span>
            <button
              onClick={() => onDelete(session.id)}
              disabled={isDeleting}
              className="text-sm text-red-400 hover:text-red-300 disabled:text-gray-600 disabled:cursor-not-allowed transition-colors"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
