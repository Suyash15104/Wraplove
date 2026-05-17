import { NextRequest, NextResponse } from 'next/server'
import { prisma }           from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions }      from '@/lib/auth'
import { generateOrderNumber, applyCouponDiscount } from '@/lib/utils'

// GET /api/orders
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const isAdmin = session.user.role === 'ADMIN'
    const page    = parseInt(searchParams.get('page') ?? '1')
    const limit   = parseInt(searchParams.get('limit') ?? '20')
    const status  = searchParams.get('status')

    const where: any = isAdmin ? {} : { userId: session.user.id }
    if (status) where.status = status

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items:   true,
          address: true,
          user:    isAdmin ? { select: { id: true, name: true, email: true } } : false,
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.order.count({ where }),
    ])

    return NextResponse.json({ success: true, data: orders, total, page, limit, totalPages: Math.ceil(total / limit) })
  } catch (err) {
    console.error('[GET /api/orders]', err)
    return NextResponse.json({ success: false, error: 'Failed to fetch orders' }, { status: 500 })
  }
}

// POST /api/orders — create new order
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { items, addressId, paymentMethod, couponCode, personalNote, recipientName } = body

    if (!items?.length || !paymentMethod) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
    }

    // Validate & calculate prices
    let subtotal = 0
    const orderItems: any[] = []

    for (const item of items) {
      if (item.type === 'product') {
        const product = await prisma.product.findUnique({ where: { id: item.productId } })
        if (!product || !product.isActive) return NextResponse.json({ success: false, error: `Product not found: ${item.productId}` }, { status: 400 })
        const linePrice = product.price * item.quantity
        subtotal += linePrice
        orderItems.push({ productId: product.id, name: product.name, emoji: product.emoji, quantity: item.quantity, price: product.price })
      } else if (item.type === 'combo') {
        const combo = await prisma.combo.findUnique({ where: { id: item.comboId } })
        if (!combo || !combo.isActive) return NextResponse.json({ success: false, error: `Combo not found` }, { status: 400 })
        subtotal += combo.price * item.quantity
        orderItems.push({ comboId: combo.id, name: combo.name, emoji: combo.emoji, quantity: item.quantity, price: combo.price })
      } else if (item.type === 'custom-box') {
        subtotal += item.price * item.quantity
        orderItems.push({ name: item.name, emoji: item.emoji, quantity: item.quantity, price: item.price, isBox: true, boxData: item.boxData })
      }
    }

    // Apply coupon
    let discount = 0
    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({ where: { code: couponCode, isActive: true } })
      if (coupon) {
        discount = applyCouponDiscount(subtotal, coupon)
        await prisma.coupon.update({ where: { code: couponCode }, data: { usedCount: { increment: 1 } } })
      }
    }

    const deliveryCharge = (subtotal - discount) >= 999 ? 0 : 79
    const total = subtotal - discount + deliveryCharge

    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId: session.user.id,
        addressId: addressId || null,
        status: 'PENDING',
        paymentMethod,
        paymentStatus: paymentMethod === 'COD' ? 'PENDING' : 'PENDING',
        subtotal,
        discount,
        deliveryCharge,
        total,
        couponCode: couponCode || null,
        personalNote: personalNote || null,
        recipientName: recipientName || null,
        items: { create: orderItems },
      },
      include: { items: true, address: true },
    })

    return NextResponse.json({ success: true, data: order }, { status: 201 })
  } catch (err) {
    console.error('[POST /api/orders]', err)
    return NextResponse.json({ success: false, error: 'Failed to create order' }, { status: 500 })
  }
}
