import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon } from '@iconify/react'
import { supabase } from '../lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPass, setShowPass] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (authError) {
      setError(authError.message)
    } else {
      navigate('/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      {/* Left – Brand Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-neutral-900 relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2938&auto=format&fit=crop"
            alt="BN Media Hub"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/80 to-neutral-900/40" />
        </div>
        <div className="relative flex items-center gap-3 z-10">
          <Icon icon="solar:camera-linear" className="text-2xl text-white" />
          <span className="text-xl tracking-tighter font-medium uppercase text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
            BN MEDIA HUB
          </span>
        </div>
        <div className="relative z-10">
          <blockquote className="text-white/90 text-xl font-light leading-relaxed" style={{ fontFamily: 'Playfair Display, serif' }}>
            "Every frame tells a story. Every story deserves to last forever."
          </blockquote>
          <p className="mt-4 text-white/50 text-sm">— BN Media Hub Studio, Thrissur</p>
        </div>
      </div>

      {/* Right – Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <Icon icon="solar:camera-linear" className="text-2xl text-neutral-900" />
            <span className="text-xl tracking-tighter font-medium uppercase" style={{ fontFamily: 'Playfair Display, serif' }}>
              BN MEDIA HUB
            </span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-medium tracking-tight text-neutral-900" style={{ fontFamily: 'Playfair Display, serif' }}>
              Studio Dashboard
            </h1>
            <p className="mt-2 text-sm text-neutral-500 font-light">Sign in to manage your photos and reviews.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-neutral-700 uppercase tracking-wide">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className={`w-full bg-white border rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-all placeholder:text-neutral-400 ${error ? 'border-red-300' : 'border-neutral-200'}`}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-neutral-700 uppercase tracking-wide">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full bg-white border rounded-lg px-4 py-3 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-all placeholder:text-neutral-400 ${error ? 'border-red-300' : 'border-neutral-200'}`}
                  required
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 transition-colors">
                  <Icon icon={showPass ? 'solar:eye-closed-linear' : 'solar:eye-linear'} className="text-lg" />
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-xs px-4 py-3 rounded-lg">
                <Icon icon="solar:danger-circle-linear" className="text-base shrink-0" />
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-neutral-900 text-white h-12 rounded-lg text-sm font-medium hover:bg-neutral-800 transition-colors disabled:opacity-60">
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Signing in...
                </>
              ) : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
            <p className="text-xs font-semibold text-amber-800 mb-1 flex items-center gap-1.5">
              <Icon icon="solar:info-circle-linear" className="text-base" />
              Supabase Auth Required
            </p>
            <p className="text-xs text-amber-700">
              Go to <strong>Supabase → Authentication → Users → Add User</strong> and create your account. Then sign in here with those credentials.
            </p>
          </div>

          <p className="mt-6 text-center text-xs text-neutral-400">© 2024 BN Media Hub. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
