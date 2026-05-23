import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ZoomIn } from 'lucide-react'

const GALLERY_IMGS = [
  { id: 1, url: 'https://images.unsplash.com/photo-1609166214994-502d326bafee?w=600&q=80', cat: 'Bridal', title: 'Royal Bridal', span: 'row-span-2' },
  { id: 2, url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80', cat: 'Arabic', title: 'Arabic Floral', span: '' },
  { id: 3, url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80', cat: 'Festival', title: 'Festival', span: '' },
  { id: 4, url: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600&q=80', cat: 'Engagement', title: 'Engagement', span: 'row-span-2' },
  { id: 5, url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80', cat: 'Traditional', title: 'Traditional', span: '' },
  { id: 6, url: 'https://images.unsplash.com/photo-1532635241-17e820acc59f?w=600&q=80', cat: 'Modern', title: 'Modern', span: '' },
  { id: 7, url: 'https://images.unsplash.com/photo-1609166214994-502d326bafee?w=600&q=80', cat: 'Minimal', title: 'Minimal', span: '' },
  { id: 8, url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80', cat: 'Bridal', title: 'Bridal 2', span: '' },
]

const CATS = ['All', 'Bridal', 'Arabic', 'Festival', 'Engagement', 'Traditional', 'Modern', 'Minimal']

export default function GalleryPage() {
  const [active, setActive] = useState('All')
  const [lightbox, setLightbox] = useState(null)

  const imgs = active === 'All' ? GALLERY_IMGS : GALLERY_IMGS.filter(i => i.cat === active)

  return (
    <div className="pt-24 pb-16 min-h-screen" style={{ background: 'var(--cream)' }}>
      <div className="max-w-7xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="gold-divider" />
          <h1 className="section-title">Our Gallery</h1>
          <p className="section-subtitle">A glimpse into our finest mehendi artwork</p>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {CATS.map(c => (
            <button key={c} onClick={() => setActive(c)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${active === c ? 'text-white' : ''}`}
              style={active === c
                ? { background: 'var(--gold)' }
                : { background: 'rgba(201,168,76,0.1)', color: 'var(--text-mid)', border: '1px solid rgba(201,168,76,0.25)' }}>
              {c}
            </button>
          ))}
        </div>

        {/* Masonry Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[200px]">
          {imgs.map((img, i) => (
            <motion.div key={img.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.06 }}
              className={`relative overflow-hidden rounded-2xl cursor-pointer group ${img.span}`}
              onClick={() => setLightbox(img)}>
              <img src={img.url} alt={img.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                <ZoomIn size={28} className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
                style={{ background: 'linear-gradient(to top, rgba(61,26,10,0.9), transparent)' }}>
                <div className="text-white text-sm font-semibold">{img.title}</div>
                <div className="text-xs" style={{ color: 'var(--gold-light)' }}>{img.cat}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.9)' }}
            onClick={() => setLightbox(null)}>
            <button className="absolute top-4 right-4 text-white/80 hover:text-white" onClick={() => setLightbox(null)}>
              <X size={28} />
            </button>
            <motion.img initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }}
              src={lightbox.url.replace('w=600', 'w=1000')} alt={lightbox.title}
              className="max-w-full max-h-[85vh] rounded-2xl object-contain"
              onClick={e => e.stopPropagation()} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
