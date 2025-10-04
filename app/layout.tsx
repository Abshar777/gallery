import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { Toaster } from 'sonner'

export const metadata: Metadata = {
  title: 'gallery',
  description: ' gallery',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans dark ${GeistSans.variable} ${GeistMono.variable}`}>
        <Toaster position="bottom-right" richColors />
        {children}
      </body>
    </html>
  )
}
