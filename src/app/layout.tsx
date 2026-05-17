import type { Metadata } from 'next'
import { Playfair_Display, DM_Sans } from 'next/font/google'
import '@/styles/globals.css'
import { Providers } from './providers'
import { Navbar } from '@/components/layout/Navbar'
import { CartDrawer } from '@/components/layout/CartDrawer'
import { Toaster } from 'react-hot-toast'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'WrapLove — Premium Gifting Studio',
    template: '%s | WrapLove',
  },
  description:
    'Handcrafted gift boxes, aesthetic combos, and personalized hampers — designed to make someone feel truly seen and celebrated.',
  keywords: ['gift boxes', 'custom gifts', 'hampers', 'personalized gifts', 'gifting india'],
  authors: [{ name: 'WrapLove' }],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://wraplove.in',
    title: 'WrapLove — Premium Gifting Studio',
    description: 'Make every gift feel like a love letter.',
    siteName: 'WrapLove',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WrapLove — Premium Gifting Studio',
    description: 'Make every gift feel like a love letter.',
    images: ['/og-image.jpg'],
  },
  robots: { index: true, follow: true },
  themeColor: '#FAF7F2',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable}`}>
      <body className="font-sans bg-cream text-brand-dark antialiased">
        <Providers>
          <Navbar />
          <main className="pt-16">{children}</main>
          <CartDrawer />
          <Toaster
            position="bottom-center"
            toastOptions={{
              style: {
                background: '#2C1F14',
                color: '#FAF7F2',
                borderRadius: '100px',
                padding: '10px 20px',
                fontSize: '0.88rem',
              },
              success: { iconTheme: { primary: '#C8D8C0', secondary: '#2C1F14' } },
              error:   { iconTheme: { primary: '#E8849A', secondary: '#2C1F14' } },
            }}
          />
        </Providers>
      </body>
    </html>
  )
}
