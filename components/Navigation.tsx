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
    { href: '/feed', label: 'Feed' },
    { href: '/my-log', label: 'My Log' },
    { href: '/sessions/new', label: 'Log Session', primary: true },
  ]

  return (
    <nav className="bg-gi-darker border-b border-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/feed" className="text-xl font-bold text-white tracking-tight">
              BJJ Log
            </Link>
            <div className="hidden md:flex items-center gap-4">
              {navItems.map((item) => (
                item.primary ? (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-md hover:shadow-lg"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      pathname === item.href
                        ? 'bg-gi-dark text-gold-400 border border-gold-600/30'
                        : 'text-gray-300 hover:bg-gi-dark hover:text-white'
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              ))}
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="text-gray-400 hover:text-gold-400 text-sm transition-colors font-medium"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-gray-800 px-4 py-3 flex gap-2">
        {navItems.map((item) => (
          item.primary ? (
            <Link
              key={item.href}
              href={item.href}
              className="flex-1 bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-white px-4 py-2 rounded-lg font-medium text-center transition-all text-sm"
            >
              {item.label}
            </Link>
          ) : (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium text-center transition-colors ${
                pathname === item.href
                  ? 'bg-gi-dark text-gold-400 border border-gold-600/30'
                  : 'text-gray-300 hover:bg-gi-dark hover:text-white'
              }`}
            >
              {item.label}
            </Link>
          )
        ))}
      </div>
    </nav>
  )
}
