import type { Metadata } from 'next'
// eslint-disable-next-line camelcase
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'
import { Providers } from '@/components/providers'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Personal Finance Manager | Track Your 70/30 Budget Rule',
  description:
    'Take control of your finances with our personal expense tracker. Manage your budget using the 70/30 rule, track expenses, and visualize spending patterns.',
  keywords:
    'personal finance, expense tracker, budget management, 70/30 rule, financial planning, money management, spending tracker',
  openGraph: {
    title: 'Personal Finance Manager | Smart Budget Tracking',
    description:
      'Manage your personal finances efficiently with our expense tracking tool. Features budget distribution, expense categorization, and spending analytics.',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Personal Finance Manager Dashboard',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Personal Finance Manager',
    description: 'Smart personal finance tracking with the 70/30 budget rule',
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
        <Toaster richColors />
      </body>
    </html>
  )
}
