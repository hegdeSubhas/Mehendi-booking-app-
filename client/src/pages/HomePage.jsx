import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Star, ArrowRight, MessageCircle, Award, Clock, Users, Loader } from 'lucide-react'
import { designsAPI } from '../services/api'

const TESTIMONIALS = [
  { name: 'Priya Sharma', event: 'Wedding', text: 'Absolutely breathtaking! My bridal mehendi was beyond perfect. Every guest complimented it!', rating: 5, a: 'P' },
  { name: 'Anita Mehta', event: 'Engagement', text: 'The artist was so professional and the design was exactly what I wanted. Highly recommend!', rating: 5, a: 'A' },
  { name: 'Kavya Reddy', event: 'Diwali', text: 'Got festival mehendi done in just 40 minutes. Beautiful result and very affordable!', rating: 5, a: 'K' },
]

const WHY = [
  { icon: Award, title: 'Expert Artists', desc: '10+ years of experience in traditional and modern mehendi art' },
  { icon: Clock, title: 'On-Time Service', desc: 'Always punctual. We value your special day as much as you do' },
  { icon: Users, title: 'Group Bookings', desc: 'Special pricing for bridal parties & large event groups' },
  { icon: Star, title: '500+ Happy Brides', desc: 'Trusted by hundreds of brides across the city' },
]

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.12, duration: 0.55, ease: 'easeOut' } }),
}

