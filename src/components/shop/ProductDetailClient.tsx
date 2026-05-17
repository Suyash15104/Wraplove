'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, ShoppingBag, Star, ChevronRight, Check, Minus, Plus, Share2 } from 'lucide-react'
import { useCartStore, useWishlistStore } from '@/store'
import { ProductCard } from '@/components/shop/ProductCard'
import { formatPrice, getDiscountPercent, formatDate, cn } from '@/lib/utils'
import type { Product } from '@/types'
import toast from 'react-hot-toast'

interface Props { product: Product; related: Product[] }

const STAR_COLORS = ['', 'bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-lime-400', 'bg-green-400']

export function ProductDetailClient({ product, related }: Props) {
  const { addProduct }   = useCartStore()
  const { toggle, has }  = useWishlistStore()
  const [activeImg, setActiveImg]     = useState(0)
  const [quantity, setQuantity]       = useState(1)
  const [activeVariant, setVariant]   = useState<string | null>(null)
  const [addedToCart, setAddedToCart] = useState(false)
  const [activeTab, setActiveTab]     = useState<'description' | 'reviews'>('description')

  const isWishlisted = has('product', product.id)
  const hasDiscount  = product.comparePrice && product.comparePrice > product.price
  const images       = product.images?.length ? product.images : []
  const reviews      = (product as any).reviews ?? []

  const handleAddToCart = () => {
    addProduct(product, quantity)
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: product.name, url: window.location.href })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied!')
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-brand-muted mb-8">
        <Link href="/" className="hover:text-brand-dark">Home</Link>
        <ChevronRight size={12} />
        <Link href="/shop" className="hover:text-brand-dark">Shop</Link>
        <ChevronRight size={12} />
        <Link href={`/shop?category=${product.category?.slug}`} className="hover:text-brand-dark capitalize">
          {product.category?.name}
        </Link>
        <ChevronRight size={12} />
        <span className="text-brand-dark">{product.name}</span>
      </nav>

      {/* Main layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">

        {/* Images */}
        <div className="space-y-3">
          {/* Main image */}
          <div className="relative aspect-square rounded-4xl overflow-hidden bg-gradient-to-br from-cream to-beige-200">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeImg}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                {images[activeImg] ? (
                  <Image
                    src={images[activeImg]}
                    alt={product.name}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <span className="text-9xl">{product.emoji}</span>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Wishlist + Share */}
            <div className="absolute top-4 right-4 flex flex-col gap-2">
              <button
                onClick={() => toggle('product', product.id)}
                className={cn(
                  'w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm shadow-sm flex items-center justify-center transition-all',
                  isWishlisted ? 'text-rose' : 'text-brand-muted hover:text-rose'
                )}
              >
                <Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'} />
              </button>
              <button
                onClick={handleShare}
                className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm shadow-sm flex items-center justify-center text-brand-muted hover:text-brand-dark"
              >
                <Share2 size={15} />
              </button>
            </div>

            {hasDiscount && (
              <div className="absolute top-4 left-4 badge-sale">
                {getDiscountPercent(product.price, product.comparePrice!)}% OFF
              </div>
            )}
          </div>

          {/* Thumbnail row */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={cn(
                    'w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 border-2 transition-all',
                    activeImg === i ? 'border-rose' : 'border-transparent hover:border-blush-300'
                  )}
                >
                  <Image src={img} alt="" width={64} height={64} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <div className="flex flex-wrap gap-2 mb-3">
            {product.tags?.map((tag) => (
              <span key={tag} className="badge bg-beige-100 text-brand-muted">{tag}</span>
            ))}
            {product.isFeatured && <span className="badge-trending">✦ Bestseller</span>}
          </div>

          <h1 className="font-display text-display-sm font-semibold text-brand-dark mb-3">
            {product.name}
          </h1>

          {/* Rating */}
          {(product as any).reviewCount > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14}
                    fill={i < Math.round((product as any).averageRating ?? 0) ? '#C9A84C' : 'none'}
                    className="text-gold"
                  />
                ))}
              </div>
              <span className="text-sm text-brand-muted">
                {(product as any).averageRating?.toFixed(1)} ({(product as any).reviewCount} reviews)
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="font-display text-3xl font-semibold text-brand-dark">
              {formatPrice(product.price)}
            </span>
            {hasDiscount && (
              <span className="text-base text-brand-muted line-through">
                {formatPrice(product.comparePrice!)}
              </span>
            )}
            {hasDiscount && (
              <span className="text-sm text-green-600 font-medium">
                You save {formatPrice(product.comparePrice! - product.price)}
              </span>
            )}
          </div>

          {/* Variants */}
          {product.variants && product.variants.length > 0 && (
            <div className="mb-6">
              <p className="text-sm font-medium text-brand-dark mb-2">
                {product.variants[0]?.name}:{' '}
                <span className="text-rose">{activeVariant ?? 'Choose an option'}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setVariant(v.value)}
                    className={cn(
                      'px-4 py-2 rounded-full text-sm border-2 transition-all',
                      activeVariant === v.value
                        ? 'border-rose bg-blush-100 text-rose'
                        : 'border-beige-200 text-brand-muted hover:border-blush-300'
                    )}
                  >
                    {v.value}
                    {v.price && v.price !== product.price && (
                      <span className="ml-1 text-xs">+{formatPrice(v.price - product.price)}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mb-6">
            <p className="text-sm font-medium text-brand-dark mb-2">Quantity</p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-9 h-9 rounded-full bg-beige-100 hover:bg-beige-200 flex items-center justify-center transition-colors"
              >
                <Minus size={14} />
              </button>
              <span className="w-8 text-center font-semibold text-brand-dark">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="w-9 h-9 rounded-full bg-beige-100 hover:bg-beige-200 flex items-center justify-center transition-colors"
              >
                <Plus size={14} />
              </button>
              <span className="text-xs text-brand-muted ml-2">
                {product.stock > 10 ? 'In stock' : `Only ${product.stock} left`}
              </span>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <motion.button
              onClick={handleAddToCart}
              whileTap={{ scale: 0.97 }}
              disabled={product.stock === 0}
              className={cn(
                'btn btn-lg flex-1 transition-all',
                addedToCart ? 'bg-sage-100 text-sage-400 border-2 border-sage-200' : 'btn-primary'
              )}
            >
              {addedToCart
                ? <><Check size={16} /> Added to Bag!</>
                : <><ShoppingBag size={16} /> Add to Cart</>
              }
            </motion.button>
            <button
              onClick={() => toggle('product', product.id)}
              className={cn(
                'btn btn-lg border-2 px-5',
                isWishlisted
                  ? 'border-rose bg-blush-100 text-rose'
                  : 'border-beige-200 text-brand-muted hover:border-blush-300'
              )}
            >
              <Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'} />
            </button>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-3">
            {[
              { emoji: '🚀', text: '24hr Dispatch' },
              { emoji: '📦', text: 'Premium Packaging' },
              { emoji: '🔄', text: 'Easy Returns' },
              { emoji: '💌', text: 'Gift Message' },
            ].map((b) => (
              <div key={b.text} className="flex items-center gap-1.5 text-xs text-brand-muted bg-beige-100 rounded-full px-3 py-1.5">
                <span>{b.emoji}</span> {b.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs: Description / Reviews */}
      <div className="mb-16">
        <div className="flex gap-0 bg-beige-100 rounded-2xl p-1 mb-8 max-w-xs">
          {(['description', 'reviews'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'flex-1 py-2 rounded-xl text-sm font-medium transition-all capitalize',
                activeTab === tab ? 'bg-white shadow-sm text-brand-dark' : 'text-brand-muted'
              )}
            >
              {tab} {tab === 'reviews' && (product as any).reviewCount > 0 && `(${(product as any).reviewCount})`}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'description' ? (
            <motion.div key="desc" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <p className="text-brand-muted leading-relaxed max-w-2xl">{product.description}</p>
            </motion.div>
          ) : (
            <motion.div key="reviews" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {reviews.length === 0 ? (
                <p className="text-brand-muted">No reviews yet. Be the first! 💗</p>
              ) : (
                <div className="space-y-4 max-w-2xl">
                  {reviews.map((r: any) => (
                    <div key={r.id} className="bg-white rounded-2xl p-5 shadow-soft">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-blush-100 flex items-center justify-center text-xs font-bold text-rose">
                            {r.user?.name?.[0] ?? 'A'}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{r.user?.name ?? 'Anonymous'}</p>
                            <p className="text-xs text-brand-muted">{formatDate(r.createdAt)}</p>
                          </div>
                        </div>
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={12} fill={i < r.rating ? '#C9A84C' : 'none'} className="text-gold" />
                          ))}
                        </div>
                      </div>
                      {r.title && <p className="font-medium text-sm mb-1">{r.title}</p>}
                      <p className="text-sm text-brand-muted">{r.body}</p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <div>
          <h2 className="font-display text-display-sm font-semibold mb-6">
            You Might Also Love 🌸
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  )
}
