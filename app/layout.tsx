import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'NovaCall - AI Phone Assistant',
  description: 'Real-time conversational assistant for outbound phone calls',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
