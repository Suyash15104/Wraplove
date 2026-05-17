# 🎁 WrapLove — Premium Gifting Studio

> A full-stack, production-ready e-commerce platform for a customized gifting business.
> Built with Next.js 14, TypeScript, Prisma, TailwindCSS, and Framer Motion.

---

## ✨ Features

### Customer-Facing
- 🏠 **Beautiful Homepage** — animated hero, category cards, featured products, testimonials
- 🛍️ **Shop Page** — real-time search, multi-filter (category, occasion, price), sort options
- 🎁 **Gift Builder** — 3-step interactive custom box creator with live price preview
- 🎀 **Combo Showcase** — curated ready-made hampers with occasion filtering
- 🎯 **Gift Quiz** — AI-style 3-question quiz with personalized recommendations
- 🛒 **Cart Drawer** — animated slide-in cart with coupon codes and quantity controls
- 💳 **Checkout** — multi-step form with Razorpay / Stripe / COD payment options
- 🎉 **Confetti** — celebration animation on successful order placement
- 💌 **Auth** — Google OAuth + email/password via NextAuth
- ❤️ **Wishlist** — persistent across sessions with Zustand + localStorage

### Admin Dashboard
- 📊 **Metrics** — revenue, orders, customers, avg. order value with MoM trends
- 📈 **Revenue Chart** — Recharts bar chart for last 6 months
- 📦 **Orders Table** — status pills, customer info, quick actions
- 🎁 **Products Manager** — add/edit/delete with image upload via Cloudinary
- 👥 **Customers** — full customer list with order history
- 🎫 **Coupons** — create PERCENTAGE or FIXED discount codes with limits/expiry
- 🔥 **Top Products** — visual ranking with progress bars

---

## 🧱 Tech Stack

| Layer       | Tech                                             |
|-------------|--------------------------------------------------|
| Framework   | Next.js 14 (App Router)                          |
| Language    | TypeScript                                       |
| Styling     | Tailwind CSS v3 + custom design tokens           |
| Animations  | Framer Motion                                    |
| Database    | PostgreSQL via Prisma ORM                        |
| Auth        | NextAuth.js (Google + Credentials)               |
| State       | Zustand (cart, wishlist, builder, UI)            |
| Payments    | Razorpay + Stripe                                |
| Images      | Cloudinary + Next.js Image                       |
| Email       | Nodemailer (SMTP)                                |
| Charts      | Recharts                                         |
| Forms       | React Hook Form + Zod validation                 |
| Deployment  | Vercel                                           |

---

## 🚀 Getting Started

### 1. Clone & install

```bash
git clone https://github.com/yourname/wraplove.git
cd wraplove
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Fill in all values in `.env.local`:

- **DATABASE_URL** — PostgreSQL connection string (Neon, Supabase, or local)
- **NEXTAUTH_SECRET** — random string (generate: `openssl rand -base64 32`)
- **GOOGLE_CLIENT_ID / SECRET** — from Google Cloud Console
- **CLOUDINARY_*** — from cloudinary.com dashboard
- **RAZORPAY_*** — from Razorpay dashboard
- **STRIPE_*** — from Stripe dashboard
- **SMTP_*** — Gmail app password or SendGrid

### 3. Set up database

```bash
# Push schema to your database
npm run db:push

# Seed with sample data (products, combos, box themes, coupons)
npm run db:seed

