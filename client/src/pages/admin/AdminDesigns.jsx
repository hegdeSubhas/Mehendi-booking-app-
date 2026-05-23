import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Edit, Trash2, X, Loader, Save, Upload, Image, Link2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { designsAPI, uploadAPI } from '../../services/api'
import toast from 'react-hot-toast'

const CATEGORIES = ['Bridal', 'Arabic', 'Festival', 'Engagement', 'Kids', 'Indo-Western', 'Traditional', 'Modern', 'Minimal']
const EMPTY = { title: '', category: 'Bridal', description: '', image_url: '', price_per_head: '', duration: '2-3 hours', rating: '4.5' }

// ── Image Upload Component ───────────────────────────────────────────────────
function ImageUploader({ value, onChange }) {
  const [mode, setMode] = useState('upload') // 'upload' | 'url'
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(value || '')
  const inputRef = useRef(null)

  // Sync preview when value changes (e.g. editing existing design)
  useEffect(() => {
    setPreview(value || '')
    if (value && value.startsWith('http')) setMode('url')
  }, [value])

  const handleFile = useCallback(async (file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image must be under 10MB')
      return
    }

    // Show local preview immediately
    const localUrl = URL.createObjectURL(file)
    setPreview(localUrl)

    setUploading(true)
    try {
      const res = await uploadAPI.image(file)
      const imageUrl = res.data.imageUrl  // e.g. "/uploads/design_xxx.jpg"
      setPreview(imageUrl)
      onChange(imageUrl)
      toast.success('Image uploaded! ✅')
    } catch (err) {
      toast.error(err.message || 'Upload failed')
      setPreview(value || '')
    } finally {
      setUploading(false)
    }
  }, [onChange, value])

  const onDrop = useCallback((e) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [handleFile])

  const onFileInput = (e) => {
    const file = e.target.files[0]
    if (file) handleFile(file)
  }

  return (
    <div className="space-y-3">
      {/* Mode toggle */}
      <div className="flex rounded-xl overflow-hidden border" style={{ borderColor: 'rgba(201,168,76,0.3)' }}>
        {['upload', 'url'].map(m => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className="flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold transition-all"
            style={{
              background: mode === m ? 'var(--gold)' : 'transparent',
              color: mode === m ? 'white' : 'var(--text-mid)',
            }}
          >
            {m === 'upload' ? <Upload size={13} /> : <Link2 size={13} />}
            {m === 'upload' ? 'Upload File' : 'Paste URL'}
          </button>
        ))}
      </div>

      {mode === 'upload' ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => !uploading && inputRef.current?.click()}
          className="relative rounded-2xl border-2 border-dashed cursor-pointer transition-all overflow-hidden"
          style={{
            borderColor: dragging ? 'var(--gold)' : 'rgba(201,168,76,0.35)',
            background: dragging ? 'rgba(201,168,76,0.06)' : 'rgba(255,252,247,0.5)',
            minHeight: preview ? 'auto' : 160,
          }}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onFileInput}
          />

          {preview ? (
            <div className="relative group">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-52 object-cover rounded-xl"
              />
              {/* Overlay on hover */}
              <div className="absolute inset-0 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: 'rgba(0,0,0,0.5)' }}>
                <div className="text-white text-center">
                  <Upload size={24} className="mx-auto mb-1" />
                  <p className="text-xs font-medium">Click to change image</p>
                </div>
              </div>
              {uploading && (
                <div className="absolute inset-0 rounded-xl flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.6)' }}>
                  <div className="text-center text-white">
                    <Loader size={28} className="animate-spin mx-auto mb-2" />
                    <p className="text-xs">Uploading...</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
              {uploading ? (
                <>
                  <Loader size={32} className="animate-spin mb-3" style={{ color: 'var(--gold)' }} />
                  <p className="text-sm font-medium" style={{ color: 'var(--brown)' }}>Uploading...</p>
                </>
              ) : (
                <>
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                    style={{ background: 'rgba(201,168,76,0.12)' }}>
                    <Image size={26} style={{ color: 'var(--gold)' }} />
                  </div>
                  <p className="text-sm font-semibold mb-1" style={{ color: 'var(--brown)' }}>
                    {dragging ? 'Drop image here' : 'Drag & drop image'}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-light)' }}>
                    or click to browse • JPG, PNG, WebP, GIF • Max 10MB
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <div className="relative">
            <Link2 size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--gold)' }} />
            <input
              type="url"
              placeholder="https://example.com/image.jpg"
              className="input-field pl-9"
              value={preview.startsWith('/uploads') ? '' : preview}
              onChange={(e) => {
                setPreview(e.target.value)
                onChange(e.target.value)
              }}
            />
          </div>
          {preview && !preview.startsWith('/uploads') && preview.startsWith('http') && (
            <img src={preview} alt="URL preview" className="w-full h-40 object-cover rounded-xl"
              onError={(e) => { e.target.style.display = 'none' }} />
          )}
        </div>
      )}
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function AdminDesigns() {
  const [designs, setDesigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)
  const [imageUrl, setImageUrl] = useState('')

  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const load = () => {
    setLoading(true)
    designsAPI.getAll()
      .then(r => setDesigns(r.data?.designs || []))
      .catch(() => setDesigns([]))
      .finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [])

  const openModal = (design = null) => {
    setEditing(design)
    reset(design
      ? { ...design, price_per_head: design.price_per_head || design.pricePerHead, image_url: design.image_url || design.imageUrl }
      : EMPTY
    )
    setImageUrl(design?.image_url || design?.imageUrl || '')
    setModal(true)
  }

  const onSubmit = async (data) => {
    if (!imageUrl) {
      toast.error('Please upload or enter an image')
      return
    }
    setSaving(true)
    try {
      const payload = {
        title: data.title,
        category: data.category,
        description: data.description,
        image_url: imageUrl,
        imageUrl: imageUrl,
        price_per_head: Number(data.price_per_head),
        pricePerHead: Number(data.price_per_head),
        duration: data.duration,
        rating: Number(data.rating),
      }
      if (editing) {
        await designsAPI.update(editing.id || editing._id, payload)
        toast.success('Design updated ✅')
      } else {
        await designsAPI.create(payload)
        toast.success('Design added ✅')
      }
      setModal(false)
      load()
    } catch { toast.error('Failed to save design') }
    finally { setSaving(false) }
  }

  const del = async (id) => {
    if (!window.confirm('Delete this design?')) return
    try {
      await designsAPI.delete(id)
      toast.success('Deleted')
      load()
    } catch { toast.error('Delete failed') }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold" style={{ fontFamily: 'Playfair Display, serif', color: 'var(--brown)' }}>Manage Designs</h2>
          <p className="text-sm mt-1" style={{ color: 'var(--text-light)' }}>{designs.length} design{designs.length !== 1 ? 's' : ''} total</p>
        </div>
        <button onClick={() => openModal()} className="btn-gold py-2.5 px-5 text-sm"><Plus size={16} /> Add Design</button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader size={28} className="animate-spin" style={{ color: 'var(--gold)' }} /></div>
      ) : designs.length === 0 ? (
        <div className="text-center py-20 glass-card">
          <div className="text-5xl mb-4">🎨</div>
          <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--brown)' }}>No designs yet</h3>
          <p className="text-sm mb-4" style={{ color: 'var(--text-light)' }}>Add your first design to show on the platform.</p>
          <button onClick={() => openModal()} className="btn-gold py-2 px-5 text-sm inline-flex"><Plus size={16} /> Add Design</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {designs.map(d => (
            <motion.div key={d.id || d._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card overflow-hidden group">
              <div className="relative overflow-hidden">
                <img
                  src={d.image_url || d.imageUrl}
                  alt={d.title}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=No+Image' }}
                />
                <div className="absolute top-3 right-3">
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold"
                    style={{ background: 'rgba(201,168,76,0.9)', color: 'white', backdropFilter: 'blur(4px)' }}>
                    ⭐ {d.rating}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm truncate" style={{ color: 'var(--brown)', fontFamily: 'Playfair Display, serif' }}>{d.title}</h3>
                    <span className="badge badge-gold text-xs mt-1">{d.category}</span>
                  </div>
                  <div className="text-right shrink-0 ml-2">
                    <div className="font-bold text-base" style={{ color: 'var(--gold-dark)', fontFamily: 'Playfair Display, serif' }}>
                      ₹{Number(d.price_per_head || d.pricePerHead).toLocaleString()}
                    </div>
                    <div className="text-xs" style={{ color: 'var(--text-light)' }}>{d.duration}</div>
                  </div>
                </div>
                <p className="text-xs mb-3 line-clamp-2" style={{ color: 'var(--text-light)' }}>{d.description}</p>
                <div className="flex gap-2">
                  <button onClick={() => openModal(d)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium transition-colors"
                    style={{ background: 'rgba(201,168,76,0.1)', color: 'var(--gold-dark)' }}>
                    <Edit size={13} /> Edit
                  </button>
                  <button onClick={() => del(d.id || d._id)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium transition-colors"
                    style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444' }}>
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {modal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)' }}
            onClick={(e) => e.target === e.currentTarget && setModal(false)}
          >
            <motion.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.92, opacity: 0 }}
              className="w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-3xl bg-white shadow-2xl"
              style={{ border: '1px solid rgba(201,168,76,0.15)' }}
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-white z-10 flex justify-between items-center px-7 py-5"
                style={{ borderBottom: '1px solid rgba(201,168,76,0.15)' }}>
                <h3 className="text-xl font-bold" style={{ fontFamily: 'Playfair Display, serif', color: 'var(--brown)' }}>
                  {editing ? '✏️ Edit Design' : '🌿 Add New Design'}
                </h3>
                <button onClick={() => setModal(false)} className="p-2 rounded-xl hover:bg-gray-100 transition-colors" style={{ color: 'var(--text-light)' }}>
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="p-7 space-y-5">

                {/* Image Uploader */}
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-mid)' }}>
                    Design Image <span className="text-red-400">*</span>
                  </label>
                  <ImageUploader value={imageUrl} onChange={setImageUrl} />
                  {!imageUrl && saving && (
                    <p className="text-red-500 text-xs mt-1">Image is required</p>
                  )}
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold mb-1" style={{ color: 'var(--text-mid)' }}>Title <span className="text-red-400">*</span></label>
                  <input className={`input-field ${errors.title ? 'border-red-400' : ''}`} placeholder="e.g. Royal Bridal Full Hand"
                    {...register('title', { required: 'Title is required' })} />
                  {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
                </div>

                {/* Category + Rating row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1" style={{ color: 'var(--text-mid)' }}>Category</label>
                    <select className="input-field" {...register('category', { required: true })}>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1" style={{ color: 'var(--text-mid)' }}>Rating (0–5)</label>
                    <input type="number" step="0.1" min="0" max="5" placeholder="4.5"
                      className={`input-field ${errors.rating ? 'border-red-400' : ''}`}
                      {...register('rating', { required: 'Required', min: 0, max: 5 })} />
                  </div>
                </div>

                {/* Price + Duration row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1" style={{ color: 'var(--text-mid)' }}>Price per Head (₹) <span className="text-red-400">*</span></label>
                    <input type="number" min="1" placeholder="1500"
                      className={`input-field ${errors.price_per_head ? 'border-red-400' : ''}`}
                      {...register('price_per_head', { required: 'Required', min: 1 })} />
                    {errors.price_per_head && <p className="text-red-500 text-xs mt-1">{errors.price_per_head.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1" style={{ color: 'var(--text-mid)' }}>Duration</label>
                    <input type="text" placeholder="2-3 hours" className="input-field"
                      {...register('duration', { required: 'Required' })} />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold mb-1" style={{ color: 'var(--text-mid)' }}>Description <span className="text-red-400">*</span></label>
                  <textarea rows={3} placeholder="Describe the design style, occasion suitability, special features..."
                    className={`input-field resize-none ${errors.description ? 'border-red-400' : ''}`}
                    {...register('description', { required: 'Description is required' })} />
                  {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setModal(false)}
                    className="flex-1 py-3 rounded-xl text-sm font-semibold border-2 transition-all"
                    style={{ borderColor: 'rgba(201,168,76,0.4)', color: 'var(--gold-dark)' }}>
                    Cancel
                  </button>
                  <button type="submit" disabled={saving}
                    className="btn-gold flex-1 py-3 text-sm justify-center disabled:opacity-60">
                    {saving ? <Loader size={16} className="animate-spin" /> : <><Save size={15} /> {editing ? 'Update Design' : 'Save Design'}</>}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
