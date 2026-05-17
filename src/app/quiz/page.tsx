'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useCartStore } from '@/store'
import { formatPrice, cn } from '@/lib/utils'
import { Footer } from '@/components/layout/Footer'

const QUIZ_QUESTIONS = [
  {
    id:       'recipient',
    question: "Who are you gifting?",
    subtitle: "Help us tailor the perfect recommendation ✨",
    options:  [
      { emoji: '👩‍❤️‍👨', label: 'Partner / Significant Other', sub: 'Romantic & heartfelt',  value: 'Romance' },
      { emoji: '👯',      label: 'Best Friend',                  sub: 'Fun & celebratory',     value: 'BestFriend' },
      { emoji: '🎂',      label: 'Birthday Celebration',         sub: 'Make them feel special', value: 'Birthday' },
      { emoji: '💎',      label: 'Someone Special (Luxury)',     sub: 'Elevated & premium',     value: 'Luxury' },
    ],
  },
  {
    id:       'budget',
    question: "What's your budget?",
    subtitle: "We have beautiful options at every range 💰",
    options:  [
      { emoji: '🌸', label: 'Under ₹500',        sub: 'Budget-friendly picks',   value: 'budget' },
      { emoji: '✨', label: '₹500 – ₹1000',       sub: 'Our most popular range',  value: 'mid' },
      { emoji: '💎', label: '₹1000 – ₹1500',      sub: 'Premium collections',     value: 'premium' },
      { emoji: '👑', label: 'No limit — the best!', sub: 'Total luxury experience', value: 'luxury' },
    ],
  },
  {
    id:       'vibe',
    question: "What's the vibe?",
    subtitle: "Choose the feeling you want to create 🎨",
    options:  [
      { emoji: '🌹', label: 'Romantic & Heartfelt', sub: 'Deep, meaningful, touching', value: 'Romance' },
      { emoji: '🎉', label: 'Fun & Celebratory',    sub: 'Joyful, colourful, festive',  value: 'Birthday' },
      { emoji: '🕯️', label: 'Cozy & Comforting',   sub: 'Warm, calm, soothing',       value: 'Cozy' },
      { emoji: '✦',  label: 'Sleek & Minimal',      sub: 'Elegant, refined, premium',  value: 'Luxury' },
    ],
  },
]

const COMBO_RECOMMENDATIONS: Record<string, any> = {
  Romance:    { name: 'Romantic Reverie',  emoji: '🌹💌', price: 1249, description: 'Pearl Earrings · Minimal Necklace · Scented Candle · Bouquet · Personal Card', bg: 'linear-gradient(135deg,#FFE4E8,#FFD6E7)', id: 'combo1' },
  BestFriend: { name: 'BFF Hamper',        emoji: '🫶🎀', price: 799,  description: 'Hair Clips · Polaroids · Bouquet · Aroma Sachet · Card',                      bg: 'linear-gradient(135deg,#F0E6FF,#FFE0F0)', id: 'combo3' },
  Birthday:   { name: 'Birthday Glow Up',  emoji: '🎂🎊', price: 899,  description: 'Polaroid Prints · LED Lights · Hair Clips · Box Fillers · Personal Card',     bg: 'linear-gradient(135deg,#FFF0D6,#FFE4C4)', id: 'combo2' },
  Luxury:     { name: 'Minimal Luxe',      emoji: '💎🖤', price: 1549, description: 'Pearl Earrings · Minimal Necklace · Scented Candle · Essential Oil · Sachet',  bg: 'linear-gradient(135deg,#E8E8E8,#D4D0C8)', id: 'combo4' },
  Cozy:       { name: 'Cozy Corner',       emoji: '🕯️🌿',price: 999,  description: 'Scented Candle · Wax Melts · Aroma Sachet · Essential Oil · Fairy Lights',   bg: 'linear-gradient(135deg,#E0F0E0,#F0FFE8)', id: 'combo5' },
}

