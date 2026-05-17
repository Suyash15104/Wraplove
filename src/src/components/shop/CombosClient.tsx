'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Heart } from 'lucide-react'
import { useCartStore, useWishlistStore } from '@/store'
import { formatPrice, cn } from '@/lib/utils'
import type { Combo } from '@/types'

const OCCASIONS = ['All', 'Romance', 'Birthday', 'BestFriend', 'Luxury', 'Cozy']

const BG_MAP: Record<string, string> = {
  Romance:    'linear-gradient(135deg,#FFE4E8,#FFD6E7)',
  Birthday:   'linear-gradient(135deg,#FFF0D6,#FFE4C4)',
  BestFriend: 'linear-gradient(135deg,#F0E6FF,#FFE0F0)',
  Luxury:     'linear-gradient(135deg,#E8E8E8,#D4D0C8)',
  Cozy:       'linear-gradient(135deg,#E0F0E0,#F0FFE8)',
  default:    'linear-gradient(135deg,#FFE4F0,#FFD6E8)',
}

function ComboCard({ combo, index }: { combo: Combo; index: number }) {
  const { addCombo } = useCartStore()
  const { toggle, has } = useWishlistStore()
  const [added, setAdded] = useState(false)

  const isWishlisted = has('combo', combo.id)
  const occasion = combo.occasions?.[0] ?? 'default'
  const bg = BG_MAP[occasion] ?? BG_MAP.default

  const handleAdd = () => {
    addCombo(combo)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.06 }}
      className="bg-white rounded-3xl overflow-hidden shadow-card hover:shadow-hover hover:-translate-y-1 transition-all duration-300"
    >
      {/* Banner */}
      <div className="relative h-44 flex items-center justify-center gap-4" style={{ background: bg }}>
        {combo.emoji.split('').slice(0, 2).map((e, i) => (
          <motion.span
            key={i}
            className="text-5xl"
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 3, delay: i * 0.8, ease: 'easeInOut' }}
          >
            {e}
          </motion.span>
        ))}

        {/* Wishlist */}
        <button
          onClick={() => toggle('combo', combo.id)}
          className={cn(
            'absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center',
            'bg-white/80 backdrop-blur-sm transition-all duration-200',
            isWishlisted ? 'text-rose' : 'text-brand-muted hover:text-rose'
          )}
        >
          <Heart size={14} fill={isWishlisted ? 'currentColor' : 'none'} />
        </button>

        {/* Badge */}
        {combo.badge && (
          <span className="absolute top-3 left-3 badge bg-white/80 backdrop-blur-sm text-brand-dark text-[10px]">
            {combo.badge === 'trending' ? '🔥 Trending' : combo.badge === 'popular' ? '⭐ Popular' : '✨ New'}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-5">
        <h3 className="font-display text-xl font-semibold text-brand-dark mb-1">{combo.name}</h3>
        <p className="text-xs text-brand-muted mb-3 line-clamp-2">{combo.description}</p>

        {/* Included items */}
        {combo.products?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {combo.products.slice(0, 4).map((cp) => (
              <span key={cp.id} className="text-xs bg-beige-100 text-brand-muted px-2 py-0.5 rounded-full flex items-center gap-1">
                {cp.product.emoji} {cp.product.name}
              </span>
            ))}
            {combo.products.length > 4 && (
              <span className="text-xs bg-beige-100 text-brand-muted px-2 py-0.5 rounded-full">
                +{combo.products.length - 4} more
              </span>
            )}
          </div>
        )}

        {/* Price + CTA */}
        <div className="flex items-center justify-between">
          <div>
            <span className="font-display text-xl font-semibold text-brand-dark">
              {formatPrice(combo.price)}
            </span>
            {combo.comparePrice && (
              <span className="text-xs text-brand-muted line-through ml-2">
                {formatPrice(combo.comparePrice)}
              </span>
            )}
          </div>
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

export function CombosClient({ combos, initialOccasion }: { combos: Combo[]; initialOccasion?: string }) {
  const [activeOccasion, setOccasion] = useState(initialOccasion ?? 'All')

  const filtered = useMemo(() => {
    if (activeOccasion === 'All') return combos
    return combos.filter((c) => c.occasions?.includes(activeOccasion))
  }, [combos, activeOccasion])

  return (
    <section className="section-pad">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="section-tag">Curated Combos</div>
          <h1 className="font-display text-display-md font-semibold mt-2 mb-3">
            Ready-Made <em className="text-rose not-italic">Magic</em>
          </h1>
          <p className="text-brand-muted max-w-md mx-auto">
            Our expertly curated combinations — designed for every mood, occasion, and person.
          </p>
        </div>

        {/* Occasion filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {OCCASIONS.map((occ) => (
            <button
              key={occ}
              onClick={() => setOccasion(occ)}
              className={cn(
                'px-5 py-2 rounded-full text-sm font-medium border-2 transition-all duration-200',
                activeOccasion === occ
                  ? 'border-rose bg-rose text-white shadow-glow'
                  : 'border-beige-200 text-brand-muted hover:border-blush-300 bg-white'
              )}
            >
              {occ === 'All' ? '✦ All' : occ === 'Romance' ? '🌹 Romance' : occ === 'Birthday' ? '🎂 Birthday'
               : occ === 'BestFriend' ? '🫶 BFF' : occ === 'Luxury' ? '💎 Luxury' : '🕯️ Cozy'}
            </button>
          ))}
        </div>

        {/* Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence>
            {filtered.map((combo, i) => (
              <ComboCard key={combo.id} combo={combo} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">😔</div>
            <h3 className="font-display text-xl font-semibold mb-2">No combos found</h3>
            <p className="text-brand-muted">Try a different occasion filter</p>
          </div>
        )}
      </div>
    </section>
  )
}
