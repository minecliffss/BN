import { useState, useEffect } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Icon } from '@iconify/react'
import { supabase } from '../../lib/supabase'
import Logo from '../Logo'

const navItems = [
  { label: 'Overview',  icon: 'solar:widget-2-linear',      to: '/dashboard' },
  { label: 'Hero',      icon: 'solar:home-linear',           to: '/dashboard/hero' },
  { label: 'Portfolio', icon: 'solar:gallery-wide-linear',  to: '/dashboard/portfolio' },
  { label: 'Reviews',   icon: 'solar:star-linear',          to: '/dashboard/reviews' },
]

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [user, setUser] = useState(null)
  const [checking, setChecking] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    // Check auth on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/login', { replace: true })
      } else {
        setUser(session.user)
      }
      setChecking(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate('/login', { replace: true })
      } else {
        setUser(session.user)
      }
    })

    return () => subscription.unsubscribe()
  }, [navigate])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login', { replace: true })
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <svg className="animate-spin h-7 w-7 text-neutral-400" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
      </div>
    )
  }

  const emailInitial = user?.email?.charAt(0)?.toUpperCase() || 'A'
  const emailDisplay = user?.email || ''

  return (
    <div className="flex h-screen bg-neutral-50 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-60' : 'w-16'} transition-all duration-300 bg-white border-r border-neutral-100 flex flex-col shrink-0 z-20`}>
        {/* Brand */}
        <div className="h-16 flex items-center px-4 border-b border-neutral-100 gap-3 shrink-0">
          <Logo size="sm" showText={sidebarOpen} />
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/dashboard'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                  ? 'bg-neutral-900 text-white'
                  : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900'
                }`
              }
            >
              <Icon icon={item.icon} className="text-lg shrink-0" />
              {sidebarOpen && <span className="truncate">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div className="border-t border-neutral-100 p-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 text-sm font-semibold shrink-0">
              {emailInitial}
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-neutral-900 truncate">BN Studio</p>
                <p className="text-xs text-neutral-400 truncate">{emailDisplay}</p>
              </div>
            )}
            {sidebarOpen && (
              <button
                onClick={handleLogout}
                className="text-neutral-400 hover:text-red-500 transition-colors"
                title="Sign out"
              >
                <Icon icon="solar:logout-2-linear" className="text-lg" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-neutral-100 flex items-center px-6 gap-4 shrink-0">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            <Icon icon={sidebarOpen ? 'solar:sidebar-minimalistic-linear' : 'solar:hamburger-menu-linear'} className="text-xl" />
          </button>
          <div className="h-5 w-px bg-neutral-200" />
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-xs font-semibold text-white bg-neutral-900 border border-neutral-900 rounded-full px-5 py-2 hover:bg-neutral-800 transition-all shadow-sm hover:shadow-md active:scale-95 transition-transform"
            >
              <Icon icon="solar:home-linear" />
              View Site
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-xs font-medium text-red-500 hover:text-red-700 transition-colors border border-red-200 rounded-full px-3 py-1.5 hover:bg-red-50"
            >
              <Icon icon="solar:logout-2-linear" />
              Sign Out
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  )
}
