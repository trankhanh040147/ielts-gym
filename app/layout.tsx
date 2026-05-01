import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'

const geist = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'IELTS Gym — Writing Task 2 Practice',
  description: 'AI-powered IELTS Writing Task 2 coaching for band 5.5–6.5 learners.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geist.className} min-h-screen bg-background antialiased`}>
        {children}
      </body>
    </html>
  )
}
