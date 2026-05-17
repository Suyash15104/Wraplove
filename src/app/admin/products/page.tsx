import { getServerSession } from 'next-auth'
import { authOptions }      from '@/lib/auth'
import { redirect }         from 'next/navigation'
import { prisma }           from '@/lib/prisma'
import { AdminSidebar }     from '@/components/admin/AdminSidebar'
import { AdminProductsClient } from '@/components/admin/AdminProductsClient'
import type { Metadata }    from 'next'

export const metadata: Metadata = { title: 'Products — Admin' }

export default async function AdminProductsPage() {
  const session = await getServerSession(authOptions)
  if (!session || session.user?.role !== 'ADMIN') redirect('/auth/login')

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.category.findMany({ orderBy: { sortOrder: 'asc' } }),
  ])

  return (
    <div className="flex min-h-screen bg-beige-100">
      <AdminSidebar />
      <AdminProductsClient
        products={JSON.parse(JSON.stringify(products))}
        categories={JSON.parse(JSON.stringify(categories))}
      />
    </div>
  )
}
