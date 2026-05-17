import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { CartItem, Product, Combo, CustomBox } from '@/types'
import { calculateCartTotals, applyCouponDiscount } from '@/lib/utils'
import toast from 'react-hot-toast'

// ─── CART STORE ───────────────────────────────────────────────────────────────

interface CartStore {
  items: CartItem[]
  coupon: { code: string; type: string; value: number; discount: number } | null
  isOpen: boolean

  addProduct: (product: Product, quantity?: number) => void
  addCombo: (combo: Combo, quantity?: number) => void
  addCustomBox: (box: CustomBox) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  applyCoupon: (coupon: { code: string; type: string; value: number; minOrder?: number; maxDiscount?: number }) => void
  removeCoupon: () => void

  // Derived
  get totalItems(): number
  get subtotal(): number
  get discount(): number
  get deliveryCharge(): number
  get total(): number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      coupon: null,
      isOpen: false,

      addProduct(product, quantity = 1) {
        set((state) => {
          const existing = state.items.find(
            (i) => i.type === 'product' && i.product?.id === product.id
          )
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === existing.id ? { ...i, quantity: i.quantity + quantity } : i
              ),
            }
          }
          return {
            items: [
              ...state.items,
              {
                id: `product-${product.id}-${Date.now()}`,
                type: 'product',
                product,
                quantity,
                price: product.price,
                name: product.name,
                emoji: product.emoji,
              },
            ],
          }
        })
        toast.success(`🎁 ${product.name} added to bag!`, { duration: 2000 })
      },

      addCombo(combo, quantity = 1) {
        set((state) => {
          const existing = state.items.find(
            (i) => i.type === 'combo' && i.combo?.id === combo.id
          )
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === existing.id ? { ...i, quantity: i.quantity + quantity } : i
              ),
            }
          }
          return {
            items: [
              ...state.items,
              {
                id: `combo-${combo.id}-${Date.now()}`,
                type: 'combo',
                combo,
                quantity,
                price: combo.price,
                name: combo.name,
                emoji: combo.emoji,
              },
            ],
          }
        })
        toast.success(`✨ ${combo.name} added to bag!`, { duration: 2000 })
      },

      addCustomBox(box) {
        set((state) => ({
          items: [
            ...state.items,
            {
              id: `box-${Date.now()}`,
              type: 'custom-box',
              customBox: box,
              quantity: 1,
              price: box.totalPrice,
              name: `Custom ${box.theme.name} Box`,
              emoji: box.theme.emoji,
            },
          ],
        }))
        toast.success('🎁 Custom gift box added to bag!', { duration: 2000 })
      },

      removeItem(id) {
        set((state) => ({ items: state.items.filter((i) => i.id !== id) }))
      },

      updateQuantity(id, quantity) {
        if (quantity <= 0) {
          get().removeItem(id)
          return
        }
        set((state) => ({
          items: state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
        }))
      },

      clearCart() {
        set({ items: [], coupon: null })
      },

      openCart:   () => set({ isOpen: true }),
      closeCart:  () => set({ isOpen: false }),
      toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),

      applyCoupon(coupon) {
        const subtotal = get().subtotal
        const discount = applyCouponDiscount(subtotal, coupon)
        if (discount === 0) {
          toast.error(`Minimum order of ₹${coupon.minOrder} required`)
          return
        }
        set({ coupon: { ...coupon, discount } })
        toast.success(`🎉 Coupon applied! You save ₹${Math.round(discount)}`)
      },

      removeCoupon() {
        set({ coupon: null })
        toast.success('Coupon removed')
      },

      get totalItems() {
        return get().items.reduce((sum, i) => sum + i.quantity, 0)
      },
      get subtotal() {
        return get().items.reduce((sum, i) => sum + i.price * i.quantity, 0)
      },
      get discount() {
        return get().coupon?.discount ?? 0
      },
      get deliveryCharge() {
        const sub = get().subtotal - get().discount
        return sub >= 999 ? 0 : 79
      },
      get total() {
        return get().subtotal - get().discount + get().deliveryCharge
      },
    }),
    {
      name: 'wraplove-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items, coupon: state.coupon }),
    }
  )
)

