import Link from 'next/link'
import { Instagram, Twitter, Youtube, MessageCircle } from 'lucide-react'

const FOOTER_LINKS = {
  Shop: [
    { label: 'All Products',  href: '/shop' },
    { label: 'Gift Combos',   href: '/combos' },
    { label: 'Build A Gift',  href: '/builder' },
    { label: 'New Arrivals',  href: '/shop?sort=newest' },
    { label: 'Bestsellers',   href: '/shop?featured=true' },
  ],
  Help: [
    { label: 'Shipping Info', href: '/shipping' },
    { label: 'Returns',       href: '/returns' },
    { label: 'Track Order',   href: '/account/orders' },
    { label: 'Contact Us',    href: '/contact' },
    { label: 'FAQs',          href: '/faqs' },
  ],
  Brand: [
    { label: 'Our Story',     href: '/about' },
    { label: 'Sustainability', href: '/sustainability' },
    { label: 'Gift Guide',    href: '/gift-guide' },
    { label: 'Press',         href: '/press' },
    { label: 'Affiliates',    href: '/affiliates' },
  ],
}

export function Footer() {
  return (
    <footer className="bg-brand-dark text-white/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-10 mb-12">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-block mb-4">
              <span className="font-display text-2xl font-semibold text-white">
                Wrap<span className="text-blush-300">Love</span>
              </span>
              <span className="text-gold ml-1">✦</span>
            </Link>
            <p className="text-sm leading-relaxed mb-6 max-w-xs">
              A premium gifting studio crafting personalized, aesthetic hampers that make every
              celebration unforgettable.
            </p>
            <div className="flex gap-3">
              {[
                { Icon: Instagram,     href: '#', label: 'Instagram' },
                { Icon: Twitter,       href: '#', label: 'Twitter' },
                { Icon: Youtube,       href: '#', label: 'YouTube' },
                { Icon: MessageCircle, href: '#', label: 'WhatsApp' },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center
                             hover:bg-rose transition-colors duration-200"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-white text-sm font-medium mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/55 hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="bg-white/5 rounded-3xl px-6 py-6 mb-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-display text-lg font-semibold text-white">Get gifting inspiration 💌</p>
            <p className="text-sm text-white/55 mt-0.5">Exclusive offers, new combos & gifting ideas — weekly.</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 sm:w-56 bg-white/10 border border-white/20 rounded-xl px-4 py-2.5
                         text-sm text-white placeholder-white/40 focus:outline-none focus:border-blush-300"
            />
            <button className="btn-primary whitespace-nowrap">Subscribe ✦</button>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/35">
          <p>© {new Date().getFullYear()} WrapLove. Made with 💗 in Chennai, India.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-white/60 transition-colors">Privacy Policy</Link>
            <Link href="/terms"   className="hover:text-white/60 transition-colors">Terms of Service</Link>
            <Link href="/cookies" className="hover:text-white/60 transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
