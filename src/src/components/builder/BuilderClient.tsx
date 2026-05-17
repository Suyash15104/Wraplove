'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ShoppingBag, Save, Check, Plus, Minus, RotateCcw } from 'lucide-react'
import { useBuilderStore, useCartStore } from '@/store'
import { ProductCard } from '@/components/shop/ProductCard'
import { formatPrice, cn } from '@/lib/utils'
import type { BoxTheme, Product } from '@/types'
import toast from 'react-hot-toast'

const STEPS = [
  { id: 0, label: 'Box Theme',  icon: '🎁' },
  { id: 1, label: 'Add Items',  icon: '✨' },
  { id: 2, label: 'Personalize', icon: '💌' },
]

const OCCASIONS = ['🎂 Birthday', '🌹 Romance', '🎓 Graduation', '💍 Engagement', '🫶 Best Friend', '💗 Just Because', '🌸 Self Love', '✦ Other']

interface BuilderClientProps {
  boxThemes: BoxTheme[]
  products: Product[]
}

export function BuilderClient({ boxThemes, products }: BuilderClientProps) {
  const builder = useBuilderStore()
  const { addCustomBox } = useCartStore()

  const builderItems = useMemo(() => {
    return Object.entries(builder.selectedItems)
      .map(([productId, qty]) => {
        const product = products.find((p) => p.id === productId)
        return product ? { product, quantity: qty } : null
      })
      .filter(Boolean) as { product: Product; quantity: number }[]
  }, [builder.selectedItems, products])

  const basePrice = builder.selectedTheme?.basePrice ?? 0
  const itemsTotal = builderItems.reduce((s, i) => s + i.product.price * i.quantity, 0)
  const packagingFee = 49
  const total = basePrice + itemsTotal + packagingFee

  function handleAddToCart() {
    if (!builder.selectedTheme) {
      toast.error('Please choose a box theme first!')
      return
    }
    if (builderItems.length === 0) {
      toast.error('Add at least one item to your box!')
      return
    }
    addCustomBox({
      theme: builder.selectedTheme,
      items: builderItems,
      personalNote: builder.personalNote,
      recipientName: builder.recipientName,
      occasion: builder.occasion,
      totalPrice: total,
    })
    builder.reset()
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="section-tag">Gift Builder ✦</div>
        <h1 className="font-display text-display-md font-semibold mt-2 mb-3">
          Build Your <em className="text-rose not-italic">Perfect Hamper</em>
        </h1>
        <p className="text-brand-muted max-w-md mx-auto">
          Pick, customize, and preview — your dream gift box in minutes.
        </p>
      </div>

      {/* Step bar */}
      <div className="flex items-center justify-center mb-10">
        <div className="flex items-center gap-0 bg-beige-100 rounded-full p-1">
          {STEPS.map((step, i) => (
            <button
              key={step.id}
              onClick={() => builder.step > step.id && builder.setStep(step.id)}
              className={cn(
                'flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300',
                builder.step === step.id
                  ? 'bg-rose text-white shadow-sm'
                  : builder.step > step.id
                  ? 'text-rose cursor-pointer hover:bg-blush-100'
                  : 'text-brand-muted cursor-default'
              )}
            >
              <span>{step.icon}</span>
              <span className="hidden sm:block">{step.label}</span>
              {builder.step > step.id && <Check size={12} />}
            </button>
          ))}
        </div>
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">

        {/* LEFT — step content */}
        <div className="bg-white rounded-3xl p-6 shadow-card">
          <AnimatePresence mode="wait">

            {/* STEP 0 — Box themes */}
            {builder.step === 0 && (
              <motion.div key="step0" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <h2 className="font-display text-xl font-semibold mb-1">Choose Your Box Theme</h2>
                <p className="text-sm text-brand-muted mb-6">The foundation of your perfect gift.</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                  {boxThemes.map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => builder.setTheme(theme)}
                      className={cn(
                        'p-4 rounded-2xl border-2 text-center transition-all duration-200 group',
                        builder.selectedTheme?.id === theme.id
                          ? 'border-rose shadow-glow'
                          : 'border-beige-200 hover:border-blush-300'
                      )}
                      style={{ background: theme.color }}
                    >
                      <span className="text-3xl mb-2 block">{theme.emoji}</span>
                      <p className="text-xs font-medium text-brand-dark">{theme.name}</p>
                      <p className="text-xs text-brand-muted mt-0.5">+{formatPrice(theme.basePrice)}</p>
                      {builder.selectedTheme?.id === theme.id && (
                        <div className="mt-2 w-5 h-5 rounded-full bg-rose flex items-center justify-center mx-auto">
                          <Check size={10} className="text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => builder.setStep(1)}
                  disabled={!builder.selectedTheme}
                  className="btn-primary w-full disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next: Add Items <ChevronRight size={16} />
                </button>
              </motion.div>
            )}

            {/* STEP 1 — Add items */}
            {builder.step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <h2 className="font-display text-xl font-semibold mb-1">Add Gift Items</h2>
                <p className="text-sm text-brand-muted mb-6">
                  Tap to add, tap again for more. {Object.keys(builder.selectedItems).length > 0 && (
                    <span className="text-rose font-medium">
                      {Object.values(builder.selectedItems).reduce((a, b) => a + b, 0)} items selected
                    </span>
                  )}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[420px] overflow-y-auto pr-1">
                  {products.filter((p) => p.isBuilderItem).map((product) => (
                    <div key={product.id} className="relative">
                      <ProductCard
                        product={product}
                        variant="builder"
                        selectedQty={builder.selectedItems[product.id]}
                        onAddToBox={() => {
                          if (builder.selectedItems[product.id]) {
                            builder.setItemQty(product.id, builder.selectedItems[product.id] + 1)
                          } else {
                            builder.addItem(product.id)
                          }
                        }}
                      />
                      {builder.selectedItems[product.id] > 0 && (
                        <button
                          onClick={() => builder.setItemQty(product.id, builder.selectedItems[product.id] - 1)}
                          className="absolute bottom-3 right-8 w-5 h-5 rounded-full bg-beige-200 flex items-center justify-center"
                        >
                          <Minus size={10} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 mt-6">
                  <button onClick={() => builder.setStep(0)} className="btn-ghost flex-1">← Back</button>
                  <button
                    onClick={() => builder.setStep(2)}
                    disabled={Object.keys(builder.selectedItems).length === 0}
                    className="btn-primary flex-[2] disabled:opacity-40"
                  >
                    Next: Personalize <ChevronRight size={16} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2 — Personalize */}
            {builder.step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <h2 className="font-display text-xl font-semibold mb-1">Personalize Your Gift</h2>
                <p className="text-sm text-brand-muted mb-6">Make it truly one-of-a-kind. 💌</p>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-brand-muted block mb-1.5">
                      Recipient's Name
                    </label>
                    <input
                      className="input"
                      placeholder="To: Priya ✦"
                      value={builder.recipientName}
                      onChange={(e) => builder.setRecipientName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-brand-muted block mb-1.5">
                      Occasion
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {OCCASIONS.map((occ) => (
                        <button
                          key={occ}
                          onClick={() => builder.setOccasion(occ)}
                          className={cn(
                            'px-3 py-2 rounded-xl text-xs font-medium border-2 transition-all',
                            builder.occasion === occ
                              ? 'border-rose bg-blush-100 text-rose'
                              : 'border-beige-200 text-brand-muted hover:border-blush-300'
                          )}
                        >
                          {occ}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-brand-muted block mb-1.5">
                      Personal Message Card
                    </label>
                    <textarea
                      className="input min-h-[120px] resize-none"
                      placeholder="Write from the heart... 💌&#10;'Happy Birthday gorgeous! You deserve all the good things in the world...'"
                      value={builder.personalNote}
                      onChange={(e) => builder.setPersonalNote(e.target.value)}
                    />
                    <p className="text-xs text-brand-muted mt-1">{builder.personalNote.length}/500 characters</p>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button onClick={() => builder.setStep(1)} className="btn-ghost flex-1">← Back</button>
                  <button onClick={builder.reset} className="btn-icon" title="Reset builder">
                    <RotateCcw size={16} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* RIGHT — Live preview */}
        <div className="space-y-4 sticky top-20">
          <div className="bg-white rounded-3xl p-5 shadow-card">
            <h3 className="font-display text-lg font-semibold mb-1">🎁 Live Preview</h3>
            <p className="text-xs text-brand-muted mb-4">Your gift is taking shape...</p>

            {/* Preview box */}
            <div
              className="rounded-2xl p-6 flex flex-col items-center min-h-[180px] mb-4"
              style={{ background: builder.selectedTheme?.gradient ?? 'linear-gradient(135deg, #FFF5F8, #F3EEF8)' }}
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                className="text-6xl mb-2"
              >
                {builder.selectedTheme?.emoji ?? '🎁'}
              </motion.div>
              <p className="text-sm font-medium text-brand-dark mb-3">
                {builder.selectedTheme?.name ?? 'Choose a theme'}
              </p>
              {builderItems.length > 0 && (
                <div className="flex flex-wrap gap-1.5 justify-center">
                  {builderItems.map(({ product, quantity }) => (
                    <span
                      key={product.id}
                      className="bg-white/70 backdrop-blur-sm rounded-full px-2.5 py-1 text-xs flex items-center gap-1"
                    >
                      {product.emoji} {product.name}
                      {quantity > 1 && <span className="text-rose font-bold">×{quantity}</span>}
                    </span>
                  ))}
                </div>
              )}
              {builder.recipientName && (
                <p className="text-xs text-brand-muted mt-3 italic">To: {builder.recipientName}</p>
              )}
            </div>

            {/* Price breakdown */}
            <div className="bg-beige-100 rounded-2xl p-4 space-y-2 mb-4">
              <div className="flex justify-between text-sm text-brand-muted">
                <span>Box Base ({builder.selectedTheme?.name ?? '—'})</span>
                <span>{formatPrice(basePrice)}</span>
              </div>
              {builderItems.map(({ product, quantity }) => (
                <div key={product.id} className="flex justify-between text-xs text-brand-muted">
                  <span>{product.emoji} {product.name} ×{quantity}</span>
                  <span>{formatPrice(product.price * quantity)}</span>
                </div>
              ))}
              <div className="flex justify-between text-sm text-brand-muted">
                <span>Packaging & ribbon</span>
                <span>{formatPrice(packagingFee)}</span>
              </div>
              <div className="flex justify-between font-semibold text-brand-dark pt-2 border-t border-beige-200">
                <span>Total</span>
                <span className="font-display text-lg">{formatPrice(total)}</span>
              </div>
            </div>

            {/* CTAs */}
            <button
              onClick={handleAddToCart}
              disabled={!builder.selectedTheme || builderItems.length === 0}
              className="btn-primary w-full mb-2 disabled:opacity-40"
            >
              <ShoppingBag size={16} /> Add to Cart
            </button>
            <button
              onClick={() => toast.success('💾 Combo saved to wishlist!')}
              disabled={!builder.selectedTheme}
              className="btn-ghost w-full text-xs disabled:opacity-40"
            >
              <Save size={14} /> Save Combo
            </button>
          </div>

          {/* AI Suggestion hint */}
          {builderItems.length >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-lavender-100 rounded-2xl p-4 text-sm"
            >
              <p className="font-medium text-mauve mb-1">✨ Suggested Add-on</p>
              <p className="text-xs text-brand-muted">
                Based on your selection, customers also add a{' '}
                <strong>Personalized Message Card</strong> (+₹59) for a complete gift experience.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
