import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Office Vibe Connector',
  description: 'オフィスの雰囲気を可視化し、交流を促進するアプリ',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>
        {children}
      </body>
    </html>
  )
}
