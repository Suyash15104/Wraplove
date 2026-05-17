import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json()
    if (!code) return NextResponse.json({ success: false, error: 'Coupon code required' }, { status: 400 })

    const coupon = await prisma.coupon.findUnique({ where: { code: code.toUpperCase().trim() } })

    if (!coupon) return NextResponse.json({ success: false, error: 'Coupon not found' }, { status: 404 })
    if (!coupon.isActive) return NextResponse.json({ success: false, error: 'Coupon is no longer active' }, { status: 400 })
    if (coupon.endDate && new Date() > coupon.endDate) return NextResponse.json({ success: false, error: 'Coupon has expired' }, { status: 400 })
    if (coupon.startDate && new Date() < coupon.startDate) return NextResponse.json({ success: false, error: 'Coupon is not yet active' }, { status: 400 })
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) return NextResponse.json({ success: false, error: 'Coupon usage limit reached' }, { status: 400 })

    return NextResponse.json({
      success: true,
      coupon: {
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        minOrder: coupon.minOrder,
        maxDiscount: coupon.maxDiscount,
        description: coupon.description,
      },
    })
  } catch (err) {
    console.error('[POST /api/coupons/validate]', err)
    return NextResponse.json({ success: false, error: 'Failed to validate coupon' }, { status: 500 })
  }
}
