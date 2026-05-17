'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingBag, Trash2, Plus, Minus, Tag } from 'lucide-react'
import { useCartStore } from '@/store'
import { formatPrice } from '@/lib/utils'
import { useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

export function CartDrawer() {
  const {
    isOpen, closeCart, items, removeItem, updateQuantity,
    subtotal, discount, deliveryCharge, total,
    coupon, applyCoupon, removeCoupon,
  } = useCartStore()

  const [couponInput, setCouponInput] = useState('')
  const [couponLoading, setCouponLoading] = useState(false)

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return
    setCouponLoading(true)
    try {
      const { data } = await axios.post('/api/coupons/validate', { code: couponInput.trim() })
      if (data.success) {
        applyCoupon(data.coupon)
        setCouponInput('')
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error ?? 'Invalid coupon code')
    } finally {
      setCouponLoading(false)
    }
  }

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-50 bg-brand-dark/40 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            key="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-sm bg-cream flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-beige-200">
              <div className="flex items-center gap-2">
                <ShoppingBag size={18} className="text-rose" />
                <h2 className="font-display text-lg font-semibold">Your Gift Bag</h2>
                {items.length > 0 && (
                  <span className="text-xs bg-blush-100 text-rose px-2 py-0.5 rounded-full font-medium">
                    {items.reduce((s, i) => s + i.quantity, 0)} items
                  </span>
                )}
              </div>
              <button onClick={closeCart} className="btn-icon text-brand-muted hover:text-brand-dark">
                <X size={18} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {items.length === 0 ? (
                <EmptyCart closeCart={closeCart} />
              ) : (
                <div className="space-y-3">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex gap-3 bg-white rounded-2xl p-3"
                      >
                        {/* Emoji / image */}
                        <div className="w-14 h-14 bg-gradient-brand rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                          {item.emoji}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-brand-dark truncate">{item.name}</p>
                          <p className="text-sm font-semibold text-rose font-display mt-0.5">
                            {formatPrice(item.price)}
                          </p>
                          {/* Qty controls */}
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-6 h-6 rounded-full bg-beige-100 hover:bg-beige-200
                                         flex items-center justify-center transition-colors"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-6 h-6 rounded-full bg-beige-100 hover:bg-beige-200
                                         flex items-center justify-center transition-colors"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                        </div>

                        {/* Remove */}
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-brand-muted hover:text-rose transition-colors self-start mt-0.5 p-1"
                        >
                          <Trash2 size={14} />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-5 py-4 border-t border-beige-200 space-y-3 bg-cream">
                {/* Coupon */}
                {coupon ? (
                  <div className="flex items-center justify-between bg-sage-100 rounded-xl px-3 py-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Tag size={14} className="text-sage-400" />
                      <span className="font-medium text-brand-dark">{coupon.code}</span>
                      <span className="text-brand-muted">— {formatPrice(coupon.discount)} off</span>
                    </div>
                    <button onClick={removeCoupon} className="text-brand-muted hover:text-rose">
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                      placeholder="Coupon code"
                      className="input text-xs flex-1 py-2"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      disabled={couponLoading || !couponInput}
                      className="btn-outline btn-sm disabled:opacity-50"
                    >
                      {couponLoading ? '...' : 'Apply'}
                    </button>
                  </div>
                )}

                {/* Price breakdown */}
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between text-brand-muted">
                    <span>Subtotal</span><span>{formatPrice(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sage-400">
                      <span>Discount</span><span>−{formatPrice(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-brand-muted">
                    <span>Delivery</span>
                    <span>{deliveryCharge === 0 ? <span className="text-sage-400 font-medium">FREE</span> : formatPrice(deliveryCharge)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-base text-brand-dark pt-2 border-t border-beige-200">
                    <span>Total</span>
                    <span className="font-display text-lg">{formatPrice(total)}</span>
                  </div>
                </div>

                {deliveryCharge > 0 && (
                  <p className="text-xs text-center text-brand-muted">
                    Add {formatPrice(999 - subtotal)} more for free delivery 🎁
                  </p>
                )}

                {/* CTA */}
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="btn-primary w-full btn-lg"
                >
                  Proceed to Checkout →
                </Link>
                <button
                  onClick={closeCart}
                  className="btn-ghost w-full text-xs text-brand-muted"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}

function EmptyCart({ closeCart }: { closeCart: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center py-16 gap-4">
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        className="text-5xl"
      >
        🛍️
      </motion.div>
      <div>
        <p className="font-display text-lg font-semibold mb-1">Your bag is empty</p>
        <p className="text-sm text-brand-muted">Start adding beautiful gifts!</p>
      </div>
      <div className="flex flex-col gap-2 w-full max-w-[200px]">
        <Link href="/shop" onClick={closeCart} className="btn-primary w-full">
          Browse Shop ✦
        </Link>
        <Link href="/builder" onClick={closeCart} className="btn-ghost w-full text-xs">
          Build a Gift Box
        </Link>
      </div>
    </div>
  )
}
