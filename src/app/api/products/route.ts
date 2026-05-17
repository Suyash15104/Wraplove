import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET /api/products
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const category  = searchParams.get('category')
    const occasion  = searchParams.get('occasion')
    const search    = searchParams.get('search')
    const featured  = searchParams.get('featured')
    const builder   = searchParams.get('builder')
    const sortBy    = searchParams.get('sort') ?? 'newest'
    const page      = parseInt(searchParams.get('page') ?? '1')
    const limit     = parseInt(searchParams.get('limit') ?? '12')
    const minPrice  = searchParams.get('minPrice')
    const maxPrice  = searchParams.get('maxPrice')

    const where: any = { isActive: true }

    if (category)  where.category   = { slug: category }
    if (featured === 'true') where.isFeatured = true
    if (builder === 'true')  where.isBuilderItem = true
    if (occasion)  where.occasions   = { has: occasion }
    if (search)    where.OR = [
      { name:        { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { tags:        { has: search } },
    ]
    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) where.price.gte = parseFloat(minPrice)
      if (maxPrice) where.price.lte = parseFloat(maxPrice)
    }

    const orderBy = {
      newest:    { createdAt: 'desc' as const },
      oldest:    { createdAt: 'asc'  as const },
      'price-asc':  { price: 'asc'  as const },
      'price-desc': { price: 'desc' as const },
    }[sortBy] ?? { createdAt: 'desc' as const }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
          reviews: { select: { rating: true } },
        },
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where }),
    ])

    // Compute average rating
    const enriched = products.map((p) => ({
      ...p,
      averageRating: p.reviews.length
        ? p.reviews.reduce((sum, r) => sum + r.rating, 0) / p.reviews.length
        : null,
      reviewCount: p.reviews.length,
      reviews: undefined,
    }))

    return NextResponse.json({
      success: true,
      data: enriched,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    })
  } catch (err) {
    console.error('[GET /api/products]', err)
    return NextResponse.json({ success: false, error: 'Failed to fetch products' }, { status: 500 })
  }
}

// POST /api/products — admin only
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (session?.user?.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 })
    }

    const body = await req.json()
    const { name, slug, description, emoji, images, price, comparePrice, cost, sku,
            stock, minStock, categoryId, tags, occasions, isFeatured, isBuilderItem, weight } = body

    if (!name || !slug || !description || !emoji || !price || !categoryId) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
    }

    const product = await prisma.product.create({
      data: {
        name, slug, description, emoji,
        images: images ?? [],
        price: parseFloat(price),
        comparePrice: comparePrice ? parseFloat(comparePrice) : null,
        cost: cost ? parseFloat(cost) : null,
        sku: sku || null,
        stock: parseInt(stock ?? '0'),
        minStock: parseInt(minStock ?? '5'),
        categoryId,
        tags: tags ?? [],
        occasions: occasions ?? [],
        isFeatured: Boolean(isFeatured),
        isBuilderItem: Boolean(isBuilderItem ?? true),
        weight: weight ? parseFloat(weight) : null,
      },
      include: { category: true },
    })

    return NextResponse.json({ success: true, data: product }, { status: 201 })
  } catch (err: any) {
    if (err.code === 'P2002') {
      return NextResponse.json({ success: false, error: 'Slug already exists' }, { status: 409 })
    }
    console.error('[POST /api/products]', err)
    return NextResponse.json({ success: false, error: 'Failed to create product' }, { status: 500 })
  }
}
