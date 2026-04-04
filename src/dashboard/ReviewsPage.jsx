import { useState, useEffect } from 'react'
import { Icon } from '@iconify/react'
import { supabase } from '../lib/supabase'

const emptyForm = {
  name: '',
  type: '',
  text: '',
  rating: 5,
}

function StarSelector({ value, onChange }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className="transition-transform hover:scale-110"
        >
          <Icon
            icon={star <= value ? 'solar:star-bold' : 'solar:star-linear'}
            className={`text-xl ${star <= value ? 'text-amber-500' : 'text-neutral-300'}`}
          />
        </button>
      ))}
    </div>
  )
}

function ReviewModal({ isOpen, onClose, onSave, initial }) {
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setForm(initial || emptyForm)
    setError('')
  }, [initial, isOpen])

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      await onSave(form)
      onClose()
    } catch (err) {
      setError(err.message || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-neutral-100 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
          <h2 className="text-lg font-medium text-neutral-900" style={{ fontFamily: 'Playfair Display, serif' }}>
            {initial?.id ? 'Edit Review' : 'Add New Review'}
          </h2>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-900 transition-colors">
            <Icon icon="solar:close-circle-linear" className="text-xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-xs px-4 py-3 rounded-lg">
              <Icon icon="solar:danger-circle-linear" className="text-base shrink-0" />
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-neutral-600 uppercase tracking-wide">Client Name *</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="Anjali Menon"
                className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900/20 transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-neutral-600 uppercase tracking-wide">Event Type</label>
              <input
                type="text"
                value={form.type}
                onChange={e => setForm({ ...form, type: e.target.value })}
                placeholder="Wedding Client"
                className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900/20 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-neutral-600 uppercase tracking-wide">Review Text *</label>
            <textarea
              required
              rows="4"
              value={form.text}
              onChange={e => setForm({ ...form, text: e.target.value })}
              placeholder="Share what the client said..."
              className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900/20 transition-all resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-neutral-600 uppercase tracking-wide">Rating</label>
            <StarSelector value={form.rating} onChange={r => setForm({ ...form, rating: r })} />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="text-sm text-neutral-500 hover:text-neutral-900 font-medium px-4 py-2 rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-all">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="text-sm bg-neutral-900 text-white font-medium px-5 py-2 rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-60 flex items-center gap-2">
              {saving && <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>}
              {initial?.id ? 'Save Changes' : 'Add Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function DeleteConfirmModal({ isOpen, review, onConfirm, onCancel, loading }) {
  if (!isOpen || !review) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm border border-neutral-100 p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
          <Icon icon="solar:trash-bin-trash-linear" className="text-2xl text-red-500" />
        </div>
        <h3 className="text-base font-medium text-neutral-900 mb-1">Delete this review?</h3>
        <p className="text-sm text-neutral-500 mb-6">Review from <span className="font-medium text-neutral-800">{review.name}</span> will be permanently removed.</p>
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

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const [search, setSearch] = useState('')

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const fetchReviews = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('reviews').select('*').order('created_at', { ascending: false })
    if (!error) setReviews(data || [])
    setLoading(false)
  }

  useEffect(() => { fetchReviews() }, [])

  const handleSave = async (form) => {
    if (editTarget?.id) {
      const { error } = await supabase.from('reviews').update({ ...form, updated_at: new Date().toISOString() }).eq('id', editTarget.id)
      if (error) throw error
      showToast('Review updated successfully')
    } else {
      // derive avatar from first letter of name
      const { error } = await supabase.from('reviews').insert([{ ...form, avatar: form.name?.charAt(0)?.toUpperCase() || '?' }])
      if (error) throw error
      showToast('Review added successfully')
    }
    fetchReviews()
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleteLoading(true)
    const { error } = await supabase.from('reviews').delete().eq('id', deleteTarget.id)
    setDeleteLoading(false)
    if (!error) {
      showToast('Review deleted', 'error')
      setDeleteTarget(null)
      fetchReviews()
    }
  }

  const openAdd = () => { setEditTarget(null); setModalOpen(true) }
  const openEdit = (r) => { setEditTarget(r); setModalOpen(true) }

  const filtered = reviews.filter(r =>
    r.name?.toLowerCase().includes(search.toLowerCase()) ||
    r.type?.toLowerCase().includes(search.toLowerCase()) ||
    r.text?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-8 space-y-6">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-lg border text-sm font-medium transition-all ${toast.type === 'error' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-200 text-green-700'}`}>
          <Icon icon={toast.type === 'error' ? 'solar:trash-bin-trash-linear' : 'solar:check-circle-linear'} className="text-base shrink-0" />
          {toast.msg}
        </div>
      )}

      {/* Modals */}
      <ReviewModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSave={handleSave} initial={editTarget} />
      <DeleteConfirmModal isOpen={!!deleteTarget} review={deleteTarget} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} loading={deleteLoading} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium tracking-tight text-neutral-900" style={{ fontFamily: 'Playfair Display, serif' }}>
            Client Reviews
          </h1>
          <p className="mt-1 text-sm text-neutral-500 font-light">Manage testimonials shown on the website</p>
        </div>
        <button onClick={openAdd} className="inline-flex items-center gap-2 bg-neutral-900 text-white text-sm font-medium px-5 py-2.5 rounded-full hover:bg-neutral-800 transition-colors self-start sm:self-auto">
          <Icon icon="solar:add-square-linear" className="text-lg" />
          Add Review
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-2 border border-neutral-200 rounded-xl px-4 py-2.5 bg-white shadow-sm max-w-sm">
        <Icon icon="solar:magnifer-linear" className="text-neutral-400 text-sm" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search reviews..."
          className="text-sm focus:outline-none placeholder:text-neutral-400 flex-1"
        />
        {search && (
          <button onClick={() => setSearch('')} className="text-neutral-400 hover:text-neutral-700 transition-colors">
            <Icon icon="solar:close-circle-linear" className="text-base" />
          </button>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <svg className="animate-spin h-7 w-7 text-neutral-400" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>
        </div>
      )}

      {/* Empty State */}
      {!loading && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-neutral-100 flex items-center justify-center mb-4">
            <Icon icon="solar:star-linear" className="text-3xl text-neutral-400" />
          </div>
          <p className="text-neutral-600 font-medium">No reviews found</p>
          <p className="text-sm text-neutral-400 mt-1">Start by adding your first client testimonial.</p>
          <button onClick={openAdd} className="mt-5 inline-flex items-center gap-2 bg-neutral-900 text-white text-sm font-medium px-5 py-2.5 rounded-full hover:bg-neutral-800 transition-colors">
            <Icon icon="solar:add-square-linear" className="text-lg" />
            Add Review
          </button>
        </div>
      )}

      {/* Reviews Table */}
      {!loading && filtered.length > 0 && (
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 border-b border-neutral-100">
              <tr>
                {['Client', 'Review', 'Rating', 'Date', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {filtered.map(review => (
                <tr key={review.id} className="hover:bg-neutral-50 transition-colors group">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 text-xs font-semibold shrink-0">
                        {review.avatar || review.name?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                      <div>
                        <p className="font-medium text-neutral-900 whitespace-nowrap">{review.name}</p>
                        <p className="text-xs text-neutral-500">{review.type}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 max-w-sm">
                    <p className="text-neutral-600 line-clamp-2 text-xs leading-relaxed" title={review.text}>{review.text}</p>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex text-amber-500 text-xs gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Icon key={i} icon={i < (review.rating || 5) ? 'solar:star-bold' : 'solar:star-linear'} />
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-neutral-500 whitespace-nowrap text-xs">
                    {review.created_at ? new Date(review.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEdit(review)}
                        className="p-1.5 text-neutral-400 hover:text-neutral-900 transition-colors rounded-lg hover:bg-white border border-transparent hover:border-neutral-200"
                      >
                        <Icon icon="solar:pen-linear" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(review)}
                        className="p-1.5 text-red-400 hover:text-red-600 transition-colors rounded-lg hover:bg-white border border-transparent hover:border-red-200"
                      >
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

      {/* Stats Cards */}
      {!loading && reviews.length > 0 && (
        <div className="grid grid-cols-3 gap-4 pt-2">
          <div className="bg-white rounded-xl border border-neutral-100 shadow-sm p-4 text-center">
            <p className="text-2xl font-medium text-neutral-900">{reviews.length}</p>
            <p className="text-xs text-neutral-500 mt-1">Total Reviews</p>
          </div>
          <div className="bg-white rounded-xl border border-neutral-100 shadow-sm p-4 text-center">
            <p className="text-2xl font-medium text-amber-600">
              {reviews.length > 0 ? (reviews.reduce((acc, r) => acc + (r.rating || 5), 0) / reviews.length).toFixed(1) : '—'}
            </p>
            <p className="text-xs text-neutral-500 mt-1">Avg. Rating</p>
          </div>
          <div className="bg-white rounded-xl border border-neutral-100 shadow-sm p-4 text-center">
            <p className="text-2xl font-medium text-green-600">
              {reviews.filter(r => (r.rating || 5) === 5).length}
            </p>
            <p className="text-xs text-neutral-500 mt-1">5-Star Reviews</p>
          </div>
        </div>
      )}
    </div>
  )
}
