import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'BJJ Training Log',
  description: 'Track your BJJ training sessions with your team',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