// ─── WISHLIST STORE ───────────────────────────────────────────────────────────

interface WishlistStore {
  productIds: string[]
  comboIds: string[]
  toggle: (type: 'product' | 'combo', id: string) => void
  has: (type: 'product' | 'combo', id: string) => boolean
  clear: () => void
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      productIds: [],
      comboIds: [],

      toggle(type, id) {
        if (type === 'product') {
          set((s) => ({
            productIds: s.productIds.includes(id)
              ? s.productIds.filter((x) => x !== id)
              : [...s.productIds, id],
          }))
          const has = get().productIds.includes(id)
          toast(has ? '💔 Removed from wishlist' : '🤍 Added to wishlist!', { duration: 1500 })
        } else {
          set((s) => ({
            comboIds: s.comboIds.includes(id)
              ? s.comboIds.filter((x) => x !== id)
              : [...s.comboIds, id],
          }))
        }
      },

      has(type, id) {
        if (type === 'product') return get().productIds.includes(id)
        return get().comboIds.includes(id)
      },

      clear() {
        set({ productIds: [], comboIds: [] })
      },
    }),
    {
      name: 'wraplove-wishlist',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

// ─── BUILDER STORE ────────────────────────────────────────────────────────────

interface BuilderStore {
  step: number
  selectedTheme: import('@/types').BoxTheme | null
  selectedItems: Record<string, number> // productId -> quantity
  personalNote: string
  recipientName: string
  occasion: string

  setStep: (step: number) => void
  setTheme: (theme: import('@/types').BoxTheme) => void
  addItem: (productId: string) => void
  removeItem: (productId: string) => void
  setItemQty: (productId: string, qty: number) => void
  setPersonalNote: (note: string) => void
  setRecipientName: (name: string) => void
  setOccasion: (occasion: string) => void
  reset: () => void
}

const builderInitial = {
  step: 0,
  selectedTheme: null,
  selectedItems: {},
  personalNote: '',
  recipientName: '',
  occasion: '',
}

export const useBuilderStore = create<BuilderStore>()((set) => ({
  ...builderInitial,

  setStep: (step) => set({ step }),
  setTheme: (theme) => set({ selectedTheme: theme }),

  addItem: (productId) =>
    set((s) => ({
      selectedItems: {
        ...s.selectedItems,
        [productId]: (s.selectedItems[productId] ?? 0) + 1,
      },
    })),

  removeItem: (productId) =>
    set((s) => {
      const next = { ...s.selectedItems }
      delete next[productId]
      return { selectedItems: next }
    }),

  setItemQty: (productId, qty) =>
    set((s) => {
      if (qty <= 0) {
        const next = { ...s.selectedItems }
        delete next[productId]
        return { selectedItems: next }
      }
      return { selectedItems: { ...s.selectedItems, [productId]: qty } }
    }),

  setPersonalNote: (personalNote) => set({ personalNote }),
  setRecipientName: (recipientName) => set({ recipientName }),
  setOccasion: (occasion) => set({ occasion }),
  reset: () => set(builderInitial),
}))

// ─── UI STORE ─────────────────────────────────────────────────────────────────

interface UIStore {
  searchOpen: boolean
  mobileMenuOpen: boolean
  setSearchOpen: (v: boolean) => void
  setMobileMenuOpen: (v: boolean) => void
}

export const useUIStore = create<UIStore>()((set) => ({
  searchOpen: false,
  mobileMenuOpen: false,
  setSearchOpen: (v) => set({ searchOpen: v }),
  setMobileMenuOpen: (v) => set({ mobileMenuOpen: v }),
}))