export default function QuizPage() {
  const [step, setStep]       = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [chosen, setChosen]   = useState<number | null>(null)
  const { addCombo }          = useCartStore()

  const progress = (step / QUIZ_QUESTIONS.length) * 100
  const isDone   = step >= QUIZ_QUESTIONS.length

  function answer(value: string, idx: number) {
    setChosen(idx)
    setTimeout(() => {
      setAnswers((prev) => [...prev, value])
      setStep((s) => s + 1)
      setChosen(null)
    }, 500)
  }

  const result = isDone
    ? COMBO_RECOMMENDATIONS[answers[0]] ??
      COMBO_RECOMMENDATIONS[answers[2]] ??
      COMBO_RECOMMENDATIONS['BestFriend']
    : null

  return (
    <>
      <section className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center section-pad">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="section-tag">Gift Quiz ✨</div>
            <h1 className="font-display text-display-sm font-semibold mt-2 mb-2">
              Find Your <em className="text-rose not-italic">Perfect Gift</em>
            </h1>
            <p className="text-brand-muted text-sm">3 quick questions → personalized recommendation</p>
          </div>

          {/* Progress */}
          {!isDone && (
            <div className="h-1.5 bg-beige-200 rounded-full mb-10 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blush-300 to-rose rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
          )}

          {/* Quiz content */}
          <AnimatePresence mode="wait">
            {!isDone ? (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-8">
                  <h2 className="font-display text-2xl sm:text-3xl font-semibold text-brand-dark mb-2">
                    {QUIZ_QUESTIONS[step]?.question}
                  </h2>
                  <p className="text-brand-muted">{QUIZ_QUESTIONS[step]?.subtitle}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {QUIZ_QUESTIONS[step]?.options.map((opt, i) => (
                    <motion.button
                      key={i}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => answer(opt.value, i)}
                      className={cn(
                        'p-5 rounded-3xl border-2 text-left transition-all duration-200 flex items-center gap-4',
                        chosen === i
                          ? 'border-rose bg-blush-100 shadow-glow'
                          : 'border-beige-200 bg-white hover:border-blush-300 hover:shadow-card'
                      )}
                    >
                      <span className="text-4xl flex-shrink-0">{opt.emoji}</span>
                      <div>
                        <p className="font-medium text-brand-dark">{opt.label}</p>
                        <p className="text-sm text-brand-muted mt-0.5">{opt.sub}</p>
                      </div>
                    </motion.button>
                  ))}
                </div>

                <p className="text-center text-xs text-brand-muted mt-6">
                  Question {step + 1} of {QUIZ_QUESTIONS.length}
                </p>
              </motion.div>
            ) : (
              /* Result */
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="text-center"
              >
                <div className="bg-white rounded-4xl p-8 shadow-hover">
                  <p className="text-xs font-medium uppercase tracking-widest text-brand-muted mb-3">
                    Your Perfect Match ✦
                  </p>
                  <div
                    className="rounded-3xl h-44 flex items-center justify-center text-6xl gap-4 mb-6"
                    style={{ background: result?.bg }}
                  >
                    {result?.emoji.split('').map((e: string, i: number) => (
                      <motion.span key={i}
                        animate={{ y: [0, -8, 0] }}
                        transition={{ repeat: Infinity, duration: 3, delay: i * 0.6 }}>
                        {e}
                      </motion.span>
                    ))}
                  </div>
                  <h2 className="font-display text-3xl font-semibold text-brand-dark mb-2">{result?.name}</h2>
                  <p className="text-sm text-brand-muted mb-2">{result?.description}</p>
                  <p className="font-display text-2xl font-semibold text-rose mb-8">
                    {formatPrice(result?.price ?? 0)}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      onClick={() => {
                        addCombo({ id: result?.id, name: result?.name, emoji: result?.emoji, price: result?.price, slug: '', description: '', occasions: [], tags: [], products: [], isFeatured: false, createdAt: '' })
                      }}
                      className="btn-primary btn-lg"
                    >
                      Add to Cart — {formatPrice(result?.price ?? 0)}
                    </button>
                    <Link href="/combos" className="btn-outline btn-lg">See All Combos</Link>
                  </div>

                  <button
                    onClick={() => { setStep(0); setAnswers([]) }}
                    className="btn-ghost mt-4 text-sm"
                  >
                    ↺ Retake Quiz
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
      <Footer />
    </>
  )
}
