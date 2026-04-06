import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '@iconify/react'
import { motion, useScroll, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'
import Logo from './Logo'
import { LOCATIONS, SERVICES } from '../lib/seo-data'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] } }
};
const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } }
};
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1, ease: "easeOut" } }
};
const scaleIn = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] } }
};
const GRID_ASPECTS = [
  'aspect-[3/4]',
  'aspect-[4/3] md:aspect-[3/4]',
  'aspect-[3/4]',
  'aspect-[4/3] lg:col-span-2',
  'aspect-[4/3]',
]

const HERO_DEFAULT = {
  headline: 'Capturing Moments That Last Forever',
  subtitle: 'Professional Wedding & Event Photography based in Kerala. We craft cinematic stories through our lenses with minimal, elegant, and premium quality.',
  rating_text: '5.0 Rating • 88 Happy Clients',
  whatsapp_url: '#',
  main_image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2938&auto=format&fit=crop',
  image_2: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2940&auto=format&fit=crop',
  image_3: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=2940&auto=format&fit=crop',
}

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState('All')
  const [portfolioWorks, setPortfolioWorks] = useState([])
  const [reviews, setReviews] = useState([])
  const [heroData, setHeroData] = useState(HERO_DEFAULT)
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', eventType: 'Wedding', message: '' })

  const handleFormChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSendWhatsApp = () => {
    const { firstName, lastName, email, eventType, message } = formData
    const text = [
      `👋 Hello BN MEDIA HUB!`,
      ``,
      `📛 Name: ${firstName} ${lastName}`.trim(),
      email ? `📧 Email: ${email}` : null,
      `🎉 Event Type: ${eventType}`,
      message ? `💬 Message: ${message}` : null,
    ].filter(Boolean).join('\n')
    window.open(`https://wa.me/918606013907?text=${encodeURIComponent(text)}`, '_blank')
  }

  useEffect(() => {
    supabase.from('portfolio_works').select('*').order('created_at', { ascending: false })
      .then(({ data }) => setPortfolioWorks(data || []))
    supabase.from('reviews').select('*').order('created_at', { ascending: false })
      .then(({ data }) => setReviews(data || []))
    supabase.from('hero_settings').select('*').limit(1).maybeSingle()
      .then(({ data }) => { if (data) setHeroData({ ...HERO_DEFAULT, ...data }) })
  }, [])

  // Categories derived from actual DB works only
  const categories = portfolioWorks.length > 0
    ? ['All', ...Array.from(new Set(portfolioWorks.map(w => w.category)))]
    : ['All']

  const { scrollY } = useScroll()
  const [isScrolled, setIsScrolled] = useState(false)
  useEffect(() => {
    return scrollY.on('change', (latest) => setIsScrolled(latest > 50))
  }, [scrollY])

  // Lock scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => { document.body.style.overflow = 'unset' }
  }, [isMenuOpen])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] } }}
      exit={{ opacity: 0, transition: { duration: 0.3 } }}
      className="bg-white text-neutral-900 antialiased selection:bg-neutral-900 selection:text-white font-sans"
    >
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        className={`fixed w-full top-0 z-50 bg-white border-b border-neutral-100 transition-all duration-500 ${isScrolled ? 'py-0 shadow-sm' : 'py-2'}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex justify-between items-center transition-all duration-500 ${isScrolled ? 'h-16' : 'h-20'}`}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
              className="flex-shrink-0 flex items-center gap-2"
            >
              <Logo size="md" />
            </motion.div>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="hidden md:flex space-x-8"
            >
              <motion.a variants={fadeIn} href="#about" className="text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors">About</motion.a>
              <motion.a variants={fadeIn} href="#portfolio" className="text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors">Portfolio</motion.a>
              <Link to="/gallery" className="text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors">Gallery</Link>
              <motion.a variants={fadeIn} href="#services" className="text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors">Services</motion.a>
              <motion.a variants={fadeIn} href="#reviews" className="text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors">Reviews</motion.a>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.8 }}
              className="hidden md:flex"
            >
              <a href="#contact" className="inline-flex items-center justify-center text-sm font-medium transition-colors bg-neutral-900 text-white hover:bg-neutral-800 h-10 px-6 rounded-full">
                Book Now
              </a>
            </motion.div>
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-neutral-500 hover:text-neutral-900 focus:outline-none transition-transform"
              >
                <Icon
                  icon={isMenuOpen ? "solar:close-circle-linear" : "solar:hamburger-menu-linear"}
                  className="text-2xl"
                />
              </button>
            </div>
          </div>
        </div>

        {/* Redesigned Mobile menu overlay */}
        <div
          className={`fixed inset-0 z-40 bg-white transition-opacity duration-300 md:hidden ${isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
            }`}
          style={{ top: '80px' }} // Height of original navbar
        >
          <div className="flex flex-col h-[calc(100vh-80px)] px-6 py-12 justify-between">
            <div className="space-y-6">
              {[
                { name: "About", href: "#about" },
                { name: "Portfolio", href: "#portfolio" },
                { name: "Gallery", href: "/gallery", isPage: true },
                { name: "Services", href: "#services" },
                { name: "Reviews", href: "#reviews" },
              ].map((link, i) => (
                link.isPage ? (
                  <Link
                    key={link.name}
                    to={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block text-4xl font-serif tracking-tight text-neutral-900 transition-all duration-500 delay-[${i * 100}ms] ${isMenuOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                      }`}
                  >
                    {link.name}
                  </Link>
                ) : (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block text-4xl font-serif tracking-tight text-neutral-900 transition-all duration-500 delay-[${i * 100}ms] ${isMenuOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                      }`}
                  >
                    {link.name}
                  </a>
                )
              ))}
            </div>

            <div className="space-y-8">
              <a
                href="#contact"
                onClick={() => setIsMenuOpen(false)}
                className="inline-flex items-center justify-center w-full bg-neutral-900 text-white rounded-none h-14 text-sm font-medium tracking-wide uppercase transition-transform active:scale-95"
              >
                Book Your Session
              </a>

              <div className="flex items-center gap-8 justify-center pb-8 border-t border-neutral-100 pt-8">
                <Logo size="sm" theme="light" />
                <div className="flex gap-6">
                  <a href="#" className="text-xs font-medium text-neutral-400 uppercase tracking-widest">Instagram</a>
                  <a href="#" className="text-xs font-medium text-neutral-400 uppercase tracking-widest">Facebook</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center"
        >
          <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-50 border border-neutral-200 mb-8">
            <div className="flex text-amber-500 text-sm">
              <Icon icon="solar:star-bold" />
              <Icon icon="solar:star-bold" />
              <Icon icon="solar:star-bold" />
              <Icon icon="solar:star-bold" />
              <Icon icon="solar:star-bold" />
            </div>
            <span className="text-xs font-medium text-neutral-600">{heroData.rating_text}</span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight text-neutral-900 mb-6 max-w-4xl mx-auto leading-tight"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            Capturing Moments <br className="hidden md:block" /> That Last <span className="text-amber-600 italic">Forever</span>
          </motion.h1>

          <motion.p variants={fadeIn} className="mt-4 text-lg text-neutral-500 max-w-2xl mx-auto font-light leading-relaxed">
            {heroData.subtitle}
          </motion.p>

          <motion.div variants={fadeUp} className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center relative z-20">
            <a href="#portfolio" className="inline-flex items-center justify-center text-sm font-medium transition-colors bg-neutral-900 text-white hover:bg-neutral-800 h-12 px-8 rounded-full w-full sm:w-auto relative overflow-hidden group">
              <span className="relative z-10">View Portfolio</span>
              <motion.div className="absolute inset-0 bg-neutral-800 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]" />
            </a>
            <a href="#contact" className="inline-flex items-center justify-center text-sm font-medium transition-colors bg-white text-neutral-900 border border-neutral-200 hover:bg-neutral-50 h-12 px-8 rounded-full w-full sm:w-auto gap-2 group relative overflow-hidden">
              <span className="relative z-10 flex items-center gap-2">Book Now <Icon icon="solar:arrow-right-linear" className="text-lg" /></span>
            </a>
          </motion.div>
        </motion.div>

        {/* Hero Image Collage */}
        <div className="mt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-12 gap-4 h-[400px] md:h-[500px] lg:h-[600px]">
            <div className="col-span-12 md:col-span-8 rounded-none overflow-hidden relative group">
              <motion.img
                animate={{ scale: [1.0, 1.08, 1.0] }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                src={heroData.main_image}
                alt="Wedding Couple"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="hidden md:block col-span-4 space-y-4">
              <div className="h-[calc(50%-0.5rem)] rounded-none overflow-hidden relative group">
                <motion.img
                  animate={{ scale: [1.08, 1.0, 1.08] }}
                  transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                  src={heroData.image_2}
                  alt="Wedding Details"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="h-[calc(50%-0.5rem)] rounded-none overflow-hidden relative group bg-neutral-100">
                <motion.img
                  animate={{ scale: [1.0, 1.08, 1.0] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear", delay: 1 }}
                  src={heroData.image_3}
                  alt="Event"
                  className="w-full h-full object-cover opacity-90"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-24 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeIn}
              className="relative"
            >
              <div className="aspect-[4/5] rounded-none overflow-hidden">
                <img src="https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=2940&auto=format&fit=crop" alt="Photographer" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
              </div>
              <div className="absolute -bottom-8 -right-8 bg-white p-6 rounded-none shadow-sm border border-neutral-100 hidden md:block">
                <p className="text-4xl tracking-tight font-medium text-neutral-900 font-serif">7+</p>
                <p className="text-sm text-neutral-500 font-medium mt-1">Years of Excellence</p>
              </div>
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={staggerContainer}
            >
              <motion.span variants={fadeUp} className="text-amber-600 text-sm font-medium tracking-wide uppercase">Our Story</motion.span>
              <motion.h2 variants={fadeUp} className="mt-4 text-3xl md:text-4xl font-medium tracking-tight text-neutral-900 font-serif">
                We don't just take pictures, we capture emotions.
              </motion.h2>
              <motion.p variants={fadeUp} className="mt-6 text-neutral-500 font-light leading-relaxed">
                At BN MEDIA HUB, we believe every frame holds a story. Based in Thrissur, Kerala, our professional and friendly team focuses on creativity, extreme attention to detail, and preserving the raw emotions of your special day.
              </motion.p>
              <motion.p variants={fadeUp} className="mt-4 text-neutral-500 font-light leading-relaxed">
                Whether it's an intimate engagement, a grand wedding, or a corporate event, we blend seamlessly into the background to capture cinematic moments that you will cherish for a lifetime.
              </motion.p>
              <motion.div variants={fadeUp} className="mt-8">
                <a href="#contact" className="inline-flex items-center text-sm font-medium text-neutral-900 hover:text-amber-600 transition-colors gap-2 group">
                  Meet the team
                  <Icon icon="solar:arrow-right-linear" className="transform group-hover:translate-x-1 transition-transform" />
                </a>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-white relative">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={staggerContainer}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="text-center max-w-2xl mx-auto mb-16">
            <motion.span variants={fadeUp} className="text-amber-600 text-sm font-medium tracking-wide uppercase">Expertise</motion.span>
            <motion.h2 variants={fadeUp} className="mt-4 text-3xl md:text-4xl font-medium tracking-tight text-neutral-900 font-serif">
              Services We Offer
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-4 text-neutral-500 font-light">Comprehensive photography and videography solutions tailored to your unique needs.</motion.p>
          </div>

          <motion.div className="flex flex-wrap justify-center gap-6">
            {/* Service Cards */}
            {[
              { title: 'Wedding Packages', icon: 'solar:hearts-linear', desc: 'Capturing the magic, rituals, and raw emotions of your big day with a cinematic touch.' },
              { title: 'Cinematic Short Film', icon: 'solar:videocamera-linear', desc: 'High-definition videography that tells the beautiful story of your journey together.' },
              { title: 'Pre-Wedding & Post Wedding', icon: 'solar:gallery-linear', desc: 'Creative and personalized outdoor sessions to celebrate your engagement.' },
              { title: 'Event Coverage', icon: 'solar:confetti-linear', desc: 'Professional coverage for corporate events, parties, and cultural gatherings.' },
              { title: 'Portraits', icon: 'solar:user-circle-linear', desc: 'Striking individual, family, and conceptual portraits in studio or on location.' },
              { title: 'Modelling', icon: 'solar:flash-drive-linear', desc: 'Professional fashion and modelling portfolio shoots with high-end post-processing.' },
              { title: 'Photo Grading & Video Editing', icon: 'solar:album-linear', desc: 'Premium retouching and layout design for high-quality, lasting physical albums.' },
              { title: 'Festival Coverage', icon: 'solar:stars-minimalistic-linear', desc: 'Capturing the vibrant spirit, energy, and colors of cultural and religious festivals.' },
            ].map((service, index) => (
              <motion.div
                key={index}
                variants={fadeUp}
                whileHover={{ y: -4, transition: { duration: 0.3 } }}
                className="p-8 rounded-2xl border border-neutral-100 bg-neutral-50/50 hover:bg-white hover:border-amber-200 hover:shadow-xl hover:shadow-amber-900/5 transition-all duration-300 group w-full md:w-[calc(50%_-_12px)] lg:w-[calc(33.333%_-_16px)] cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-white border border-neutral-200 flex items-center justify-center mb-6 group-hover:border-amber-200 group-hover:bg-amber-50 transition-colors">
                  <motion.div whileHover={{ scale: 1.1 }}>
                    <Icon icon={service.icon} className="text-xl text-neutral-700 group-hover:text-amber-600 transition-colors" />
                  </motion.div>
                </div>
                <h3 className="text-lg font-medium tracking-tight text-neutral-900 mb-2">{service.title}</h3>
                <p className="text-sm text-neutral-500 font-light leading-relaxed">{service.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-24 bg-white border-t border-neutral-100 relative">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={staggerContainer}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="flex flex-col items-center text-center mb-16 gap-8">
            <div className="max-w-2xl">
              <motion.span variants={fadeUp} className="text-amber-600 text-sm font-medium tracking-wide uppercase">Selected Works</motion.span>
              <motion.h2 variants={fadeUp} className="mt-4 text-3xl md:text-4xl font-medium tracking-tight text-neutral-900 font-serif">
                A Glimpse Into Our Lens
              </motion.h2>
            </div>

            <motion.div variants={fadeIn} className="flex flex-wrap justify-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2.5 text-xs font-medium rounded-full transition-all duration-300 border ${activeCategory === cat
                    ? 'bg-neutral-900 text-white border-neutral-900 shadow-md scale-105'
                    : 'bg-neutral-50 text-neutral-600 hover:bg-neutral-100 border-neutral-200'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </motion.div>
          </div>

          {/* Portfolio grid */}
          {portfolioWorks.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto mb-5">
                <Icon icon="solar:gallery-wide-linear" className="text-4xl text-neutral-300" />
              </div>
              <p className="text-neutral-400 text-sm font-light">Portfolio coming soon</p>
            </div>
          ) : (
            <motion.div variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {portfolioWorks
                .filter(item => activeCategory === 'All' || item.category === activeCategory)
                .map((item, index) => (
                  <motion.div
                    key={item.id}
                    layout
                    variants={scaleIn}
                    whileHover="hover"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className={`relative overflow-hidden cursor-pointer ${GRID_ASPECTS[index % GRID_ASPECTS.length]}`}
                  >
                    {item.img_url ? (
                      <motion.img
                        variants={{ hover: { scale: 1.04 } }}
                        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                        src={item.img_url}
                        className="w-full h-full object-cover"
                        alt={item.title}
                      />
                    ) : (
                      <div className="w-full h-full bg-neutral-100 flex items-center justify-center">
                        <Icon icon="solar:gallery-linear" className="text-4xl text-neutral-300" />
                      </div>
                    )}
                    <motion.div
                      variants={{ hidden: { opacity: 0 }, visible: { opacity: 0 }, hover: { opacity: 1 } }}
                      transition={{ duration: 0.4 }}
                      className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex flex-col justify-end p-6"
                    >
                      <span className="text-white text-lg font-medium tracking-tight">{item.title}</span>
                      <span className="text-white/80 text-xs mt-1">{item.location}</span>
                    </motion.div>
                  </motion.div>
                ))}
            </motion.div>
          )}

          <motion.div variants={fadeUp} className="mt-12 text-center">
            <Link to="/gallery" className="inline-flex items-center text-sm font-medium text-neutral-900 hover:text-amber-600 transition-colors gap-2 group cursor-pointer">
              View Full Gallery
              <Icon icon="solar:arrow-right-linear" className="transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="py-24 bg-[#f5f5f7] border-y border-neutral-200/60 overflow-hidden">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={staggerContainer}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-14"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
            <motion.div variants={fadeUp}>
              <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-neutral-900 font-serif">Loved by clients.</h2>
              <p className="mt-2 text-neutral-500 font-light">Don't just take our word for it.</p>
            </motion.div>
            <motion.a variants={fadeUp} href="https://www.google.com/search?q=BN+MEDIA+HUB+Reviews#lrd=0x3ba7bfcaf7e7f287:0xcc6f8c55946f6cd3,3,,,," target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 bg-white px-6 py-3 rounded-full border border-neutral-200 shadow-sm hover:shadow-md hover:border-neutral-300 transition-all cursor-pointer group active:scale-95">
              <div className="flex text-amber-500 text-lg group-hover:scale-105 transition-transform">
                <Icon icon="solar:star-bold" />
                <Icon icon="solar:star-bold" />
                <Icon icon="solar:star-bold" />
                <Icon icon="solar:star-bold" />
                <Icon icon="solar:star-bold" />
              </div>
              <div className="h-4 w-px bg-neutral-200" />
              <span className="text-sm font-medium text-neutral-900">88 Reviews</span>
            </motion.a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="relative w-full"
        >
          {reviews.length === 0 && (
            <div className="flex items-center justify-center py-12 text-neutral-400 text-sm">No reviews yet.</div>
          )}
          {reviews.length > 0 && (
            <div className="flex flex-col gap-5">
              {/* Top Row - Scrolls Left */}
              <div className="flex gap-5 flex-row animate-marquee hover:[animation-play-state:paused]">
                {[...Array(2)].map((_, i) => (
                  <div key={`row1-${i}`} className="flex gap-5 flex-row">
                    {reviews.map((review, index) => (
                      <div
                        key={`row1-${i}-${index}`}
                        className="relative bg-white rounded-2xl border border-neutral-200/70 shadow-[0_2px_12px_rgba(0,0,0,0.06)] shrink-0 w-[280px] md:w-[340px] p-6 overflow-hidden cursor-default transition-all duration-300 hover:shadow-[0_6px_24px_rgba(0,0,0,0.10)] hover:-translate-y-0.5"
                      >
                        {/* Header: avatar + name */}
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center text-white text-sm font-semibold shrink-0 shadow-sm">
                            {review.avatar || review.name?.charAt(0)?.toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-neutral-900 truncate">{review.name}</p>
                            <p className="text-xs text-neutral-400 truncate">{review.type || 'Happy Client'}</p>
                          </div>
                          {/* Star rating top-right */}
                          <div className="flex text-amber-400 text-xs gap-0.5 shrink-0">
                            {[...Array(5)].map((_, s) => (
                              <Icon key={s} icon={s < (review.rating || 5) ? 'solar:star-bold' : 'solar:star-linear'} />
                            ))}
                          </div>
                        </div>

                        {/* Review text */}
                        <p className="text-[13.5px] text-neutral-600 leading-relaxed font-light line-clamp-4">{review.text}</p>

                        {/* Large quotation mark watermark */}
                        <div className="absolute bottom-3 right-4 text-[64px] leading-none text-neutral-100 font-serif select-none pointer-events-none" aria-hidden="true">"</div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* Bottom Row - Scrolls Right */}
              <div className="flex gap-5 flex-row animate-marquee-reverse hover:[animation-play-state:paused]">
                {[...Array(2)].map((_, i) => (
                  <div key={`row2-${i}`} className="flex gap-5 flex-row">
                    {[...reviews].reverse().map((review, index) => (
                      <div
                        key={`row2-${i}-${index}`}
                        className="relative bg-white rounded-2xl border border-neutral-200/70 shadow-[0_2px_12px_rgba(0,0,0,0.06)] shrink-0 w-[280px] md:w-[340px] p-6 overflow-hidden cursor-default transition-all duration-300 hover:shadow-[0_6px_24px_rgba(0,0,0,0.10)] hover:-translate-y-0.5"
                      >
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-full bg-neutral-900 flex items-center justify-center text-white text-sm font-semibold shrink-0 shadow-sm">
                            {review.avatar || review.name?.charAt(0)?.toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-neutral-900 truncate">{review.name}</p>
                            <p className="text-xs text-neutral-400 truncate">{review.type || 'Happy Client'}</p>
                          </div>
                          <div className="flex text-amber-400 text-xs gap-0.5 shrink-0">
                            {[...Array(5)].map((_, s) => (
                              <Icon key={s} icon={s < (review.rating || 5) ? 'solar:star-bold' : 'solar:star-linear'} />
                            ))}
                          </div>
                        </div>
                        <p className="text-[13.5px] text-neutral-600 leading-relaxed font-light line-clamp-4">{review.text}</p>
                        <div className="absolute bottom-3 right-4 text-[64px] leading-none text-neutral-100 font-serif select-none pointer-events-none" aria-hidden="true">"</div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Edge fade gradients */}
          <div className="absolute pointer-events-none inset-0 bg-gradient-to-r from-[#f5f5f7] via-transparent to-[#f5f5f7]" />
        </motion.div>

        {/* Write a Review CTA */}
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-14 text-center"
        >
          <p className="text-neutral-400 text-sm font-light mb-4 italic">Had an amazing experience with our team?</p>
          <a
            href="https://www.google.com/search?q=BN+MEDIA+HUB+Reviews#lrd=0x3ba7bfcaf7e7f287:0xcc6f8c55946f6cd3,3,,,,"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-amber-600 hover:text-amber-700 transition-all group"
          >
            <span className="border-b border-amber-600/30 group-hover:border-amber-700">Write a Review on Google</span>
            <Icon icon="solar:pen-linear" className="text-lg group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Info */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
              <motion.span variants={fadeUp} className="text-amber-600 text-sm font-medium tracking-wide uppercase">Get in Touch</motion.span>
              <motion.h2 variants={fadeUp} className="mt-4 text-3xl md:text-4xl font-medium tracking-tight text-neutral-900 mb-8 font-serif">
                Let's discuss your special day.
              </motion.h2>

              <motion.div variants={staggerContainer} className="space-y-6 mb-10">
                {[
                  { title: 'Studio Location', icon: 'solar:map-point-linear', content: 'Opp. Happyhome Auditorium, Jerusalem, Kunnamkulam, Pazhanji, Thrissur, Kerala 680542' },
                  { title: 'Working Hours', icon: 'solar:clock-circle-linear', content: 'Mon - Sat, 9:00 AM - 6:00 PM' },
                  { title: 'Direct Contact', icon: 'solar:phone-calling-linear', content: '+91 86060 13907' },
                ].map((info, index) => (
                  <motion.div variants={fadeUp} key={index} className="flex gap-4 items-start group">
                    <div className="mt-1 w-10 h-10 rounded-full bg-neutral-50 border border-neutral-100 flex items-center justify-center shrink-0 group-hover:bg-amber-50 group-hover:border-amber-200 transition-colors">
                      <Icon icon={info.icon} className="text-lg text-neutral-600 group-hover:text-amber-600 transition-colors" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-neutral-900">{info.title}</h4>
                      <p className="text-sm text-neutral-500 font-light mt-1 leading-relaxed max-w-xs">{info.content}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>


            </motion.div>

            {/* Contact Form */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="bg-neutral-50 p-8 md:p-10 rounded-3xl border border-neutral-100">
              <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleSendWhatsApp() }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-neutral-700">First Name</label>
                    <input name="firstName" type="text" value={formData.firstName} onChange={handleFormChange} className="w-full bg-white border border-neutral-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all placeholder:text-neutral-400" placeholder="John" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-neutral-700">Last Name</label>
                    <input name="lastName" type="text" value={formData.lastName} onChange={handleFormChange} className="w-full bg-white border border-neutral-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all placeholder:text-neutral-400" placeholder="Doe" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-neutral-700">Email Address</label>
                  <input name="email" type="email" value={formData.email} onChange={handleFormChange} className="w-full bg-white border border-neutral-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all placeholder:text-neutral-400" placeholder="john@example.com" />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-neutral-700">Event Type</label>
                  <div className="relative">
                    <select name="eventType" value={formData.eventType} onChange={handleFormChange} className="w-full bg-white border border-neutral-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all appearance-none text-neutral-700">
                      <option>Wedding</option>
                      <option>Engagement</option>
                      <option>Pre-Wedding Shoot</option>
                      <option>Corporate Event</option>
                      <option>Portrait Session</option>
                    </select>
                    <Icon icon="solar:alt-arrow-down-linear" className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-neutral-700">Message</label>
                  <textarea name="message" rows="4" value={formData.message} onChange={handleFormChange} className="w-full bg-white border border-neutral-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all placeholder:text-neutral-400 resize-none" placeholder="Tell us about your event..." />
                </div>

                <button type="submit" className="w-full inline-flex items-center justify-center gap-2 text-sm font-medium transition-colors bg-[#25D366] text-white hover:bg-[#1ebd5b] h-12 rounded-lg relative overflow-hidden group">
                  <span className="relative z-10 flex items-center gap-2">
                    <Icon icon="solar:chat-round-line-linear" className="text-xl" />
                    Send via WhatsApp
                  </span>
                  <motion.div className="absolute inset-0 bg-[#1da951] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]" />
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <motion.footer
        initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={staggerContainer}
        className="bg-white border-t border-neutral-100 py-12 overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6 relative">
          <motion.div variants={fadeIn} className="flex items-center gap-2">
            <Logo size="sm" />
          </motion.div>

          <motion.div variants={staggerContainer} className="flex items-center gap-6 text-sm text-neutral-500 font-medium">
            <motion.a variants={fadeUp} whileHover={{ scale: 1.15, textShadow: "0px 0px 8px rgba(0,0,0,0.2)" }} href="#" className="hover:text-neutral-900 transition-all pointer-events-auto">Instagram</motion.a>
            <motion.a variants={fadeUp} whileHover={{ scale: 1.15, textShadow: "0px 0px 8px rgba(0,0,0,0.2)" }} href="#" className="hover:text-neutral-900 transition-all pointer-events-auto">Facebook</motion.a>
            <motion.a variants={fadeUp} whileHover={{ scale: 1.15, textShadow: "0px 0px 8px rgba(0,0,0,0.2)" }} href="#" className="hover:text-neutral-900 transition-all pointer-events-auto">YouTube</motion.a>
          </motion.div>

          <motion.p variants={fadeIn} className="text-xs text-neutral-400">© 2024 BN MEDIA HUB. All rights reserved.</motion.p>
        </div>

        {/* SEO Hub Links Area */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 py-8 relative group">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: "100%" }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
            className="absolute top-0 left-0 h-px bg-neutral-100"
          />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div variants={fadeUp}>
              <h4 className="text-xs font-semibold text-neutral-900 uppercase tracking-widest mb-4">Cities We Serve</h4>
              <div className="flex flex-col gap-2">
                {LOCATIONS.map(loc => (
                  <Link key={loc.id} to={`/locations/${loc.id}/wedding-photography`} className="text-xs text-neutral-500 hover:text-neutral-900 transition-colors">
                    {loc.name}
                  </Link>
                ))}
              </div>
            </motion.div>
            <motion.div variants={fadeUp}>
              <h4 className="text-xs font-semibold text-neutral-900 uppercase tracking-widest mb-4">Core Services</h4>
              <div className="flex flex-col gap-2">
                {SERVICES.slice(0, 4).map(s => (
                  <Link key={s.id} to={`/locations/thrissur/${s.id}`} className="text-xs text-neutral-500 hover:text-neutral-900 transition-colors">
                    {s.name} in Thrissur
                  </Link>
                ))}
              </div>
            </motion.div>
            <motion.div variants={fadeUp} className="col-span-2">
              <h4 className="text-xs font-semibold text-neutral-900 uppercase tracking-widest mb-4">Professional Photography in Kerala</h4>
              <p className="text-xs text-neutral-400 font-light leading-relaxed">
                Based in Thrissur, Kerala, BN Media provides top-tier photography and cinematic videography services across {LOCATIONS.map(l => l.name).join(', ')}, and surrounding regions. We specialize in wedding ceremonies, creative pre-wedding sessions, and high-end event coverage.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.footer>

      {/* Floating WhatsApp Button */}
    </motion.div>
  )
}


export default App
