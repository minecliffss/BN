import { useState, useEffect, useRef } from 'react'
import { Icon } from '@iconify/react'
import { supabase } from '../lib/supabase'

const BUCKET = 'portfolio-images'

const categories = ['All', 'Weddings', 'Events', 'Portraits', 'Festival']
const statusColors = {
  Delivered: 'bg-green-100 text-green-700',
  'In Edit': 'bg-amber-100 text-amber-700',
  Review: 'bg-blue-100 text-blue-700',
}

const emptyForm = {
  title: '',
  category: 'Weddings',
  location: '',
  photos: '',
  status: 'Delivered',
  img_url: '',
}

/* ─── Image Uploader ─── */
function ImageUploader({ currentImg, onUploaded }) {
  const [preview, setPreview] = useState(currentImg || '')
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const inputRef = useRef()

  useEffect(() => {
    setPreview(currentImg || '')
    setUploadError('')
  }, [currentImg])

  const handleFile = async (file) => {
    if (!file) return
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowed.includes(file.type)) {
      setUploadError('Only JPEG, PNG or WebP images are allowed.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File must be under 5 MB.')
      return
    }
    setUploadError('')
    setPreview(URL.createObjectURL(file))
    setUploading(true)
    try {
      const ext = file.name.split('.').pop().toLowerCase()
      const path = `portfolio/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { error: upErr } = await supabase.storage
        .from(BUCKET)
        .upload(path, file, { upsert: true, contentType: file.type })
      if (upErr) throw upErr
      const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path)
      onUploaded(urlData.publicUrl)
    } catch (err) {
      setUploadError('Upload failed: ' + (err.message || 'Unknown error'))
      setPreview(currentImg || '')
      onUploaded(currentImg || '')
    } finally {
      setUploading(false)
    }
  }

  const onInputChange = (e) => handleFile(e.target.files[0])
  const onDrop = (e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]) }

  return (
    <div className="space-y-2">
      <label className="text-xs font-medium text-neutral-600 uppercase tracking-wide">Cover Image</label>

      {preview ? (
        <div className="relative rounded-xl overflow-hidden border border-neutral-200 aspect-video bg-neutral-50">
          <img src={preview} alt="preview" className="w-full h-full object-cover" />
          {uploading && (
            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-2">
              <svg className="animate-spin h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              <span className="text-white text-xs font-medium">Uploading…</span>
            </div>
          )}
          {!uploading && (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm text-neutral-700 text-xs font-medium px-3 py-1.5 rounded-lg border border-neutral-200 hover:bg-white transition-colors flex items-center gap-1.5"
            >
              <Icon icon="solar:camera-add-linear" className="text-sm" />
              Change
            </button>
          )}
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className={`flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
            dragOver
              ? 'border-neutral-900 bg-neutral-50 scale-[1.01]'
              : 'border-neutral-200 bg-neutral-50 hover:border-neutral-400 hover:bg-neutral-100'
          }`}
        >
          {uploading ? (
            <>
              <svg className="animate-spin h-7 w-7 text-neutral-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              <span className="text-sm text-neutral-500">Uploading…</span>
            </>
          ) : (
            <>
              <div className="w-12 h-12 rounded-full bg-neutral-200 flex items-center justify-center">
                <Icon icon="solar:upload-minimalistic-linear" className="text-xl text-neutral-500" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-neutral-700">Click or drag image here</p>
                <p className="text-xs text-neutral-400 mt-0.5">JPEG, PNG, WebP · Max 5 MB</p>
              </div>
            </>
          )}
        </div>
      )}

      {uploadError && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <Icon icon="solar:danger-circle-linear" className="text-sm shrink-0" />
          {uploadError}
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        className="hidden"
        onChange={onInputChange}
      />
    </div>
  )
}

/* ─── Work Modal ─── */
function WorkModal({ isOpen, onClose, onSave, initial }) {
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setForm(initial ? { ...emptyForm, ...initial } : emptyForm)
    setError('')
  }, [initial, isOpen])

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      await onSave({ ...form, photos: parseInt(form.photos, 10) || 0 })
      onClose()
    } catch (err) {
      setError(err.message || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-neutral-100 overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 shrink-0">
          <h2 className="text-lg font-medium text-neutral-900" style={{ fontFamily: 'Playfair Display, serif' }}>
            {initial?.id ? 'Edit Work' : 'Add New Work'}
          </h2>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-900 transition-colors">
            <Icon icon="solar:close-circle-linear" className="text-xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-xs px-4 py-3 rounded-lg">
              <Icon icon="solar:danger-circle-linear" className="text-base shrink-0" />
              {error}
            </div>
          )}

          {/* Image upload — stores URL in form.img_url */}
          <ImageUploader
            currentImg={form.img_url}
            onUploaded={(url) => setForm(f => ({ ...f, img_url: url }))}
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-1">
              <label className="text-xs font-medium text-neutral-600 uppercase tracking-wide">Title *</label>
              <input
                type="text" required
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                placeholder="Classic Wedding"
                className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900/20 transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-neutral-600 uppercase tracking-wide">Category *</label>
              <select
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900/20 transition-all appearance-none"
              >
                {['Weddings', 'Events', 'Portraits', 'Festival'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-neutral-600 uppercase tracking-wide">Status</label>
              <select
                value={form.status}
                onChange={e => setForm({ ...form, status: e.target.value })}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900/20 transition-all appearance-none"
              >
                {['Delivered', 'In Edit', 'Review'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-neutral-600 uppercase tracking-wide">Location</label>
              <input
                type="text"
                value={form.location}
                onChange={e => setForm({ ...form, location: e.target.value })}
                placeholder="Kerala, India"
                className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900/20 transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-neutral-600 uppercase tracking-wide">No. of Photos</label>
              <input
                type="number" min="0"
                value={form.photos}
                onChange={e => setForm({ ...form, photos: e.target.value })}
                placeholder="342"
                className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900/20 transition-all"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="text-sm text-neutral-500 hover:text-neutral-900 font-medium px-4 py-2 rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-all">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="text-sm bg-neutral-900 text-white font-medium px-5 py-2 rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-60 flex items-center gap-2">
              {saving && <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>}
              {initial?.id ? 'Save Changes' : 'Add Work'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

/* ─── Delete Confirm Modal ─── */
function DeleteConfirmModal({ isOpen, work, onConfirm, onCancel, loading }) {
  if (!isOpen || !work) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm border border-neutral-100 p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
          <Icon icon="solar:trash-bin-trash-linear" className="text-2xl text-red-500" />
        </div>
        <h3 className="text-base font-medium text-neutral-900 mb-1">Delete this work?</h3>
        <p className="text-sm text-neutral-500 mb-6">
          <span className="font-medium text-neutral-800">"{work.title}"</span> will be permanently removed.
        </p>
        <div className="flex gap-3 justify-center">
          <button onClick={onCancel} className="px-5 py-2 text-sm font-medium text-neutral-600 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors">Cancel</button>
          <button onClick={onConfirm} disabled={loading} className="px-5 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors disabled:opacity-60 flex items-center gap-2">
            {loading && <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>}
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─── Main Page ─── */
export default function PortfolioPage() {
  const [works, setWorks] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')
  const [viewMode, setViewMode] = useState('grid')
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [toast, setToast] = useState(null)

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const fetchWorks = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('portfolio_works')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error) setWorks(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchWorks() }, [])

  const handleSave = async (form) => {
    if (editTarget?.id) {
      const { error } = await supabase
        .from('portfolio_works')
        .update({ ...form, updated_at: new Date().toISOString() })
        .eq('id', editTarget.id)
      if (error) throw error
      showToast('Work updated successfully')
    } else {
      const { error } = await supabase
        .from('portfolio_works')
        .insert([{ ...form }])
      if (error) throw error
      showToast('New work added')
    }
    fetchWorks()
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleteLoading(true)
    // Also remove image from Storage
    if (deleteTarget.img_url?.includes(BUCKET)) {
      const path = deleteTarget.img_url.split(`/${BUCKET}/`)[1]
      if (path) await supabase.storage.from(BUCKET).remove([path])
    }
    const { error } = await supabase.from('portfolio_works').delete().eq('id', deleteTarget.id)
    setDeleteLoading(false)
    if (!error) {
      showToast('Work deleted', 'error')
      setDeleteTarget(null)
      fetchWorks()
    }
  }

  const openAdd = () => { setEditTarget(null); setModalOpen(true) }
  const openEdit = (w) => { setEditTarget(w); setModalOpen(true) }

  const filtered = works.filter(w => {
    const matchCat = activeCategory === 'All' || w.category === activeCategory
    const matchSearch =
      w.title?.toLowerCase().includes(search.toLowerCase()) ||
      w.location?.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <div className="p-8 space-y-6">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-lg border text-sm font-medium ${
          toast.type === 'error'
            ? 'bg-red-50 border-red-200 text-red-700'
            : 'bg-green-50 border-green-200 text-green-700'
        }`}>
          <Icon icon={toast.type === 'error' ? 'solar:trash-bin-trash-linear' : 'solar:check-circle-linear'} className="text-base shrink-0" />
          {toast.msg}
        </div>
      )}

      <WorkModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSave={handleSave} initial={editTarget} />
      <DeleteConfirmModal isOpen={!!deleteTarget} work={deleteTarget} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} loading={deleteLoading} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium tracking-tight text-neutral-900" style={{ fontFamily: 'Playfair Display, serif' }}>
            Selected Works
          </h1>
          <p className="mt-1 text-sm text-neutral-500 font-light">
            {works.length} works in your portfolio · shown on website
          </p>
        </div>
        <button onClick={openAdd} className="inline-flex items-center gap-2 bg-neutral-900 text-white text-sm font-medium px-5 py-2.5 rounded-full hover:bg-neutral-800 transition-colors self-start sm:self-auto">
          <Icon icon="solar:add-square-linear" className="text-lg" />
          Add New Work
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between bg-white border border-neutral-100 rounded-2xl p-4 shadow-sm">
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 text-xs font-medium rounded-full border transition-all ${
                activeCategory === cat
                  ? 'bg-neutral-900 text-white border-neutral-900'
                  : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100'
              }`}>
              {cat}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <div className="flex items-center gap-2 border border-neutral-200 rounded-lg px-3 py-2 bg-white">
            <Icon icon="solar:magnifer-linear" className="text-neutral-400 text-sm" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="text-sm focus:outline-none placeholder:text-neutral-400 w-32" />
          </div>
          <div className="flex border border-neutral-200 rounded-lg overflow-hidden">
            <button onClick={() => setViewMode('grid')} className={`p-2 ${viewMode === 'grid' ? 'bg-neutral-900 text-white' : 'bg-white text-neutral-500 hover:bg-neutral-50'} transition-colors`}>
              <Icon icon="solar:widget-2-linear" className="text-base" />
            </button>
            <button onClick={() => setViewMode('list')} className={`p-2 ${viewMode === 'list' ? 'bg-neutral-900 text-white' : 'bg-white text-neutral-500 hover:bg-neutral-50'} transition-colors`}>
              <Icon icon="solar:list-linear" className="text-base" />
            </button>
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <svg className="animate-spin h-7 w-7 text-neutral-400" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
        </div>
      )}

      {/* Empty */}
      {!loading && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-neutral-100 flex items-center justify-center mb-4">
            <Icon icon="solar:gallery-wide-linear" className="text-3xl text-neutral-400" />
          </div>
          <p className="text-neutral-600 font-medium">No works found</p>
          <p className="text-sm text-neutral-400 mt-1">Add your first work or change the filter.</p>
          <button onClick={openAdd} className="mt-5 inline-flex items-center gap-2 bg-neutral-900 text-white text-sm font-medium px-5 py-2.5 rounded-full hover:bg-neutral-800 transition-colors">
            <Icon icon="solar:add-square-linear" className="text-lg" />
            Add New Work
          </button>
        </div>
      )}

      {/* Grid View */}
      {!loading && viewMode === 'grid' && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map(work => (
            <div key={work.id} className="bg-white rounded-2xl border border-neutral-100 overflow-hidden shadow-sm hover:shadow-md transition-all group cursor-pointer">
              <div className="relative h-52 overflow-hidden bg-neutral-100">
                {work.img_url ? (
                  <img src={work.img_url} alt={work.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Icon icon="solar:gallery-linear" className="text-4xl text-neutral-300" />
                  </div>
                )}
                {work.status && (
                  <span className={`absolute top-3 right-3 text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[work.status] || 'bg-neutral-100 text-neutral-600'}`}>
                    {work.status}
                  </span>
                )}
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-neutral-900">{work.title}</h3>
                    <p className="text-xs text-neutral-400 mt-1">
                      {work.category}{work.location ? ` · ${work.location}` : ''}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(work)} className="p-1.5 text-neutral-400 hover:text-neutral-900 transition-colors rounded-lg hover:bg-neutral-50">
                      <Icon icon="solar:pen-linear" className="text-sm" />
                    </button>
                    <button onClick={() => setDeleteTarget(work)} className="p-1.5 text-red-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50">
                      <Icon icon="solar:trash-bin-trash-linear" className="text-sm" />
                    </button>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between text-xs text-neutral-500">
                  <span className="flex items-center gap-1">
                    <Icon icon="solar:camera-linear" />{work.photos || 0} photos
                  </span>
                  <span>
                    {work.created_at
                      ? new Date(work.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                      : ''}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List View */}
      {!loading && viewMode === 'list' && filtered.length > 0 && (
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 border-b border-neutral-100">
              <tr>
                {['Work', 'Category', 'Location', 'Photos', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {filtered.map(work => (
                <tr key={work.id} className="hover:bg-neutral-50 transition-colors group">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {work.img_url ? (
                        <img src={work.img_url} alt={work.title} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center shrink-0">
                          <Icon icon="solar:gallery-linear" className="text-neutral-400" />
                        </div>
                      )}
                      <span className="font-medium text-neutral-900">{work.title}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-neutral-500">{work.category}</td>
                  <td className="px-5 py-4 text-neutral-500">{work.location || '—'}</td>
                  <td className="px-5 py-4 text-neutral-700 font-medium">{work.photos || 0}</td>
                  <td className="px-5 py-4">
                    {work.status && (
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[work.status] || 'bg-neutral-100 text-neutral-600'}`}>
                        {work.status}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEdit(work)} className="p-1.5 text-neutral-400 hover:text-neutral-900 rounded-lg hover:bg-white border border-transparent hover:border-neutral-200 transition-colors">
                        <Icon icon="solar:pen-linear" />
                      </button>
                      <button onClick={() => setDeleteTarget(work)} className="p-1.5 text-red-400 hover:text-red-600 rounded-lg hover:bg-white border border-transparent hover:border-red-200 transition-colors">
                        <Icon icon="solar:trash-bin-trash-linear" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
