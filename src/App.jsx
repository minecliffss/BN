import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '@iconify/react'
import { supabase } from './lib/supabase'

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
    <div className="bg-white text-neutral-900 antialiased selection:bg-neutral-900 selection:text-white font-sans">
      {/* Navigation */}
      <nav className="fixed w-full top-0 z-50 bg-white border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex-shrink-0 flex items-center gap-2">
              <Icon icon="solar:camera-linear" className="text-2xl text-neutral-900" />
              <span className="text-xl tracking-tighter font-medium uppercase font-serif">BN</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#about" className="text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors">About</a>
              <a href="#portfolio" className="text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors">Portfolio</a>
              <a href="#services" className="text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors">Services</a>
              <a href="#reviews" className="text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors">Reviews</a>
            </div>
            <div className="hidden md:flex">
              <a href="#contact" className="inline-flex items-center justify-center text-sm font-medium transition-colors bg-neutral-900 text-white hover:bg-neutral-800 h-10 px-6 rounded-full">
                Book Now
              </a>
            </div>
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
                { name: "Services", href: "#services" },
                { name: "Reviews", href: "#reviews" },
              ].map((link, i) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block text-4xl font-serif tracking-tight text-neutral-900 transition-all duration-500 delay-[${i * 100}ms] ${isMenuOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                    }`}
                >
                  {link.name}
                </a>
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
                <Icon icon="solar:camera-linear" className="text-xl text-neutral-400" />
                <div className="flex gap-6">
                  <a href="#" className="text-xs font-medium text-neutral-400 uppercase tracking-widest">Instagram</a>
                  <a href="#" className="text-xs font-medium text-neutral-400 uppercase tracking-widest">Facebook</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-50 border border-neutral-200 mb-8">
            <div className="flex text-amber-500 text-sm">
              <Icon icon="solar:star-bold" />
              <Icon icon="solar:star-bold" />
              <Icon icon="solar:star-bold" />
              <Icon icon="solar:star-bold" />
              <Icon icon="solar:star-bold" />
            </div>
            <span className="text-xs font-medium text-neutral-600">{heroData.rating_text}</span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight text-neutral-900 mb-6 max-w-4xl mx-auto leading-tight font-serif">
            {heroData.headline}
          </h1>

          <p className="mt-4 text-lg text-neutral-500 max-w-2xl mx-auto font-light leading-relaxed">
            {heroData.subtitle}
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a href="#portfolio" className="inline-flex items-center justify-center text-sm font-medium transition-colors bg-neutral-900 text-white hover:bg-neutral-800 h-12 px-8 rounded-full w-full sm:w-auto">
              View Portfolio
            </a>
            <a href="#contact" className="inline-flex items-center justify-center text-sm font-medium transition-colors bg-white text-neutral-900 border border-neutral-200 hover:bg-neutral-50 h-12 px-8 rounded-full w-full sm:w-auto gap-2">
              Book Now
              <Icon icon="solar:arrow-right-linear" className="text-lg" />
            </a>
          </div>
        </div>

        {/* Hero Image Collage */}
        <div className="mt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-12 gap-4 h-[400px] md:h-[500px] lg:h-[600px]">
            <div className="col-span-12 md:col-span-8 rounded-none overflow-hidden relative group">
              <img
                src={heroData.main_image}
                alt="Wedding Couple"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="hidden md:block col-span-4 space-y-4">
              <div className="h-[calc(50%-0.5rem)] rounded-none overflow-hidden relative group">
                <img
                  src={heroData.image_2}
                  alt="Wedding Details"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="h-[calc(50%-0.5rem)] rounded-none overflow-hidden relative group bg-neutral-100">
                <img
                  src={heroData.image_3}
                  alt="Event"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90"
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
            <div className="relative">
              <div className="aspect-[4/5] rounded-none overflow-hidden">
                <img src="https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=2940&auto=format&fit=crop" alt="Photographer" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
              </div>
              <div className="absolute -bottom-8 -right-8 bg-white p-6 rounded-none shadow-sm border border-neutral-100 hidden md:block">
                <p className="text-4xl tracking-tight font-medium text-neutral-900 font-serif">7+</p>
                <p className="text-sm text-neutral-500 font-medium mt-1">Years of Excellence</p>
              </div>
            </div>
            <div>
              <span className="text-amber-600 text-sm font-medium tracking-wide uppercase">Our Story</span>
              <h2 className="mt-4 text-3xl md:text-4xl font-medium tracking-tight text-neutral-900 font-serif">
                We don't just take pictures, we capture emotions.
              </h2>
              <p className="mt-6 text-neutral-500 font-light leading-relaxed">
                At BN MEDIA HUB, we believe every frame holds a story. Based in Thrissur, Kerala, our professional and friendly team focuses on creativity, extreme attention to detail, and preserving the raw emotions of your special day.
              </p>
              <p className="mt-4 text-neutral-500 font-light leading-relaxed">
                Whether it's an intimate engagement, a grand wedding, or a corporate event, we blend seamlessly into the background to capture cinematic moments that you will cherish for a lifetime.
              </p>
              <div className="mt-8">
                <a href="#contact" className="inline-flex items-center text-sm font-medium text-neutral-900 hover:text-amber-600 transition-colors gap-2 group">
                  Meet the team
                  <Icon icon="solar:arrow-right-linear" className="transform group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-amber-600 text-sm font-medium tracking-wide uppercase">Expertise</span>
            <h2 className="mt-4 text-3xl md:text-4xl font-medium tracking-tight text-neutral-900 font-serif">
              Services We Offer
            </h2>
            <p className="mt-4 text-neutral-500 font-light">Comprehensive photography and videography solutions tailored to your unique needs.</p>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
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
              <div
                key={index}
                className="p-8 rounded-2xl border border-neutral-100 bg-neutral-50/50 hover:bg-white hover:border-amber-200 hover:shadow-xl hover:shadow-amber-900/5 transition-all duration-300 group w-full md:w-[calc(50%_-_12px)] lg:w-[calc(33.333%_-_16px)] cursor-pointer hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-full bg-white border border-neutral-200 flex items-center justify-center mb-6 group-hover:border-amber-200 group-hover:bg-amber-50 transition-colors">
                  <Icon icon={service.icon} className="text-xl text-neutral-700 group-hover:text-amber-600 transition-colors" />
                </div>
                <h3 className="text-lg font-medium tracking-tight text-neutral-900 mb-2">{service.title}</h3>
                <p className="text-sm text-neutral-500 font-light leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-24 bg-white border-t border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center mb-16 gap-8">
            <div className="max-w-2xl">
              <span className="text-amber-600 text-sm font-medium tracking-wide uppercase">Selected Works</span>
              <h2 className="mt-4 text-3xl md:text-4xl font-medium tracking-tight text-neutral-900 font-serif">
                A Glimpse Into Our Lens
              </h2>
            </div>

            <div className="flex flex-wrap justify-center gap-2">
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
            </div>
          </div>

          {/* Portfolio grid — only shown when DB has works */}
          {portfolioWorks.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto mb-5">
                <Icon icon="solar:gallery-wide-linear" className="text-4xl text-neutral-300" />
              </div>
              <p className="text-neutral-400 text-sm font-light">Portfolio coming soon</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {portfolioWorks
                .filter(item => activeCategory === 'All' || item.category === activeCategory)
                .map((item, index) => (
                  <div
                    key={item.id}
                    className={`relative group rounded-none overflow-hidden cursor-pointer ${GRID_ASPECTS[index % GRID_ASPECTS.length]}`}
                  >
                    {item.img_url ? (
                      <img
                        src={item.img_url}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        alt={item.title}
                      />
                    ) : (
                      <div className="w-full h-full bg-neutral-100 flex items-center justify-center">
                        <Icon icon="solar:gallery-linear" className="text-4xl text-neutral-300" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                      <span className="text-white text-lg font-medium tracking-tight">{item.title}</span>
                      <span className="text-white/80 text-xs mt-1">{item.location}</span>
                    </div>
                  </div>
                ))}
            </div>
          )}

          <div className="mt-12 text-center">
            <a href="#" className="inline-flex items-center text-sm font-medium text-neutral-900 hover:text-amber-600 transition-colors gap-2 group">
              View Full Gallery
              <Icon icon="solar:arrow-right-linear" className="transform group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="py-24 bg-neutral-50 border-y border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6 text-center md:text-left">
            <div>
              <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-neutral-900 font-serif">Loved by clients.</h2>
              <p className="mt-2 text-neutral-500 font-light">Don't just take our word for it.</p>
            </div>
            <a href="#reviews" className="flex items-center gap-4 bg-white px-6 py-3 rounded-full border border-neutral-200 shadow-sm hover:shadow-md hover:border-neutral-300 transition-all cursor-pointer group active:scale-95">
              <div className="flex text-amber-500 text-lg group-hover:scale-105 transition-transform">
                <Icon icon="solar:star-bold" />
                <Icon icon="solar:star-bold" />
                <Icon icon="solar:star-bold" />
                <Icon icon="solar:star-bold" />
                <Icon icon="solar:star-bold" />
              </div>
              <div className="h-4 w-px bg-neutral-200" />
              <span className="text-sm font-medium text-neutral-900">88 Reviews</span>
            </a>
          </div>
        </div>

        <div className="relative overflow-hidden w-full mt-12 mb-12 group">
          {reviews.length === 0 && (
            <div className="flex items-center justify-center py-12 text-neutral-400 text-sm">No reviews yet.</div>
          )}
          {reviews.length > 0 && (
            <div className="flex gap-6 flex-row animate-marquee hover:[animation-play-state:paused]">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex gap-6 flex-row">
                  {reviews.map((review, index) => (
                    <div
                      key={`${i}-${index}`}
                      className="bg-white p-8 rounded-2xl border border-neutral-100 shadow-sm shrink-0 w-[300px] md:w-[400px]"
                    >
                      <div className="flex text-amber-500 text-sm mb-4 gap-0.5">
                        {[...Array(5)].map((_, s) => (
                          <Icon key={s} icon={s < (review.rating || 5) ? 'solar:star-bold' : 'solar:star-linear'} />
                        ))}
                      </div>
                      <p className="text-neutral-700 mb-6 font-light leading-relaxed">{review.text}</p>
                      <div className="flex items-center gap-3 mt-auto">
                        <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-sm font-medium text-neutral-600">
                          {review.avatar || review.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-neutral-900">{review.name}</p>
                          <p className="text-xs text-neutral-500">{review.type}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
          <div className="absolute pointer-events-none inset-0 bg-gradient-to-r from-neutral-50 via-transparent to-neutral-50"></div>
        </div>

        {/* New 'Write a Review' CTA */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 text-center">
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
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Info */}
            <div>
              <span className="text-amber-600 text-sm font-medium tracking-wide uppercase">Get in Touch</span>
              <h2 className="mt-4 text-3xl md:text-4xl font-medium tracking-tight text-neutral-900 mb-8 font-serif">
                Let's discuss your special day.
              </h2>

              <div className="space-y-6 mb-10">
                {[
                  { title: 'Studio Location', icon: 'solar:map-point-linear', content: 'Opp. Happyhome Auditorium, Jerusalem, Kunnamkulam, Pazhanji, Thrissur, Kerala 680542' },
                  { title: 'Working Hours', icon: 'solar:clock-circle-linear', content: 'Mon - Sat, 9:00 AM - 6:00 PM' },
                  { title: 'Direct Contact', icon: 'solar:phone-calling-linear', content: '+91 XXXXX XXXXX' },
                ].map((info, index) => (
                  <div key={index} className="flex gap-4 items-start">
                    <div className="mt-1 w-10 h-10 rounded-full bg-neutral-50 border border-neutral-100 flex items-center justify-center shrink-0">
                      <Icon icon={info.icon} className="text-lg text-neutral-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-neutral-900">{info.title}</h4>
                      <p className="text-sm text-neutral-500 font-light mt-1 leading-relaxed max-w-xs">{info.content}</p>
                    </div>
                  </div>
                ))}
              </div>

              <a href="#" className="inline-flex items-center justify-center text-sm font-medium transition-colors bg-[#25D366] text-white hover:bg-[#1ebd5b] h-12 px-8 rounded-full gap-2 font-sans">
                <Icon icon="solar:chat-round-line-linear" className="text-xl" />
                Book via WhatsApp
              </a>
            </div>

            {/* Contact Form */}
            <div className="bg-neutral-50 p-8 md:p-10 rounded-3xl border border-neutral-100">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-neutral-700">First Name</label>
                    <input type="text" className="w-full bg-white border border-neutral-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-shadow placeholder:text-neutral-400" placeholder="John" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-neutral-700">Last Name</label>
                    <input type="text" className="w-full bg-white border border-neutral-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-shadow placeholder:text-neutral-400" placeholder="Doe" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-neutral-700">Email Address</label>
                  <input type="email" className="w-full bg-white border border-neutral-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-shadow placeholder:text-neutral-400" placeholder="john@example.com" />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-neutral-700">Event Type</label>
                  <div className="relative">
                    <select className="w-full bg-white border border-neutral-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-shadow appearance-none text-neutral-700">
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
                  <textarea rows="4" className="w-full bg-white border border-neutral-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-shadow placeholder:text-neutral-400 resize-none" placeholder="Tell us about your event..." defaultValue={""} />
                </div>

                <button type="button" className="w-full inline-flex items-center justify-center text-sm font-medium transition-colors bg-neutral-900 text-white hover:bg-neutral-800 h-12 rounded-lg">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-neutral-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Icon icon="solar:camera-linear" className="text-xl text-neutral-900" />
            <span className="text-lg tracking-tighter font-medium uppercase font-serif">BN MEDIA HUB</span>
          </div>

          <div className="flex items-center gap-6 text-sm text-neutral-500 font-medium">
            <a href="#" className="hover:text-neutral-900 transition-colors pointer-events-none">Instagram</a>
            <a href="#" className="hover:text-neutral-900 transition-colors pointer-events-none">Facebook</a>
            <a href="#" className="hover:text-neutral-900 transition-colors pointer-events-none">YouTube</a>
          </div>

          <p className="text-xs text-neutral-400">© 2024 BN Media Hub. All rights reserved.</p>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a href="#" className="fixed bottom-6 right-6 w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform z-50 group">
        <Icon icon="solar:phone-calling-linear" className="text-2xl" />
        <span className="absolute right-16 bg-white text-neutral-900 text-xs font-medium px-3 py-1.5 rounded-lg border border-neutral-100 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">Chat with us</span>
      </a>
    </div>
  )
}

export default App
