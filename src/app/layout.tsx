import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Claude Code Font Generator',
  description: 'Generate text in the Claude Code styling font using the classic ANSI Shadow ASCII art style. Export as PNG, SVG, or text.',
  keywords: ['Claude Code', 'ANSI Shadow', 'ASCII art', 'font generator', 'Claude styling', 'text art'],
  authors: [{ name: 'Claude Code Font Generator' }],
  creator: 'Claude Code Font Generator',
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    title: 'Claude Code Font Generator',
    description: 'Generate text in the Claude Code styling font using the classic ANSI Shadow ASCII art style. Export as PNG, SVG, or text.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}