import { CheckoutClient } from '@/components/checkout/CheckoutClient'
import { Footer } from '@/components/layout/Footer'
import Script from 'next/script'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Checkout',
  description: 'Complete your WrapLove gift order.',
}

export default function CheckoutPage() {
  return (
    <>
      {/* Load Razorpay SDK */}
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="beforeInteractive" />
      <CheckoutClient />
      <Footer />
    </>
  )
}
