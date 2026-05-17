import { prisma } from '@/lib/prisma'
import { CombosClient } from '@/components/shop/CombosClient'
import { Footer } from '@/components/layout/Footer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gift Combos — Curated Collections',
  description: 'Browse WrapLove\'s expertly curated gift combo sets for every occasion.',
}

export default async function CombosPage({
  searchParams,
}: {
  searchParams: { occasion?: string }
}) {
  const combos = await prisma.combo.findMany({
    where: { isActive: true },
    include: {
      products: {
        include: { product: { include: { category: true } } },
      },
    },
    orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
  })

  return (
    <>
      <CombosClient
        combos={JSON.parse(JSON.stringify(combos))}
        initialOccasion={searchParams.occasion}
      />
      <Footer />
    </>
  )
}
