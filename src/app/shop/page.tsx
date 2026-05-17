import { Suspense } from 'react'
import { prisma }   from '@/lib/prisma'
import { ShopClient } from '@/components/shop/ShopClient'
import { Footer }   from '@/components/layout/Footer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Shop — All Products',
  description: 'Browse WrapLove\'s full collection of handcrafted gifts, jewellery, candles, and more.',
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined }
}) {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: { isActive: true },
      include: {
        category: true,
        reviews: { select: { rating: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.category.findMany({ orderBy: { sortOrder: 'asc' } }),
  ])

  const enriched = products.map((p) => ({
    ...p,
    averageRating: p.reviews.length
      ? p.reviews.reduce((s, r) => s + r.rating, 0) / p.reviews.length
      : null,
    reviewCount: p.reviews.length,
    reviews: undefined,
  }))

  return (
    <>
      <ShopClient
        initialProducts={JSON.parse(JSON.stringify(enriched))}
        categories={JSON.parse(JSON.stringify(categories))}
        initialSearch={searchParams.search}
        initialCategory={searchParams.category}
      />
      <Footer />
    </>
  )
}
