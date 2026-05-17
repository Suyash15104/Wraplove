'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CreditCard, Truck, MessageSquare, ShieldCheck, ChevronRight, Loader2 } from 'lucide-react'
import { useCartStore } from '@/store'
import { formatPrice, cn } from '@/lib/utils'
import axios from 'axios'
import toast from 'react-hot-toast'
import dynamic from 'next/dynamic'

const Confetti = dynamic(() => import('react-confetti'), { ssr: false })

const addressSchema = z.object({
  name:    z.string().min(2, 'Name is required'),
  phone:   z.string().regex(/^[6-9]\d{9}$/, 'Invalid phone number'),
  line1:   z.string().min(5, 'Address is required'),
  line2:   z.string().optional(),
  city:    z.string().min(2, 'City is required'),
  state:   z.string().min(2, 'State is required'),
  pincode: z.string().regex(/^\d{6}$/, 'Invalid PIN code'),
})

type AddressForm = z.infer<typeof addressSchema>

type PaymentMethod = 'RAZORPAY' | 'STRIPE' | 'COD'

const PAYMENT_OPTIONS: { id: PaymentMethod; label: string; icon: string; description: string }[] = [
  { id: 'RAZORPAY', label: 'Razorpay',       icon: '💳', description: 'Cards, UPI, Wallets, Net Banking' },
  { id: 'STRIPE',   label: 'Stripe',          icon: '🌐', description: 'International cards & payments' },
  { id: 'COD',      label: 'Cash on Delivery', icon: '💵', description: 'Pay when your order arrives' },
]

