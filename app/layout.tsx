import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'Zash · La billetera para Rosa',
  description:
    'Billetera virtual pensada para personas mayores y jubilados. Letras grandes, voz que confirma, sin anuncios. Prototipo interactivo con operaciones simuladas.',
  icons: { icon: '/icon.svg' },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#0B2A66',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es-AR" className={inter.variable}>
      <body className="antialiased">{children}</body>
    </html>
  )
}
