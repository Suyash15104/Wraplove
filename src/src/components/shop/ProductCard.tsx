'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Plus, Check, Star, ShoppingBag } from 'lucide-react'
import { useCartStore, useWishlistStore } from '@/store'
import { formatPrice, getDiscountPercent, getProductImageUrl, cn } from '@/lib/utils'
import type { Product } from '@/types'

interface ProductCardProps {
  product: Product
  variant?: 'default' | 'compact' | 'builder'
  onAddToBox?: (product: Product) => void
  selectedQty?: number
}

export function ProductCard({ product, variant = 'default', onAddToBox, selectedQty }: ProductCardProps) {
  const { addProduct } = useCartStore()
  const { toggle, has } = useWishlistStore()
  const [added, setAdded] = useState(false)
  const [imageIdx, setImageIdx] = useState(0)

  const isWishlisted = has('product', product.id)
  const hasDiscount   = product.comparePrice && product.comparePrice > product.price
  const discountPct   = hasDiscount ? getDiscountPercent(product.price, product.comparePrice!) : 0

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addProduct(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    toggle('product', product.id)
  }

  const handleAddToBox = (e: React.MouseEvent) => {
    e.preventDefault()
    onAddToBox?.(product)
  }

  if (variant === 'compact') {
    return (
      <Link href={`/shop/${product.slug}`}>
        <div className="flex gap-3 p-3 bg-white rounded-2xl hover:shadow-card transition-all duration-200 group">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
            style={{ background: `${product.category?.slug === 'jewellery' ? '#FFFFF0' : '#FFF5F8'}` }}
          >
            {product.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-brand-dark truncate">{product.name}</p>
            <p className="text-sm font-semibold text-rose font-display">{formatPrice(product.price)}</p>
          </div>
        </div>
      </Link>
    )
  }

  if (variant === 'builder') {
    const isSelected = (selectedQty ?? 0) > 0
    return (
      <motion.div
        layout
        className={cn(
          'flex items-center gap-3 p-3 rounded-2xl border-2 cursor-pointer transition-all duration-200',
          isSelected
            ? 'border-rose bg-blush-100'
            : 'border-beige-200 bg-white hover:border-blush-300 hover:bg-blush-100/50'
        )}
        onClick={handleAddToBox}
      >
        <div className="w-10 h-10 rounded-xl bg-beige-100 flex items-center justify-center text-xl flex-shrink-0">
          {product.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-brand-dark truncate">{product.name}</p>
          <p className="text-xs text-brand-muted font-display font-semibold">{formatPrice(product.price)}</p>
        </div>
        <AnimatePresence mode="wait">
          {isSelected ? (
            <motion.div
              key="count"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="w-6 h-6 rounded-full bg-rose text-white text-xs font-bold flex items-center justify-center flex-shrink-0"
            >
              {selectedQty}
            </motion.div>
          ) : (
            <motion.div
              key="plus"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="w-6 h-6 rounded-full bg-beige-200 flex items-center justify-center flex-shrink-0"
            >
              <Plus size={12} className="text-brand-muted" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    )
  }

  // Default variant
  return (
    <Link href={`/shop/${product.slug}`} className="block group">
      <motion.div
        whileHover={{ y: -6 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="bg-white rounded-3xl overflow-hidden shadow-card hover:shadow-hover transition-shadow duration-300"
      >
        {/* Image area */}
        <div className="relative h-56 overflow-hidden bg-gradient-to-br from-cream to-beige-100">
          {product.images?.[0] ? (
            <Image
              src={product.images[imageIdx] ?? product.images[0]}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl">
              {product.emoji}
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.isFeatured && (
              <span className="badge-trending text-[10px]">✦ Bestseller</span>
            )}
            {hasDiscount && (
              <span className="badge-sale text-[10px]">{discountPct}% off</span>
            )}
          </div>

          {/* Wishlist */}
          <motion.button
            onClick={handleWishlist}
            whileTap={{ scale: 0.85 }}
            className={cn(
              'absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center',
              'bg-white/80 backdrop-blur-sm shadow-sm transition-all duration-200',
              isWishlisted ? 'text-rose bg-blush-100' : 'text-brand-muted hover:text-rose'
            )}
          >
            <Heart size={14} fill={isWishlisted ? 'currentColor' : 'none'} />
          </motion.button>

          {/* Image dots */}
          {product.images?.length > 1 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {product.images.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.preventDefault(); setImageIdx(i) }}
                  className={cn(
                    'w-1.5 h-1.5 rounded-full transition-all',
                    i === imageIdx ? 'bg-white w-3' : 'bg-white/50'
                  )}
                />
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Tags */}
          <div className="flex gap-1.5 mb-2 flex-wrap">
            {product.tags?.slice(0, 2).map((tag) => (
              <span key={tag} className="text-[10px] bg-beige-100 text-brand-muted px-2 py-0.5 rounded-full">
                {tag}
              </span>
            ))}
          </div>

          {/* Name + desc */}
          <h3 className="font-medium text-brand-dark text-sm mb-0.5 line-clamp-1">{product.name}</h3>
          <p className="text-xs text-brand-muted line-clamp-2 mb-3">{product.description}</p>

          {/* Rating */}
          {product.reviewCount && product.reviewCount > 0 && (
            <div className="flex items-center gap-1 mb-3">
              <Star size={11} fill="#C9A84C" className="text-gold" />
              <span className="text-xs text-brand-muted">
                {product.averageRating?.toFixed(1)} ({product.reviewCount})
              </span>
            </div>
          )}

          {/* Price + CTA */}
          <div className="flex items-center justify-between">
            <div>
              <span className="font-display text-lg font-semibold text-brand-dark">
                {formatPrice(product.price)}
              </span>
              {hasDiscount && (
                <span className="text-xs text-brand-muted line-through ml-1.5">
                  {formatPrice(product.comparePrice!)}
                </span>
              )}
            </div>
            <motion.button
              onClick={handleAddToCart}
              whileTap={{ scale: 0.9 }}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200',
                added
                  ? 'bg-sage-100 text-sage-400'
                  : 'bg-rose text-white hover:bg-rose-400 hover:shadow-glow'
              )}
            >
              <AnimatePresence mode="wait">
                {added ? (
                  <motion.span key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                    className="flex items-center gap-1">
                    <Check size={12} /> Added
                  </motion.span>
                ) : (
                  <motion.span key="add" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                    className="flex items-center gap-1.5">
                    <ShoppingBag size={12} /> Add
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}
