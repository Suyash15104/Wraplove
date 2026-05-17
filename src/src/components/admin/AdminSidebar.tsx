'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, ShoppingBag, Users, BarChart3, Tag, Settings, ExternalLink, LogOut } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { cn } from '@/lib/utils'

const LINKS = [
  { href: '/admin',             label: 'Dashboard',  icon: LayoutDashboard },
  { href: '/admin/orders',      label: 'Orders',     icon: ShoppingBag },
  { href: '/admin/products',    label: 'Products',   icon: Package },
  { href: '/admin/customers',   label: 'Customers',  icon: Users },
  { href: '/admin/analytics',   label: 'Analytics',  icon: BarChart3 },
  { href: '/admin/coupons',     label: 'Coupons',    icon: Tag },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-56 flex-shrink-0 bg-brand-dark text-white flex flex-col min-h-screen sticky top-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/10">
        <p className="font-display text-lg font-semibold">
          Wrap<span className="text-blush-300">Love</span>
          <span className="text-gold ml-1 text-sm">✦</span>
        </p>
        <p className="text-xs text-white/40 mt-0.5">Admin Panel</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {LINKS.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
              pathname === href
                ? 'bg-white/15 text-white'
                : 'text-white/60 hover:bg-white/10 hover:text-white'
            )}
          >
            <Icon size={16} />
            {label}
          </Link>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-white/10 space-y-0.5">
        <Link href="/" target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/60 hover:bg-white/10 hover:text-white transition-colors">
          <ExternalLink size={16} /> View Site
        </Link>
        <Link href="/admin/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/60 hover:bg-white/10 hover:text-white transition-colors">
          <Settings size={16} /> Settings
        </Link>
        <button
          onClick={() => signOut()}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-rose-300 hover:bg-rose-500/20 transition-colors"
        >
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </aside>
  )
}
