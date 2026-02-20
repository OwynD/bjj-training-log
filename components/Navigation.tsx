'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const navItems = [
    { href: '/feed', label: 'Feed', icon: '⚡' },
    { href: '/my-log', label: 'Log', icon: '📓' },
  ]

  return (
    <nav className="sticky top-0 z-50 border-b border-border-subtle bg-surface-base backdrop-blur-xl">
      <div className="mx-auto max-w-md px-4">
        {/* Desktop/Tablet Header */}
        <div className="flex h-14 items-center justify-between">
          <Link href="/feed" className="text-sm font-semibold text-text-primary tracking-tight">
            BJJ Log
          </Link>
          
          {/* Desktop Nav */}
          <div className="hidden sm:flex items-center gap-1.5">
            <div className="flex items-center gap-0.5 rounded-lg bg-surface-elevated p-0.5">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    relative px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200
                    ${pathname === item.href
                      ? 'bg-surface-higher text-text-primary shadow-sm'
                      : 'text-text-tertiary hover:text-text-secondary'
                    }
                  `}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            
            <Link
              href="/sessions/new"
              className="ml-2 flex items-center gap-1.5 rounded-lg bg-accent-gold px-3 py-1.5 text-xs font-medium text-surface-base transition-colors hover:bg-accent-gold-hover"
            >
              <span>+</span>
              <span>New</span>
            </Link>
          </div>

          <button
            onClick={handleSignOut}
            className="hidden sm:block text-xs text-text-tertiary hover:text-text-secondary transition-colors"
          >
            Sign out
          </button>
        </div>

        {/* Mobile Bottom Nav */}
        <div className="sm:hidden fixed bottom-0 left-0 right-0 border-t border-border-subtle bg-surface-base backdrop-blur-xl px-4 pb-safe">
          <div className="mx-auto max-w-md">
            <div className="grid grid-cols-3 gap-2 py-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex flex-col items-center gap-1 rounded-lg py-2 transition-colors
                    ${pathname === item.href
                      ? 'text-text-primary'
                      : 'text-text-tertiary active:bg-surface-elevated'
                    }
                  `}
                >
                  <span className="text-base">{item.icon}</span>
                  <span className="text-xs font-medium">{item.label}</span>
                </Link>
              ))}
              
              <Link
                href="/sessions/new"
                className="flex flex-col items-center gap-1 rounded-lg bg-accent-gold py-2 text-surface-base transition-colors active:bg-accent-gold-hover"
              >
                <span className="text-base font-semibold">+</span>
                <span className="text-xs font-medium">Log</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
