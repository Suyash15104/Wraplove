'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useSession, signOut } from 'next-auth/react'
import { ShoppingBag, Search, Heart, Menu, X, ChevronDown, User, Package, LogOut, Settings } from 'lucide-react'
import { useCartStore, useWishlistStore, useUIStore } from '@/store'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { label: 'Shop',       href: '/shop' },
  { label: 'Build Gift', href: '/builder' },
  { label: 'Combos',     href: '/combos' },
  { label: 'About',      href: '/about' },
  { label: 'Contact',    href: '/contact' },
]

export function Navbar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const { totalItems, openCart } = useCartStore()
  const { productIds } = useWishlistStore()
  const { mobileMenuOpen, setMobileMenuOpen, searchOpen, setSearchOpen } = useUIStore()

  const [scrolled, setScrolled]       = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery]  = useState('')
  const searchRef = useRef<HTMLInputElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus()
  }, [searchOpen])

  // Close user menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const isAdmin = session?.user?.role === 'ADMIN'

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'glass border-b border-white/30 shadow-soft'
            : 'bg-cream/90 backdrop-blur-sm'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-1.5 flex-shrink-0">
            <span className="font-display text-xl font-semibold tracking-tight text-brand-dark">
              Wrap<span className="text-rose">Love</span>
            </span>
            <span className="text-gold text-sm">✦</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200',
                  pathname === link.href
                    ? 'bg-blush-100 text-rose'
                    : 'text-brand-muted hover:text-brand-dark hover:bg-beige-100'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right icons */}
          <div className="flex items-center gap-1 md:gap-2">

            {/* Search toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="btn-icon text-brand-muted hover:text-brand-dark"
              aria-label="Search"
            >
              <Search size={18} />
            </button>

            {/* Wishlist */}
            <Link
              href="/account/wishlist"
              className="btn-icon relative text-brand-muted hover:text-brand-dark"
              aria-label="Wishlist"
            >
              <Heart size={18} />
              {productIds.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {productIds.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <button
              onClick={openCart}
              className="btn-icon relative text-brand-muted hover:text-brand-dark"
              aria-label="Cart"
            >
              <ShoppingBag size={18} />
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span
                    key="badge"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 w-4 h-4 bg-rose text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* User menu */}
            {session ? (
              <div className="relative hidden md:block" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-1.5 pl-2 pr-3 py-1.5 rounded-full
                             bg-beige-100 hover:bg-beige-200 transition-colors text-sm font-medium"
                >
                  {session.user?.image ? (
                    <img src={session.user.image} alt="" className="w-6 h-6 rounded-full object-cover" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-blush-300 flex items-center justify-center text-xs font-bold text-rose">
                      {session.user?.name?.[0] ?? 'U'}
                    </div>
                  )}
                  <span className="max-w-[80px] truncate">{session.user?.name?.split(' ')[0]}</span>
                  <ChevronDown size={14} className={cn('transition-transform', userMenuOpen && 'rotate-180')} />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-hover border border-beige-100 py-1.5 overflow-hidden"
                    >
                      <Link href="/account" onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-brand-muted hover:bg-beige-100 hover:text-brand-dark transition-colors">
                        <User size={15} /> My Account
                      </Link>
                      <Link href="/account/orders" onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-brand-muted hover:bg-beige-100 hover:text-brand-dark transition-colors">
                        <Package size={15} /> My Orders
                      </Link>
                      {isAdmin && (
                        <Link href="/admin" onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-brand-muted hover:bg-beige-100 hover:text-brand-dark transition-colors">
                          <Settings size={15} /> Admin Panel
                        </Link>
                      )}
                      <hr className="my-1 border-beige-100" />
                      <button
                        onClick={() => { signOut(); setUserMenuOpen(false) }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-rose hover:bg-rose-100 transition-colors"
                      >
                        <LogOut size={15} /> Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link href="/auth/login" className="hidden md:flex btn-outline btn-sm">
                Sign In
              </Link>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="btn-icon md:hidden text-brand-muted"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Search bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-beige-100 overflow-hidden"
            >
              <div className="max-w-2xl mx-auto px-4 py-3">
                <div className="flex items-center gap-3 bg-beige-100 rounded-2xl px-4 py-2.5">
                  <Search size={16} className="text-brand-muted flex-shrink-0" />
                  <input
                    ref={searchRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search gifts, combos, occasions..."
                    className="flex-1 bg-transparent text-sm text-brand-dark placeholder-brand-muted focus:outline-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && searchQuery.trim()) {
                        window.location.href = `/shop?search=${encodeURIComponent(searchQuery)}`
                        setSearchOpen(false)
                      }
                      if (e.key === 'Escape') setSearchOpen(false)
                    }}
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="text-brand-muted hover:text-brand-dark">
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-40 bg-cream pt-16 px-6 py-8 md:hidden flex flex-col"
          >
            <nav className="flex flex-col gap-1 mb-8">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'px-4 py-3.5 rounded-2xl text-base font-medium transition-colors',
                    pathname === link.href
                      ? 'bg-blush-100 text-rose'
                      : 'text-brand-dark hover:bg-beige-100'
                  )}
                >
                  {link.label}
                </Link>
              ))}
              {isAdmin && (
                <Link href="/admin" onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3.5 rounded-2xl text-base font-medium text-brand-dark hover:bg-beige-100">
                  Admin ✦
                </Link>
              )}
            </nav>
            <div className="mt-auto flex flex-col gap-3">
              {session ? (
                <button onClick={() => signOut()} className="btn-outline w-full">
                  Sign Out
                </button>
              ) : (
                <>
                  <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)} className="btn-primary w-full">
                    Sign In
                  </Link>
                  <Link href="/auth/register" onClick={() => setMobileMenuOpen(false)} className="btn-outline w-full">
                    Create Account
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
