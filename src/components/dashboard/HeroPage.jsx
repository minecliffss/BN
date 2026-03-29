import { useState, useEffect, useRef } from 'react'
import { Icon } from '@iconify/react'
import { supabase } from '../../lib/supabase'

const BUCKET = 'portfolio-images'

const DEFAULT_HERO = {
  headline: 'Capturing Moments That Last Forever',
  subtitle: 'Professional Wedding & Event Photography based in Kerala. We craft cinematic stories through our lenses with minimal, elegant, and premium quality.',
  rating_text: '5.0 Rating • 88 Happy Clients',
  whatsapp_url: '#',
  main_image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2938&auto=format&fit=crop',
  image_2: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2940&auto=format&fit=crop',
  image_3: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=2940&auto=format&fit=crop',
}

/* ─── Single Image Uploader ─── */
function HeroImageUploader({ label, value, onChange, aspectClass = 'aspect-video' }) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [err, setErr] = useState('')
  const inputRef = useRef()

  const handleFile = async (file) => {
    if (!file) return
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowed.includes(file.type)) { setErr('Only JPEG/PNG/WebP allowed.'); return }
    if (file.size > 8 * 1024 * 1024) { setErr('Max 8 MB.'); return }
    setErr('')
    setUploading(true)
    try {
      const ext = file.name.split('.').pop().toLowerCase()
      const path = `hero/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { error: upErr } = await supabase.storage.from(BUCKET).upload(path, file, { upsert: true, contentType: file.type })
      if (upErr) throw upErr
      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
      onChange(data.publicUrl)
    } catch (e) {
      setErr('Upload failed: ' + e.message)
    } finally {
      setUploading(false)
    }
  }

  const onDrop = (e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]) }

  return (
    <div className="space-y-2">
      <label className="text-xs font-medium text-neutral-600 uppercase tracking-wide">{label}</label>
      <div
        className={`relative rounded-xl overflow-hidden border-2 border-dashed ${aspectClass} bg-neutral-100 cursor-pointer group ${dragOver ? 'border-neutral-900 bg-neutral-200' : 'border-neutral-200 hover:border-neutral-400'} transition-all`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
      >
        {value && (
          <img src={value} alt={label} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        )}

        {/* Overlay */}
        <div className={`absolute inset-0 flex flex-col items-center justify-center gap-2 transition-opacity ${value && !uploading ? 'opacity-0 group-hover:opacity-100 bg-black/50' : 'opacity-100 bg-black/20'}`}>
          {uploading ? (
            <svg className="animate-spin h-7 w-7 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
          ) : (
            <>
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Icon icon="solar:camera-add-linear" className="text-xl text-white" />
              </div>
              <p className="text-white text-xs font-medium">{value ? 'Click to change' : 'Click or drag image'}</p>
              <p className="text-white/70 text-xs">JPEG, PNG · Max 8 MB</p>
            </>
          )}
        </div>
      </div>
      {err && <p className="text-xs text-red-500">{err}</p>}
      <input ref={inputRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp" className="hidden" onChange={e => handleFile(e.target.files[0])} />
    </div>
  )
}

/* ─── Main Hero Management Page ─── */
export default function HeroPage() {
  const [hero, setHero] = useState(DEFAULT_HERO)
  const [heroId, setHeroId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const fetchHero = async () => {
    setLoading(true)
    const { data } = await supabase.from('hero_settings').select('*').limit(1).maybeSingle()
    if (data) {
      setHero({ ...DEFAULT_HERO, ...data })
      setHeroId(data.id)
    }
    setLoading(false)
  }

  useEffect(() => { fetchHero() }, [])

  const handleSave = async () => {
    setSaving(true)
    const payload = {
      headline: hero.headline,
      subtitle: hero.subtitle,
      rating_text: hero.rating_text,
      whatsapp_url: hero.whatsapp_url,
      main_image: hero.main_image,
      image_2: hero.image_2,
      image_3: hero.image_3,
      updated_at: new Date().toISOString(),
    }
    let error
    if (heroId) {
      ;({ error } = await supabase.from('hero_settings').update(payload).eq('id', heroId))
    } else {
      const { data, error: insertErr } = await supabase.from('hero_settings').insert([payload]).select().single()
      error = insertErr
      if (data) setHeroId(data.id)
    }
    setSaving(false)
    if (error) {
      showToast('Save failed: ' + error.message, 'error')
    } else {
      showToast('Hero section updated successfully!')
    }
  }

  const set = (key, val) => setHero(h => ({ ...h, [key]: val }))

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <svg className="animate-spin h-7 w-7 text-neutral-400" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8 max-w-5xl">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-lg border text-sm font-medium ${
          toast.type === 'error' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-200 text-green-700'
        }`}>
          <Icon icon={toast.type === 'error' ? 'solar:danger-circle-linear' : 'solar:check-circle-linear'} className="text-base shrink-0" />
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium tracking-tight text-neutral-900" style={{ fontFamily: 'Playfair Display, serif' }}>
            Hero Section
          </h1>
          <p className="mt-1 text-sm text-neutral-500 font-light">Manage the headline, text and photos shown in the top hero area</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 bg-neutral-900 text-white text-sm font-medium px-6 py-2.5 rounded-full hover:bg-neutral-800 transition-colors disabled:opacity-60 self-start sm:self-auto"
        >
          {saving ? (
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
          ) : (
            <Icon icon="solar:diskette-linear" className="text-lg" />
          )}
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>

      {/* Live Preview Card */}
      <div className="bg-white border border-neutral-100 rounded-2xl p-5 shadow-sm">
        <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-4 flex items-center gap-1.5">
          <Icon icon="solar:eye-linear" className="text-sm" />
          Preview
        </p>
        <div className="bg-neutral-50 rounded-xl p-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-neutral-200 mb-4">
            <div className="flex text-amber-500 text-xs gap-0.5">
              {[...Array(5)].map((_, i) => <Icon key={i} icon="solar:star-bold" />)}
            </div>
            <span className="text-xs font-medium text-neutral-600">{hero.rating_text}</span>
          </div>
          <h2 className="text-2xl font-medium text-neutral-900 font-serif leading-tight max-w-sm mx-auto">
            {hero.headline}
          </h2>
          <p className="mt-2 text-sm text-neutral-500 max-w-xs mx-auto leading-relaxed">{hero.subtitle}</p>
        </div>

        {/* Mini collage preview */}
        <div className="mt-4 grid grid-cols-12 gap-2 h-40 rounded-xl overflow-hidden">
          <div className="col-span-8 overflow-hidden bg-neutral-100">
            {hero.main_image && <img src={hero.main_image} alt="main" className="w-full h-full object-cover" />}
          </div>
          <div className="col-span-4 flex flex-col gap-2">
            <div className="flex-1 overflow-hidden bg-neutral-100">
              {hero.image_2 && <img src={hero.image_2} alt="img2" className="w-full h-full object-cover" />}
            </div>
            <div className="flex-1 overflow-hidden bg-neutral-100">
              {hero.image_3 && <img src={hero.image_3} alt="img3" className="w-full h-full object-cover" />}
            </div>
          </div>
        </div>
      </div>

      {/* Text Settings */}
      <div className="bg-white border border-neutral-100 rounded-2xl p-6 shadow-sm space-y-5">
        <h2 className="text-sm font-semibold text-neutral-800 flex items-center gap-2">
          <Icon icon="solar:text-linear" className="text-base text-neutral-500" />
          Text Content
        </h2>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-neutral-600 uppercase tracking-wide">Main Headline</label>
          <input
            type="text"
            value={hero.headline}
            onChange={e => set('headline', e.target.value)}
            className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900/20 transition-all font-serif"
          />
          <p className="text-xs text-neutral-400">Displayed as the large heading. Keep it short and impactful.</p>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-neutral-600 uppercase tracking-wide">Subtitle / Description</label>
          <textarea
            rows={3}
            value={hero.subtitle}
            onChange={e => set('subtitle', e.target.value)}
            className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900/20 transition-all resize-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-neutral-600 uppercase tracking-wide">Rating Badge Text</label>
            <input
              type="text"
              value={hero.rating_text}
              onChange={e => set('rating_text', e.target.value)}
              placeholder="5.0 Rating • 88 Happy Clients"
              className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900/20 transition-all"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-neutral-600 uppercase tracking-wide">WhatsApp Link</label>
            <input
              type="url"
              value={hero.whatsapp_url}
              onChange={e => set('whatsapp_url', e.target.value)}
              placeholder="https://wa.me/91XXXXXXXXXX"
              className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900/20 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Image Collage Settings */}
      <div className="bg-white border border-neutral-100 rounded-2xl p-6 shadow-sm space-y-5">
        <h2 className="text-sm font-semibold text-neutral-800 flex items-center gap-2">
          <Icon icon="solar:gallery-wide-linear" className="text-base text-neutral-500" />
          Hero Photo Collage
          <span className="ml-auto text-xs font-normal text-neutral-400">3 images · shown below the headline</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Main large image */}
          <div className="md:row-span-2">
            <HeroImageUploader
              label="Main Image (Large · Left)"
              value={hero.main_image}
              onChange={v => set('main_image', v)}
              aspectClass="aspect-[4/5]"
            />
          </div>

          <div className="grid grid-rows-2 gap-5 h-full">
            {/* Top right */}
            <HeroImageUploader
              label="Image 2 (Top Right)"
              value={hero.image_2}
              onChange={v => set('image_2', v)}
              aspectClass="aspect-video"
            />
            {/* Bottom right */}
            <HeroImageUploader
              label="Image 3 (Bottom Right)"
              value={hero.image_3}
              onChange={v => set('image_3', v)}
              aspectClass="aspect-video"
            />
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-start gap-3">
          <Icon icon="solar:info-circle-linear" className="text-amber-600 text-base mt-0.5 shrink-0" />
          <p className="text-xs text-amber-700 leading-relaxed">
            <strong>Best practice:</strong> Use landscape/portrait wedding photos with good contrast. Recommended: at least 1200×800px for sharp display on all screens.
          </p>
        </div>
      </div>

      {/* Save bottom */}
      <div className="flex justify-end pb-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 bg-neutral-900 text-white text-sm font-medium px-8 py-3 rounded-full hover:bg-neutral-800 transition-colors disabled:opacity-60"
        >
          {saving ? (
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
          ) : (
            <Icon icon="solar:diskette-linear" className="text-lg" />
          )}
          {saving ? 'Saving…' : 'Save All Changes'}
        </button>
      </div>
    </div>
  )
}
