'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'

const FLOAT_ITEMS = [
  { emoji: '🌸', label: 'Pipe Cleaner Bouquet', color: '#FFF0F5', delay: 0,   top: '18%', left: '-5%' },
  { emoji: '💎', label: 'Pearl Earrings',        color: '#F5F0FF', delay: 1.5, top: '60%', right: '-5%' },
  { emoji: '📸', label: 'Polaroids',             color: '#F0FFF5', delay: 3,   top: '80%', left: '5%' },
  { emoji: '🕯️', label: 'Scented Candle',        color: '#FFFDF0', delay: 0.8, top: '25%', right: '0%' },
]

const STATS = [
  { value: '1.2K+', label: 'Happy Customers' },
  { value: '48h',   label: 'Avg. Delivery' },
  { value: '100%',  label: 'Handcrafted' },
  { value: '4.9★',  label: 'Avg. Rating' },
]

export function HeroSection() {
  return (
    <section className="relative min-h-[calc(100vh-64px)] flex items-center overflow-hidden bg-gradient-hero">
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="blob w-80 h-80 bg-blush-300 opacity-30 -top-20 right-0 delay-0" />
        <div className="blob w-64 h-64 bg-lavender-300 opacity-25 bottom-10 right-1/4 delay-2" />
        <div className="blob w-48 h-48 bg-sage-300 opacity-25 bottom-0 left-10 delay-4" />
        <div className="blob w-56 h-56 bg-gold-200 opacity-20 top-1/4 left-1/3 delay-1" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 w-full py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">

        {/* Left — content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="inline-flex items-center gap-2 bg-blush-100 text-rose
                       text-xs font-medium px-4 py-1.5 rounded-full mb-6 tracking-wide"
          >
            <Sparkles size={12} />
            Premium Gifting Studio ✦
          </motion.div>

          <h1 className="font-display text-display-lg lg:text-display-xl font-semibold text-brand-dark mb-6 text-balance">
            Make Every Gift<br />
            Feel Like a{' '}
            <em className="text-rose not-italic">Love Letter</em>
          </h1>

          <p className="text-brand-muted text-lg leading-relaxed mb-8 max-w-[460px]">
            Handcrafted gift boxes, aesthetic combos, and personalized hampers —
            designed to make someone feel truly seen and celebrated.
          </p>

          <div className="flex flex-wrap gap-3 mb-10">
            <Link href="/builder" className="btn-primary btn-lg group">
              ✨ Build Your Gift
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/shop" className="btn-outline btn-lg">
              Browse Collection
            </Link>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-8">
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
              >
                <div className="font-display text-2xl font-semibold text-brand-dark">{s.value}</div>
                <div className="text-xs text-brand-muted mt-0.5">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right — gift visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="relative hidden lg:flex justify-center items-center"
        >
          <div className="relative w-[420px] h-[480px]">
            {/* Central gift box */}
            <motion.div
              animate={{ y: [0, -14, 0], rotate: [-1, 1, -1] }}
              transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                         w-52 h-52 bg-gradient-brand rounded-3xl shadow-hover
                         flex items-center justify-center text-7xl"
            >
              🎁
            </motion.div>

            {/* Floating items */}
            {FLOAT_ITEMS.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
                transition={{
                  opacity: { delay: 0.6 + i * 0.15, duration: 0.4 },
                  y: { repeat: Infinity, duration: 4, delay: item.delay, ease: 'easeInOut' },
                }}
                style={{ top: item.top, left: item.left, right: item.right }}
                className="absolute"
              >
                <div
                  className="flex items-center gap-2 px-3 py-2 rounded-2xl shadow-card backdrop-blur-sm
                             bg-white/80 text-sm font-medium text-brand-dark whitespace-nowrap"
                  style={{ background: item.color + 'CC' }}
                >
                  <span className="text-xl">{item.emoji}</span>
                  {item.label}
                </div>
              </motion.div>
            ))}

            {/* Decorative dots */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.8, 0.4] }}
                transition={{ repeat: Infinity, duration: 2 + i * 0.5, delay: i * 0.3 }}
                className="absolute w-2.5 h-2.5 rounded-full bg-rose/30"
                style={{
                  top: `${15 + i * 14}%`,
                  left: `${[85, 10, 90, 5, 80, 15][i]}%`,
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
      >
        <span className="text-xs text-brand-muted tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-5 h-8 rounded-full border-2 border-brand-muted/40 flex items-start justify-center pt-1.5"
        >
          <div className="w-1 h-2 rounded-full bg-brand-muted/60" />
        </motion.div>
      </motion.div>
    </section>
  )
}
