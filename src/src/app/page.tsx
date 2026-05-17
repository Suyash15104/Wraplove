import { HeroSection }        from '@/components/home/HeroSection'
import { MarqueeBanner }       from '@/components/home/MarqueeBanner'
import { CategoriesSection }   from '@/components/home/CategoriesSection'
import { FeaturedProducts }    from '@/components/home/FeaturedProducts'
import { BuilderCTA }          from '@/components/home/BuilderCTA'
import { ComboShowcase }       from '@/components/home/ComboShowcase'
import { QuizCTA }             from '@/components/home/QuizCTA'
import { TestimonialsSection } from '@/components/home/TestimonialsSection'
import { InstagramGallery }    from '@/components/home/InstagramGallery'
import { Footer }              from '@/components/layout/Footer'
import { prisma }              from '@/lib/prisma'

export default async function HomePage() {
  const [featuredProducts, featuredCombos] = await Promise.all([
    prisma.product.findMany({
      where: { isFeatured: true, isActive: true },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
      take: 8,
    }),
    prisma.combo.findMany({
      where: { isFeatured: true, isActive: true },
      include: { products: { include: { product: { include: { category: true } } } } },
      orderBy: { createdAt: 'desc' },
      take: 6,
    }),
  ])

  return (
    <>
      <HeroSection />
      <MarqueeBanner />
      <CategoriesSection />
      <FeaturedProducts products={JSON.parse(JSON.stringify(featuredProducts))} />
      <BuilderCTA />
      <ComboShowcase combos={JSON.parse(JSON.stringify(featuredCombos))} />
      <QuizCTA />
      <TestimonialsSection />
      <InstagramGallery />
      <Footer />
    </>
  )
}
