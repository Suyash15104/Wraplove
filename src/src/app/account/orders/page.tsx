import { getServerSession } from 'next-auth'
import { authOptions }      from '@/lib/auth'
import { redirect }         from 'next/navigation'
import { prisma }           from '@/lib/prisma'
import { Footer }           from '@/components/layout/Footer'
import { formatPrice, formatDate, ORDER_STATUS_CONFIG, cn } from '@/lib/utils'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'My Orders — WrapLove' }

export default async function OrdersPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/auth/login')

  const orders = await prisma.order.findMany({
    where:   { userId: session.user.id },
    include: { items: true, address: true },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <>
      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-12">
        <div className="mb-8">
          <h1 className="font-display text-display-sm font-semibold mb-1">My Orders</h1>
          <p className="text-brand-muted">Track and manage your WrapLove orders</p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-4xl shadow-soft">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="font-display text-xl font-semibold mb-2">No orders yet</h2>
            <p className="text-brand-muted mb-6">Time to treat yourself or someone special!</p>
            <Link href="/shop" className="btn-primary btn-lg">Shop Now ✦</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const cfg = ORDER_STATUS_CONFIG[order.status as keyof typeof ORDER_STATUS_CONFIG]
              return (
                <div key={order.id} className="bg-white rounded-3xl p-6 shadow-soft">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <p className="font-semibold text-brand-dark">#{order.orderNumber}</p>
                        <span className={cn('badge', cfg.color)}>
                          {cfg.icon} {cfg.label}
                        </span>
                      </div>
                      <p className="text-xs text-brand-muted">
                        Placed on {formatDate(order.createdAt)} ·{' '}
                        {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <p className="font-display text-xl font-semibold text-brand-dark">
                      {formatPrice(order.total)}
                    </p>
                  </div>

                  {/* Items */}
                  <div className="flex gap-2 mb-4 flex-wrap">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-1.5 bg-beige-100 rounded-full px-3 py-1.5 text-xs">
                        <span>{item.emoji}</span>
                        <span className="text-brand-muted">{item.name}</span>
                        {item.quantity > 1 && <span className="text-rose font-medium">×{item.quantity}</span>}
                      </div>
                    ))}
                  </div>

                  {/* Address */}
                  {order.address && (
                    <p className="text-xs text-brand-muted mb-4">
                      📍 {order.address.line1}, {order.address.city} {order.address.pincode}
                    </p>
                  )}

                  {/* Tracking */}
                  {order.trackingNumber && (
                    <div className="bg-sage-100 rounded-2xl px-4 py-3 text-sm mb-4">
                      <span className="text-brand-muted">Tracking: </span>
                      <span className="font-medium text-brand-dark">{order.trackingNumber}</span>
                    </div>
                  )}

                  {/* Status progress */}
                  <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
                    {['CONFIRMED', 'PROCESSING', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'].map((s, i, arr) => {
                      const statuses = ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'PENDING']
                      const currentIdx = statuses.indexOf(order.status)
                      const stepIdx    = statuses.indexOf(s)
                      const isActive   = stepIdx <= currentIdx
                      const isCurrent  = s === order.status
                      return (
                        <div key={s} className="flex items-center gap-1 flex-shrink-0">
                          <div className={cn(
                            'w-2 h-2 rounded-full transition-all',
                            isCurrent ? 'w-3 h-3 bg-rose' : isActive ? 'bg-sage-400' : 'bg-beige-200'
                          )} />
                          <span className={cn('text-[10px] whitespace-nowrap', isActive ? 'text-brand-dark' : 'text-brand-muted')}>
                            {ORDER_STATUS_CONFIG[s as keyof typeof ORDER_STATUS_CONFIG]?.label}
                          </span>
                          {i < arr.length - 1 && <div className={cn('h-px w-6 mx-1', isActive ? 'bg-sage-300' : 'bg-beige-200')} />}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
      <Footer />
    </>
  )
}
