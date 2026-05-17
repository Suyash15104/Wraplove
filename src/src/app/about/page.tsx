import { Footer } from '@/components/layout/Footer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Our Story — WrapLove',
  description: 'Learn about WrapLove — a premium gifting studio born from the belief that every gift should feel like a warm hug.',
}

const VALUES = [
  { emoji: '🌸', title: 'Handcrafted with Care',   desc: 'Every box is packed by hand with deliberate attention to every single detail.' },
  { emoji: '♻️', title: 'Eco-Friendly Packaging',  desc: 'We use biodegradable paper, soy inks, and recyclable materials throughout.' },
  { emoji: '💌', title: 'Deeply Personalized',      desc: 'From message cards to custom ribbons — every order feels one-of-a-kind.' },
  { emoji: '🚀', title: 'Fast & Reliable Delivery', desc: 'Most orders ship within 24 hours and arrive beautifully packed.' },
  { emoji: '⭐', title: 'Premium Quality Always',   desc: 'We source only the best — no cheap fillers, only things people actually love.' },
  { emoji: '🫶', title: 'Community First',          desc: 'We collaborate with local artisans and small makers across India.' },
]

const TEAM = [
  { name: 'Aria Sharma',   role: 'Founder & Creative Director', emoji: '🌸', location: 'Chennai' },
  { name: 'Priya Nair',    role: 'Head of Curation',            emoji: '💎', location: 'Bangalore' },
  { name: 'Riya Kapoor',   role: 'Packaging & Design',          emoji: '🎀', location: 'Mumbai' },
  { name: 'Meera Pillai',  role: 'Customer Experience',         emoji: '💌', location: 'Chennai' },
]

export default function AboutPage() {
  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-8">

        {/* Hero */}
        <section className="py-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="section-tag">Our Story</div>
            <h1 className="font-display text-display-lg font-semibold mt-3 mb-5 leading-tight">
              Gifting Reimagined<br />with{' '}
              <em className="text-rose not-italic">Heart & Soul</em>
            </h1>
            <p className="text-brand-muted leading-relaxed mb-4 text-lg">
              WrapLove was born from a simple belief: every gift should feel like a warm hug.
              We handcraft every box, source every item with care, and personalize every detail
              so your loved ones feel truly celebrated.
            </p>
            <p className="text-brand-muted leading-relaxed mb-6">
              Founded in 2023 in Chennai by Aria Sharma, we've helped over 1,200 people express
              love in the most beautiful way possible. What started as a side project making
              pipe-cleaner bouquets for friends has grown into a full gifting studio shipping
              across India.
            </p>
            <div className="flex gap-8">
              {[
                { value: '1,200+', label: 'Happy Customers' },
                { value: '4.9 ★',  label: 'Average Rating' },
                { value: '48h',    label: 'Avg. Delivery' },
              ].map((s) => (
                <div key={s.label}>
                  <p className="font-display text-2xl font-semibold text-brand-dark">{s.value}</p>
                  <p className="text-xs text-brand-muted mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="w-full h-96 bg-gradient-brand rounded-4xl flex items-center justify-center text-9xl relative overflow-hidden">
              🎁
              <div className="absolute bottom-6 left-6 bg-white/80 backdrop-blur-sm rounded-2xl px-4 py-2.5 text-sm font-medium flex items-center gap-2">
                ✦ Shipped with Love
              </div>
              <div className="absolute top-6 right-6 bg-white/80 backdrop-blur-sm rounded-2xl px-4 py-2.5 text-sm font-medium flex items-center gap-2">
                🌸 1200+ Happy Customers
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 border-t border-beige-200">
          <div className="text-center mb-12">
            <div className="section-tag">What We Stand For</div>
            <h2 className="font-display text-display-md font-semibold mt-3">
              Our <em className="text-rose not-italic">Core Values</em>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {VALUES.map((v) => (
              <div key={v.title} className="bg-white rounded-3xl p-6 shadow-soft hover:shadow-card transition-shadow group">
                <div className="text-3xl mb-4">{v.emoji}</div>
                <h3 className="font-semibold text-brand-dark mb-2">{v.title}</h3>
                <p className="text-sm text-brand-muted leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Team */}
        <section className="py-16 border-t border-beige-200">
          <div className="text-center mb-12">
            <div className="section-tag">The People Behind WrapLove</div>
            <h2 className="font-display text-display-md font-semibold mt-3">
              Meet the <em className="text-rose not-italic">Team</em>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {TEAM.map((member) => (
              <div key={member.name} className="bg-white rounded-3xl p-6 shadow-soft text-center hover:-translate-y-1 hover:shadow-card transition-all duration-300">
                <div className="w-20 h-20 bg-gradient-brand rounded-full flex items-center justify-center text-4xl mx-auto mb-4">
                  {member.emoji}
                </div>
                <h3 className="font-semibold text-brand-dark mb-0.5">{member.name}</h3>
                <p className="text-xs text-rose font-medium mb-1">{member.role}</p>
                <p className="text-xs text-brand-muted">📍 {member.location}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="py-16">
          <div className="bg-gradient-brand rounded-4xl p-10 text-center relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
              <div className="blob w-48 h-48 bg-white/20 top-0 right-0" />
              <div className="blob w-32 h-32 bg-white/10 bottom-0 left-0" />
            </div>
            <div className="relative z-10">
              <h2 className="font-display text-display-sm font-semibold text-brand-dark mb-3">
                Ready to Spread Some Love?
              </h2>
              <p className="text-brand-muted mb-6 max-w-md mx-auto">
                Build your perfect gift box or browse our curated combos — every order packed with heart.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <a href="/builder" className="btn-secondary btn-lg">Build a Gift Box ✦</a>
                <a href="/shop" className="btn-outline btn-lg">Browse Shop</a>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  )
}
