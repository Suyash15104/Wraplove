import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { AdminDashboardClient } from '@/components/admin/AdminDashboardClient'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Admin Dashboard' }

export default async function AdminPage() {
  const session = await getServerSession(authOptions)
  if (!session || session.user?.role !== 'ADMIN') redirect('/auth/login')

  const now      = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)

  const [
    thisMonthOrders,
    lastMonthOrders,
    totalCustomers,
    newCustomers,
    recentOrders,
    topProducts,
    revenueByMonth,
  ] = await Promise.all([
    prisma.order.aggregate({
      where: { createdAt: { gte: monthStart }, paymentStatus: 'PAID' },
      _sum: { total: true },
      _count: true,
    }),
    prisma.order.aggregate({
      where: { createdAt: { gte: lastMonthStart, lt: monthStart }, paymentStatus: 'PAID' },
      _sum: { total: true },
      _count: true,
    }),
    prisma.user.count({ where: { role: 'USER' } }),
    prisma.user.count({ where: { role: 'USER', createdAt: { gte: monthStart } } }),
    prisma.order.findMany({
      include: { user: { select: { name: true, email: true } }, items: true },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
    prisma.orderItem.groupBy({
      by: ['productId', 'name', 'emoji'],
      where: { productId: { not: null } },
      _sum: { quantity: true },
      _count: { _all: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 8,
    }),
    // Revenue last 6 months
    Promise.all(
      Array.from({ length: 6 }, (_, i) => {
        const start = new Date(now.getFullYear(), now.getMonth() - i, 1)
        const end   = new Date(now.getFullYear(), now.getMonth() - i + 1, 1)
        return prisma.order.aggregate({
          where: { createdAt: { gte: start, lt: end }, paymentStatus: 'PAID' },
          _sum: { total: true },
          _count: true,
        }).then((r) => ({
          month: start.toLocaleString('en-IN', { month: 'short' }),
          revenue: r._sum.total ?? 0,
          orders:  r._count,
        }))
      })
    ),
  ])

  const thisRevenue = thisMonthOrders._sum.total ?? 0
  const lastRevenue = lastMonthOrders._sum.total ?? 0
  const revenueGrowth = lastRevenue > 0 ? ((thisRevenue - lastRevenue) / lastRevenue) * 100 : 0

  const metrics = {
    totalRevenue:  thisRevenue,
    revenueGrowth: Math.round(revenueGrowth),
    totalOrders:   thisMonthOrders._count,
    ordersGrowth:  lastMonthOrders._count > 0
      ? Math.round(((thisMonthOrders._count - lastMonthOrders._count) / lastMonthOrders._count) * 100)
      : 0,
    totalCustomers,
    newCustomers,
    avgOrderValue: thisMonthOrders._count > 0 ? Math.round(thisRevenue / thisMonthOrders._count) : 0,
    avgRating:     4.9,
  }

  return (
    <div className="flex min-h-screen bg-beige-100">
      <AdminSidebar />
      <AdminDashboardClient
        metrics={metrics}
        recentOrders={JSON.parse(JSON.stringify(recentOrders))}
        topProducts={topProducts}
        revenueData={revenueByMonth.reverse()}
      />
    </div>
  )
}
