import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Star, Clock, ArrowLeft, ArrowRight, CheckCircle, Loader } from 'lucide-react'
import { designsAPI } from '../services/api'

export default function DesignDetailPage() {
  const { id } = useParams()
  const [design, setDesign] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    setLoading(true)
    setNotFound(false)
    designsAPI.getById(id)
      .then(r => {
        const d = r.data?.design
        if (!d) { setNotFound(true); return }
        setDesign({
          ...d,
          id: String(d.id || d._id || ''),
          price_per_head: d.price_per_head ?? d.pricePerHead ?? 0,
          image_url: d.image_url || d.imageUrl || '',
        })
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div className="pt-28 min-h-screen flex items-center justify-center" style={{ background: 'var(--cream)' }}>
      <Loader size={32} className="animate-spin" style={{ color: 'var(--gold)' }} />
    </div>
  )

  if (notFound) return (
    <div className="pt-28 min-h-screen flex flex-col items-center justify-center" style={{ background: 'var(--cream)' }}>
      <div className="text-5xl mb-4">🌿</div>
      <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Playfair Display, serif', color: 'var(--brown)' }}>Design not found</h2>
      <p className="text-sm mb-6" style={{ color: 'var(--text-light)' }}>This design may have been removed or the link is invalid.</p>
      <Link to="/designs" className="btn-gold py-2.5 px-6 text-sm">Browse All Designs</Link>
    </div>
  )

  return (
    <div className="pt-24 pb-16 min-h-screen" style={{ background: 'var(--cream)' }}>
      <div className="max-w-6xl mx-auto px-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 mb-8 text-sm hover:opacity-70 transition-opacity" style={{ color: 'var(--text-mid)' }}>
          <ArrowLeft size={16} /> Back to Designs
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="rounded-3xl overflow-hidden shadow-2xl">
            <img src={design.image_url} alt={design.title} className="w-full h-96 lg:h-full object-cover"
              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1609166214994-502d326bafee?w=800&q=80' }} />
          </motion.div>

          {/* Info */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col justify-center">
            <span className="badge badge-gold mb-4 self-start">{design.category}</span>
            <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif', color: 'var(--brown)' }}>{design.title}</h1>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                {Array(5).fill(0).map((_, i) => (
                  <Star key={i} size={16} className={i < Math.floor(design.rating) ? 'fill-current' : ''} style={{ color: 'var(--gold)' }} />
                ))}
                <span className="text-sm ml-1" style={{ color: 'var(--text-mid)' }}>{design.rating} rating</span>
              </div>
              <div className="flex items-center gap-1" style={{ color: 'var(--text-light)' }}>
                <Clock size={14} /><span className="text-sm">{design.duration}</span>
              </div>
            </div>

            <p className="text-base leading-relaxed mb-8" style={{ color: 'var(--text-mid)' }}>{design.description}</p>

            {['Premium organic henna paste', 'Certified expert artist', 'Personalized consultation', 'Post-care instructions included'].map(f => (
              <div key={f} className="flex items-center gap-2 mb-2">
                <CheckCircle size={15} style={{ color: 'var(--gold)' }} />
                <span className="text-sm" style={{ color: 'var(--text-mid)' }}>{f}</span>
              </div>
            ))}

            <div className="glass-card p-6 mt-8">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-4xl font-bold" style={{ fontFamily: 'Playfair Display, serif', color: 'var(--gold-dark)' }}>
                  ₹{design.price_per_head.toLocaleString()}
                </span>
                <span className="text-sm" style={{ color: 'var(--text-light)' }}>per person</span>
              </div>
              <p className="text-xs mb-5" style={{ color: 'var(--text-light)' }}>Final price calculated based on number of guests</p>
              <Link to={`/book/${design.id}`} className="btn-gold w-full justify-center text-base py-4">
                Book This Design <ArrowRight size={18} />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
