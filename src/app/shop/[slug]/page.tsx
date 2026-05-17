import { notFound }  from 'next/navigation'
import { prisma }    from '@/lib/prisma'
import { Footer }   from '@/components/layout/Footer'
import { ProductDetailClient } from '@/components/shop/ProductDetailClient'
import type { Metadata } from 'next'

interface Props { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await prisma.product.findUnique({ where: { slug: params.slug } })
  if (!product) return { title: 'Product Not Found' }
  return {
    title: product.name,
    description: product.description.slice(0, 160),
  }
}

export default async function ProductPage({ params }: Props) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug, isActive: true },
    include: {
      category: true,
      variants:  true,
      reviews: {
        include: { user: { select: { name: true, image: true } } },
        where:   { isVisible: true },
        orderBy: { createdAt: 'desc' },
        take: 20,
      },
    },
  })
  if (!product) notFound()

  // Related products in same category
  const related = await prisma.product.findMany({
    where: { categoryId: product.categoryId, isActive: true, NOT: { id: product.id } },
    include: { category: true },
    take: 4,
  })

  const avgRating = product.reviews.length
    ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length
    : 0

  return (
    <>
      <ProductDetailClient
        product={JSON.parse(JSON.stringify({ ...product, averageRating: avgRating, reviewCount: product.reviews.length }))}
        related={JSON.parse(JSON.stringify(related))}
      />
      <Footer />
    </>
  )
}