export default function HomePage() {
  const [featured, setFeatured] = useState([])
  const [loadingDesigns, setLoadingDesigns] = useState(true)

  useEffect(() => {
    designsAPI.getAll()
      .then(res => {
        const raw = res.data?.designs || []
        // Pick top 3 by rating, normalise fields
        const top3 = raw
          .map(d => ({
            ...d,
            id: String(d.id || d._id || ''),
            price: d.price_per_head ?? d.pricePerHead ?? 0,
            img: d.image_url || d.imageUrl || '',
          }))
          .sort((a, b) => (b.rating || 0) - (a.rating || 0))
          .slice(0, 3)
        setFeatured(top3)
      })
      .catch(() => setFeatured([]))
      .finally(() => setLoadingDesigns(false))
  }, [])

  return (
    <>
      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden hero-gradient">
        <div className="absolute inset-0" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=1400&q=80)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.18 }} />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium mb-8"
            style={{ background: 'rgba(201,168,76,0.25)', border: '1px solid rgba(201,168,76,0.4)', color: 'var(--gold-light)' }}>
            <Star size={12} className="fill-current" /> Premium Mehendi Art Studio
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7 }}
            className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
            Where Art Meets<span className="block italic" style={{ color: 'var(--gold-light)' }}>Tradition</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.6 }}
            className="text-lg md:text-xl mb-10 max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.75)' }}>
            Celebrate your most cherished moments with exquisite bridal, Arabic, and traditional mehendi artistry.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/book" className="btn-gold text-base px-10 py-4">Book Your Mehendi <ArrowRight size={18} /></Link>
            <Link to="/designs" className="btn-outline-gold text-base px-10 py-4" style={{ borderColor: 'rgba(255,255,255,0.5)', color: 'white' }}>Explore Designs</Link>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
            className="flex flex-wrap justify-center gap-8 mt-16">
            {[['500+', 'Happy Brides'], ['10+', 'Years Experience'], ['50+', 'Design Patterns'], ['4.9★', 'Rating']].map(([num, label]) => (
              <div key={label} className="text-center">
                <div className="text-3xl font-bold" style={{ color: 'var(--gold-light)', fontFamily: 'Playfair Display, serif' }}>{num}</div>
                <div className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.6)' }}>{label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FEATURED DESIGNS — from DB only */}
      <section className="py-24 px-4" style={{ background: 'var(--cream)' }}>
        <div className="max-w-7xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-14">
            <div className="gold-divider" />
            <h2 className="section-title">Featured Designs</h2>
            <p className="section-subtitle">Handpicked masterpieces for every occasion</p>
          </motion.div>

          {loadingDesigns ? (
            <div className="flex justify-center py-16">
              <Loader size={28} className="animate-spin" style={{ color: 'var(--gold)' }} />
            </div>
          ) : featured.length === 0 ? (
            <div className="glass-card text-center py-16">
              <div className="text-5xl mb-4">🌿</div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--brown)', fontFamily: 'Playfair Display, serif' }}>
                Designs coming soon
              </h3>
              <p className="text-sm mb-5" style={{ color: 'var(--text-light)' }}>
                Our artist is preparing beautiful designs. Check back shortly!
              </p>
              <Link to="/contact" className="btn-gold py-2.5 px-6 text-sm">Contact Us</Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {featured.map((d, i) => (
                  <motion.div key={d.id} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} className="design-card group">
                    <div className="relative overflow-hidden h-56">
                      <img src={d.img} alt={d.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy"
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1609166214994-502d326bafee?w=500&q=80' }} />
                      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(61,26,10,0.7), transparent)' }} />
                      <span className="absolute top-3 left-3 badge badge-gold">{d.category}</span>
                      <div className="absolute bottom-3 left-3 flex items-center gap-1">
                        <Star size={12} className="fill-current" style={{ color: 'var(--gold-light)' }} />
                        <span className="text-white text-xs font-medium">{d.rating}</span>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-lg mb-1" style={{ fontFamily: 'Playfair Display, serif', color: 'var(--brown)' }}>{d.title}</h3>
                      <p className="text-sm mb-3 line-clamp-2" style={{ color: 'var(--text-light)' }}>{d.description}</p>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xs" style={{ color: 'var(--text-light)' }}>From</span>
                          <div className="text-xl font-bold" style={{ color: 'var(--gold-dark)', fontFamily: 'Playfair Display, serif' }}>₹{d.price.toLocaleString()}</div>
                          <span className="text-xs" style={{ color: 'var(--text-light)' }}>per person · {d.duration}</span>
                        </div>
                        <Link to={`/book/${d.id}`} className="btn-gold py-2 px-5 text-sm">Book</Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="text-center mt-10">
                <Link to="/designs" className="btn-outline-gold">View All Designs <ArrowRight size={16} /></Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-24 px-4" style={{ background: 'var(--beige)' }}>
        <div className="max-w-7xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-14">
            <div className="gold-divider" />
            <h2 className="section-title">Why Choose Us</h2>
            <p className="section-subtitle">Experience the difference of true artistry</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY.map(({ icon: Icon, title, desc }, i) => (
              <motion.div key={title} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}
                className="glass-card p-8 text-center hover:scale-105 transition-transform duration-300">
                <div className="w-14 h-14 rounded-2xl mx-auto mb-5 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(201,168,76,0.2), rgba(201,168,76,0.05))' }}>
                  <Icon size={26} style={{ color: 'var(--gold)' }} />
                </div>
                <h3 className="font-bold text-lg mb-2" style={{ fontFamily: 'Playfair Display, serif', color: 'var(--brown)' }}>{title}</h3>
                <p className="text-sm" style={{ color: 'var(--text-light)' }}>{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 px-4" style={{ background: 'var(--cream)' }}>
        <div className="max-w-6xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-14">
            <div className="gold-divider" />
            <h2 className="section-title">Happy Brides</h2>
            <p className="section-subtitle">Stories from our beautiful clients</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div key={t.name} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} className="glass-card p-7">
                <div className="flex gap-1 mb-4">
                  {Array(t.rating).fill(0).map((_, j) => <Star key={j} size={14} className="fill-current" style={{ color: 'var(--gold)' }} />)}
                </div>
                <p className="text-sm leading-relaxed mb-5 italic" style={{ color: 'var(--text-mid)' }}>"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ background: 'var(--gold)' }}>{t.a}</div>
                  <div>
                    <div className="font-semibold text-sm" style={{ color: 'var(--brown)' }}>{t.name}</div>
                    <div className="text-xs" style={{ color: 'var(--text-light)' }}>{t.event}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 relative overflow-hidden" style={{ background: 'var(--brown)' }}>
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>Ready for Your Dream Mehendi?</h2>
            <p className="mb-8 text-lg" style={{ color: 'rgba(255,255,255,0.7)' }}>Book now and get instant confirmation. Limited slots available!</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/book" className="btn-gold text-base px-10 py-4">Book Your Session</Link>
              <a href="https://wa.me/+917338498524" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-10 py-4 rounded-full font-semibold text-white transition-all hover:scale-105"
                style={{ background: '#25D366' }}>
                <MessageCircle size={18} /> WhatsApp Now
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
