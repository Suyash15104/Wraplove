'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, Edit2, Trash2, X, Loader2, Package } from 'lucide-react'
import { formatPrice, cn } from '@/lib/utils'
import type { Product, Category } from '@/types'
import axios from 'axios'
import toast from 'react-hot-toast'

interface Props { products: Product[]; categories: Category[] }

export function AdminProductsClient({ products: initial, categories }: Props) {
  const [products, setProducts]   = useState(initial)
  const [search,   setSearch]     = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editing,  setEditing]    = useState<Product | null>(null)
  const [saving,   setSaving]     = useState(false)
  const [form, setForm] = useState({
    name: '', slug: '', description: '', emoji: '🎁',
    price: '', comparePrice: '', stock: '', categoryId: '',
    tags: '', occasions: '', isFeatured: false, isBuilderItem: true,
  })

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.name.toLowerCase().includes(search.toLowerCase())
  )

  function openAdd() {
    setEditing(null)
    setForm({ name: '', slug: '', description: '', emoji: '🎁', price: '', comparePrice: '', stock: '', categoryId: categories[0]?.id ?? '', tags: '', occasions: '', isFeatured: false, isBuilderItem: true })
    setShowModal(true)
  }

  function openEdit(p: Product) {
    setEditing(p)
    setForm({
      name: p.name, slug: p.slug, description: p.description, emoji: p.emoji,
      price: p.price.toString(), comparePrice: p.comparePrice?.toString() ?? '',
      stock: p.stock.toString(), categoryId: p.categoryId,
      tags: p.tags.join(', '), occasions: p.occasions.join(', '),
      isFeatured: p.isFeatured, isBuilderItem: p.isBuilderItem,
    })
    setShowModal(true)
  }

  async function handleSave() {
    if (!form.name || !form.price || !form.categoryId) {
      toast.error('Name, price, and category are required')
      return
    }
    setSaving(true)
    try {
      const payload = {
        ...form,
        slug: form.slug || form.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        price: parseFloat(form.price),
        comparePrice: form.comparePrice ? parseFloat(form.comparePrice) : null,
        stock: parseInt(form.stock || '0'),
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
        occasions: form.occasions.split(',').map((o) => o.trim()).filter(Boolean),
      }

      if (editing) {
        const { data } = await axios.patch(`/api/products/${editing.id}`, payload)
        setProducts((prev) => prev.map((p) => (p.id === editing.id ? data.data : p)))
        toast.success('Product updated!')
      } else {
        const { data } = await axios.post('/api/products', payload)
        setProducts((prev) => [data.data, ...prev])
        toast.success('Product created!')
      }
      setShowModal(false)
    } catch (err: any) {
      toast.error(err.response?.data?.error ?? 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return
    try {
      await axios.delete(`/api/products/${id}`)
      setProducts((prev) => prev.filter((p) => p.id !== id))
      toast.success('Product deleted')
    } catch {
      toast.error('Delete failed')
    }
  }

  return (
    <div className="flex-1 p-8 overflow-y-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-semibold text-brand-dark">Products 🎁</h1>
          <p className="text-sm text-brand-muted mt-0.5">{products.length} products total</p>
        </div>
        <button onClick={openAdd} className="btn-primary">
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-5 max-w-xs">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" />
        <input
          type="text" value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="input pl-9 text-sm"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-beige-100 bg-beige-100/50">
                {['Product', 'Category', 'Price', 'Stock', 'Featured', 'Builder', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-5 py-3.5 text-xs font-medium text-brand-muted">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-beige-100">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-beige-100/30 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-beige-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                        {p.emoji}
                      </div>
                      <div>
                        <p className="font-medium text-brand-dark text-sm">{p.name}</p>
                        <p className="text-xs text-brand-muted">{p.sku || p.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="badge bg-beige-100 text-brand-muted">{p.category?.name}</span>
                  </td>
                  <td className="px-5 py-3.5 font-display font-semibold">
                    {formatPrice(p.price)}
                    {p.comparePrice && (
                      <span className="text-xs text-brand-muted line-through ml-1">{formatPrice(p.comparePrice)}</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={cn(
                      'badge',
                      p.stock > 10 ? 'bg-green-100 text-green-700' :
                      p.stock > 0  ? 'bg-yellow-100 text-yellow-700' :
                                     'bg-red-100 text-red-700'
                    )}>
                      {p.stock > 0 ? `${p.stock} in stock` : 'Out of stock'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className={cn('w-2 h-2 rounded-full mx-auto', p.isFeatured ? 'bg-green-400' : 'bg-beige-200')} />
                  </td>
                  <td className="px-5 py-3.5">
                    <div className={cn('w-2 h-2 rounded-full mx-auto', p.isBuilderItem ? 'bg-blue-400' : 'bg-beige-200')} />
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(p)}
                        className="p-1.5 text-brand-muted hover:text-brand-dark hover:bg-beige-100 rounded-lg transition-colors">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => handleDelete(p.id, p.name)}
                        className="p-1.5 text-brand-muted hover:text-rose hover:bg-blush-100 rounded-lg transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <Package size={32} className="text-brand-muted mx-auto mb-3 opacity-40" />
            <p className="text-brand-muted text-sm">No products found</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div key="overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="fixed inset-0 bg-brand-dark/40 backdrop-blur-sm z-50" />
            <motion.div key="modal"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-4xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-beige-100">
                  <h2 className="font-display text-xl font-semibold">
                    {editing ? 'Edit Product' : 'Add Product'} {form.emoji}
                  </h2>
                  <button onClick={() => setShowModal(false)} className="btn-icon text-brand-muted">
                    <X size={18} />
                  </button>
                </div>
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="text-xs font-medium text-brand-muted block mb-1.5">Product Name *</label>
                      <input className="input" placeholder="Pipe Cleaner Bouquet" value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })} />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-brand-muted block mb-1.5">Emoji</label>
                      <input className="input text-2xl" value={form.emoji} maxLength={2}
                        onChange={(e) => setForm({ ...form, emoji: e.target.value })} />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-brand-muted block mb-1.5">Category *</label>
                      <select className="input" value={form.categoryId}
                        onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
                        {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-brand-muted block mb-1.5">Price (₹) *</label>
                      <input className="input" type="number" placeholder="299" value={form.price}
                        onChange={(e) => setForm({ ...form, price: e.target.value })} />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-brand-muted block mb-1.5">Compare Price (₹)</label>
                      <input className="input" type="number" placeholder="399" value={form.comparePrice}
                        onChange={(e) => setForm({ ...form, comparePrice: e.target.value })} />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-brand-muted block mb-1.5">Stock</label>
                      <input className="input" type="number" placeholder="50" value={form.stock}
                        onChange={(e) => setForm({ ...form, stock: e.target.value })} />
                    </div>
                    <div className="col-span-2">
                      <label className="text-xs font-medium text-brand-muted block mb-1.5">Description</label>
                      <textarea className="input min-h-[80px] resize-none" placeholder="Product description..."
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })} />
                    </div>
                    <div className="col-span-2">
                      <label className="text-xs font-medium text-brand-muted block mb-1.5">Tags (comma separated)</label>
                      <input className="input" placeholder="Handmade, Floral, Colourful" value={form.tags}
                        onChange={(e) => setForm({ ...form, tags: e.target.value })} />
                    </div>
                    <div className="col-span-2">
                      <label className="text-xs font-medium text-brand-muted block mb-1.5">Occasions (comma separated)</label>
                      <input className="input" placeholder="Birthday, Romance, BestFriend" value={form.occasions}
                        onChange={(e) => setForm({ ...form, occasions: e.target.value })} />
                    </div>
                    <div className="flex items-center gap-3">
                      <input type="checkbox" id="featured" checked={form.isFeatured}
                        onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                        className="w-4 h-4 accent-rose" />
                      <label htmlFor="featured" className="text-sm font-medium text-brand-dark">Featured</label>
                    </div>
                    <div className="flex items-center gap-3">
                      <input type="checkbox" id="builder" checked={form.isBuilderItem}
                        onChange={(e) => setForm({ ...form, isBuilderItem: e.target.checked })}
                        className="w-4 h-4 accent-rose" />
                      <label htmlFor="builder" className="text-sm font-medium text-brand-dark">Show in Builder</label>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button onClick={() => setShowModal(false)} className="btn-ghost flex-1">Cancel</button>
                    <button onClick={handleSave} disabled={saving} className="btn-primary flex-[2] disabled:opacity-60">
                      {saving ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : editing ? 'Update Product' : 'Create Product'}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
