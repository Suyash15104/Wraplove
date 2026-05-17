// ─── PRODUCT TYPES ────────────────────────────────────────────────────────────

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  emoji: string
  images: string[]
  price: number
  comparePrice?: number
  stock: number
  tags: string[]
  occasions: string[]
  isFeatured: boolean
  isBuilderItem: boolean
  category: Category
  categoryId: string
  variants?: Variant[]
  reviews?: Review[]
  averageRating?: number
  reviewCount?: number
  createdAt: string
  updatedAt: string
}

export interface Variant {
  id: string
  productId: string
  name: string
  value: string
  price?: number
  stock: number
  image?: string
}

export interface Category {
  id: string
  name: string
  slug: string
  emoji?: string
  description?: string
  image?: string
}

// ─── COMBO TYPES ──────────────────────────────────────────────────────────────

export interface Combo {
  id: string
  name: string
  slug: string
  description: string
  emoji: string
  bannerImage?: string
  price: number
  comparePrice?: number
  occasions: string[]
  tags: string[]
  badge?: string
  products: ComboProduct[]
  isFeatured: boolean
  createdAt: string
}

export interface ComboProduct {
  id: string
  quantity: number
  product: Product
}

// ─── BOX BUILDER TYPES ────────────────────────────────────────────────────────

export interface BoxTheme {
  id: string
  name: string
  slug: string
  emoji: string
  color: string
  gradient?: string
  basePrice: number
  description?: string
}

export interface BuilderItem {
  product: Product
  quantity: number
}

export interface CustomBox {
  theme: BoxTheme
  items: BuilderItem[]
  personalNote?: string
  recipientName?: string
  occasion?: string
  totalPrice: number
}

// ─── CART TYPES ───────────────────────────────────────────────────────────────

export interface CartItem {
  id: string
  type: 'product' | 'combo' | 'custom-box'
  product?: Product
  combo?: Combo
  customBox?: CustomBox
  quantity: number
  price: number
  name: string
  emoji: string
}

// ─── ORDER TYPES ──────────────────────────────────────────────────────────────

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED'

export type PaymentMethod = 'RAZORPAY' | 'STRIPE' | 'COD'
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED'

export interface Order {
  id: string
  orderNumber: string
  status: OrderStatus
  paymentMethod: PaymentMethod
  paymentStatus: PaymentStatus
  subtotal: number
  discount: number
  deliveryCharge: number
  total: number
  couponCode?: string
  personalNote?: string
  recipientName?: string
  trackingNumber?: string
  items: OrderItem[]
  address?: Address
  createdAt: string
  updatedAt: string
}

export interface OrderItem {
  id: string
  name: string
  emoji: string
  quantity: number
  price: number
  isBox: boolean
  product?: Product
  combo?: Combo
}

// ─── USER TYPES ───────────────────────────────────────────────────────────────

export interface User {
  id: string
  name?: string
  email: string
  image?: string
  phone?: string
  role: 'USER' | 'ADMIN'
  loyaltyPoints: number
  referralCode?: string
}

export interface Address {
  id: string
  name: string
  phone: string
  line1: string
  line2?: string
  city: string
  state: string
  pincode: string
  isDefault: boolean
}

// ─── COUPON TYPES ─────────────────────────────────────────────────────────────

export interface Coupon {
  id: string
  code: string
  description?: string
  type: 'PERCENTAGE' | 'FIXED'
  value: number
  minOrder?: number
  maxDiscount?: number
  isActive: boolean
}

// ─── REVIEW TYPES ─────────────────────────────────────────────────────────────

export interface Review {
  id: string
  rating: number
  title?: string
  body?: string
  images: string[]
  isVerified: boolean
  user: { name?: string; image?: string }
  createdAt: string
}

// ─── API RESPONSE TYPES ───────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// ─── FILTER / SORT TYPES ──────────────────────────────────────────────────────

export interface ProductFilters {
  category?: string
  occasion?: string
  minPrice?: number
  maxPrice?: number
  tags?: string[]
  search?: string
  featured?: boolean
  builderOnly?: boolean
}

export type SortOption =
  | 'newest'
  | 'oldest'
  | 'price-asc'
  | 'price-desc'
  | 'popular'
  | 'rating'

// ─── QUIZ TYPES ───────────────────────────────────────────────────────────────

export interface QuizQuestion {
  id: string
  question: string
  subtitle: string
  options: QuizOption[]
}

export interface QuizOption {
  emoji: string
  label: string
  sublabel?: string
  value: string
}

export interface QuizResult {
  occasion: string
  budget: string
  vibe: string
  recommendedCombos: Combo[]
  recommendedProducts: Product[]
}

// ─── ADMIN ANALYTICS TYPES ───────────────────────────────────────────────────

export interface DashboardMetrics {
  totalRevenue: number
  revenueGrowth: number
  totalOrders: number
  ordersGrowth: number
  totalCustomers: number
  newCustomers: number
  avgOrderValue: number
  avgRating: number
}

export interface RevenueDataPoint {
  month: string
  revenue: number
  orders: number
}