export function CheckoutClient() {
  const router = useRouter()
  const { items, subtotal, discount, deliveryCharge, total, coupon, clearCart } = useCartStore()
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('RAZORPAY')
  const [personalNote, setPersonalNote]   = useState('')
  const [recipientName, setRecipientName] = useState('')
  const [loading, setLoading]             = useState(false)
  const [success, setSuccess]             = useState(false)
  const [orderNum, setOrderNum]           = useState('')
  const [windowSize, setWindowSize]       = useState({ width: 0, height: 0 })

  const { register, handleSubmit, formState: { errors } } = useForm<AddressForm>({
    resolver: zodResolver(addressSchema),
  })

  const onSubmit = async (address: AddressForm) => {
    if (!items.length) {
      toast.error('Your cart is empty!')
      return
    }
    setLoading(true)
    try {
      // Create order
      const orderPayload = {
        items: items.map((item) => ({
          type:      item.type,
          productId: item.product?.id,
          comboId:   item.combo?.id,
          name:      item.name,
          emoji:     item.emoji,
          price:     item.price,
          quantity:  item.quantity,
          isBox:     item.type === 'custom-box',
          boxData:   item.customBox,
        })),
        paymentMethod,
        couponCode:    coupon?.code,
        personalNote,
        recipientName,
      }

      const { data: orderData } = await axios.post('/api/orders', orderPayload)
      if (!orderData.success) throw new Error(orderData.error)

      const order = orderData.data

      if (paymentMethod === 'RAZORPAY') {
        // Create Razorpay order
        const { data: rzpData } = await axios.post('/api/orders/razorpay', { orderId: order.id })

        const options = {
          key:         rzpData.data.keyId,
          amount:      rzpData.data.amount,
          currency:    'INR',
          name:        'WrapLove',
          description: 'Premium Gift Box',
          order_id:    rzpData.data.razorpayOrderId,
          handler:     async (response: any) => {
            await axios.post('/api/orders/razorpay/verify', {
              orderId:              order.id,
              razorpay_payment_id:  response.razorpay_payment_id,
              razorpay_order_id:    response.razorpay_order_id,
              razorpay_signature:   response.razorpay_signature,
            })
            handleSuccess(order.orderNumber)
          },
          prefill: { name: address.name, contact: address.phone },
          theme:   { color: '#E8849A' },
        }

        if (typeof window !== 'undefined' && (window as any).Razorpay) {
          const rzp = new (window as any).Razorpay(options)
          rzp.open()
        } else {
          toast.error('Razorpay SDK not loaded. Please refresh.')
        }
      } else if (paymentMethod === 'COD') {
        handleSuccess(order.orderNumber)
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error ?? 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function handleSuccess(orderNumber: string) {
    setOrderNum(orderNumber)
    setSuccess(true)
    clearCart()
    if (typeof window !== 'undefined') {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    }
    setTimeout(() => router.push('/account/orders'), 5000)
  }

  if (!items.length && !success) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="text-6xl mb-4">🛍️</div>
        <h2 className="font-display text-2xl font-semibold mb-2">Your cart is empty</h2>
        <p className="text-brand-muted mb-6">Add some beautiful gifts before checking out!</p>
        <a href="/shop" className="btn-primary">Browse Shop ✦</a>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 relative">
        {windowSize.width > 0 && (
          <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={300}
            colors={['#F2C4CE', '#DDD6F3', '#C8D8C0', '#C9A84C', '#E8849A']} />
        )}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 12 }}
          className="bg-white rounded-4xl p-10 shadow-hover max-w-md w-full"
        >
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="font-display text-3xl font-semibold text-brand-dark mb-2">Order Placed!</h2>
          <p className="text-brand-muted mb-4">
            Your gift is being packed with love and care.
          </p>
          <div className="bg-blush-100 rounded-2xl px-5 py-3 mb-6 inline-block">
            <p className="text-xs text-brand-muted">Order Number</p>
            <p className="font-display text-xl font-semibold text-rose">#{orderNum}</p>
          </div>
          <p className="text-sm text-brand-muted">
            You'll receive a confirmation email shortly. Redirecting to your orders...
          </p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-12">
      <div className="mb-8">
        <h1 className="font-display text-display-sm font-semibold mb-1">Checkout</h1>
        <p className="text-brand-muted">Almost there — you're about to make someone's day ✨</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">

          {/* LEFT — form sections */}
          <div className="space-y-5">

            {/* Delivery address */}
            <div className="bg-white rounded-3xl p-6 shadow-soft">
              <h2 className="font-display text-lg font-semibold mb-5 flex items-center gap-2">
                <Truck size={18} className="text-rose" /> Delivery Address
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2 grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-brand-muted block mb-1.5">Full Name *</label>
                    <input {...register('name')} className={cn('input', errors.name && 'border-rose')} placeholder="Priya Sharma" />
                    {errors.name && <p className="text-xs text-rose mt-1">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="text-xs font-medium text-brand-muted block mb-1.5">Phone *</label>
                    <input {...register('phone')} className={cn('input', errors.phone && 'border-rose')} placeholder="98765 43210" />
                    {errors.phone && <p className="text-xs text-rose mt-1">{errors.phone.message}</p>}
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-medium text-brand-muted block mb-1.5">Address Line 1 *</label>
                  <input {...register('line1')} className={cn('input', errors.line1 && 'border-rose')} placeholder="Flat 4B, Sunrise Apartments, MG Road" />
                  {errors.line1 && <p className="text-xs text-rose mt-1">{errors.line1.message}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-medium text-brand-muted block mb-1.5">Address Line 2</label>
                  <input {...register('line2')} className="input" placeholder="Near Inox Cinema (optional)" />
                </div>
                <div>
                  <label className="text-xs font-medium text-brand-muted block mb-1.5">City *</label>
                  <input {...register('city')} className={cn('input', errors.city && 'border-rose')} placeholder="Chennai" />
                  {errors.city && <p className="text-xs text-rose mt-1">{errors.city.message}</p>}
                </div>
                <div>
                  <label className="text-xs font-medium text-brand-muted block mb-1.5">State *</label>
                  <input {...register('state')} className={cn('input', errors.state && 'border-rose')} placeholder="Tamil Nadu" />
                  {errors.state && <p className="text-xs text-rose mt-1">{errors.state.message}</p>}
                </div>
                <div>
                  <label className="text-xs font-medium text-brand-muted block mb-1.5">PIN Code *</label>
                  <input {...register('pincode')} className={cn('input', errors.pincode && 'border-rose')} placeholder="600001" maxLength={6} />
                  {errors.pincode && <p className="text-xs text-rose mt-1">{errors.pincode.message}</p>}
                </div>
              </div>
            </div>

            {/* Payment method */}
            <div className="bg-white rounded-3xl p-6 shadow-soft">
              <h2 className="font-display text-lg font-semibold mb-5 flex items-center gap-2">
                <CreditCard size={18} className="text-rose" /> Payment Method
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {PAYMENT_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setPaymentMethod(opt.id)}
                    className={cn(
                      'p-4 rounded-2xl border-2 text-left transition-all duration-200',
                      paymentMethod === opt.id
                        ? 'border-rose bg-blush-100'
                        : 'border-beige-200 hover:border-blush-300'
                    )}
                  >
                    <span className="text-2xl block mb-2">{opt.icon}</span>
                    <p className="text-sm font-medium text-brand-dark">{opt.label}</p>
                    <p className="text-xs text-brand-muted mt-0.5">{opt.description}</p>
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 mt-4 text-xs text-brand-muted">
                <ShieldCheck size={14} className="text-sage-400" />
                256-bit SSL encryption. Your payment info is never stored.
              </div>
            </div>

            {/* Personalization */}
            <div className="bg-white rounded-3xl p-6 shadow-soft">
              <h2 className="font-display text-lg font-semibold mb-5 flex items-center gap-2">
                <MessageSquare size={18} className="text-rose" /> Gift Personalization
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-brand-muted block mb-1.5">Recipient Name</label>
                  <input
                    className="input"
                    placeholder="To: Riya ✦"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-brand-muted block mb-1.5">
                    Personal Message Card
                    <span className="text-brand-muted font-normal ml-1">(will be beautifully printed)</span>
                  </label>
                  <textarea
                    className="input min-h-[100px] resize-none"
                    placeholder={'Write from your heart... 💌\n"Happy Birthday gorgeous! You deserve all the good things..."'}
                    value={personalNote}
                    maxLength={500}
                    onChange={(e) => setPersonalNote(e.target.value)}
                  />
                  <p className="text-xs text-brand-muted mt-1 text-right">{personalNote.length}/500</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT — order summary */}
          <div className="sticky top-24">
            <div className="bg-white rounded-3xl p-6 shadow-soft mb-4">
              <h2 className="font-display text-lg font-semibold mb-5">Order Summary</h2>

              <div className="space-y-3 mb-5 max-h-64 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 items-center">
                    <div className="w-10 h-10 bg-gradient-brand rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                      {item.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-brand-dark truncate">{item.name}</p>
                      <p className="text-xs text-brand-muted">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold text-brand-dark flex-shrink-0">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Price breakdown */}
              <div className="space-y-2 border-t border-beige-100 pt-4">
                <div className="flex justify-between text-sm text-brand-muted">
                  <span>Subtotal</span><span>{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-sage-400">
                    <span>Discount ({coupon?.code})</span>
                    <span>−{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm text-brand-muted">
                  <span>Delivery</span>
                  <span>{deliveryCharge === 0 ? <span className="text-sage-400 font-medium">FREE</span> : formatPrice(deliveryCharge)}</span>
                </div>
                <div className="flex justify-between font-semibold text-brand-dark pt-2 border-t border-beige-100 text-base">
                  <span>Total</span>
                  <span className="font-display text-xl">{formatPrice(total)}</span>
                </div>
              </div>

              {deliveryCharge === 0 && (
                <div className="mt-3 bg-sage-100 rounded-xl px-3 py-2 text-xs text-sage-400 font-medium flex items-center gap-1.5">
                  🎁 You qualify for free delivery!
                </div>
              )}
            </div>

            {/* Place order CTA */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full btn-lg disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <><Loader2 size={18} className="animate-spin" /> Processing...</>
              ) : (
                <>🎉 Place Order — {formatPrice(total)} <ChevronRight size={16} /></>
              )}
            </button>
            <p className="text-xs text-center text-brand-muted mt-3">
              By placing your order, you agree to our{' '}
              <a href="/terms" className="underline">Terms</a> &{' '}
              <a href="/privacy" className="underline">Privacy Policy</a>
            </p>
          </div>
        </div>
      </form>
    </div>
  )
}