# Open Prisma Studio (optional, for visual DB management)
npm run db:studio
```

### 4. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Admin panel: [http://localhost:3000/admin](http://localhost:3000/admin)
> Log in with `admin@wraplove.in` / `admin@wraplove123` (seeded)

---

## 📁 Project Structure

```
wraplove/
├── prisma/
│   ├── schema.prisma         # Full database schema
│   └── seed.ts               # Seed data (products, combos, coupons)
├── src/
│   ├── app/                  # Next.js App Router pages
│   │   ├── page.tsx          # Homepage
│   │   ├── shop/             # Shop listing
│   │   ├── builder/          # Custom gift builder
│   │   ├── combos/           # Pre-made combos
│   │   ├── quiz/             # Gift recommendation quiz
│   │   ├── checkout/         # Checkout flow
│   │   ├── admin/            # Admin dashboard
│   │   ├── auth/             # Login / Register
│   │   └── api/              # API routes
│   │       ├── products/     # CRUD for products
│   │       ├── combos/       # CRUD for combos
│   │       ├── orders/       # Order management + Razorpay
│   │       ├── coupons/      # Coupon validation
│   │       └── auth/         # NextAuth handler
│   ├── components/
│   │   ├── home/             # Homepage sections
│   │   ├── shop/             # ProductCard, ShopClient, CombosClient
│   │   ├── builder/          # BuilderClient (multi-step)
│   │   ├── checkout/         # CheckoutClient (form + payment)
│   │   ├── admin/            # Dashboard, Sidebar, Tables
│   │   └── layout/           # Navbar, CartDrawer, Footer
│   ├── lib/
│   │   ├── prisma.ts         # Prisma client singleton
│   │   ├── auth.ts           # NextAuth config
│   │   └── utils.ts          # formatPrice, cn, helpers
│   ├── store/
│   │   └── index.ts          # Zustand: cart, wishlist, builder, UI
│   ├── types/
│   │   └── index.ts          # TypeScript type definitions
│   └── styles/
│       └── globals.css       # Tailwind + custom animations
├── tailwind.config.ts        # Custom design tokens
├── next.config.js
├── package.json
└── .env.example
```

---

## 🎨 Design System

| Token        | Value      | Usage                         |
|--------------|------------|-------------------------------|
| `cream`      | `#FAF7F2`  | Page background               |
| `beige`      | `#F0EAE0`  | Cards, inputs, sections       |
| `blush`      | `#F2C4CE`  | Highlights, tags, hover       |
| `rose`       | `#E8849A`  | Primary CTA, active states    |
| `lavender`   | `#DDD6F3`  | Accent sections, banners      |
| `mauve`      | `#9B8EC4`  | Admin, secondary accents      |
| `sage`       | `#C8D8C0`  | Success states, wellness      |
| `gold`       | `#C9A84C`  | Premium badges, ratings       |
| `brand-dark` | `#2C1F14`  | Primary text, footer bg       |
| `brand-muted`| `#7A6652`  | Secondary text, placeholders  |

---

## 🔐 API Routes

| Method | Route                          | Auth    | Description                  |
|--------|-------------------------------|---------|------------------------------|
| GET    | `/api/products`               | Public  | List products with filters   |
| POST   | `/api/products`               | Admin   | Create product               |
| GET    | `/api/orders`                 | User    | List user orders             |
| POST   | `/api/orders`                 | User    | Create order                 |
| POST   | `/api/orders/razorpay`        | User    | Create Razorpay payment      |
| POST   | `/api/coupons`                | Public  | Validate coupon code         |
| POST   | `/api/auth/[...nextauth]`     | Public  | NextAuth handler             |

---

## 💳 Payment Flow

### Razorpay (recommended for India)
1. User fills checkout form → clicks "Place Order"
2. POST `/api/orders` → DB order created with `status: PENDING`
3. POST `/api/orders/razorpay` → Razorpay order created
4. Razorpay modal opens → user pays
5. `handler` callback → POST `/api/orders/razorpay/verify` → signature verified
6. Order updated to `paymentStatus: PAID`, confetti fires

### Cash on Delivery
1. Order created → immediately marked `CONFIRMED`
2. Email confirmation sent via Nodemailer

---

## 🚢 Deployment (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set env vars in Vercel dashboard or:
vercel env add DATABASE_URL
vercel env add NEXTAUTH_SECRET
# ... etc
```

**Database**: Use [Neon](https://neon.tech) or [Supabase](https://supabase.com) for serverless PostgreSQL on Vercel.

---

## 🌱 Seeded Data

After running `npm run db:seed` you'll have:

- **12 Products** — Bouquet, Polaroids, Pearl Earrings, Necklace, Hair Clips, LED Lights, Candle, Sachet, Wax Melts, Essential Oil, Fillers, Card
- **6 Box Themes** — Blush Romance, Lavender Dream, Sage Serenity, Golden Luxury, Noir Elegance, Surprise Me
- **8 Categories** — Gifts, Jewellery, Candles, Wellness, Accessories, Prints, Decor, Packaging
- **4 Coupons** — `WRAP10` (10%), `LOVE20` (20%), `BDAY50` (₹50 off), `FIRST15` (15%)
- **1 Admin** — `admin@wraplove.in` / `admin@wraplove123`

---

## 📦 Key Packages

```
next 14          → App Router, Server Components, Image optimization
@prisma/client   → Type-safe DB queries
next-auth        → Authentication (Google + Credentials)
framer-motion    → Page transitions, micro-animations
zustand          → Client state management
razorpay         → Indian payment gateway
stripe           → International payments
cloudinary       → Image storage and optimization
react-hook-form  → Performant forms
zod              → Runtime type validation
recharts         → Admin analytics charts
lucide-react     → Icon library
react-hot-toast  → Toast notifications
```

---

## 🤝 Contributing

1. Fork the repo
2. Create a branch: `git checkout -b feature/amazing-feature`
3. Commit: `git commit -m 'Add amazing feature'`
4. Push: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

MIT © 2025 WrapLove

---

*Made with 💗 in Chennai, India*
