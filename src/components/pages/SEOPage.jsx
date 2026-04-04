import React, { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Icon } from '@iconify/react'
import { LOCATIONS, SERVICES } from '../../lib/seo-data'
import Logo from '../Logo'

const SEOPage = () => {
  const { locationId, serviceId } = useParams()

  const location = LOCATIONS.find(l => l.id === locationId)
  const service = SERVICES.find(s => s.id === serviceId)

  // Use effective values or fallback to prevent crashes
  const locationName = location?.name || 'Kerala'
  const serviceName = service?.name || 'Photography'
  const serviceTitle = service?.title || 'Photographer'

  const title = `Best ${serviceName} in ${locationName}, Kerala | BN Media`
  const description = service?.description.replace('our services', `our services in ${locationName}`) || `The best ${serviceName} service in ${locationName}, Kerala.`

  useEffect(() => {
    document.title = title
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', description)
    }
    window.scrollTo(0, 0)
  }, [title, description])

  if (!location || !service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-2xl font-serif text-neutral-900 mb-4">Page Not Found</h1>
          <Link to="/" className="text-amber-600 hover:underline">Return to Home</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white min-h-screen font-sans selection:bg-neutral-900 selection:text-white">
      {/* Navigation */}
      <nav className="fixed w-full top-0 z-50 bg-white border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <Logo size="md" />
            </Link>
            <div className="hidden md:flex space-x-8">
              <Link to="/#portfolio" className="text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors">Portfolio</Link>
              <Link to="/#services" className="text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors">Services</Link>
              <Link to="/#contact" className="text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-20">
        {/* Hero Section */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center mb-20 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-50 border border-neutral-200 mb-8">
            <span className="text-xs font-medium text-amber-600 uppercase tracking-widest">Premium Service in {locationName}</span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight text-neutral-900 mb-6 leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
            Professional {serviceTitle} <br className="hidden md:block" /> in <span className="text-amber-600 italic">{locationName}</span>
          </h1>
          <p className="text-lg text-neutral-500 max-w-2xl mx-auto font-light leading-relaxed mb-10">
            {description} At BN Media, we are dedicated to preserving the unique emotions and beauty of your special moments in {locationName}.
          </p>
          <div className="flex justify-center gap-4">
            <a href="/#contact" className="bg-neutral-900 text-white px-8 py-3.5 rounded-full text-sm font-medium hover:bg-neutral-800 transition-all shadow-lg hover:shadow-neutral-900/10">
              Book Today
            </a>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="bg-neutral-50 py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="relative aspect-[4/5] bg-neutral-200 overflow-hidden group">
              <img 
                src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2938&auto=format&fit=crop" 
                alt={`${serviceName} in ${locationName}`}
                className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
              />
               <div className="absolute bottom-6 left-6 right-6 p-6 bg-white/90 backdrop-blur-sm shadow-sm border border-neutral-100">
                <p className="text-xs font-medium text-amber-600 uppercase mb-1 tracking-widest">Serving {locationName}</p>
                <p className="text-lg font-serif text-neutral-900 font-medium">Capture the {location.keywords[0]} of your event.</p>
              </div>
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-serif text-neutral-900 font-medium mb-6">Why Choose BN Media for your {serviceName}?</h2>
              <div className="space-y-6">
                {service.features.map((feature, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="w-10 h-10 bg-amber-50 border border-amber-100 rounded-full flex items-center justify-center shrink-0">
                      <Icon icon="solar:check-circle-bold" className="text-amber-600 text-xl" />
                    </div>
                    <div>
                      <h3 className="font-medium text-neutral-900">{feature}</h3>
                      <p className="text-sm text-neutral-500 font-light mt-1">Experience high-end quality and artistic vision for your celebration in {locationName}.</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Local Internal Links (Spoke Crosslinking) */}
        <section className="py-24 border-t border-neutral-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-serif text-neutral-900 mb-10">Other Services in {locationName}</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {SERVICES.filter(s => s.id !== serviceId).map(s => (
                <Link 
                  key={s.id} 
                  to={`/locations/${locationId}/${s.id}`}
                  className="px-6 py-2.5 rounded-full border border-neutral-200 text-sm font-medium text-neutral-700 hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-all"
                >
                  {s.name}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Global Locations Hub Link */}
        <footer className="mt-12 text-center text-neutral-400 text-xs py-8 border-t border-neutral-50">
          <div className="mb-4 flex justify-center gap-6">
            <Link to="/" className="hover:text-neutral-900">Home</Link>
            <Link to="/#portfolio" className="hover:text-neutral-900">Portfolio</Link>
            <Link to="/#services" className="hover:text-neutral-900">Services</Link>
          </div>
          <p>© 2024 BN Media Kerala. All rights reserved.</p>
        </footer>
      </main>
      
      {/* Schema.js JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          "serviceType": serviceName,
          "provider": {
            "@type": "LocalBusiness",
            "name": "BN Media",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": locationName,
              "addressRegion": "KL",
              "addressCountry": "IN"
            }
          },
          "areaServed": {
            "@type": "City",
            "name": locationName
          },
          "description": description
        })}
      </script>
    </div>
  )
}

export default SEOPage
