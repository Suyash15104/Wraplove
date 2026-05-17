'use client'

import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, ShoppingBag, Users, Star, IndianRupee } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { formatPrice, formatRelativeDate, ORDER_STATUS_CONFIG, cn } from '@/lib/utils'
import type { DashboardMetrics } from '@/types'

interface AdminDashboardClientProps {
  metrics: DashboardMetrics
  recentOrders: any[]
  topProducts: any[]
  revenueData: { month: string; revenue: number; orders: number }[]
}

const METRIC_CARDS = (m: DashboardMetrics) => [
  {
    label:  'Revenue (This Month)',
    value:  formatPrice(m.totalRevenue),
    growth: m.revenueGrowth,
    icon:   IndianRupee,
    color:  'bg-blush-100 text-rose',
  },
  {
    label:  'Orders (This Month)',
    value:  m.totalOrders.toString(),
    growth: m.ordersGrowth,
    icon:   ShoppingBag,
    color:  'bg-lavender-100 text-mauve',
  },
  {
    label:  'Total Customers',
    value:  m.totalCustomers.toLocaleString(),
    growth: m.newCustomers,
    growthLabel: `+${m.newCustomers} this month`,
    icon:   Users,
    color:  'bg-sage-100 text-sage-400',
  },
  {
    label:  'Avg. Order Value',
    value:  formatPrice(m.avgOrderValue),
    growth: null,
    icon:   Star,
    color:  'bg-gold-100 text-gold',
  },
]

function MetricCard({ label, value, growth, growthLabel, icon: Icon, color, index }: any) {
  const isPositive = growth === null ? true : growth >= 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="bg-white rounded-2xl p-5 shadow-soft"
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${color}`}>
        <Icon size={18} />
      </div>
      <div className="font-display text-2xl font-semibold text-brand-dark mb-0.5">{value}</div>
      <div className="text-xs text-brand-muted mb-2">{label}</div>
      {growth !== null && (
        <div className={`flex items-center gap-1 text-xs font-medium ${isPositive ? 'text-green-600' : 'text-rose'}`}>
          {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {growthLabel ?? `${isPositive ? '+' : ''}${growth}% vs last month`}
        </div>
      )}
    </motion.div>
  )
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-brand-dark text-white rounded-xl px-3 py-2 text-xs shadow-lg">
      <p className="font-medium mb-1">{label}</p>
      <p>Revenue: {formatPrice(payload[0]?.value ?? 0)}</p>
      <p className="text-white/60">Orders: {payload[1]?.value ?? 0}</p>
    </div>
  )
}

export function AdminDashboardClient({ metrics, recentOrders, topProducts, revenueData }: AdminDashboardClientProps) {
  const cards = METRIC_CARDS(metrics)

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-2xl font-semibold text-brand-dark">Dashboard ✦</h1>
            <p className="text-sm text-brand-muted mt-1">
              Welcome back! Here's what's happening with WrapLove today.
            </p>
          </div>
          <div className="text-sm text-brand-muted bg-white rounded-xl px-4 py-2 shadow-soft">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </div>

        {/* Metric cards */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          {cards.map((card, i) => (
            <MetricCard key={card.label} {...card} index={i} />
          ))}
        </div>

        {/* Revenue chart + top products */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6 mb-8">
          {/* Revenue chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="bg-white rounded-2xl p-6 shadow-soft"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-semibold text-brand-dark">Revenue Overview</h2>
                <p className="text-xs text-brand-muted mt-0.5">Last 6 months</p>
              </div>
              <span className={cn(
                'text-xs font-medium px-2.5 py-1 rounded-full',
                metrics.revenueGrowth >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              )}>
                {metrics.revenueGrowth >= 0 ? '+' : ''}{metrics.revenueGrowth}% MoM
              </span>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={revenueData} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0EAE0" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#7A6652' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#7A6652' }} axisLine={false} tickLine={false}
                  tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F0EAE0' }} />
                <Bar dataKey="revenue" fill="#E8849A" radius={[6, 6, 0, 0]} />
                <Bar dataKey="orders" fill="#DDD6F3" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex gap-4 mt-3">
              <div className="flex items-center gap-1.5 text-xs text-brand-muted">
                <div className="w-3 h-3 rounded-full bg-rose" /> Revenue
              </div>
              <div className="flex items-center gap-1.5 text-xs text-brand-muted">
                <div className="w-3 h-3 rounded-full bg-lavender-300" /> Orders
              </div>
            </div>
          </motion.div>

          {/* Top products */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-6 shadow-soft"
          >
            <h2 className="font-semibold text-brand-dark mb-4">🔥 Top Products</h2>
            <div className="space-y-3">
              {topProducts.map((item: any, i: number) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-beige-100 rounded-xl flex items-center justify-center text-lg flex-shrink-0">
                    {item.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-brand-dark truncate">{item.name}</p>
                    <div className="h-1.5 bg-beige-100 rounded-full mt-1.5 overflow-hidden">
                      <div
                        className="h-full bg-rose rounded-full"
                        style={{ width: `${Math.min(100, ((item._sum?.quantity ?? 1) / (topProducts[0]?._sum?.quantity ?? 1)) * 100)}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-xs text-brand-muted flex-shrink-0">
                    {item._sum?.quantity ?? 0} sold
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Recent orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-soft overflow-hidden"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-beige-100">
            <h2 className="font-semibold text-brand-dark">Recent Orders</h2>
            <a href="/admin/orders" className="text-xs text-rose hover:underline">View all →</a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-beige-100 bg-beige-100/50">
                  {['Order', 'Customer', 'Items', 'Total', 'Date', 'Status'].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-medium text-brand-muted">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-beige-100">
                {recentOrders.map((order) => {
                  const cfg = ORDER_STATUS_CONFIG[order.status as keyof typeof ORDER_STATUS_CONFIG]
                  return (
                    <tr key={order.id} className="hover:bg-beige-100/40 transition-colors">
                      <td className="px-5 py-3.5 font-medium text-brand-dark whitespace-nowrap">
                        #{order.orderNumber}
                      </td>
                      <td className="px-5 py-3.5 text-brand-muted">
                        {order.user?.name ?? 'Guest'}
                      </td>
                      <td className="px-5 py-3.5 text-brand-muted">
                        {order.items.slice(0, 2).map((i: any) => i.emoji).join(' ')}
                        {order.items.length > 2 && <span className="text-xs"> +{order.items.length - 2}</span>}
                      </td>
                      <td className="px-5 py-3.5 font-display font-semibold text-brand-dark whitespace-nowrap">
                        {formatPrice(order.total)}
                      </td>
                      <td className="px-5 py-3.5 text-brand-muted text-xs whitespace-nowrap">
                        {formatRelativeDate(order.createdAt)}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={cn('badge', cfg.color)}>
                          {cfg.icon} {cfg.label}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
