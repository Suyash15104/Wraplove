import { NextRequest, NextResponse } from 'next/server'
import { prisma }           from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions }      from '@/lib/auth'

// GET /api/products/[id]
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        category: true,
        variants: true,
        reviews: {
          include: { user: { select: { name: true, image: true } } },
          where:   { isVisible: true },
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
      },
    })
    if (!product) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
    const avgRating = product.reviews.length
      ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length : null
    return NextResponse.json({ success: true, data: { ...product, averageRating: avgRating, reviewCount: product.reviews.length } })
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Failed to fetch product' }, { status: 500 })
  }
}

// PATCH /api/products/[id] — admin only
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (session?.user?.role !== 'ADMIN') return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 })

    const body = await req.json()
    const product = await prisma.product.update({
      where: { id: params.id },
      data:  {
        ...body,
        price:        body.price        ? parseFloat(body.price)        : undefined,
        comparePrice: body.comparePrice ? parseFloat(body.comparePrice) : undefined,
        stock:        body.stock        ? parseInt(body.stock)           : undefined,
      },
      include: { category: true },
    })
    return NextResponse.json({ success: true, data: product })
  } catch (err: any) {
    if (err.code === 'P2025') return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 })
    return NextResponse.json({ success: false, error: 'Failed to update' }, { status: 500 })
  }
}

// DELETE /api/products/[id] — admin only
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (session?.user?.role !== 'ADMIN') return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 })

    await prisma.product.update({ where: { id: params.id }, data: { isActive: false } }) // soft delete
    return NextResponse.json({ success: true, message: 'Product deactivated' })
  } catch (err: any) {
    if (err.code === 'P2025') return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
    return NextResponse.json({ success: false, error: 'Failed to delete' }, { status: 500 })
  }
}
