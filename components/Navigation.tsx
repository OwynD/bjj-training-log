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
    <nav className="bg-gray-800 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/feed" className="text-xl font-bold text-white">
              BJJ Log
            </Link>
            <div className="hidden md:flex items-center gap-4">
              {navItems.map((item) => (
                item.primary ? (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      pathname === item.href
                        ? 'bg-gray-700 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
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
            className="text-gray-400 hover:text-white text-sm transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-gray-700 px-4 py-3 flex gap-2">
        {navItems.map((item) => (
          item.primary ? (
            <Link
              key={item.href}
              href={item.href}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-center transition-colors text-sm"
            >
              {item.label}
            </Link>
          ) : (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium text-center transition-colors ${
                pathname === item.href
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
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
