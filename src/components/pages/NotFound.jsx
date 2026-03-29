import React from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '@iconify/react'

const NotFound = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 selection:bg-neutral-900 selection:text-white antialiased">
      <div className="max-w-md w-full text-center space-y-8 animate-fade-in-up">
        {/* Decorative Element */}
        <div className="relative inline-block">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-neutral-50 border border-neutral-100 flex items-center justify-center mx-auto mb-6 group transition-all duration-500 hover:border-amber-200 hover:bg-amber-50/50">
            <Icon 
              icon="solar:camera-broken" 
              className="text-6xl md:text-7xl text-neutral-200 group-hover:text-amber-600 transition-colors duration-500" 
            />
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-9xl font-serif text-neutral-900/5 select-none pointer-events-none -z-10">404</div>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-serif tracking-tight text-neutral-900">
            Missing in Frame
          </h1>
          <p className="text-neutral-500 font-light leading-relaxed max-w-sm mx-auto">
            The page you're searching for seems to have slipped out of focus. It might have been moved or deleted.
          </p>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            to="/" 
            className="inline-flex items-center justify-center h-12 px-8 text-sm font-medium text-white bg-neutral-900 rounded-full hover:bg-neutral-800 transition-all duration-300 w-full sm:w-auto hover:scale-[1.02] active:scale-95 shadow-lg shadow-neutral-900/5"
          >
            Back to Home
          </Link>
          <a 
            href="/#contact" 
            className="inline-flex items-center justify-center h-12 px-8 text-sm font-medium text-neutral-900 bg-white border border-neutral-200 rounded-full hover:bg-neutral-50 transition-all duration-300 w-full sm:w-auto hover:scale-[1.02] active:scale-95"
          >
            Get Help
          </a>
        </div>

        {/* Brand identity footer */}
        <div className="pt-20 flex items-center justify-center gap-2 opacity-30">
          <Icon icon="solar:camera-linear" className="text-lg text-neutral-900" />
          <span className="text-sm tracking-tighter font-medium uppercase font-serif">BN MEDIA HUB</span>
        </div>
      </div>
    </div>
  )
}

export default NotFound
