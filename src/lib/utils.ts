import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// ─── CLASSNAME UTILITY ────────────────────────────────────────────────────────
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ─── PRICE FORMATTING ─────────────────────────────────────────────────────────
export function formatPrice(amount: number, currency = 'INR'): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatPriceCompact(amount: number): string {
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`
  return `₹${amount}`
}

// ─── DISCOUNT PERCENTAGE ──────────────────────────────────────────────────────
export function getDiscountPercent(price: number, comparePrice: number): number {
  return Math.round(((comparePrice - price) / comparePrice) * 100)
}

// ─── ORDER NUMBER GENERATOR ───────────────────────────────────────────────────
export function generateOrderNumber(): string {
  const prefix = 'WL'
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 5).toUpperCase()
  return `${prefix}${timestamp}${random}`
}

// ─── SLUG GENERATOR ───────────────────────────────────────────────────────────
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
}

// ─── CART CALCULATIONS ────────────────────────────────────────────────────────
export function calculateCartTotals(items: { price: number; quantity: number }[]) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const deliveryCharge = subtotal >= Number(process.env.FREE_DELIVERY_THRESHOLD ?? 999) ? 0 : 79
  const total = subtotal + deliveryCharge
  return { subtotal, deliveryCharge, total }
}

// ─── COUPON VALIDATION ────────────────────────────────────────────────────────
export function applyCouponDiscount(
  subtotal: number,
  coupon: { type: string; value: number; minOrder?: number | null; maxDiscount?: number | null }
): number {
  if (coupon.minOrder && subtotal < coupon.minOrder) return 0
  if (coupon.type === 'PERCENTAGE') {
    const discount = (subtotal * coupon.value) / 100
    return coupon.maxDiscount ? Math.min(discount, coupon.maxDiscount) : discount
  }
  return coupon.value
}

// ─── DATE HELPERS ─────────────────────────────────────────────────────────────
export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    ...options,
  }).format(new Date(date))
}

export function formatRelativeDate(date: string | Date): string {
  const now = new Date()
  const then = new Date(date)
  const diffMs = now.getTime() - then.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  return formatDate(date)
}

// ─── ORDER STATUS HELPERS ─────────────────────────────────────────────────────
export const ORDER_STATUS_CONFIG = {
  PENDING:           { label: 'Pending',           color: 'bg-yellow-100 text-yellow-700',  icon: '⏳' },
  CONFIRMED:         { label: 'Confirmed',         color: 'bg-blue-100 text-blue-700',      icon: '✅' },
  PROCESSING:        { label: 'Processing',        color: 'bg-purple-100 text-purple-700',  icon: '🎁' },
  SHIPPED:           { label: 'Shipped',           color: 'bg-indigo-100 text-indigo-700',  icon: '📦' },
  OUT_FOR_DELIVERY:  { label: 'Out for Delivery',  color: 'bg-orange-100 text-orange-700',  icon: '🚚' },
  DELIVERED:         { label: 'Delivered',         color: 'bg-green-100 text-green-700',    icon: '🎉' },
  CANCELLED:         { label: 'Cancelled',         color: 'bg-red-100 text-red-700',        icon: '❌' },
  REFUNDED:          { label: 'Refunded',          color: 'bg-gray-100 text-gray-700',      icon: '↩️' },
} as const

// ─── ARRAY HELPERS ────────────────────────────────────────────────────────────
export function chunk<T>(array: T[], size: number): T[][] {
  return Array.from({ length: Math.ceil(array.length / size) }, (_, i) =>
    array.slice(i * size, i * size + size)
  )
}

export function shuffle<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5)
}

// ─── IMAGE HELPERS ────────────────────────────────────────────────────────────
export function getProductImageUrl(images: string[], index = 0): string {
  if (images && images[index] && images[index].startsWith('http')) return images[index]
  return `/images/placeholder-product.jpg`
}

// ─── VALIDATION ───────────────────────────────────────────────────────────────
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function isValidPhone(phone: string): boolean {
  return /^[6-9]\d{9}$/.test(phone.replace(/\s/g, ''))
}

export function isValidPincode(pincode: string): boolean {
  return /^\d{6}$/.test(pincode)
}
