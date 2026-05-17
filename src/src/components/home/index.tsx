'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useInView } from 'react-intersection-observer'
import { ProductCard } from '@/components/shop/ProductCard'
import { formatPrice, cn } from '@/lib/utils'
import { useCartStore } from '@/store'
import type { Product, Combo } from '@/types'
import { useState } from 'react'
import { Heart, Check } from 'lucide-react'

// ─── MARQUEE BANNER ───────────────────────────────────────────────────────────
const MARQUEE_ITEMS = [
  '🌸 Handcrafted with Love',
  '✦ Free Delivery over ₹999',
  '🎁 Custom Gift Builder',
  '💌 Personalized Cards',
  '⭐ 4.9 Star Rated',
  '🚀 48hr Delivery',
  '🌿 Eco-Friendly Packaging',
  '💎 Premium Quality',
]

export function MarqueeBanner() {
  const content = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS]
  return (
    <div className="bg-brand-dark text-white py-3 overflow-hidden">
      <div className="marquee-track">
        {content.map((item, i) => (
          <span key={i} className="text-sm font-medium whitespace-nowrap px-8 text-white/80">
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

// ─── CATEGORIES SECTION ───────────────────────────────────────────────────────
const CATEGORIES = [
  { emoji: '🎂', name: 'Birthday Magic',    slug: 'Birthday',  count: 24, bg: '#FFF5F8' },
  { emoji: '🌹', name: 'Romantic Surprise', slug: 'Romance',   count: 18, bg: '#FFF0F5' },
  { emoji: '🫶', name: 'Bestie Hampers',    slug: 'BestFriend',count: 31, bg: '#F5F0FF' },
  { emoji: '💎', name: 'Minimal Luxury',    slug: 'Luxury',    count: 15, bg: '#FFFFF5' },
  { emoji: '🕯️', name: 'Cozy & Comfort',   slug: 'Cozy',      count: 22, bg: '#F0FFF5' },
  { emoji: '✨', name: 'Surprise Me!',       slug: 'quiz',      count: 0,  bg: '#FFF5F8' },
]

export function CategoriesSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section className="section-pad" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <div className="section-tag">Browse By Occasion</div>
          <h2 className="font-display text-display-md font-semibold mt-2 mb-3">
            Find the <em className="text-rose not-italic">Perfect Vibe</em>
          </h2>
          <p className="text-brand-muted max-w-md mx-auto">
            Every moment deserves something beautiful. Choose your occasion and we'll find the ideal gift.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.07 }}
            >
              <Link
                href={cat.slug === 'quiz' ? '/quiz' : `/combos?occasion=${cat.slug}`}
                className="block group"
              >
                <div
                  className="rounded-3xl p-5 text-center hover:shadow-card transition-all duration-300
                             hover:-translate-y-1 border-2 border-transparent hover:border-blush-200"
                  style={{ background: cat.bg }}
                >
                  <motion.span
                    className="text-4xl block mb-3"
                    animate={{ rotate: [0, -5, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 4, delay: i * 0.5 }}
                  >
                    {cat.emoji}
                  </motion.span>
                  <p className="text-sm font-medium text-brand-dark mb-1">{cat.name}</p>
                  {cat.count > 0 && (
                    <p className="text-xs text-brand-muted">{cat.count} combos</p>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── FEATURED PRODUCTS ────────────────────────────────────────────────────────
export function FeaturedProducts({ products }: { products: Product[] }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <section className="section-pad bg-white" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <div className="section-tag">Our Bestsellers</div>
          <h2 className="font-display text-display-md font-semibold mt-2 mb-3">
            They're All <em className="text-rose not-italic">Obsessed</em>
          </h2>
          <p className="text-brand-muted max-w-md mx-auto">
            The items your friends are already jealous about.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.08 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Link href="/shop" className="btn-outline btn-lg">
            View All Products →
          </Link>
        </div>
      </div>
    </section>
  )
}

// ─── BUILDER CTA ──────────────────────────────────────────────────────────────
export function BuilderCTA() {
  return (
    <section className="px-4 sm:px-8 lg:px-16 py-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-brand rounded-4xl p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
          {/* Decorative */}
          <div className="absolute text-[120px] opacity-[0.07] right-48 top-1/2 -translate-y-1/2 pointer-events-none select-none">
            ✦
          </div>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
            className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full"
          />

          <div className="relative z-10">
            <p className="text-xs font-medium uppercase tracking-widest text-brand-dark/60 mb-2">
              Interactive Builder
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-brand-dark mb-2">
              Build Your Dream Gift Box 🎁
            </h2>
            <p className="text-brand-muted max-w-sm">
              Pick items, personalize, preview — and we'll pack it with love and ribbon.
            </p>
          </div>

          <Link href="/builder" className="btn-secondary btn-lg relative z-10 whitespace-nowrap flex-shrink-0">
            Start Building ✦
          </Link>
        </div>
      </div>
    </section>
  )
}

// ─── COMBO SHOWCASE ───────────────────────────────────────────────────────────
const COMBO_GRADIENTS = [
  'linear-gradient(135deg,#FFE4E8,#FFD6E7)',
  'linear-gradient(135deg,#FFF0D6,#FFE4C4)',
  'linear-gradient(135deg,#F0E6FF,#FFE0F0)',
  'linear-gradient(135deg,#E8E8E8,#D4D0C8)',
  'linear-gradient(135deg,#E0F0E0,#F0FFE8)',
  'linear-gradient(135deg,#FFE4F0,#FFD6E8)',
]

function ComboCard({ combo, index }: { combo: Combo; index: number }) {
  const { addCombo } = useCartStore()
  const [added, setAdded] = useState(false)
  const [ref, inView] = useInView({ triggerOnce: true })

  const handleAdd = () => {
    addCombo(combo)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.08 }}
      className="bg-white rounded-3xl overflow-hidden shadow-card hover:shadow-hover hover:-translate-y-1 transition-all duration-300"
    >
      <div
        className="h-40 flex items-center justify-center text-5xl gap-3 relative overflow-hidden"
        style={{ background: COMBO_GRADIENTS[index % COMBO_GRADIENTS.length] }}
      >
        {[...combo.emoji].slice(0, 2).map((e, i) => (
          <motion.span
            key={i}
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 3, delay: i * 0.8 }}
          >
            {e}
          </motion.span>
        ))}
      </div>
      <div className="p-5">
        <h3 className="font-display text-lg font-semibold text-brand-dark mb-1">{combo.name}</h3>
        <p className="text-xs text-brand-muted mb-4 line-clamp-2">{combo.description}</p>
        <div className="flex items-center justify-between">
          <span className="font-display text-xl font-semibold text-brand-dark">
            {formatPrice(combo.price)}
          </span>
          <button
            onClick={handleAdd}
            className={cn(
              'flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all',
              added
                ? 'bg-sage-100 text-sage-400'
                : 'bg-rose text-white hover:bg-rose-400 hover:shadow-glow'
            )}
          >
            {added ? <><Check size={14} /> Added!</> : '🛒 Add Combo'}
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export function ComboShowcase({ combos }: { combos: Combo[] }) {
  return (
    <section className="section-pad bg-beige-100/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <div className="section-tag">Curated Combos</div>
          <h2 className="font-display text-display-md font-semibold mt-2 mb-3">
            Ready-Made <em className="text-rose not-italic">Magic</em>
          </h2>
          <p className="text-brand-muted max-w-md mx-auto">
            Expertly curated combinations for every vibe and occasion.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {combos.map((combo, i) => (
            <ComboCard key={combo.id} combo={combo} index={i} />
          ))}
        </div>

        <div className="text-center">
          <Link href="/combos" className="btn-outline btn-lg">View All Combos →</Link>
        </div>
      </div>
    </section>
  )
}

// ─── QUIZ CTA ─────────────────────────────────────────────────────────────────
export function QuizCTA() {
  return (
    <section className="section-pad bg-white">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-lavender-100 to-blush-100 rounded-4xl p-10 relative overflow-hidden"
        >
          <div className="absolute inset-0 pointer-events-none">
            <div className="blob w-48 h-48 bg-lavender-300 opacity-20 top-0 right-0" />
            <div className="blob w-32 h-32 bg-blush-300 opacity-20 bottom-0 left-0" />
          </div>
          <div className="relative z-10">
            <div className="text-5xl mb-4">🎯</div>
            <h2 className="font-display text-display-sm font-semibold text-brand-dark mb-3">
              Not Sure What to Gift?
            </h2>
            <p className="text-brand-muted mb-8 max-w-md mx-auto">
              Take our 3-question gift quiz and we'll recommend the perfect hamper — tailored
              specifically to your person and occasion.
            </p>
            <Link href="/quiz" className="btn-primary btn-lg">
              Take the Gift Quiz ✨
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ─── TESTIMONIALS ─────────────────────────────────────────────────────────────
const TESTIMONIALS = [
  { stars: 5, text: 'The packaging alone made me cry! My girlfriend absolutely loved every single thing in the box. Will definitely order again and again.', author: 'Priya M.', label: 'Birthday Gift', init: 'PM', bg: '#FFF5F8' },
  { stars: 5, text: "I ordered the BFF Hamper for my best friend's birthday and she couldn't stop gushing. The quality is absolutely outstanding!", author: 'Riya S.', label: 'BFF Hamper', init: 'RS', bg: '#F5F0FF' },
  { stars: 5, text: 'Minimal Luxe combo is gorgeous. The pearl earrings alone are worth more than what I paid! Packaging is so aesthetic.', author: 'Ananya K.', label: 'Minimal Luxe', init: 'AK', bg: '#FFFFF5' },
  { stars: 5, text: 'Super quick delivery and the personalized card made it extra special. 10/10 would recommend to every single person I know!', author: 'Sana R.', label: 'Quick Delivery', init: 'SR', bg: '#F0FFF5' },
  { stars: 5, text: "Built a custom hamper for my mom and it was the most beautiful gift I've ever given. She literally put it on display in the living room!", author: 'Meera T.', label: 'Custom Builder', init: 'MT', bg: '#FFF0F5' },
]

export function TestimonialsSection() {
  return (
    <section className="section-pad">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <div className="section-tag">Love Notes 💌</div>
          <h2 className="font-display text-display-md font-semibold mt-2">
            What Our Customers Say
          </h2>
        </div>

        <div className="flex gap-5 overflow-x-auto snap-x-mandatory scrollbar-hide pb-4">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl p-6 min-w-[280px] max-w-[280px] snap-start flex-shrink-0 shadow-card"
            >
              <div className="flex gap-0.5 mb-4">
                {[...Array(t.stars)].map((_, si) => (
                  <span key={si} className="text-gold text-sm">🌸</span>
                ))}
              </div>
              <p className="text-sm text-brand-muted leading-relaxed mb-5 italic">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-rose flex-shrink-0"
                  style={{ background: t.bg }}
                >
                  {t.init}
                </div>
                <div>
                  <p className="text-sm font-medium text-brand-dark">{t.author}</p>
                  <p className="text-xs text-brand-muted">{t.label}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── INSTAGRAM GALLERY ────────────────────────────────────────────────────────
const GALLERY_EMOJIS = ['🌸', '🎁', '💎', '🕯️', '📸', '🫶', '🌹', '✨', '🎀']

export function InstagramGallery() {
  return (
    <section className="section-pad bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <div className="section-tag">@wraplove.in</div>
          <h2 className="font-display text-display-md font-semibold mt-2 mb-3">
            Follow Our <em className="text-rose not-italic">Journey</em>
          </h2>
          <p className="text-brand-muted">Tag us in your unboxing moments for a chance to be featured!</p>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-9 gap-2">
          {GALLERY_EMOJIS.map((emoji, i) => (
            <motion.a
              key={i}
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              className="aspect-square rounded-2xl flex items-center justify-center text-3xl sm:text-4xl
                         bg-gradient-to-br from-cream to-beige-200 hover:shadow-card transition-shadow duration-300"
            >
              {emoji}
            </motion.a>
          ))}
        </div>

        <div className="text-center mt-8">
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="btn-outline btn-lg">
            📸 Follow on Instagram
          </a>
        </div>
      </div>
    </section>
  )
}
