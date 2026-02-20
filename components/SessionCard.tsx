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
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    }).format(date)
  }

  return (
    <Link 
      href={`/sessions/${session.id}`}
      className="group block rounded-lg border border-border-subtle bg-surface-elevated p-4 transition-all hover:border-border-default hover:bg-surface-higher active:scale-[0.99]"
    >
      {/* Header */}
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-medium text-text-primary">
            {session.gym}
          </h3>
          {showUser && session.profiles && (
            <p className="mt-0.5 text-xs text-text-tertiary">{session.profiles.display_name}</p>
          )}
        </div>
        
        <div className="flex shrink-0 items-center gap-2">
          <span className={`
            inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium
            ${session.gi_type === 'gi' 
              ? 'bg-accent-blue/10 text-accent-blue ring-1 ring-inset ring-accent-blue/20' 
              : 'bg-accent-purple/10 text-accent-purple ring-1 ring-inset ring-accent-purple/20'
            }
          `}>
            {session.gi_type === 'gi' ? 'Gi' : 'No-Gi'}
          </span>
        </div>
      </div>

      {/* Meta */}
      <div className="flex items-center gap-4 text-xs text-text-secondary">
        <div className="flex items-center gap-1.5 tabular-nums">
          <svg className="h-3.5 w-3.5 text-text-tertiary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{session.duration_min}m</span>
        </div>
        
        <div className="flex items-center gap-1.5">
          <svg className="h-3.5 w-3.5 text-text-tertiary" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
          </svg>
          <span>{formatDate(session.date)}</span>
        </div>
      </div>

      {/* Notes preview */}
      {session.notes && (
        <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-text-tertiary">
          {session.notes}
        </p>
      )}

      {/* Actions */}
      {onDelete && (
        <div className="mt-3 flex items-center gap-2 border-t border-border-subtle pt-3">
          <button
            onClick={(e) => {
              e.preventDefault()
              onDelete(session.id)
            }}
            disabled={isDeleting}
            className="text-xs text-red-400 transition-colors hover:text-red-300 disabled:cursor-not-allowed disabled:text-text-tertiary"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      )}
    </Link>
  )
}
