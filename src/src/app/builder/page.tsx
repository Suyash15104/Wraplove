import { prisma }        from '@/lib/prisma'
import { BuilderClient } from '@/components/builder/BuilderClient'
import { Footer }        from '@/components/layout/Footer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Build Your Gift Box',
  description: 'Drag, drop, and personalize your own custom gift hamper with WrapLove\'s interactive gift builder.',
}

export default async function BuilderPage() {
  const [boxThemes, products] = await Promise.all([
    prisma.boxTheme.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
    prisma.product.findMany({
      where: { isActive: true, isBuilderItem: true },
      include: { category: true },
      orderBy: { category: { sortOrder: 'asc' } },
    }),
  ])

  return (
    <>
      <BuilderClient
        boxThemes={JSON.parse(JSON.stringify(boxThemes))}
        products={JSON.parse(JSON.stringify(products))}
      />
      <Footer />
    </>
  )
}
