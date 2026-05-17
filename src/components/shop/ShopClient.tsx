'use client'

import { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react'
import { ProductCard } from '@/components/shop/ProductCard'
import { cn } from '@/lib/utils'
import type { Product, Category } from '@/types'

type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'popular'

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'newest',     label: 'Newest First' },
  { value: 'popular',    label: 'Most Popular' },
  { value: 'price-asc',  label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
]

const OCCASIONS = ['Birthday', 'Romance', 'BestFriend', 'Luxury', 'Cozy', 'Anniversary']

interface ShopClientProps {
  initialProducts: Product[]
  categories: Category[]
  initialSearch?: string
  initialCategory?: string
}

export function ShopClient({ initialProducts, categories, initialSearch, initialCategory }: ShopClientProps) {
  const [search,       setSearch]       = useState(initialSearch ?? '')
  const [activeCategory, setCategory]  = useState(initialCategory ?? 'all')
  const [activeOccasion, setOccasion]  = useState('all')
  const [sortBy,       setSort]         = useState<SortOption>('newest')
  const [priceRange,   setPriceRange]   = useState<[number, number]>([0, 2000])
  const [showFilters,  setShowFilters]  = useState(false)
  const [page,         setPage]         = useState(1)
  const PER_PAGE = 12

  const filtered = useMemo(() => {
    let list = [...initialProducts]

    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      )
    }

    if (activeCategory !== 'all') {
      list = list.filter((p) => p.category?.slug === activeCategory)
    }

    if (activeOccasion !== 'all') {
      list = list.filter((p) => p.occasions?.includes(activeOccasion))
    }

    list = list.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1])

    switch (sortBy) {
      case 'price-asc':  list.sort((a, b) => a.price - b.price);  break
      case 'price-desc': list.sort((a, b) => b.price - a.price);  break
      case 'popular':    list.sort((a, b) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0)); break
      default:           list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }

    return list
  }, [initialProducts, search, activeCategory, activeOccasion, sortBy, priceRange])

  const paginated  = filtered.slice(0, page * PER_PAGE)
  const hasMore    = paginated.length < filtered.length

  const clearFilters = useCallback(() => {
    setSearch(''); setCategory('all'); setOccasion('all')
    setSort('newest'); setPriceRange([0, 2000]); setPage(1)
  }, [])

  const hasActiveFilters =
    search || activeCategory !== 'all' || activeOccasion !== 'all' || sortBy !== 'newest'

  return (
    <section className="section-pad">
      <div className="max-w-7xl mx-auto">

        {/* Page header */}
        <div className="mb-8">
          <div className="section-tag">Our Collection</div>
          <h1 className="font-display text-display-md font-semibold mt-2 mb-2">
            Shop <em className="text-rose not-italic">Beautiful Gifts</em>
          </h1>
          <p className="text-brand-muted">Handpicked with love — {initialProducts.length} products</p>
        </div>

        {/* Search + controls bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              placeholder="Search gifts, candles, jewellery..."
              className="input pl-10"
            />
            {search && (
              <button onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-dark">
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex gap-2">
            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => { setSort(e.target.value as SortOption); setPage(1) }}
                className="input pr-8 appearance-none cursor-pointer bg-white"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted pointer-events-none" />
            </div>

            {/* Filter toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={cn('btn-outline flex items-center gap-2', showFilters && 'bg-rose text-white border-rose')}
            >
              <SlidersHorizontal size={15} />
              Filters
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-white" />
              )}
            </button>
          </div>
        </div>

        {/* Filters panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-6"
            >
              <div className="bg-white rounded-2xl p-5 shadow-soft space-y-5">
                {/* Categories */}
                <div>
                  <p className="text-xs font-medium text-brand-muted uppercase tracking-wide mb-2.5">Category</p>
                  <div className="flex flex-wrap gap-2">
                    {[{ slug: 'all', name: 'All', emoji: '✦' }, ...categories].map((cat) => (
                      <button
                        key={cat.slug}
                        onClick={() => { setCategory(cat.slug); setPage(1) }}
                        className={cn(
                          'flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm transition-all border-2',
                          activeCategory === cat.slug
                            ? 'border-rose bg-blush-100 text-rose'
                            : 'border-beige-200 text-brand-muted hover:border-blush-300'
                        )}
                      >
                        {(cat as any).emoji && <span>{(cat as any).emoji}</span>}
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Occasions */}
                <div>
                  <p className="text-xs font-medium text-brand-muted uppercase tracking-wide mb-2.5">Occasion</p>
                  <div className="flex flex-wrap gap-2">
                    {['all', ...OCCASIONS].map((occ) => (
                      <button
                        key={occ}
                        onClick={() => { setOccasion(occ); setPage(1) }}
                        className={cn(
                          'px-3.5 py-1.5 rounded-full text-sm transition-all border-2',
                          activeOccasion === occ
                            ? 'border-rose bg-blush-100 text-rose'
                            : 'border-beige-200 text-brand-muted hover:border-blush-300'
                        )}
                      >
                        {occ === 'all' ? 'All Occasions' : occ}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price range */}
                <div>
                  <p className="text-xs font-medium text-brand-muted uppercase tracking-wide mb-2.5">
                    Price Range: ₹{priceRange[0]} – ₹{priceRange[1]}
                  </p>
                  <input
                    type="range"
                    min={0}
                    max={2000}
                    step={50}
                    value={priceRange[1]}
                    onChange={(e) => { setPriceRange([priceRange[0], parseInt(e.target.value)]); setPage(1) }}
                    className="w-full accent-rose"
                  />
                </div>

                {hasActiveFilters && (
                  <button onClick={clearFilters} className="btn-ghost text-xs text-rose">
                    <X size={12} /> Clear all filters
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active filter chips */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 mb-5">
            {search && (
              <span className="badge bg-blush-100 text-rose gap-1">
                Search: "{search}" <button onClick={() => setSearch('')}><X size={10} /></button>
              </span>
            )}
            {activeCategory !== 'all' && (
              <span className="badge bg-lavender-100 text-mauve gap-1">
                {categories.find((c) => c.slug === activeCategory)?.name}
                <button onClick={() => setCategory('all')}><X size={10} /></button>
              </span>
            )}
            {activeOccasion !== 'all' && (
              <span className="badge bg-sage-100 text-sage-400 gap-1">
                {activeOccasion} <button onClick={() => setOccasion('all')}><X size={10} /></button>
              </span>
            )}
          </div>
        )}

        {/* Results count */}
        <p className="text-sm text-brand-muted mb-6">
          Showing <strong className="text-brand-dark">{paginated.length}</strong> of{' '}
          <strong className="text-brand-dark">{filtered.length}</strong> products
        </p>

        {/* Product grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="font-display text-xl font-semibold mb-2">No products found</h3>
            <p className="text-brand-muted mb-6">Try adjusting your search or filters</p>
            <button onClick={clearFilters} className="btn-primary">Clear Filters</button>
          </div>
        ) : (
          <>
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
            >
              <AnimatePresence>
                {paginated.map((product, i) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i < PER_PAGE ? i * 0.05 : 0 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Load more */}
            {hasMore && (
              <div className="text-center mt-12">
                <button onClick={() => setPage((p) => p + 1)} className="btn-outline btn-lg">
                  Load More Products ↓
                </button>
                <p className="text-xs text-brand-muted mt-2">
                  {filtered.length - paginated.length} more products
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}
