import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Razorpay from 'razorpay'
import crypto from 'crypto'

const razorpay = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

// POST /api/payments/razorpay/create-order
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const { orderId } = await req.json()

    const order = await prisma.order.findUnique({
      where: { id: orderId, userId: session.user.id },
    })
    if (!order) return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 })

    const razorpayOrder = await razorpay.orders.create({
      amount:   Math.round(order.total * 100), // paise
      currency: 'INR',
      receipt:  order.orderNumber,
      notes:    { orderId: order.id, userId: session.user.id },
    })

    return NextResponse.json({
      success: true,
      data: {
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      },
    })
  } catch (err) {
    console.error('[POST /api/payments/razorpay/create-order]', err)
    return NextResponse.json({ success: false, error: 'Failed to create Razorpay order' }, { status: 500 })
  }
}
