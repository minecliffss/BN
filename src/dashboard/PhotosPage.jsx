import { useState } from 'react'
import { Icon } from '@iconify/react'

const initialPhotos = [
  { id: 1, title: 'Wedding Ceremony', category: 'Weddings', tag: 'Hero', img: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=600&auto=format&fit=crop', size: '4.2 MB', date: 'Mar 22' },
  { id: 2, title: 'Bridal Bouquet', category: 'Weddings', tag: 'Detail', img: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600&auto=format&fit=crop', size: '3.1 MB', date: 'Mar 22' },
  { id: 3, title: 'First Dance', category: 'Weddings', tag: 'Emotion', img: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=600&auto=format&fit=crop', size: '5.8 MB', date: 'Mar 22' },
  { id: 4, title: 'Beach Couple', category: 'Pre-Wedding', tag: 'Romantic', img: 'https://images.unsplash.com/photo-1544078755-9a845116bb6e?q=80&w=600&auto=format&fit=crop', size: '3.9 MB', date: 'Mar 18' },
  { id: 5, title: 'Bridal Portrait', category: 'Portraits', tag: 'Studio', img: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=600&auto=format&fit=crop', size: '2.7 MB', date: 'Mar 15' },
  { id: 6, title: 'Event Crowd', category: 'Events', tag: 'Candid', img: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=600&auto=format&fit=crop', size: '4.5 MB', date: 'Mar 10' },
  { id: 7, title: 'Festival Colors', category: 'Festival', tag: 'Vibrant', img: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=600&auto=format&fit=crop', size: '6.1 MB', date: 'Mar 5' },
  { id: 8, title: 'Outdoor Wedding', category: 'Weddings', tag: 'Natural', img: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=600&auto=format&fit=crop&sat=-50', size: '4.8 MB', date: 'Feb 28' },
]

const filters = ['All', 'Weddings', 'Pre-Wedding', 'Portraits', 'Events', 'Festival']

export default function PhotosPage() {
  const [photos, setPhotos] = useState(initialPhotos)
  const [selected, setSelected] = useState([])
  const [filter, setFilter] = useState('All')
  const [preview, setPreview] = useState(null)
  const [editingPhoto, setEditingPhoto] = useState(null)

  const filtered = photos.filter(p => filter === 'All' || p.category === filter)

  const toggleSelect = (id) => {
    setSelected(s => s.includes(id) ? s.filter(i => i !== id) : [...s, id])
  }

  const handleDeleteSelected = () => {
    if (confirm(`Delete ${selected.length} selected photos?`)) {
      setPhotos(photos.filter(p => !selected.includes(p.id)))
      setSelected([])
    }
  }

  const handleUpdatePhoto = (e) => {
    e.preventDefault()
    setPhotos(photos.map(p => p.id === editingPhoto.id ? editingPhoto : p))
    setEditingPhoto(null)
    setPreview(editingPhoto)
  }


  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium tracking-tight text-neutral-900" style={{ fontFamily: 'Playfair Display, serif' }}>
            Photo Library
          </h1>
          <p className="mt-1 text-sm text-neutral-500 font-light">{photos.length} photos · {selected.length > 0 && <span className="text-amber-600 font-medium">{selected.length} selected</span>}</p>
        </div>
        <div className="flex items-center gap-3">
          {selected.length > 0 && (
            <>
              <button className="flex items-center gap-1.5 text-xs font-medium text-neutral-600 border border-neutral-200 rounded-full px-4 py-2 hover:bg-neutral-50 transition-colors">
                <Icon icon="solar:download-linear" /> Export ({selected.length})
              </button>
              <button 
                onClick={handleDeleteSelected}
                className="flex items-center gap-1.5 text-xs font-medium text-red-600 border border-red-200 rounded-full px-4 py-2 hover:bg-red-50 transition-colors">
                <Icon icon="solar:trash-bin-trash-linear" /> Delete
              </button>
            </>
          )}
          <button className="inline-flex items-center gap-2 bg-neutral-900 text-white text-sm font-medium px-5 py-2.5 rounded-full hover:bg-neutral-800 transition-colors">
            <Icon icon="solar:upload-linear" className="text-lg" />
            Upload Photos
          </button>
        </div>
      </div>

      {/* Upload dropzone */}
      <div className="border-2 border-dashed border-neutral-200 rounded-2xl p-8 text-center bg-white hover:border-amber-300 hover:bg-amber-50/30 transition-all cursor-pointer group">
        <Icon icon="solar:cloud-upload-linear" className="text-4xl text-neutral-300 group-hover:text-amber-400 transition-colors mx-auto" />
        <p className="mt-3 text-sm font-medium text-neutral-600">Drop photos here to upload</p>
        <p className="text-xs text-neutral-400 mt-1">PNG, JPG, WEBP up to 50MB each</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 text-xs font-medium rounded-full border transition-all ${filter === f
              ? 'bg-neutral-900 text-white border-neutral-900'
              : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-100'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Photo Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map(photo => (
          <div
            key={photo.id}
            className={`relative rounded-xl overflow-hidden group cursor-pointer border-2 transition-all ${selected.includes(photo.id) ? 'border-amber-400 shadow-lg shadow-amber-100' : 'border-transparent'}`}
          >
            <div className="aspect-square overflow-hidden">
              <img
                src={photo.img}
                alt={photo.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onClick={() => setPreview(photo)}
              />
            </div>

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="absolute top-3 left-3">
                <button
                  onClick={(e) => { e.stopPropagation(); toggleSelect(photo.id) }}
                  className={`w-6 h-6 rounded-full border-2 border-white flex items-center justify-center transition-colors ${selected.includes(photo.id) ? 'bg-amber-400 border-amber-400' : 'bg-white/20'}`}
                >
                  {selected.includes(photo.id) && <Icon icon="solar:check-read-linear" className="text-white text-xs" />}
                </button>
              </div>
              <div className="absolute bottom-3 left-3 right-3">
                <p className="text-white text-xs font-medium truncate">{photo.title}</p>
                <p className="text-white/70 text-xs">{photo.size} · {photo.date}</p>
              </div>
            </div>

            {/* Tag */}
            <div className="absolute top-3 right-3">
              <span className="bg-black/40 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                {photo.tag}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Preview */}
      {preview && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-6" onClick={() => {setPreview(null); setEditingPhoto(null)}}>
          <div className="relative max-w-4xl w-full" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => {setPreview(null); setEditingPhoto(null)}}
              className="absolute -top-12 right-0 text-white/70 hover:text-white text-sm flex items-center gap-2"
            >
              <Icon icon="solar:close-square-linear" className="text-2xl" /> Close
            </button>
            <img src={preview.img?.replace('w=600', 'w=1200')} alt={preview.title} className="w-full rounded-2xl" />
            
            {editingPhoto ? (
              <form onSubmit={handleUpdatePhoto} className="mt-4 bg-white/10 p-4 rounded-xl space-y-3 p-4">
                 <div className="flex gap-4">
                     <div className="flex-1 space-y-1 block">
                       <label className="text-xs text-white/70 block uppercase">Title</label>
                        <input
                          type="text"
                          value={editingPhoto.title}
                          onChange={(e) => setEditingPhoto({ ...editingPhoto, title: e.target.value })}
                          className="w-full bg-black/50 border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors"
                        />
                     </div>
                     <div className="flex-1 space-y-1 block">
                       <label className="text-xs text-white/70 block uppercase">Category</label>
                        <select
                          value={editingPhoto.category}
                          onChange={(e) => setEditingPhoto({ ...editingPhoto, category: e.target.value })}
                          className="w-full bg-black/50 border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors"
                        >
                          {filters.filter(f => f !== 'All').map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                     </div>
                     <div className="flex-1 space-y-1 block">
                       <label className="text-xs text-white/70 block uppercase">Tag (Optional)</label>
                        <input
                          type="text"
                          value={editingPhoto.tag || ''}
                          onChange={(e) => setEditingPhoto({ ...editingPhoto, tag: e.target.value })}
                          className="w-full bg-black/50 border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors placeholder:text-white/30"
                          placeholder="e.g. Hero, Candid"
                        />
                     </div>
                 </div>
                 <div className="flex justify-end gap-3 pt-2">
                    <button type="button" onClick={() => setEditingPhoto(null)} className="text-sm text-white/70 hover:text-white transition-colors">Cancel</button>
                    <button type="submit" className="text-sm bg-amber-500 text-black font-medium px-4 py-2 rounded-lg hover:bg-amber-400 transition-colors">Save Changes</button>
                 </div>
              </form>
            ) : (
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">{preview.title}</p>
                  <p className="text-white/50 text-sm">{preview.category} · {preview.size} · {preview.date} {preview.tag && `· Tag: ${preview.tag}`}</p>
                </div>
                <div className="flex gap-3">
                   <button 
                    onClick={() => setEditingPhoto(preview)}
                    className="text-xs text-white border border-white/30 rounded-full px-4 py-2 hover:bg-white/10 transition-colors flex items-center gap-2">
                    <Icon icon="solar:pen-linear" /> Edit
                  </button>
                  <button 
                    onClick={() => {
                      if(confirm(`Delete photo: ${preview.title}?`)) {
                        setPhotos(photos.filter(p => p.id !== preview.id));
                        setPreview(null);
                      }
                    }}
                    className="text-xs text-red-500 border border-red-500/30 rounded-full px-4 py-2 hover:bg-red-500/10 transition-colors flex items-center gap-2">
                    <Icon icon="solar:trash-bin-trash-linear" /> Delete
                  </button>
                  <button className="text-xs text-white border border-white/30 rounded-full px-4 py-2 hover:bg-white/10 transition-colors flex items-center gap-2">
                    <Icon icon="solar:download-linear" /> Download
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
