import { PrismaClient, CouponType } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding WrapLove database...')

  // Admin user
  const adminPassword = await bcrypt.hash('admin@wraplove123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@wraplove.in' },
    update: {},
    create: {
      name: 'WrapLove Admin',
      email: 'admin@wraplove.in',
      password: adminPassword,
      role: 'ADMIN',
    },
  })
  console.log('✅ Admin user created:', admin.email)

  // Categories
  const categories = await Promise.all([
    prisma.category.upsert({ where: { slug: 'gifts' }, update: {}, create: { name: 'Gifts', slug: 'gifts', emoji: '🎁', sortOrder: 1 } }),
    prisma.category.upsert({ where: { slug: 'jewellery' }, update: {}, create: { name: 'Jewellery', slug: 'jewellery', emoji: '💎', sortOrder: 2 } }),
    prisma.category.upsert({ where: { slug: 'candles' }, update: {}, create: { name: 'Candles', slug: 'candles', emoji: '🕯️', sortOrder: 3 } }),
    prisma.category.upsert({ where: { slug: 'wellness' }, update: {}, create: { name: 'Wellness', slug: 'wellness', emoji: '🌿', sortOrder: 4 } }),
    prisma.category.upsert({ where: { slug: 'accessories' }, update: {}, create: { name: 'Accessories', slug: 'accessories', emoji: '🎀', sortOrder: 5 } }),
    prisma.category.upsert({ where: { slug: 'prints' }, update: {}, create: { name: 'Prints', slug: 'prints', emoji: '📸', sortOrder: 6 } }),
    prisma.category.upsert({ where: { slug: 'decor' }, update: {}, create: { name: 'Decor', slug: 'decor', emoji: '✨', sortOrder: 7 } }),
    prisma.category.upsert({ where: { slug: 'packaging' }, update: {}, create: { name: 'Packaging', slug: 'packaging', emoji: '🎊', sortOrder: 8 } }),
  ])
  console.log('✅ Categories created')

  const catMap = Object.fromEntries(categories.map(c => [c.slug, c]))

  // Products
  const productsData = [
    {
      name: 'Pipe Cleaner Flower Bouquet',
      slug: 'pipe-cleaner-flower-bouquet',
      description: 'A beautiful handcrafted bouquet made from premium pipe cleaners, shaped into delicate blooms. Each flower is individually crafted and stays fresh forever. Perfect for birthdays, anniversaries, and anyone who loves a pop of colour.',
      emoji: '🌸',
      images: ['/images/bouquet-1.jpg', '/images/bouquet-2.jpg'],
      price: 299,
      comparePrice: 399,
      stock: 50,
      tags: ['Handmade', 'Floral', 'Colourful'],
      occasions: ['Birthday', 'BestFriend', 'Romance', 'Anniversary'],
      categoryId: catMap['gifts'].id,
      isFeatured: true,
    },
    {
      name: 'Polaroid Photo Prints',
      slug: 'polaroid-photo-prints',
      description: 'Set of 6 beautifully printed polaroid-style photo prints. Send us your photos and we\'ll print them in vibrant colour with a white border. Each print is 10×15cm on premium glossy paper.',
      emoji: '📸',
      images: ['/images/polaroid-1.jpg'],
      price: 199,
      comparePrice: 279,
      stock: 100,
      tags: ['Photos', 'Memories', 'Personalized'],
      occasions: ['Birthday', 'BestFriend', 'Anniversary'],
      categoryId: catMap['prints'].id,
      isFeatured: true,
    },
    {
      name: 'Pearl Earrings',
      slug: 'pearl-earrings',
      description: 'Dainty freshwater pearl stud earrings set in 18k gold-plated brass. Timeless, elegant, and hypoallergenic. Comes in a beautiful velvet pouch.',
      emoji: '🪞',
      images: ['/images/pearl-earrings.jpg'],
      price: 449,
      comparePrice: 599,
      stock: 30,
      tags: ['Jewellery', 'Premium', 'Gold'],
      occasions: ['Romance', 'Luxury', 'Anniversary'],
      categoryId: catMap['jewellery'].id,
      isFeatured: true,
    },
    {
      name: 'Minimal Gold Necklace',
      slug: 'minimal-gold-necklace',
      description: 'A delicate 18-inch gold-plated chain necklace with a tiny star pendant. Lightweight, elegant, and perfect for layering. Tarnish-resistant and hypoallergenic.',
      emoji: '📿',
      images: ['/images/necklace-1.jpg'],
      price: 649,
      comparePrice: 849,
      stock: 25,
      tags: ['Jewellery', 'Gold', 'Minimal'],
      occasions: ['Romance', 'Luxury', 'Birthday'],
      categoryId: catMap['jewellery'].id,
      isFeatured: true,
    },
    {
      name: 'Cute Hair Clips Set',
      slug: 'cute-hair-clips-set',
      description: 'A curated set of 5 aesthetic hair clips — includes a pearl clip, bow clip, star clip, butterfly clip, and a floral clip. Perfect for the trendy girl in your life.',
      emoji: '🎀',
      images: ['/images/hair-clips.jpg'],
      price: 149,
      comparePrice: 199,
      stock: 80,
      tags: ['Accessories', 'Cute', 'Trendy'],
      occasions: ['Birthday', 'BestFriend'],
      categoryId: catMap['accessories'].id,
    },
    {
      name: 'LED Fairy Lights (2m)',
      slug: 'led-fairy-lights',
      description: '2 metres of warm white LED fairy lights on copper wire. Battery powered, ultra-flexible, perfect for room décor. Creates a warm, cosy ambiance instantly.',
      emoji: '✨',
      images: ['/images/fairy-lights.jpg'],
      price: 249,
      comparePrice: 349,
      stock: 60,
      tags: ['Decor', 'Cozy', 'Lights'],
      occasions: ['Birthday', 'Cozy', 'Dorm'],
      categoryId: catMap['decor'].id,
    },
    {
      name: 'Mini Scented Soy Candle',
      slug: 'mini-scented-soy-candle',
      description: 'Hand-poured soy wax candle with premium fragrance oils. Available in Rose & Vanilla, Jasmine & Sandalwood, or Lavender & Cedarwood. Burns for up to 20 hours.',
      emoji: '🕯️',
      images: ['/images/candle-1.jpg', '/images/candle-2.jpg'],
      price: 349,
      comparePrice: 449,
      stock: 40,
      tags: ['Candle', 'Cozy', 'Soy', 'Scented'],
      occasions: ['Romance', 'Cozy', 'Luxury', 'Birthday'],
      categoryId: catMap['candles'].id,
      isFeatured: true,
    },
    {
      name: 'Aroma Sachet',
      slug: 'aroma-sachet',
      description: 'A beautifully packaged dried flower aroma sachet filled with lavender, jasmine, and rose petals. Keeps your wardrobe, drawers, and bags smelling divine for months.',
      emoji: '🌿',
      images: ['/images/sachet-1.jpg'],
      price: 129,
      comparePrice: 179,
      stock: 75,
      tags: ['Aroma', 'Wellness', 'Natural'],
      occasions: ['Cozy', 'Luxury', 'BestFriend'],
      categoryId: catMap['wellness'].id,
    },
    {
      name: 'Wax Melts Set',
      slug: 'wax-melts-set',
      description: 'A set of 4 highly scented soy wax melt cubes. Use with any wax warmer for hours of fragrance. Scents: Rose, Vanilla, Cedarwood, and Fresh Linen.',
      emoji: '🫧',
      images: ['/images/wax-melts.jpg'],
      price: 199,
      comparePrice: 279,
      stock: 50,
      tags: ['Aroma', 'Cozy', 'Wax'],
      occasions: ['Cozy'],
      categoryId: catMap['candles'].id,
    },
    {
      name: 'Essential Oil Rollerball',
      slug: 'essential-oil-rollerball',
      description: 'A 10ml roll-on essential oil blend in a premium glass bottle. Choose from Calm (lavender + chamomile), Energise (peppermint + eucalyptus), or Love (rose + ylang ylang).',
      emoji: '💧',
      images: ['/images/essential-oil.jpg'],
      price: 279,
      comparePrice: 379,
      stock: 45,
      tags: ['Wellness', 'Premium', 'Aromatherapy'],
      occasions: ['Luxury', 'Cozy', 'Romance'],
      categoryId: catMap['wellness'].id,
    },
    {
      name: 'Box Fillers Set',
      slug: 'box-fillers-set',
      description: 'A generous bundle of premium box fillers — shredded craft paper in cream and blush, gold ribbon curls, dried flower confetti, and mini tissue paper. Makes your gift box look absolutely stunning.',
      emoji: '🎊',
      images: ['/images/fillers.jpg'],
      price: 79,
      comparePrice: 119,
      stock: 200,
      tags: ['Packaging', 'Fillers', 'Essential'],
      occasions: ['Birthday', 'BestFriend', 'Romance', 'Cozy'],
      categoryId: catMap['packaging'].id,
    },
    {
      name: 'Personalized Message Card',
      slug: 'personalized-message-card',
      description: 'A premium 300gsm card printed with your personal message in a beautiful handwritten-style font. Includes a matching envelope. You\'ll never need to look for a card again.',
      emoji: '💌',
      images: ['/images/card-1.jpg'],
      price: 59,
      comparePrice: 89,
      stock: 500,
      tags: ['Card', 'Personal', 'Essential'],
      occasions: ['Birthday', 'BestFriend', 'Romance', 'Cozy', 'Anniversary'],
      categoryId: catMap['packaging'].id,
    },
  ]

  for (const p of productsData) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: p,
    })
  }
  console.log('✅ Products seeded')

  // Box Themes
  const boxThemes = [
    { name: 'Blush Romance', slug: 'blush-romance', emoji: '🌸', color: '#FFF0F5', gradient: 'linear-gradient(135deg, #FFF0F5, #FFD6E7)', basePrice: 149 },
    { name: 'Lavender Dream', slug: 'lavender-dream', emoji: '💜', color: '#F5F0FF', gradient: 'linear-gradient(135deg, #F5F0FF, #E8E0FF)', basePrice: 149 },
    { name: 'Sage Serenity', slug: 'sage-serenity', emoji: '🌿', color: '#F0FFF5', gradient: 'linear-gradient(135deg, #F0FFF5, #DCF0E0)', basePrice: 149 },
    { name: 'Golden Luxury', slug: 'golden-luxury', emoji: '✨', color: '#FFFDF0', gradient: 'linear-gradient(135deg, #FFFDF0, #FFF0C0)', basePrice: 199 },
    { name: 'Noir Elegance', slug: 'noir-elegance', emoji: '🖤', color: '#F5F5F5', gradient: 'linear-gradient(135deg, #F5F5F5, #E8E8E8)', basePrice: 199 },
    { name: 'Surprise Me!', slug: 'surprise-me', emoji: '🎁', color: '#FFF5F8', gradient: 'linear-gradient(135deg, #FFF5F8, #F0EEFF)', basePrice: 129 },
  ]
  for (const bt of boxThemes) {
    await prisma.boxTheme.upsert({ where: { slug: bt.slug }, update: {}, create: { ...bt, isActive: true } })
  }
  console.log('✅ Box themes seeded')

  // Coupons
  await prisma.coupon.upsert({
    where: { code: 'WRAP10' },
    update: {},
    create: { code: 'WRAP10', description: '10% off on all orders', type: CouponType.PERCENTAGE, value: 10, minOrder: 500, isActive: true },
  })
  await prisma.coupon.upsert({
    where: { code: 'LOVE20' },
    update: {},
    create: { code: 'LOVE20', description: '20% off for Valentine\'s', type: CouponType.PERCENTAGE, value: 20, minOrder: 999, maxDiscount: 500, isActive: true },
  })
  await prisma.coupon.upsert({
    where: { code: 'BDAY50' },
    update: {},
    create: { code: 'BDAY50', description: 'Flat ₹50 off on birthday orders', type: CouponType.FIXED, value: 50, minOrder: 299, isActive: true },
  })
  await prisma.coupon.upsert({
    where: { code: 'FIRST15' },
    update: {},
    create: { code: 'FIRST15', description: '15% off for first order', type: CouponType.PERCENTAGE, value: 15, usageLimit: 1, isActive: true },
  })
  console.log('✅ Coupons seeded')

  console.log('🎉 Database seeded successfully!')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
