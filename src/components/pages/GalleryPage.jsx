import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '@iconify/react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../../lib/supabase'
import Logo from '../Logo'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] } }
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } }
};

const GalleryPage = () => {
  const [works, setWorks] = useState([])
  const [activeCategory, setActiveCategory] = useState('All')
  const [loading, setLoading] = useState(true)
  const [selectedImg, setSelectedImg] = useState(null)

  const categories = ['All', 'Weddings', 'Events', 'Portraits', 'Modelling']

  useEffect(() => {
    const fetchWorks = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('portfolio_works')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (data) setWorks(data)
      setLoading(false)
    }
    fetchWorks()
  }, [])

  const filteredWorks = activeCategory === 'All' 
    ? works 
    : works.filter(w => w.category === activeCategory)

  return (
    <div className="min-h-screen bg-white selection:bg-neutral-900 selection:text-white antialiased">
      {/* Simple Header / Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link to="/" className="hover:opacity-80 transition-opacity">
            <Logo size="md" />
          </Link>
          <Link to="/" className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors flex items-center gap-2 group">
            <Icon icon="solar:arrow-left-linear" className="group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
        </div>
      </nav>

      <main className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial="hidden" animate="visible" variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.span variants={fadeUp} className="text-amber-600 text-sm font-medium tracking-wide uppercase">Full Portfolio</motion.span>
          <motion.h1 variants={fadeUp} className="mt-4 text-4xl md:text-5xl font-medium tracking-tight text-neutral-900 font-serif">
            Every Frame Tells a Story
          </motion.h1>
          <motion.p variants={fadeUp} className="mt-6 text-neutral-500 font-light max-w-2xl mx-auto leading-relaxed">
            A comprehensive look at our creative journey, from intimate ceremonies to grand celebrations and professional portraits.
          </motion.p>
        </motion.div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-16">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2.5 text-xs font-medium rounded-full transition-all duration-300 border ${activeCategory === cat
                ? 'bg-neutral-900 text-white border-neutral-900 shadow-lg shadow-neutral-900/10 scale-105'
                : 'bg-neutral-50 text-neutral-600 hover:bg-neutral-100 border-neutral-200 hover:border-neutral-300'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-[4/5] bg-neutral-100 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : filteredWorks.length === 0 ? (
          <div className="text-center py-20 bg-neutral-50 rounded-3xl border border-dashed border-neutral-200">
            <Icon icon="solar:gallery-wide-linear" className="text-5xl text-neutral-200 mx-auto mb-4" />
            <p className="text-neutral-400 font-light">No works found in this category.</p>
          </div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode='popLayout'>
              {filteredWorks.map((work) => (
                <motion.div
                  key={work.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  onClick={() => setSelectedImg(work)}
                  className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-neutral-100 cursor-zoom-in"
                >
                  {work.img_url ? (
                    <img 
                      src={work.img_url} 
                      alt={work.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Icon icon="solar:gallery-linear" className="text-4xl text-neutral-200" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                    <p className="text-white text-lg font-medium tracking-tight mb-1">{work.title}</p>
                    <div className="flex items-center gap-2 text-white/70 text-xs">
                      <Icon icon="solar:map-point-linear" />
                      {work.location}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </main>

      {/* Image Modal / Lightbox */}
      <AnimatePresence>
        {selectedImg && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-10"
            onClick={() => setSelectedImg(null)}
          >
            <button 
              className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors p-2"
              onClick={() => setSelectedImg(null)}
            >
              <Icon icon="solar:close-circle-linear" className="text-3xl" />
            </button>
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl w-full max-h-full aspect-[4/5] md:aspect-video flex items-center justify-center overflow-hidden rounded-xl bg-neutral-900"
              onClick={(e) => e.stopPropagation()}
            >
              {selectedImg.img_url && (
                <img 
                  src={selectedImg.img_url} 
                  alt={selectedImg.title}
                  className="w-full h-full object-contain"
                />
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6 md:p-10">
                <h2 className="text-white text-xl md:text-2xl font-medium font-serif">{selectedImg.title}</h2>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-white/60 text-xs uppercase tracking-widest">{selectedImg.category}</span>
                  <span className="w-1 h-1 rounded-full bg-white/20" />
                  <span className="text-white/60 text-xs">{selectedImg.location}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="py-20 border-t border-neutral-100 bg-neutral-50/30">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Logo size="sm" className="opacity-40 grayscale mx-auto mb-8" />
          <p className="text-neutral-400 text-xs tracking-widest">© 2024 BN MEDIA HUB. KERALA, INDIA</p>
        </div>
      </footer>
    </div>
  )
}

export default GalleryPage
