import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Star, Clock, X, Loader } from 'lucide-react'
import { designsAPI } from '../services/api'

const CATEGORIES = ['All', 'Bridal', 'Arabic', 'Festival', 'Engagement', 'Kids', 'Indo-Western', 'Traditional', 'Modern', 'Minimal']

function normaliseDesign(d) {
  return {
    ...d,
    id: String(d.id || d._id || ''),
    price_per_head: d.price_per_head ?? d.pricePerHead ?? 0,
    image_url: d.image_url || d.imageUrl || '',
  }
}

const DesignCard = ({ design, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05, duration: 0.4 }}
    whileHover={{ y: -6 }}
    className="design-card group bg-white"
  >
    <div className="relative overflow-hidden h-52">
      <img
        src={design.image_url}
        alt={design.title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        loading="lazy"
        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1609166214994-502d326bafee?w=400&q=80' }}
      />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(61,26,10,0.75), transparent 60%)' }} />
      <span className="absolute top-3 left-3 badge badge-gold">{design.category}</span>
      <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full" style={{ background: 'rgba(0,0,0,0.5)' }}>
        <Star size={11} className="fill-current" style={{ color: 'var(--gold-light)' }} />
        <span className="text-white text-xs font-medium">{design.rating}</span>
      </div>
    </div>
    <div className="p-5">
      <h3 className="font-bold text-base mb-1" style={{ fontFamily: 'Playfair Display, serif', color: 'var(--brown)' }}>{design.title}</h3>
      <p className="text-xs mb-3 line-clamp-2" style={{ color: 'var(--text-light)' }}>{design.description}</p>
      <div className="flex items-center gap-2 mb-4">
        <Clock size={12} style={{ color: 'var(--gold)' }} />
        <span className="text-xs" style={{ color: 'var(--text-light)' }}>{design.duration}</span>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-lg font-bold" style={{ color: 'var(--gold-dark)', fontFamily: 'Playfair Display, serif' }}>
            ₹{design.price_per_head.toLocaleString()}
          </div>
          <div className="text-xs" style={{ color: 'var(--text-light)' }}>per person</div>
        </div>
        <div className="flex gap-2">
          <Link to={`/designs/${design.id}`} className="btn-outline-gold py-2 px-4 text-xs">View</Link>
          <Link to={`/book/${design.id}`} className="btn-gold py-2 px-4 text-xs">Book</Link>
        </div>
      </div>
    </div>
  </motion.div>
)

const SkeletonCard = () => (
  <div className="rounded-2xl overflow-hidden bg-white shadow">
    <div className="skeleton h-52 w-full" />
    <div className="p-5 space-y-3">
      <div className="skeleton h-4 w-3/4" />
      <div className="skeleton h-3 w-full" />
      <div className="skeleton h-3 w-1/2" />
      <div className="flex justify-between items-center">
        <div className="skeleton h-6 w-20" />
        <div className="skeleton h-8 w-16 rounded-full" />
      </div>
    </div>
  </div>
)

export default function DesignsPage() {
  const [designs, setDesigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [maxPrice, setMaxPrice] = useState(10000)

  useEffect(() => {
    setLoading(true)
    setError(false)
    designsAPI.getAll()
      .then(res => {
        const raw = res.data?.designs || []
        setDesigns(raw.map(normaliseDesign))
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  const filtered = designs.filter(d => {
    const catOk = activeCategory === 'All' || d.category === activeCategory
    const searchOk = !search || d.title.toLowerCase().includes(search.toLowerCase())
    const priceOk = d.price_per_head <= maxPrice
    return catOk && searchOk && priceOk
  })

  return (
    <div className="pt-24 pb-16 min-h-screen" style={{ background: 'var(--cream)' }}>
      <div className="max-w-7xl mx-auto px-4">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="gold-divider" />
          <h1 className="section-title">Our Mehendi Designs</h1>
          <p className="section-subtitle">Browse our curated collection of stunning patterns</p>
        </motion.div>

        {/* Filters */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 mb-10">
          <div className="relative mb-5">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-light)' }} />
            <input
              type="text"
              placeholder="Search designs..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-field pl-10"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-light)' }}>
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mb-5">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200"
                style={activeCategory === cat
                  ? { background: 'var(--gold)', color: 'white' }
                  : { background: 'rgba(201,168,76,0.1)', color: 'var(--text-mid)', border: '1px solid rgba(201,168,76,0.25)' }
                }
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm font-medium whitespace-nowrap" style={{ color: 'var(--text-mid)' }}>
              Max Price: <strong style={{ color: 'var(--gold-dark)' }}>₹{maxPrice.toLocaleString()}</strong>
            </span>
            <input
              type="range" min={400} max={10000} step={100}
              value={maxPrice} onChange={e => setMaxPrice(+e.target.value)}
              className="flex-1" style={{ accentColor: 'var(--gold)' }}
            />
          </div>
        </motion.div>

        {/* Results */}
        {!loading && !error && designs.length > 0 && (
          <div className="mb-6">
            <p className="text-sm" style={{ color: 'var(--text-light)' }}>
              Showing <strong style={{ color: 'var(--brown)' }}>{filtered.length}</strong> design{filtered.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}

        {/* Grid / States */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : error ? (
          <div className="glass-card text-center py-20">
            <div className="text-5xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--brown)' }}>Could not load designs</h3>
            <p className="text-sm mb-5" style={{ color: 'var(--text-light)' }}>Please check your connection and try again.</p>
            <button onClick={() => { setLoading(true); designsAPI.getAll().then(r => setDesigns((r.data?.designs || []).map(normaliseDesign))).catch(() => setError(true)).finally(() => setLoading(false)) }}
              className="btn-gold py-2.5 px-6 text-sm">
              Retry
            </button>
          </div>
        ) : designs.length === 0 ? (
          <div className="glass-card text-center py-24">
            <div className="text-6xl mb-4">🌿</div>
            <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--brown)', fontFamily: 'Playfair Display, serif' }}>
              No designs added yet
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-light)' }}>
              The admin hasn't uploaded any designs yet. Check back soon!
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--brown)' }}>No designs match your filters</h3>
            <p className="text-sm mb-4" style={{ color: 'var(--text-light)' }}>Try adjusting your search, category or price range.</p>
            <button onClick={() => { setSearch(''); setActiveCategory('All'); setMaxPrice(10000) }}
              className="btn-gold py-2 px-5 text-sm">Clear Filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((d, i) => <DesignCard key={d.id} design={d} index={i} />)}
          </div>
        )}
      </div>
    </div>
  )
}
